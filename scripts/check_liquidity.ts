import { ethers } from "hardhat";

const TOKENS = {
    WCELO: "0x2cE73DC897A3E10b3FF3F86470847c36ddB735cf",
    USDC: "0x01C5C0122039549AD1493B8220cABEdD739BC44E"
};

// Uniswap V3 Factory on Celo Sepolia
const V3_FACTORY_ADDRESS = "0xF5E24aD27EcDCb77382570076FA77e3aaEC77a0e"; // Official Celo Sepolia Factory

// Factory ABI (minimal)
const FACTORY_ABI = [
    "function getPool(address tokenA, address tokenB, uint24 fee) external view returns (address pool)"
];

// Pool ABI (minimal)
const POOL_ABI = [
    "function liquidity() external view returns (uint128)",
    "function slot0() external view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)"
];

async function main() {
    const [signer] = await ethers.getSigners();
    console.log("Checking V3 Liquidity on Celo Sepolia...");
    console.log(`Caller: ${signer.address}`);

    const factory = new ethers.Contract(V3_FACTORY_ADDRESS, FACTORY_ABI, signer);

    const feeTiers = [500, 3000, 10000]; // 0.05%, 0.3%, 1%

    for (const fee of feeTiers) {
        console.log(`\nChecking Pool for Fee Tier: ${fee}`);
        const poolAddress = await factory.getPool(TOKENS.WCELO, TOKENS.USDC, fee);

        if (poolAddress === "0x0000000000000000000000000000000000000000") {
            console.log(`❌ Pool DOES NOT EXIST for fee ${fee}`);
            continue;
        }

        console.log(`✅ Pool Found at: ${poolAddress}`);

        const pool = new ethers.Contract(poolAddress, POOL_ABI, signer);
        try {
            const liquidity = await pool.liquidity();
            console.log(`   Liquidity: ${liquidity.toString()}`);

            const slot0 = await pool.slot0();
            console.log(`   SqrtPriceX96: ${slot0.sqrtPriceX96.toString()}`);

            if (liquidity == 0n) {
                console.warn("   ⚠️ WARNING: Liquidity is ZERO. Swaps will fail.");
            } else {
                console.log("   ✅ Pool has liquidity.");
            }

        } catch (e) {
            console.error("   Failed to read pool state", e);
        }
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
