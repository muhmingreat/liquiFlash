
import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

const WCELO = "0x471EcE3750Da237f93B8E339c536989b8978a438";
const USDC = "0xA38345d75e5b7DD4b8274eD43aF84E2179D8c579";
const POOL_FEE = 3000;
// Factory address from read_pool.ts
const FACTORY_ADDRESS = "0xF5E24aD27EcDCb77382570076FA77e3aaEC77a0e";
const FACTORY_ABI = ["function getPool(address, address, uint24) external view returns (address)"];
const POOL_ABI = ["function liquidity() external view returns (uint128)"];

async function main() {
    const [signer] = await ethers.getSigners();
    const factory = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, signer);

    console.log("Checking Pool...");
    const poolAddress = await factory.getPool(WCELO, USDC, POOL_FEE);

    let result = "FAILED: Pool not found";

    if (poolAddress !== ethers.ZeroAddress) {
        const pool = new ethers.Contract(poolAddress, POOL_ABI, signer);
        try {
            const liquidity = await pool.liquidity();
            if (liquidity > 0n) {
                result = `SUCCESS: Pool Liquid. Liquidity: ${liquidity.toString()}`;
            } else {
                result = "FAILED: Pool exists but 0 Liquidity";
            }
        } catch (e) {
            result = "FAILED: Could not read liquidity";
        }
    }

    const outFile = path.join(__dirname, "../verification_result.txt");
    fs.writeFileSync(outFile, result);
    console.log("Written result to " + outFile);
}

main().catch((e) => {
    const outFile = path.join(__dirname, "../verification_result.txt");
    fs.writeFileSync(outFile, "ERROR: " + e.message);
    process.exit(1);
});
