import { useState, useEffect, useCallback } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, usePublicClient, useBalance, useChainId } from "wagmi";
import { parseEther } from "viem";
import { FACTORY_ABI, EXECUTOR_ABI } from "@/config/contracts";
import { getNetworkConfig } from "@/config/networks";
import { useTerminalStore } from "@/lib/store";
import { toast } from "sonner";

export function useLiquiFlash() {
    const { address, isConnected } = useAccount();
    const chainId = useChainId();
    const networkConfig = getNetworkConfig(chainId);

    // Derived addresses based on current chain
    const FACTORY_ADDRESS = networkConfig.factoryAddress;

    const publicClient = usePublicClient();
    const { updateSettings } = useTerminalStore();

    const [items, setItems] = useState<any[]>([]);
    const [executorAddress, setExecutorAddress] = useState<`0x${string}` | null>(null);

    // 1. Read User's Executors from Factory
    const { data: userExecutors, refetch: refetchExecutors } = useReadContract({
        address: FACTORY_ADDRESS,
        abi: FACTORY_ABI,
        functionName: "getExecutors",
        args: address ? [address] : undefined,
        query: {
            enabled: !!address && !!FACTORY_ADDRESS,
        }
    });

    // Effect to set the Executor Address (using the latest one if multiple)
    useEffect(() => {
        if (userExecutors && Array.isArray(userExecutors) && userExecutors.length > 0) {
            const latestExecutor = userExecutors[userExecutors.length - 1] as `0x${string}`;
            setExecutorAddress(latestExecutor);
            // Update global store if needed, or we can just keep it local/context
        } else {
            setExecutorAddress(null);
        }
        // Reset executor if switching chains and no executor found there
    }, [userExecutors, chainId]);

    // 2. Executor Balance
    const { data: executorBalanceData, refetch: refetchBalance } = useBalance({
        address: executorAddress || undefined,
    });

    // 3. Deploy Action
    const { writeContract: deployExecutorWrite, data: deployHash, isPending: isDeploying, error: deployError } = useWriteContract();

    const { isLoading: isWaitingForDeploy, isSuccess: isDeploySuccess } = useWaitForTransactionReceipt({
        hash: deployHash,
    });

    // Watch for successful deployment to refetch
    useEffect(() => {
        if (isDeploySuccess) {
            toast.success("Trading Account Activated!");
            refetchExecutors();
        }
    }, [isDeploySuccess, refetchExecutors]);

    const deployExecutor = useCallback(() => {
        if (!address) return;
        try {
            // Initializing with a default "executor" bot address (can be updated later by owner)
            // For now, we set it to the user themselves or a placeholder bot address
            const DEFAULT_BOT_EXECUTOR = address; // User is also the bot for now

            deployExecutorWrite({
                address: FACTORY_ADDRESS,
                abi: FACTORY_ABI,
                functionName: "createExecutor",
                args: [DEFAULT_BOT_EXECUTOR],
            });
        } catch (err) {
            console.error("Deploy failed", err);
            toast.error("Failed to initiate deployment");
        }
    }, [address, deployExecutorWrite, FACTORY_ADDRESS]);


    // 4. Deposit Action (Sending ETH to Executor)
    const { writeContract: depositWrite, data: depositHash, isPending: isDepositing } = useWriteContract(); // Actually a simple sendTransaction would work for ETH

    // We use sendTransaction for ETH deposits usually, but let's use a helper
    const depositETH = async (amount: string) => {
        if (!executorAddress) return;
        try {
            // Using window.ethereum or provider directly for simple Send
            // But better to use wagmi's sendTransaction if available. 
            // Let's use the 'useSendTransaction' hook from wagmi for pure ETH transfers
        } catch (e) {
            console.error(e);
        }
    };

    // 5. Withdraw ETH Action (Calls withdrawETH on Executor)
    const { writeContract: withdrawWrite, data: withdrawHash, isPending: isWithdrawing } = useWriteContract();

    const withdrawETH = useCallback(() => {
        if (!executorAddress) return;
        withdrawWrite({
            address: executorAddress,
            abi: EXECUTOR_ABI,
            functionName: "withdrawETH",
        });
    }, [executorAddress, withdrawWrite]);


    return {
        executorAddress,
        hasExecutor: !!executorAddress,
        executorBalance: executorBalanceData,

        // Deploy
        deployExecutor,
        isDeploying: isDeploying || isWaitingForDeploy,
        deployHash,

        // Withdraw
        withdrawETH,
        isWithdrawing,

        // Network Info
        networkConfig
    };
}
