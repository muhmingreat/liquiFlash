
import hre from "hardhat";
const { ethers } = hre;

const ADDRESSES = [
    { name: "Current Configured Factory", address: "0xf5e24ad27ecdcb77382570076fa77e3aaec77a0e" },
    { name: "Alfajores Factory", address: "0x229Fd76DA9062C1a10eb4193768E192bdEA99572" },
    { name: "Mainnet Factory", address: "0xAfE208a311B21f13EF87E33A90049fC17A7acDEc" }
];

async function main() {
    console.log("Checking for contract code on Celo Sepolia...");
    const provider = ethers.provider;

    for (const item of ADDRESSES) {
        try {
            const code = await provider.getCode(item.address);
            if (code === "0x") {
                console.log(`❌ ${item.name} (${item.address}): NO CODE`);
            } else {
                console.log(`✅ ${item.name} (${item.address}): EXISTS (${code.length} bytes)`);
            }
        } catch (e) {
            console.log(`⚠️ ${item.name}: Error - ${e.message}`);
        }
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
