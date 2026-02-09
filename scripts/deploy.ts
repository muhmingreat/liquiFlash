import hre from "hardhat";

const { ethers } = hre;

async function main() {
    console.log("Starting deployment to Celo Alfajores...");

    // 1. Deploy Master Implementation
    const Executor = await ethers.getContractFactory("LiquiFlashExecutor");
    const masterExecutor = await Executor.deploy();
    await masterExecutor.waitForDeployment();
    const masterAddress = await masterExecutor.getAddress();
    console.log(`LiquiFlashExecutor (Master) deployed to: ${masterAddress}`);

    // 2. Deploy Factory
    const Factory = await ethers.getContractFactory("LiquiFlashFactory");
    const factory = await Factory.deploy(masterAddress);
    await factory.waitForDeployment();
    const factoryAddress = await factory.getAddress();
    console.log(`LiquiFlashFactory deployed to: ${factoryAddress}`);

    console.log("Deployment Complete!");
    console.log("----------------------------------------------------");
    console.log("Add this to your Frontend Config:");
    console.log(`NEXT_PUBLIC_FACTORY_ADDRESS="${factoryAddress}"`);
    console.log("----------------------------------------------------");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
