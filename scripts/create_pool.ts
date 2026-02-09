import { ethers } from "hardhat";

// Official Celo Sepolia Addresses
const TOKENS = {
    WCELO: "0x2cE73DC897A3E10b3FF3F86470847c36ddB735cf",
    USDC: "0x01C5C0122039549AD1493B8220cABEdD739BC44E"
};

const POSITION_MANAGER_ADDRESS = "0x3d79EdAaBC0EaB6F08ED885C05Fc0B014290D95A"; // Celo Sepolia NonfungiblePositionManager
const FACTORY_ADDRESS = "0xF5E24aD27EcDCb77382570076FA77e3aaEC77a0e";

// ABIs
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
    console.log(`Starting Pool Creation/Liquidity Add...`);
    console.log(`Signer: ${signer.address}`);

    const manager = new ethers.Contract(POSITION_MANAGER_ADDRESS, NFT_MANAGER_ABI, signer);
    const wcelo = new ethers.Contract(TOKENS.WCELO, ERC20_ABI, signer);
    const usdc = new ethers.Contract(TOKENS.USDC, ERC20_ABI, signer);

    const amountWCELO = ethers.parseEther("0.1"); // 0.1 CELO
    const amountUSDC = ethers.parseUnits("1", 6); // 1 USDC

    // 1. Approve
    console.log("Approving tokens...");
    await (await wcelo.approve(POSITION_MANAGER_ADDRESS, amountWCELO)).wait();
    await (await usdc.approve(POSITION_MANAGER_ADDRESS, amountUSDC)).wait();

    // 2. Initialize Pool (if needed) - Price 1 CELO = 10 USDC (approx) -> sqrtPrice
    // Q64.96 format
    // sqrt(10/1) * 2^96 
    // approx 3.16 * 2^96 ~= 250541448375047931186413801569

    // Sort tokens
    const token0 = TOKENS.WCELO < TOKENS.USDC ? TOKENS.WCELO : TOKENS.USDC;
    const token1 = TOKENS.WCELO < TOKENS.USDC ? TOKENS.USDC : TOKENS.WCELO;

    // If WCELO is token0, price is USDC/CELO. If USDC is token0 (likely), price is CELO/USDC.
    // 0x01C5... (USDC) is smaller than 0x2cE7... (WCELO)
    // So Token0 = USDC, Token1 = WCELO.
    // Price = WCELO / USDC.
    // 1 USDC = 0.1 CELO (if 1 CELO = 10 USDC).
    // Price = 0.1. Sqrt(0.1) = 0.316.
    // 0.316 * 2^96 = 25054144837504793118641380156

    const sqrtPriceX96 = "25054144837504793118641380156";

    console.log("Initializing Pool...");
    await (await manager.createAndInitializePoolIfNecessary(
        token0,
        token1,
        3000,
        sqrtPriceX96
    )).wait();

    // 3. Mint Position (Full Range-ish for testing)
    console.log("Adding Liquidity...");
    const params = {
        token0: token0,
        token1: token1,
        fee: 3000,
        tickLower: -887220, // Min Tick
        tickUpper: 887220,  // Max Tick
        amount0Desired: amountUSDC,
        amount1Desired: amountWCELO,
        amount0Min: 0,
        amount1Min: 0,
        recipient: signer.address,
        deadline: Math.floor(Date.now() / 1000) + 60 * 10
    };

    const tx = await manager.mint(params);
    const receipt = await tx.wait();
    console.log(`✅ Liquidity Added! Tx: ${receipt.hash}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
