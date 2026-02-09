// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./MockUniswapV3Pool.sol";

contract MockUniswapV3Factory {
    mapping(address => mapping(address => mapping(uint24 => address))) public getPool;

    event PoolCreated(address indexed token0, address indexed token1, uint24 indexed fee, int24 tickSpacing, address pool);

    function createPool(address tokenA, address tokenB, uint24 fee) external returns (address pool) {
        require(tokenA != tokenB);
        (address token0, address token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        require(getPool[token0][token1][fee] == address(0));
        
        MockUniswapV3Pool newPool = new MockUniswapV3Pool(token0, token1, fee);
        pool = address(newPool);
        
        getPool[token0][token1][fee] = pool;
        getPool[token1][token0][fee] = pool;
        
        emit PoolCreated(token0, token1, fee, 60, pool);
    }
}
