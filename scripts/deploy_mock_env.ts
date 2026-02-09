
import hre from "hardhat";
const { ethers } = hre;

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log(`Deploying Mock Enviroment with account: ${deployer.address}`);

    // 1. Deploy Factory
    const Factory = await ethers.getContractFactory("MockUniswapV3Factory");
    const factory = await Factory.deploy();
    await factory.waitForDeployment();
    const factoryAddress = await factory.getAddress();
    console.log(`✅ Mock Factory Deployed: ${factoryAddress}`);

    // 2. Create Pool (WCELO / USDC)
    const WCELO = "0x471EcE3750Da237f93B8E339c536989b8978a438";
    const USDC = "0xA38345d75e5b7DD4b8274eD43aF84E2179D8c579";

    // Create Pool
    console.log("Creating Mock Pool...");
    await (await factory.createPool(WCELO, USDC, 3000)).wait();
    const poolAddress = await factory.getPool(WCELO, USDC, 3000);
    console.log(`✅ Mock Pool Deployed: ${poolAddress}`);

    // Fund the pool? The Mock Pool is simple, it doesn't enforce strict balances if we just swap.
    // But specific logic in Router callback might fail if pool doesn't transfer.
    // For now, let's assume the router pays IN, and the pool doesn't necessarily pay OUT 
    // if it's just for testing the "Execution" flow up to success.

    // 3. Deploy Router linked to THIS Factory
    const Router = await ethers.getContractFactory("LiteSwapRouter");
    const router = await Router.deploy(factoryAddress, WCELO);
    await router.waitForDeployment();
    const routerAddress = await router.getAddress();
    console.log(`✅ LiteSwapRouter Deployed: ${routerAddress}`);

    // 4. Deploy User Executor Factory (Standard)
    const Executor = await ethers.getContractFactory("LiquiFlashExecutor");
    const executorMaster = await Executor.deploy();
    await executorMaster.waitForDeployment();

    const UserFactory = await ethers.getContractFactory("LiquiFlashFactory");
    const userFactory = await UserFactory.deploy(await executorMaster.getAddress());
    await userFactory.waitForDeployment();
    const userFactoryAddress = await userFactory.getAddress();
    console.log(`✅ LiquiFlashFactory Deployed: ${userFactoryAddress}`);

    console.log("\n------------------------------------------------");
    console.log("UPDATE YOUR CONFIG WITH THESE VALUES:");
    console.log(`NEXT_PUBLIC_FACTORY_ADDRESS="${userFactoryAddress}"`);
    console.log(`ROUTER_V3_ADDRESS="${routerAddress}"`);
    console.log("------------------------------------------------");

    // Print to file for easy reading
    const fs = require("fs");
    fs.writeFileSync("mock_env_addresses.txt", `
    FACTORY=${userFactoryAddress}
    ROUTER=${routerAddress}
    MOCK_V3_FACTORY=${factoryAddress}
    POOL=${poolAddress}
    `);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
