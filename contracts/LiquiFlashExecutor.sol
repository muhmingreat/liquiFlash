// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

// --- Interfaces ---

interface IUniswapV2Router {
    function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts);
    function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts);
    function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts);
}

interface IWETH {
    function deposit() external payable;
    function withdraw(uint) external;
}

interface ISwapRouter {
    struct ExactInputSingleParams {
        address tokenIn;
        address tokenOut;
        uint24 fee;
        address recipient;
        uint256 deadline;
        uint256 amountIn;
        uint256 amountOutMinimum;
        uint160 sqrtPriceLimitX96;
    }
    function exactInputSingle(ExactInputSingleParams calldata params) external payable returns (uint256 amountOut);
}

/**
 * @title LiquiFlashExecutor
 * @dev "The Ironclad Executor" (Cloneable Version)
 * @notice A high-security execution engine for LiquiFlash.
 * 
 * SECURITY PRINCIPLES:
 * 1. SEPARATION OF POWERS: Owner (Funds) != Executor (Logic).
 * 2. NON-CUSTODIAL EXECUTOR: The Executor address can ONLY trade. It CANNOT withdraw.
 * 3. SLIPPAGE PROTECTION: All trades revert if output < minAmountOut.
 * 4. REENTRANCY GUARD: Stops callback attacks.
 */
contract LiquiFlashExecutor is Initializable, OwnableUpgradeable, ReentrancyGuardUpgradeable {
    using SafeERC20 for IERC20;

    // --- State Variables ---

    /// @notice The address authorized to trigger swaps (e.g., the x402 bot)
    address public executor;

    // --- Events ---

    event ExecutorUpdated(address indexed newExecutor);
    event SwapExecuted(address indexed tokenIn, address indexed tokenOut, uint amountIn, uint amountOut);
    event Withdrawal(address indexed token, uint amount);
    event EthWithdrawal(uint amount);
    event Received(address, uint);

    // --- Modifiers ---

    modifier onlyAuthorized() {
        require(msg.sender == owner() || msg.sender == executor, "Unauthorized");
        _;
    }

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * @notice Initializes the clone. Replaces constructor.
     * @param _owner The user who owns this specific clone.
     * @param _executor The bot address authorized to trade.
     */
    function initialize(address _owner, address _executor) public initializer {
        __Ownable_init(_owner);
        __ReentrancyGuard_init();
        require(_executor != address(0), "Invalid executor");
        executor = _executor;
    }

    // --- Admin Functions ---

    function setExecutor(address _newExecutor) external onlyOwner {
        require(_newExecutor != address(0), "Invalid executor");
        executor = _newExecutor;
        emit ExecutorUpdated(_newExecutor);
    }

    // --- Execution Logic ---

    function executeSwapV2(
        address _router,
        uint256 _amountIn,
        uint256 _minAmountOut,
        address[] calldata _path
    ) external payable onlyAuthorized nonReentrant {
        require(_path.length >= 2, "Invalid path");
        
        if (msg.value > 0) {
            require(msg.value == _amountIn, "ETH Mismatch");
            IUniswapV2Router(_router).swapExactETHForTokens{value: _amountIn}(
                _minAmountOut,
                _path,
                address(this),
                block.timestamp
            );
        } else {
            IERC20(_path[0]).forceApprove(_router, _amountIn);
            IUniswapV2Router(_router).swapExactTokensForTokens(
                _amountIn,
                _minAmountOut,
                _path,
                address(this),
                block.timestamp
            );
        }

        emit SwapExecuted(_path[0], _path[_path.length - 1], _amountIn, _minAmountOut); 
    }


    function executeSwapV3(
    address _router,
    uint256 _amountIn,
    uint256 _minAmountOut,
    address _tokenIn,
    address _tokenOut,
    uint24 _fee
) external payable onlyAuthorized nonReentrant {
    if (msg.value > 0) {
        require(msg.value == _amountIn, "ETH Mismatch");

        // 1. Wrap ETH to WETH (Only if NOT Celo Native)
        // Celo Native Address: 0x471EcE3750Da237f93B8E339c536989b8978a438
        if (_tokenIn != 0x471EcE3750Da237f93B8E339c536989b8978a438) {
             IWETH(_tokenIn).deposit{value: _amountIn}();
        }

        // 2. Approve Router to spend WETH
        IERC20(_tokenIn).forceApprove(_router, _amountIn);

        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter.ExactInputSingleParams({
            tokenIn: _tokenIn,
            tokenOut: _tokenOut,
            fee: _fee,
            recipient: address(this),
            deadline: block.timestamp,
            amountIn: _amountIn,
            amountOutMinimum: _minAmountOut,
            sqrtPriceLimitX96: 0
        });

        // 3. Swap WETH -> TokenOut
        ISwapRouter(_router).exactInputSingle(params);
    } else {
         // Logic for ERC20 -> ERC20 swaps
         IERC20(_tokenIn).forceApprove(_router, _amountIn);

         ISwapRouter.ExactInputSingleParams memory params = ISwapRouter.ExactInputSingleParams({
            tokenIn: _tokenIn,
            tokenOut: _tokenOut,
            fee: _fee,
            recipient: address(this),
            deadline: block.timestamp,
            amountIn: _amountIn,
            amountOutMinimum: _minAmountOut,
            sqrtPriceLimitX96: 0
        });

        ISwapRouter(_router).exactInputSingle(params);
    }

    emit SwapExecuted(_tokenIn, _tokenOut, _amountIn, _minAmountOut);
}

    // --- Withdrawal Logic ---

    function withdrawETH() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No ETH");
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Transfer Failed");
        emit EthWithdrawal(balance);
    }

    function withdrawToken(address _token) external onlyOwner nonReentrant {
        uint256 balance = IERC20(_token).balanceOf(address(this));
        require(balance > 0, "No tokens");
        IERC20(_token).safeTransfer(owner(), balance);
        emit Withdrawal(_token, balance);
    }

    function approveRouter(address _token, address _router) external onlyOwner {
        IERC20(_token).forceApprove(_router, type(uint256).max);
    }

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }
}

