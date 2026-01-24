// SDK Execute with Progress Example
// This component demonstrates how to execute a quote with real-time progress updates

import { useState, useEffect } from "react";
import { usePrivy } from '@privy-io/react-auth';
import { usePrivyWalletClient } from "../../utils/wallet";

export function ExecuteProgressExample() {
    const { ready, authenticated, login } = usePrivy();
    const { getWalletClient, isConnected } = usePrivyWalletClient();
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [sdkAvailable, setSdkAvailable] = useState(false);

    // Check if SDK is available
    useEffect(() => {
        import("@relayprotocol/relay-sdk").then(() => {
            setSdkAvailable(true);
        }).catch(() => {
            setSdkAvailable(false);
        });
    }, []);

    const codeSnippet = `import { getClient } from '@relayprotocol/relay-sdk';
import { useWalletClient } from 'wagmi';

const { data: wallet } = useWalletClient();
const quote = await getClient()?.actions.getQuote({...});

// Execute with progress tracking
getClient()?.actions.execute({
  quote,
  wallet,
  onProgress: ({ steps, fees, breakdown, currentStep, currentStepItem, txHashes, details }) => {
    // Update UI with progress
    console.log('Current Step:', currentStep);
    console.log('Transaction Hashes:', txHashes);
    console.log('Details:', details);
  }
});`;

    const handleRun = async () => {
        if (!ready || !authenticated || !isConnected) {
            setError("Please connect your wallet first");
            return;
        }

        const storedQuote = localStorage.getItem("relayQuoteResponse");
        if (!storedQuote) {
            setError("Please get a quote first (use Step 1: Get Quote or SDK: Get Quote example)");
            return;
        }

        setLoading(true);
        setError(null);
        setProgress(null);

        const quote = JSON.parse(storedQuote);

        // Try to use SDK if available
        if (sdkAvailable && isConnected) {
            try {
                const { getClient } = await import("@relayprotocol/relay-sdk");
                const wallet = await getWalletClient();
                const client = getClient();

                if (client && wallet) {
                    await client.actions.execute({
                        quote,
                        wallet,
                        onProgress: ({ steps, fees, breakdown, currentStep, currentStepItem, txHashes, details }) => {
                            setProgress({
                                currentStep: currentStep?.index !== undefined ? currentStep.index + 1 : 1,
                                totalSteps: steps?.length || 1,
                                stepName: currentStep?.action || "Processing",
                                status: currentStepItem?.status || "pending",
                                txHashes: txHashes || [],
                                details: details
                            });
                        }
                    });
                    setLoading(false);
                    return;
                }
            } catch (sdkError: any) {
                console.warn("SDK execution failed, falling back to manual execution:", sdkError);
                // Fall through to manual execution
            }
        }

        try {
            const provider = window.ethereum;
            await provider.request({ method: "eth_requestAccounts" });
            const accounts = await provider.request({ method: "eth_accounts" });
            const userAddress = accounts[0];

            const chainId = await provider.request({ method: "eth_chainId" });
            const originChainId = parseInt(chainId as string, 16);
            const quoteOriginChainId = quote.steps[0]?.items[0]?.data?.chainId;

            if (originChainId !== quoteOriginChainId) {
                try {
                    await provider.request({
                        method: "wallet_switchEthereumChain",
                        params: [{ chainId: `0x${quoteOriginChainId.toString(16)}` }],
                    });
                } catch (switchError: any) {
                    if (switchError.code === 4902) {
                        setError(`Please add chain ${quoteOriginChainId} to your wallet first`);
                        setLoading(false);
                        return;
                    }
                    throw switchError;
                }
            }

            for (let i = 0; i < quote.steps.length; i++) {
                const step = quote.steps[i];
                if (step.kind === "transaction") {
                    const item = step.items[0];
                    const txData = item.data;

                    setProgress({
                        currentStep: i + 1,
                        totalSteps: quote.steps.length,
                        stepName: step.action || "Processing",
                        status: "pending"
                    });

                    const hash = await provider.request({
                        method: "eth_sendTransaction",
                        params: [{
                            from: userAddress,
                            to: txData.to,
                            data: txData.data,
                            value: txData.value,
                            gas: txData.gas || undefined,
                            maxFeePerGas: txData.maxFeePerGas || undefined,
                            maxPriorityFeePerGas: txData.maxPriorityFeePerGas || undefined,
                        }],
                    });

                    setProgress({
                        currentStep: i + 1,
                        totalSteps: quote.steps.length,
                        stepName: step.action || "Processing",
                        status: "completed",
                        txHash: hash,
                        requestId: step.requestId
                    });
                }
            }
        } catch (err: any) {
            setError(err.message || "Failed to execute transaction");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>SDK: Execute with Progress</h2>
            <p style={{ color: "#b0b0b0", marginBottom: "20px" }}>
                Code snippet showing how to execute a quote with real-time progress updates using the SDK's onProgress callback.
            </p>

            <div style={{
                background: "#1a1a1a",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: "20px"
            }}>
                <h3 style={{ color: "#e0e0e0", marginTop: 0, marginBottom: "15px" }}>Code Snippet</h3>
                <pre style={{
                    background: "#0D0C0D",
                    padding: "15px",
                    borderRadius: "8px",
                    overflowX: "auto",
                    color: "#e0e0e0",
                    fontSize: "0.85rem",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    margin: 0
                }}>
                    {codeSnippet}
                </pre>
            </div>

            {!isConnected && (
                <div style={{
                    padding: "15px",
                    background: "rgba(255, 107, 107, 0.1)",
                    border: "1px solid rgba(255, 107, 107, 0.3)",
                    borderRadius: "8px",
                    color: "#ff6b6b",
                    marginBottom: "20px",
                    fontSize: "0.9rem"
                }}>
                    Please connect your wallet at the top of the page to use this example.
                </div>
            )}

            <button
                onClick={handleRun}
                disabled={loading || !isConnected}
                style={{
                    width: "100%",
                    padding: "15px 30px",
                    background: isConnected ? "#4615C8" : "#1a1a1a",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    cursor: loading || !isConnected ? "not-allowed" : "pointer",
                    opacity: loading || !isConnected ? 0.6 : 1,
                    marginBottom: "20px"
                }}
            >
                {loading ? "Running..." : (!isConnected ? "Connect Wallet First" : "Run Example")}
            </button>

            {error && (
                <div style={{
                    padding: "15px",
                    background: "#3d1f1f",
                    border: "1px solid #5a2a2a",
                    borderRadius: "8px",
                    color: "#ff6b6b",
                    marginBottom: "20px"
                }}>
                    <strong>Error:</strong> {error}
                </div>
            )}

            {progress && (
                <div>
                    <h3 style={{ color: "#e0e0e0" }}>Result</h3>
                    <div style={{
                        background: "#1a1a1a",
                        borderRadius: "12px",
                        padding: "20px",
                        marginBottom: "20px"
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                            <span style={{ color: "#a0a0a0" }}>Step:</span>
                            <span style={{ color: "#e0e0e0", fontWeight: 600 }}>
                                {progress.currentStep} / {progress.totalSteps}
                            </span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                            <span style={{ color: "#a0a0a0" }}>Status:</span>
                            <span style={{ 
                                color: progress.status === "completed" ? "#4ade80" : "#fbbf24",
                                fontWeight: 600,
                                textTransform: "uppercase"
                            }}>
                                {progress.status}
                            </span>
                        </div>
                        {progress.txHash && (
                            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0" }}>
                                <span style={{ color: "#a0a0a0" }}>Transaction Hash:</span>
                                <span style={{ color: "#e0e0e0", fontFamily: "monospace", fontSize: "0.85rem", wordBreak: "break-all" }}>
                                    {progress.txHash}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
