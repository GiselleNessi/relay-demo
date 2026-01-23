// SDK Execute with Progress Example
// This component demonstrates how to execute a quote with real-time progress updates

import { useState } from "react";

export function ExecuteProgressExample() {
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [sdkCode, setSdkCode] = useState("");
    const [usingSDK, setUsingSDK] = useState(false);
    const [progressSteps, setProgressSteps] = useState<any[]>([]);

    const handleExecute = async () => {
        // Check if wallet is available
        if (typeof window.ethereum === "undefined") {
            setError("No wallet detected. Please install MetaMask or another Web3 wallet.");
            return;
        }

        // Check for quote in localStorage
        const storedQuote = localStorage.getItem("relayQuoteResponse");
        if (!storedQuote) {
            setError("Please get a quote first (Step 1 or SDK Get Quote example)");
            return;
        }

        setLoading(true);
        setError(null);
        setProgress(null);

        const quote = JSON.parse(storedQuote);

        // Show the SDK code that would be used
        const code = `import { getClient } from '@relayprotocol/relay-sdk';
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
        setSdkCode(code);
        setProgressSteps([]);

        // Note: SDK is not installed in this demo
        // In a real app with SDK installed, you would use:
        // getClient()?.actions.execute({ quote, wallet, onProgress: ... });
        // For this demo, we simulate the onProgress callback behavior
        setUsingSDK(false);

        try {
            const provider = window.ethereum;
            
            // Request account access
            await provider.request({ method: "eth_requestAccounts" });
            const accounts = await provider.request({ method: "eth_accounts" });
            const userAddress = accounts[0];

            // Get chain ID
            const chainId = await provider.request({ method: "eth_chainId" });
            const originChainId = parseInt(chainId as string, 16);

            // Check if we're on the correct chain
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

            // Simulate progress updates (in real app, SDK handles this)
            const progressUpdates = [
                { step: "Preparing transaction...", txHashes: [] },
                { step: "Submitting deposit transaction...", txHashes: [] },
                { step: "Waiting for confirmation...", txHashes: [] },
            ];

            for (let i = 0; i < quote.steps.length; i++) {
                const step = quote.steps[i];
                if (step.kind === "transaction") {
                    const item = step.items[0];
                    const txData = item.data;

                    // Update progress
                    setProgress({
                        currentStep: i + 1,
                        totalSteps: quote.steps.length,
                        stepName: step.action || "Processing",
                        status: "pending"
                    });

                    // Send transaction
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
            console.error("Execute error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>SDK: Execute with Progress Tracking</h2>
            <p style={{ color: "#b0b0b0", marginBottom: "20px" }}>
                This example shows you how the SDK's <code style={{ background: "#1a1a1a", padding: "2px 6px", borderRadius: "4px" }}>onProgress</code> callback works. 
                <strong style={{ color: "#e0e0e0" }}> The SDK is not installed in this demo</strong>, so we're simulating the progress updates you would get with the SDK.
            </p>

            <div style={{
                background: "rgba(70, 21, 200, 0.1)",
                border: "1px solid rgba(70, 21, 200, 0.3)",
                borderRadius: "8px",
                padding: "15px",
                marginBottom: "20px"
            }}>
                <p style={{ color: "#b0b0b0", margin: 0, fontSize: "0.9rem" }}>
                    <strong style={{ color: "#4615C8" }}>SDK Advantage:</strong> The SDK provides real-time progress updates through the <code style={{ background: "#1a1a1a", padding: "2px 6px", borderRadius: "4px" }}>onProgress</code> callback. 
                    Instead of manually polling for status, the SDK calls your callback function automatically as the transaction progresses.
                </p>
            </div>

            <button
                onClick={handleExecute}
                disabled={loading}
                style={{
                    width: "100%",
                    padding: "15px 30px",
                    background: "#4615C8",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.6 : 1
                }}
            >
                {loading ? "Executing..." : "Execute with Progress Tracking"}
            </button>

            {error && (
                <div style={{
                    marginTop: "20px",
                    padding: "15px",
                    background: "#3d1f1f",
                    border: "1px solid #5a2a2a",
                    borderRadius: "8px",
                    color: "#ff6b6b"
                }}>
                    <strong>Error:</strong> {error}
                </div>
            )}

            {sdkCode && (
                <div style={{ marginTop: "30px" }}>
                    <h3>SDK Code with onProgress</h3>
                    <pre style={{
                        background: "#0D0C0D",
                        padding: "15px",
                        borderRadius: "8px",
                        overflowX: "auto",
                        color: "#e0e0e0",
                        fontSize: "0.85rem",
                        border: "1px solid rgba(255, 255, 255, 0.1)"
                    }}>
                        {sdkCode}
                    </pre>
                </div>
            )}

            {progressSteps.length > 0 && (
                <div style={{ marginTop: "30px" }}>
                    <h3>Progress History</h3>
                    <div style={{
                        background: "#1a1a1a",
                        borderRadius: "12px",
                        padding: "20px",
                        marginBottom: "20px"
                    }}>
                        {progressSteps.map((step, idx) => (
                            <div key={idx} style={{
                                padding: "15px",
                                background: "#0D0C0D",
                                borderRadius: "8px",
                                marginBottom: "10px",
                                border: "1px solid rgba(255, 255, 255, 0.1)"
                            }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                                    <span style={{ color: "#e0e0e0", fontWeight: 600 }}>{step.stepName}</span>
                                    <span style={{
                                        color: step.status === "completed" ? "#4ade80" : "#fbbf24",
                                        fontWeight: 600,
                                        textTransform: "uppercase",
                                        fontSize: "0.85rem"
                                    }}>
                                        {step.status}
                                    </span>
                                </div>
                                {step.txHash && (
                                    <div style={{ color: "#a0a0a0", fontSize: "0.85rem", fontFamily: "monospace", wordBreak: "break-all" }}>
                                        Tx: {step.txHash}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {progress && (
                <div style={{ marginTop: "30px" }}>
                    <h3>Current Progress</h3>
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
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                            <span style={{ color: "#a0a0a0" }}>Action:</span>
                            <span style={{ color: "#e0e0e0", fontWeight: 600 }}>
                                {progress.stepName}
                            </span>
                        </div>
                        {progress.txHash && (
                            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                                <span style={{ color: "#a0a0a0" }}>Transaction Hash:</span>
                                <span style={{ color: "#e0e0e0", fontFamily: "monospace", fontSize: "0.85rem", wordBreak: "break-all" }}>
                                    {progress.txHash}
                                </span>
                            </div>
                        )}
                        {progress.requestId && (
                            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0" }}>
                                <span style={{ color: "#a0a0a0" }}>Request ID:</span>
                                <span style={{ color: "#e0e0e0", fontFamily: "monospace", fontSize: "0.85rem", wordBreak: "break-all" }}>
                                    {progress.requestId}
                                </span>
                            </div>
                        )}
                    </div>

                    <div style={{
                        background: "#1a1a1a",
                        borderRadius: "12px",
                        padding: "20px",
                        marginTop: "20px"
                    }}>
                        <h4 style={{ color: "#e0e0e0", marginTop: 0 }}>onProgress Callback Data</h4>
                        <p style={{ color: "#a0a0a0", fontSize: "0.9rem", marginBottom: "10px" }}>
                            The SDK's onProgress callback provides:
                        </p>
                        <ul style={{ color: "#b0b0b0", lineHeight: "1.8", margin: 0, paddingLeft: "20px" }}>
                            <li><strong style={{ color: "#e0e0e0" }}>steps</strong> - Full steps object with updated status</li>
                            <li><strong style={{ color: "#e0e0e0" }}>fees</strong> - Complete fees breakdown</li>
                            <li><strong style={{ color: "#e0e0e0" }}>breakdown</strong> - Full breakdown object</li>
                            <li><strong style={{ color: "#e0e0e0" }}>currentStep</strong> - Current step being processed</li>
                            <li><strong style={{ color: "#e0e0e0" }}>currentStepItem</strong> - Current item in the step</li>
                            <li><strong style={{ color: "#e0e0e0" }}>txHashes</strong> - All transaction hashes processed so far</li>
                            <li><strong style={{ color: "#e0e0e0" }}>details</strong> - Summary of the swap action</li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}
