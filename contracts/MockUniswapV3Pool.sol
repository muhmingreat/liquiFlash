// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MockUniswapV3Pool {
    address public immutable token0;
    address public immutable token1;
    uint24 public immutable fee;
    uint128 public liquidity = 1000000000000000000; // 1.0
    uint160 public sqrtPriceX96;

    constructor(address _token0, address _token1, uint24 _fee) {
        token0 = _token0;
        token1 = _token1;
        fee = _fee;
        sqrtPriceX96 = 79228162514264337593543950336; // 1:1
    }

    // Uniswap V3 Swap Event
    event Swap(
        address indexed sender,
        address indexed recipient,
        int256 amount0,
        int256 amount1,
        uint160 sqrtPriceX96,
        uint128 liquidity,
        int24 tick
    );

    function swap(
        address recipient,
        bool zeroForOne,
        int256 amountSpecified,
        uint160 sqrtPriceLimitX96,
        bytes calldata data
    ) external returns (int256 amount0, int256 amount1) {
        // Simple 1:1 Swap logic for testing
        // Only works for exactInput (amountSpecified > 0)
        require(amountSpecified > 0, "Exact input only");

        uint256 amountIn = uint256(amountSpecified);
        uint256 amountOut = amountIn; // 1:1 Price

        if (zeroForOne) {
            // Selling Token0, Buying Token1
            amount0 = int256(amountIn);
            amount1 = -int256(amountOut);
            // Transfer Token1 to recipient (Mock assumes it has balance)
            // In real testnet, we need to mint/fund this pool first or just simulate logic.
            // For router callback, we don't transfer here, we expect Callback to pay us.
        } else {
             // Selling Token1, Buying Token0
            amount1 = int256(amountIn);
            amount0 = -int256(amountOut);
        }

        // Call the callback on the router/caller
        // Router.uniswapV3SwapCallback(amount0Delta, amount1Delta, data)
        // We need to define the interface
        IUniswapV3SwapCallback(msg.sender).uniswapV3SwapCallback(amount0, amount1, data);

        // Emit Event for UI Indexer
        emit Swap(
            msg.sender,
            recipient,
            amount0,
            amount1,
            sqrtPriceX96,
            liquidity,
            -887272 // Mock Tick
        );

        return (amount0, amount1);
    }
}

interface IUniswapV3SwapCallback {
    function uniswapV3SwapCallback(
        int256 amount0Delta,
        int256 amount1Delta,
        bytes calldata data
    ) external;
}
