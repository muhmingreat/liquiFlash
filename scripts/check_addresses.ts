
import { ethers } from "hardhat";

const ADDRESSES = {
    "Factory (from config/scripts)": "0xF5E24aD27EcDCb77382570076FA77e3aaEC77a0e",
    "Router V3 (Original)": "0x5615CDAb10dc425a742d643d949a7F474C01abc4",
    "Router V3 (Alfajores)": "0x8C456F41A3883bA0ba99f810F7A2Da54D9Ea3EF0",
    "PositionManager": "0x3d79EdAaBC0EaB6F08ED885C05Fc0B014290D95A",
    "Uniswap V3 Factory (Official?)": "0xAfE208a311B21f13A8794B9470c10f62d6f7a79a"
};

async function main() {
    const provider = ethers.provider;
    console.log(`Checking addresses on network: ${(await provider.getNetwork()).name} chainId: ${(await provider.getNetwork()).chainId}`);

    for (const [name, address] of Object.entries(ADDRESSES)) {
        try {
            const code = await provider.getCode(address);
            const isContract = code !== "0x";
            console.log(`[${name}] ${address}: ${isContract ? "✅ CONTRACT (" + code.length + " bytes)" : "❌ EOA (No Code)"}`);
        } catch (e) {
            console.log(`[${name}] ${address}: ⚠️ ERROR - ${e.message.split('(')[0]}`);
        }
    }
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
