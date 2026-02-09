import hre from "hardhat";
const { ethers } = hre;

// Celo Sepolia Constants
const WCELO = "0x2cE73DC897A3E10b3FF3F86470847c36ddB735cf"; // Verified Official WETH
const POSITION_MANAGER = "0x3d79EdAaBC0EaB6F08ED885C05Fc0B014290D95A";
const V3_FACTORY = "0xF5E24aD27EcDCb77382570076FA77e3aaEC77a0e";

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log(`Setting up Environment with account: ${deployer.address}`);

    // --- 1. Deploy Mock Token ---
    console.log("1. Deploying Mock Token (TEST)...");
    const MockToken = await ethers.getContractFactory("MockERC20");
    const token = await MockToken.deploy();
    await token.waitForDeployment();
    const tokenAddress = await token.getAddress();
    console.log(`✅ TEST Token deployed: ${tokenAddress}`);

    // --- 2. Deploy LiquiFlash System ---
    console.log("2. Deploying LiquiFlash Contracts...");
    const Executor = await ethers.getContractFactory("LiquiFlashExecutor");
    const executor = await Executor.deploy();
    await executor.waitForDeployment();
    console.log(`✅ Executor Master: ${await executor.getAddress()}`);

    const Factory = await ethers.getContractFactory("LiquiFlashFactory");
    const factory = await Factory.deploy(await executor.getAddress());
    await factory.waitForDeployment();
    const factoryAddress = await factory.getAddress();
    console.log(`✅ LiquiFlashFactory: ${factoryAddress}`);

    // --- 3. Create V3 Pool (TEST/WCELO) ---
    console.log("3. Initialize V3 Pool (TEST/WCELO @ 0.3%)...");

    // Sort tokens
    const t0 = tokenAddress.toLowerCase() < WCELO.toLowerCase() ? tokenAddress : WCELO;
    const t1 = tokenAddress.toLowerCase() < WCELO.toLowerCase() ? WCELO : tokenAddress;

    // SqrtPriceX96 for ~1:1 price
    // 2^96 = 79228162514264337593543950336
    const sqrtPriceX96 = "79228162514264337593543950336";

    // Note: We use a minimal interface or `call` if ABI missing, but Hardhat often infers if artifacts exist.
    // To be safe, we use the low-level ABI defined below.

    const MGR_ABI = [
        "function createAndInitializePoolIfNecessary(address token0, address token1, uint24 fee, uint160 sqrtPriceX96) external payable returns (address pool)",
        "function mint((address token0, address token1, uint24 fee, int24 tickLower, int24 tickUpper, uint256 amount0Desired, uint256 amount1Desired, uint256 amount0Min, uint256 amount1Min, address recipient, uint256 deadline)) external payable returns (uint256, uint128, uint256, uint256)"
    ];
    const mgrContract = new ethers.Contract(POSITION_MANAGER, MGR_ABI, deployer);

    // Create Pool
    await (await mgrContract.createAndInitializePoolIfNecessary(t0, t1, 3000, sqrtPriceX96)).wait();
    console.log("✅ Pool Initialized");

    // --- 4. Add Liquidity ---
    console.log("4. Adding Liquidity...");

    // Approve Manager
    const amount = ethers.parseEther("1000");
    await (await token.approve(POSITION_MANAGER, amount)).wait();

    // NATIVE CELO USAGE:
    // On Celo, the native token is an ERC20 compliant contract.
    // Address: 0x471EcE3750Da237f93B8E339c536989b8978a438 (Native Token)

    const CELO_ERC20_ABI = ["function approve(address, uint) returns (bool)"];
    const NATIVE_CELO = "0x471EcE3750Da237f93B8E339c536989b8978a438";

    const celoToken = new ethers.Contract(NATIVE_CELO, CELO_ERC20_ABI, deployer);

    console.log("Approving Native CELO...");
    await (await celoToken.approve(POSITION_MANAGER, ethers.parseEther("10.0"))).wait();

    // Mint
    const params = {
        // If our constant was wrong, swap it. 
        // ACTUALLY: The Pool was created with 'WCELO' (the address at top). 
        // If that address is 'Bridged WETH', we have no tokens for it.
        // We must Create the pool with NATIVE CELO address.

        token0: (tokenAddress.toLowerCase() < NATIVE_CELO.toLowerCase()) ? tokenAddress : NATIVE_CELO,
        token1: (tokenAddress.toLowerCase() < NATIVE_CELO.toLowerCase()) ? NATIVE_CELO : tokenAddress,
        fee: 3000,
        tickLower: -887220,
        tickUpper: 887220,
        amount0Desired: ethers.parseEther("0.5"),
        amount1Desired: ethers.parseEther("0.5"),
        amount0Min: 0,
        amount1Min: 0,
        recipient: deployer.address,
        deadline: Math.floor(Date.now() / 1000) + 600
    };

    await (await mgrContract.mint(params)).wait();
    console.log("✅ Liquidity Added");

    console.log("\n----------------------------------------------------");
    console.log("UPDATE YOUR .env WITH THIS FACTORY:");
    console.log(`NEXT_PUBLIC_FACTORY_ADDRESS="${factoryAddress}"`);
    console.log("\nUPDATE config/contracts.ts WITH THIS TOKEN:");
    console.log(`USDC: "${tokenAddress}"`);
    console.log("----------------------------------------------------");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
