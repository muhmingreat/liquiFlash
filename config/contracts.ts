import LiquiFlashFactoryArtifact from "@/lib/abis/LiquiFlashFactory.json";
import LiquiFlashExecutorArtifact from "@/lib/abis/LiquiFlashExecutor.json";
import { getNetworkConfig } from "./networks";

// Export ABIs (Chain Agnostic)
export const FACTORY_ABI = LiquiFlashFactoryArtifact.abi;
export const EXECUTOR_ABI = LiquiFlashExecutorArtifact.abi;

// Deprecated: Single Chain Exports (Kept for temporary compatibility if needed, but better to remove)
// Prefer using `useNetworkConfig()` hook or `getNetworkConfig(chainId)`


// Types
export interface NetworkAddresses {
    factory: `0x${string}`;
    router: `0x${string}`;
    routerV3: `0x${string}`;
    tokens: {
        wNative: `0x${string}`;
        usdc: `0x${string}`;
    }
}

