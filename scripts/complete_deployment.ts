
import hre from "hardhat";
const { ethers } = hre;

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log(`Resuming Deployment with account: ${deployer.address}`);

    // EXISTING ADDRESSES (From User's Partial Run)
    const factoryAddress = "0x5E260fA5aa8449a62C63687559BfE5AABe36BE5f";
    const poolAddress = "0xFb7053769f16267B93FdE3Dc8ec3828b521FdE41";

    const WCELO = "0x471EcE3750Da237f93B8E339c536989b8978a438";

    console.log(`Using Existing Mock Factory: ${factoryAddress}`);
    console.log(`Using Existing Mock Pool: ${poolAddress}`);

    // 3. Deploy Router linked to THIS Factory
    console.log("Deploying Router...");
    const Router = await ethers.getContractFactory("LiteSwapRouter");
    const router = await Router.deploy(factoryAddress, WCELO);
    await router.waitForDeployment();
    const routerAddress = await router.getAddress();
    console.log(`✅ LiteSwapRouter Deployed: ${routerAddress}`);

    // 4. Deploy User Executor Factory (Standard)
    console.log("Deploying LiquiFlashFactory...");
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
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
