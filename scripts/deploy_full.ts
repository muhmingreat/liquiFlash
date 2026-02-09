import hre from "hardhat";

const { ethers } = hre;

async function main() {
    const networkName = hre.network.name;
    const chainId = hre.network.config.chainId;
    console.log(`🚀 Starting deployment to ${networkName} (ChainId: ${chainId})...`);

    const [deployer] = await ethers.getSigners();
    console.log("Deploying with account:", deployer.address);

    // 1. Deploy Master Implementation
    console.log("\n1️⃣ Deploying LiquiFlashExecutor (Master)...");
    const Executor = await ethers.getContractFactory("LiquiFlashExecutor");
    const masterExecutor = await Executor.deploy();
    await masterExecutor.waitForDeployment();
    const masterAddress = await masterExecutor.getAddress();
    console.log(`✅ Master Executor: ${masterAddress}`);

    // 2. Deploy Factory
    console.log("\n2️⃣ Deploying LiquiFlashFactory...");
    const Factory = await ethers.getContractFactory("LiquiFlashFactory");
    const factory = await Factory.deploy(masterAddress);
    await factory.waitForDeployment();
    const factoryAddress = await factory.getAddress();
    console.log(`✅ Factory: ${factoryAddress}`);

    // 3. Deploy/Get WNative (Testnet Only)
    // For mainnets, you should set this to the real Wrapped Native address
    console.log("\n3️⃣ Deploying Mock WNative Token...");
    const WNative = await ethers.getContractFactory("MockERC20");
    const wNative = await WNative.deploy("Wrapped Native", "WNAT");
    await wNative.waitForDeployment();
    const wNativeAddress = await wNative.getAddress();
    console.log(`✅ Mock WNative: ${wNativeAddress}`);

    // 4. Deploy Mock USDC (Testnet Only)
    console.log("\n4️⃣ Deploying Mock USDC...");
    const usdc = await WNative.deploy("USD Coin", "USDC");
    await usdc.waitForDeployment();
    const usdcAddress = await usdc.getAddress();
    console.log(`✅ Mock USDC: ${usdcAddress}`);

    // 5. Deploy Router (Using our Factory and Mock WNative)
    console.log("\n5️⃣ Deploying LiteSwapRouter...");
    const LiteSwapRouter = await ethers.getContractFactory("LiteSwapRouter");
    const router = await LiteSwapRouter.deploy(factoryAddress, wNativeAddress);
    await router.waitForDeployment();
    const routerAddress = await router.getAddress();
    console.log(`✅ LiteSwapRouter: ${routerAddress}`);


    console.log("\n🎉 Deployment Complete!");
    console.log("----------------------------------------------------");
    console.log(`[${networkName}] Config for config/networks.ts:`);
    console.log(`
    [${chainId}]: {
        name: "${networkName}",
        factoryAddress: "${factoryAddress}",
        routerV3Address: "${routerAddress}",
        tokens: {
            wNative: "${wNativeAddress}",
            usdc: "${usdcAddress}",
        },
        blockExplorer: "https://explorer.yourchain.com" // Update manually
    },
    `);
    console.log("----------------------------------------------------");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
