
import hre from "hardhat";
const { ethers } = hre;

// Celo Sepolia Addresses
const FACTORY = "0xf5e24ad27ecdcb77382570076fa77e3aaec77a0e";
const WCELO = "0x471ece3750da237f93b8e339c536989b8978a438";

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying Router with account:", deployer.address);

    const LiteSwapRouter = await ethers.getContractFactory("LiteSwapRouter");
    const router = await LiteSwapRouter.deploy(FACTORY, WCELO);

    await router.waitForDeployment();

    const address = await router.getAddress();
    console.log("✅ LiteSwapRouter deployed to:", address);

    const fs = require("fs");
    const path = require("path");
    fs.writeFileSync(path.join(__dirname, "../deployed_router.txt"), address);
    console.log("Address written to deployed_router.txt");

    console.log("---------------------------------------");
    console.log("UPDATE config/contracts.ts:");
    console.log(`export const ROUTER_V3_ADDRESS = "${address}";`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
