
import hre from "hardhat";
const { ethers } = hre;

const FACTORY_ADDRESS = "0xf5e24ad27ecdcb77382570076fa77e3aaec77a0e";
const WCELO = "0x471ece3750da237f93b8e339c536989b8978a438";
const USDC = "0xa38345d75e5b7dd4b8274ed43af84e2179d8c579";
const POOL_FEE = 3000;

const FACTORY_ABI = ["function getPool(address, address, uint24) external view returns (address)"];
const POOL_ABI = ["function liquidity() external view returns (uint128)"];

async function main() {
    console.log("Checking Pool Status...");
    const [signer] = await ethers.getSigners();
    const factory = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, signer);

    const poolAddress = await factory.getPool(WCELO, USDC, POOL_FEE);
    console.log(`Pool Address for WCELO/USDC (3000): ${poolAddress}`);

    if (poolAddress === "0x0000000000000000000000000000000000000000") {
        console.log("❌ POOL DOES NOT EXIST");
    } else {
        const pool = new ethers.Contract(poolAddress, POOL_ABI, signer);
        try {
            const liquidity = await pool.liquidity();
            console.log(`✅ POOL EXISTS. Liquidity: ${liquidity.toString()}`);
            if (liquidity == 0n) {
                console.log("⚠️ WARNING: Liquidity is 0");
                require("fs").writeFileSync("pool_status.txt", "EXISTS_BUT_EMPTY");
            } else {
                console.log("✅ POOL EXISTS. Liquidity: " + liquidity.toString());
                require("fs").writeFileSync("pool_status.txt", "EXISTS_AND_LIQUID");
            }
        } catch (e) {
            console.log("❌ Failed to read liquidity");
            require("fs").writeFileSync("pool_status.txt", "ERROR_READING");
        }
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
