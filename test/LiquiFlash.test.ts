import { expect } from "chai";
import { ethers } from "hardhat";
import { LiquiFlashFactory, LiquiFlashExecutor } from "../typechain-types";

describe("LiquiFlash System", function () {
    let factory: LiquiFlashFactory;
    let masterExecutor: LiquiFlashExecutor;
    let owner: any;
    let bot: any;
    let user: any;
    let attacker: any;

    before(async function () {
        [owner, bot, user, attacker] = await ethers.getSigners();
    });

    it("Should deploy Factory and Master Implementation", async function () {
        // 1. Deploy Master Implementation
        const Executor = await ethers.getContractFactory("LiquiFlashExecutor");
        masterExecutor = await Executor.deploy();
        await masterExecutor.waitForDeployment();

        // 2. Deploy Factory
        const Factory = await ethers.getContractFactory("LiquiFlashFactory");
        factory = await Factory.deploy(await masterExecutor.getAddress());
        await factory.waitForDeployment();

        expect(await factory.implementation()).to.equal(await masterExecutor.getAddress());
    });

    it("Should allow user to create a secure clone", async function () {
        // User creates their own executor, authorizing 'bot'
        const tx = await factory.connect(user).createExecutor(bot.address);
        const receipt = await tx.wait();

        // Get the address from events or mapping
        const userExecutors = await factory.getExecutors(user.address);
        expect(userExecutors.length).to.equal(1);

        const cloneAddress = userExecutors[0];
        const clone = await ethers.getContractAt("LiquiFlashExecutor", cloneAddress);

        // Verify ownership and permissions
        expect(await clone.owner()).to.equal(user.address); // User should be owner
        expect(await clone.executor()).to.equal(bot.address); // Bot should be executor
    });

    it("Should prevent unauthorized users (Attacker) from using the clone", async function () {
        const userExecutors = await factory.getExecutors(user.address);
        const cloneAddress = userExecutors[0];
        const clone = await ethers.getContractAt("LiquiFlashExecutor", cloneAddress);

        // Attacker tries to set new executor
        await expect(
            clone.connect(attacker).setExecutor(attacker.address)
        ).to.be.revertedWithCustomError(clone, "OwnableUnauthorizedAccount");

        // Attacker tries to trade (mock call would fail authentication)
        // Here we check the modifier logic mainly.
    });

    it("Should allow Owner to withdraw funds", async function () {
        const userExecutors = await factory.getExecutors(user.address);
        const cloneAddress = userExecutors[0];

        // Send ETH to clone
        await user.sendTransaction({
            to: cloneAddress,
            value: ethers.parseEther("1.0")
        });

        // Check balance
        expect(await ethers.provider.getBalance(cloneAddress)).to.equal(ethers.parseEther("1.0"));

        // Withdraw
        const clone = await ethers.getContractAt("LiquiFlashExecutor", cloneAddress);
        await clone.connect(user).withdrawETH();

        // Balance should be 0
        expect(await ethers.provider.getBalance(cloneAddress)).to.equal(0n);
    });
});
