import { celoSepolia, polygonAmoy, avalancheFuji, bscTestnet } from "wagmi/chains";

export const NETWORK_CONFIG: Record<number, {
    name: string;
    factoryAddress: `0x${string}`;
    routerV3Address: `0x${string}`; // Mock or Real Router
    tokens: {
        wNative: `0x${string}`;
        usdc: `0x${string}`;
    };
    blockExplorer: string;
}> = {
    // 1. Celo Sepolia (Default / Primary)
    [celoSepolia.id]: {
        name: "Celo Sepolia",
        // Fallback to env or hardcoded for existing support
        factoryAddress: (process.env.NEXT_PUBLIC_FACTORY_ADDRESS as `0x${string}`) || "0xf5e24ad27ecdcb77382570076fa77e3aaec77a0e",
        routerV3Address: "0x95a8944A5F42295D6949E9a667f38A8dA5aF0Ba9",
        tokens: {
            wNative: "0x471EcE3750Da237f93B8E339c536989b8978a438", // WCELO
            usdc: "0xA38345d75e5b7DD4b8274eD43aF84E2179D8c579", // MockUSDC
        },
        blockExplorer: "https://celo-sepolia.blockscout.com"
    },

    // 2. Polygon Amoy
    [polygonAmoy.id]: {
        name: "Polygon Amoy",
        factoryAddress: "0xc2EA976aB13727Ab84E4f77477ad9149115Fa580",
        routerV3Address: "0xa7685a21E0eEa0BCA20411aeFbdFDC6EeBdaf94a",
        tokens: {
            wNative: "0xac0dFE68E1F230935692135FFa5ee5C6BA88c1fd", // Mock WNative
            usdc: "0xD1A48A48ebcd645c820270244111e29f87bff49d", // Mock USDC
        },
        blockExplorer: "https://amoy.polygonscan.com"
    },

    // 3. Avalanche Fuji (Placeholder Addresses)
    [avalancheFuji.id]: {
        name: "Avalanche Fuji",
        factoryAddress: "0x0000000000000000000000000000000000000000", // TODO: Deploy here
        routerV3Address: "0x0000000000000000000000000000000000000000",
        tokens: {
            wNative: "0x0000000000000000000000000000000000000000", // WAVAX
            usdc: "0x0000000000000000000000000000000000000000",
        },
        blockExplorer: "https://testnet.snowtrace.io"
    },

    // 4. BSC Testnet (Placeholder Addresses)
    [bscTestnet.id]: {
        name: "BSC Testnet",
        factoryAddress: "0x0000000000000000000000000000000000000000", // TODO: Deploy here
        routerV3Address: "0x0000000000000000000000000000000000000000",
        tokens: {
            wNative: "0x0000000000000000000000000000000000000000", // WBNB
            usdc: "0x0000000000000000000000000000000000000000",
        },
        blockExplorer: "https://testnet.bscscan.com"
    }
};

// NOTE: FOR MULTI-CHAIN SUPPORT
// You must deploy the `LiquiFlashFactory` and `LiquiFlashExecutor` to the new networks.
// Once deployed, update the 'factoryAddress' and 'routerV3Address' (if using a new router) above.
// The app will then automatically work on those chains.

// Helper to get config safely (defaults to Celo Sepolia if chain not found)
export const getNetworkConfig = (chainId: number | undefined) => {
    if (!chainId || !NETWORK_CONFIG[chainId]) {
        return NETWORK_CONFIG[celoSepolia.id];
    }
    return NETWORK_CONFIG[chainId];
};
