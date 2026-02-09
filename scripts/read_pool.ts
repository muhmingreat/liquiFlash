import { ethers } from "hardhat";

// Addresses to check
const WETH = "0x2cE73DC897A3E10b3FF3F86470847c36ddB735cf";
const USDC = "0x01C5C0122039549AD1493B8220cABEdD739BC44E";
const FACTORY = "0xF5E24aD27EcDCb77382570076FA77e3aaEC77a0e";

// ABI
const FACTORY_ABI = ["function getPool(address, address, uint24) external view returns (address)"];
const POOL_ABI = ["function liquidity() external view returns (uint128)", "function slot0() external view returns (uint160, int24, uint16, uint16, uint16, uint8, bool)"];

async function main() {
    const [signer] = await ethers.getSigners();
    console.log(`Checking Pool for WETH: ${WETH} <-> USDC: ${USDC}`);

    const factory = new ethers.Contract(FACTORY, FACTORY_ABI, signer);

    // Check Fee 3000
    const poolAddress = await factory.getPool(WETH, USDC, 3000);
    console.log(`Pool Address (3000): ${poolAddress}`);

    if (poolAddress === ethers.ZeroAddress) {
        console.error("❌ POOL DOES NOT EXIST. YOU MUST CREATE IT.");
    } else {
        const pool = new ethers.Contract(poolAddress, POOL_ABI, signer);
        const liquidity = await pool.liquidity();
        console.log(`Liquidity: ${liquidity.toString()}`);
        if (liquidity == 0n) {
            console.error("❌ POOL EXISTS BUT HAS 0 LIQUIDITY.");
        } else {
            console.log("✅ POOL IS READY.");
        }
    }
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
