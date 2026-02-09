
import { ethers } from "hardhat";

// UI Addresses from config/contracts.ts
const WCELO = "0x471EcE3750Da237f93B8E339c536989b8978a438";
const USDC = "0xA38345d75e5b7DD4b8274eD43aF84E2179D8c579";
const POOL_FEE = 3000;

// Uniswap V3 Factory from read_pool.ts
const FACTORY_ADDRESS_1 = "0xF5E24aD27EcDCb77382570076FA77e3aaEC77a0e";
// Alfajores (just in case)
const FACTORY_ADDRESS_2 = "0x229Fd76DA9062C1a10eb4193768E192bdEA99572";

const FACTORY_ABI = ["function getPool(address, address, uint24) external view returns (address)"];
const POOL_ABI = ["function liquidity() external view returns (uint128)", "function slot0() external view returns (uint160, int24, uint16, uint16, uint16, uint8, bool)"];

async function main() {
    const [signer] = await ethers.getSigners();
    const factories = [FACTORY_ADDRESS_1, FACTORY_ADDRESS_2];

    console.log(`Checking Pool for WCELO: ${WCELO} <-> USDC: ${USDC} (Fee: ${POOL_FEE})`);

    for (const factoryAddr of factories) {
        console.log(`\nChecking Factory: ${factoryAddr}`);
        try {
            const factory = new ethers.Contract(factoryAddr, FACTORY_ABI, signer);
            const poolAddress = await factory.getPool(WCELO, USDC, POOL_FEE);
            console.log(`  Pool Address: ${poolAddress}`);

            if (poolAddress === ethers.ZeroAddress) {
                console.log("  ❌ Pool does not exist in this factory.");
            } else {
                console.log("  ✅ Pool FOUND at " + poolAddress);
                const pool = new ethers.Contract(poolAddress, POOL_ABI, signer);
                try {
                    const liquidity = await pool.liquidity();
                    console.log(`  Liquidity: ${liquidity.toString()}`);
                    const slot0 = await pool.slot0();
                    console.log(`  Slot0 (SqrtPrice): ${slot0[0]}`);
                } catch (e) {
                    console.log("  ⚠️ Pool found but failed to read state (maybe not initialized?)");
                }
            }
        } catch (e) {
            console.log(`  ⚠️ Error querying factory: ${e.message ? e.message.split('(')[0] : e}`);
        }
    }
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
