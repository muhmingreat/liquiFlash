// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./LiquiFlashExecutor.sol";

/**
 * @title LiquiFlashFactory
 * @notice Deploys minimal proxy clones of the LiquiFlashExecutor.
 * @dev Uses EIP-1167 for gas-efficient deployment.
 */
contract LiquiFlashFactory is Ownable {
    using Clones for address;

    // --- State Variables ---

    /// @notice The master implementation contract address
    address public immutable implementation;

    /// @notice Registry of user -> executor address
    mapping(address => address[]) public userExecutors;

    /// @notice Registry of valid executors deployed by this factory
    mapping(address => bool) public isLiquiFlashExecutor;

    // --- Events ---

    event ExecutorDeployed(address indexed user, address indexed executor);

    // --- Constructor ---

    constructor(address _implementation) Ownable(msg.sender) {
        require(_implementation != address(0), "Invalid implementation");
        implementation = _implementation;
    }

    // --- Deployment Logic ---

    /**
     * @notice Creates a new Executor for the caller.
     * @param _executor The address of the bot/signer authorized to trade on behalf of this contract.
     * @return instance The address of the deployed clone.
     */
    function createExecutor(address _executor) external returns (address instance) {
        // Deploy clone
        instance = implementation.clone();
        
        // Initialize the clone with the Caller as Owner and the input as Executor
        LiquiFlashExecutor(payable(instance)).initialize(msg.sender, _executor);

        // Register
        userExecutors[msg.sender].push(instance);
        isLiquiFlashExecutor[instance] = true;

        emit ExecutorDeployed(msg.sender, instance);
    }

    // --- View Functions ---

    function getExecutors(address _user) external view returns (address[] memory) {
        return userExecutors[_user];
    }
}
