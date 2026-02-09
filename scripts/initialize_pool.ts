
import hre from "hardhat";
const { ethers } = hre;


// UI Addresses (The ones we want to trade)
const TOKENS = {
    WCELO: "0x471EcE3750Da237f93B8E339c536989b8978a438", // GoldToken
    USDC: "0xA38345d75e5b7DD4b8274eD43aF84E2179D8c579"  // Mock USDC
};

// Celo Sepolia Configuration
const POSITION_MANAGER_ADDRESS = "0x3d79EdAaBC0EaB6F08ED885C05Fc0B014290D95A";
const FACTORY_ADDRESS = "0xF5E24aD27EcDCb77382570076FA77e3aaEC77a0e";
const TICK_SPACING = 60; // For fee 3000

const NFT_MANAGER_ABI = [
    "function mint((address token0, address token1, uint24 fee, int24 tickLower, int24 tickUpper, uint256 amount0Desired, uint256 amount1Desired, uint256 amount0Min, uint256 amount1Min, address recipient, uint256 deadline)) external payable returns (uint256 tokenId, uint128 liquidity, uint256 amount0, uint256 amount1)",
    "function createAndInitializePoolIfNecessary(address token0, address token1, uint24 fee, uint160 sqrtPriceX96) external payable returns (address pool)"
];

const ERC20_ABI = [
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function balanceOf(address account) external view returns (uint256)",
    "function decimals() external view returns (uint8)"
];

async function main() {
    const [signer] = await ethers.getSigners();
    console.log(`🚀 Starting Pool Initialization...`);
    console.log(`Signer: ${signer.address}`);

    const manager = new ethers.Contract(POSITION_MANAGER_ADDRESS, NFT_MANAGER_ABI, signer);
    const wcelo = new ethers.Contract(TOKENS.WCELO, ERC20_ABI, signer);
    const usdc = new ethers.Contract(TOKENS.USDC, ERC20_ABI, signer);

    // Amounts to add (Liquidity)
    const amountWCELO = ethers.parseEther("1.0"); // 1 CELO
    const amountUSDC = ethers.parseUnits("1.0", 6); // 1 USDC (Price 1 CELO = 1 USDC for simple testing)

    // Note: If you want 1 CELO = 10 USDC, adjust amounts and SqrtPrice.
    // Let's stick to 1 CELO = 1 USD for simplicity in testnet, or maybe 5 USD.
    // Let's do 1 CELO = 1 USDC to avoid complex math issues for now, unless price matters.
    // Wait, in create_pool.ts we had logic for SqrtPrice.
    // Let's make 1 CELO = 10 USDC.
    // Price = Token1/Token0 (assuming Token0 is USDC, Token1 is WCELO? No, usually sorted by address)

    // Sort tokens
    const token0 = TOKENS.WCELO.toLowerCase() < TOKENS.USDC.toLowerCase() ? TOKENS.WCELO : TOKENS.USDC;
    const token1 = TOKENS.WCELO.toLowerCase() < TOKENS.USDC.toLowerCase() ? TOKENS.USDC : TOKENS.WCELO;

    console.log(`Token0: ${token0}`);
    console.log(`Token1: ${token1}`);

    // USDC (0xA38...) > WCELO (0x471...) ? 
    // 0x471... is SMALLER than 0xA38...
    // So Token0 = WCELO, Token1 = USDC.

    // Price = Token1 (USDC) / Token0 (WCELO)
    // Target Price: 1 CELO = 10 USDC.
    // Price = 10.
    // SqrtPrice = Sqrt(10) * 2^96
    // Sqrt(10) = 3.1622...
    // 3.1622 * 79228162514264337593543950336 = 250541448375047931186413801569 (approx)
    const sqrtPriceX96 = "250541448375047931186413801569";

    // Approve
    console.log("Approving tokens...");
    try {
        const tx1 = await wcelo.approve(POSITION_MANAGER_ADDRESS, amountWCELO);
        await tx1.wait();
        console.log("WCELO Approved");

        const tx2 = await usdc.approve(POSITION_MANAGER_ADDRESS, amountUSDC);
        await tx2.wait();
        console.log("USDC Approved");
    } catch (e) {
        console.error("Approval Failed:", e);
        // Might fail if not enough balance?
    }

    console.log("Initializing Pool...");
    try {
        const tx = await manager.createAndInitializePoolIfNecessary(
            token0,
            token1,
            3000,
            sqrtPriceX96
        );
        console.log(`Init Tx sent: ${tx.hash}`);
        await tx.wait();
        console.log("✅ Pool Initialized!");
    } catch (e) {
        console.log("Pool might already exist or init failed. proceeding to add liquidity...");
    }

    // Add Liquidity (Full Range roughly)
    // -887220 to 887220 is full range for fee 3000? 
    // Tick spacing is 60. Max tick is 887272.
    // Let's use a safe wide range.
    const tickLower = -887220;
    const tickUpper = 887220;

    // Since Token0 = WCELO, Token1 = USDC
    // Price point is 10 USDC per CELO.
    // We add 1 CELO and 10 USDC.

    console.log("Adding Liquidity...");
    const params = {
        token0: token0,
        token1: token1,
        fee: 3000,
        tickLower: tickLower,
        tickUpper: tickUpper,
        amount0Desired: amountWCELO,
        amount1Desired: ethers.parseUnits("10", 6), // 10 USDC
        amount0Min: 0,
        amount1Min: 0,
        recipient: signer.address,
        deadline: Math.floor(Date.now() / 1000) + 60 * 10
    };

    try {
        const tx = await manager.mint(params);
        console.log(`Mint Tx sent: ${tx.hash}`);
        const receipt = await tx.wait();
        console.log(`✅ Liquidity Added! Block: ${receipt.blockNumber}`);
    } catch (e: any) {
        console.error("Minting Failed:", e.message || e);
        // Sometimes Mint fails if slippage or strict checks.
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
