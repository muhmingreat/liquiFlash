import { ethers } from "hardhat";

async function main() {
    const [signer] = await ethers.getSigners();
    console.log("Runner: " + signer.address);

    const WETH = "0x2cE73DC897A3E10b3FF3F86470847c36ddB735cf"; // Correct Celo Sepolia WETH
    const USDC = "0x01C5C0122039549AD1493B8220cABEdD739BC44E"; // Correct Celo Sepolia USDC
    const MGR = "0x3d79EdAaBC0EaB6F08ED885C05Fc0B014290D95A"; // NonfungiblePositionManager

    // Sort
    const t0 = WETH.toLowerCase() < USDC.toLowerCase() ? WETH : USDC;
    const t1 = WETH.toLowerCase() < USDC.toLowerCase() ? USDC : WETH;

    // ABI
    const MGR_ABI = [
        "function createAndInitializePoolIfNecessary(address token0, address token1, uint24 fee, uint160 sqrtPriceX96) external payable returns (address pool)",
        "function mint((address token0, address token1, uint24 fee, int24 tickLower, int24 tickUpper, uint256 amount0Desired, uint256 amount1Desired, uint256 amount0Min, uint256 amount1Min, address recipient, uint256 deadline)) external payable returns (uint256, uint128, uint256, uint256)"
    ];
    const ERC20_ABI = ["function approve(address, uint256) external returns (bool)"];

    const manager = new ethers.Contract(MGR, MGR_ABI, signer);
    const wethC = new ethers.Contract(WETH, ERC20_ABI, signer);
    const usdcC = new ethers.Contract(USDC, ERC20_ABI, signer);

    const amtWETH = ethers.parseEther("0.1");
    const amtUSDC = ethers.parseUnits("1", 6); // 1 USDC

    console.log("Approving...");
    await (await wethC.approve(MGR, amtWETH)).wait();
    await (await usdcC.approve(MGR, amtUSDC)).wait();

    // Init Pool (1 CELO = 10 USDC approx)
    console.log("Initializing...");
    // SqrtPriceX96 for price 0.1 (if USDC is token0): 25054144837504793118641380156
    await (await manager.createAndInitializePoolIfNecessary(t0, t1, 3000, "25054144837504793118641380156")).wait();

    console.log("Minting...");
    await (await manager.mint({
        token0: t0,
        token1: t1,
        fee: 3000,
        tickLower: -887220,
        tickUpper: 887220,
        amount0Desired: (t0 === USDC) ? amtUSDC : amtWETH,
        amount1Desired: (t1 === USDC) ? amtUSDC : amtWETH,
        amount0Min: 0,
        amount1Min: 0,
        recipient: signer.address,
        deadline: Math.floor(Date.now() / 1000) + 600
    })).wait();

    console.log("DONE. Pool Created & Funded.");
}

main().catch(console.error);
