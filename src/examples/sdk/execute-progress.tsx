// SDK Execute with Progress Example
// This component demonstrates how to execute a quote with real-time progress updates

import { useState, useEffect } from "react";
import { usePrivy } from '@privy-io/react-auth';
import { usePrivyWalletClient } from "../../utils/wallet";

export function ExecuteProgressExample() {
    const { ready, authenticated } = usePrivy();
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
  onProgress: ({ steps, currentStep, currentStepItem, txHashes, details }) => {
    // Update UI with progress
    const stepIndex = steps?.findIndex(step => step.id === currentStep?.id) ?? -1;
    console.log('Step:', stepIndex + 1, 'of', steps?.length);
    console.log('Current Step:', currentStep?.action);
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

        // SDK examples MUST use the SDK - no API/manual execution fallback
        if (!sdkAvailable) {
            setError("Relay SDK is not installed. Please install @relayprotocol/relay-sdk to use this example.");
            setLoading(false);
            return;
        }

        if (!isConnected) {
            setError("Please connect your wallet to use the SDK example.");
            setLoading(false);
            return;
        }

        try {
            // Use SDK to execute with progress tracking
            const { getClient } = await import("../../config/relay");
            const wallet = await getWalletClient();
            const client = getClient();

            if (!client || !wallet) {
                throw new Error("SDK client or wallet not available");
            }

            await client.actions.execute({
                quote,
                wallet,
                onProgress: ({ steps, currentStep, currentStepItem, txHashes, details }) => {
                    // Find the current step index from the steps array
                    const currentStepIndex = steps?.findIndex(step => step.id === currentStep?.id) ?? -1;
                    const stepNumber = currentStepIndex >= 0 ? currentStepIndex + 1 : 1;
                    
                    setProgress({
                        currentStep: stepNumber,
                        totalSteps: steps?.length || 1,
                        stepName: currentStep?.action || "Processing",
                        status: currentStepItem?.status || "pending",
                        txHashes: txHashes || [],
                        details: details
                    });
                }
            });
            
            console.log("Execution completed via SDK");
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

            {!sdkAvailable && (
                <div style={{
                    padding: "15px",
                    background: "rgba(255, 107, 107, 0.1)",
                    border: "1px solid rgba(255, 107, 107, 0.3)",
                    borderRadius: "8px",
                    color: "#ff6b6b",
                    marginBottom: "20px",
                    fontSize: "0.9rem"
                }}>
                    <strong>Error:</strong> Relay SDK is not installed. This example requires <code>@relayprotocol/relay-sdk</code> to run.
                </div>
            )}

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
                        {progress.txHashes && progress.txHashes.length > 0 && (
                            <div style={{ padding: "10px 0" }}>
                                <span style={{ color: "#a0a0a0", display: "block", marginBottom: "8px" }}>Transaction Hashes:</span>
                                {progress.txHashes.map((hash: string, index: number) => (
                                    <div key={index} style={{ 
                                        display: "flex", 
                                        justifyContent: "space-between", 
                                        padding: "5px 0",
                                        borderBottom: index < progress.txHashes.length - 1 ? "1px solid rgba(255, 255, 255, 0.05)" : "none"
                                    }}>
                                        <span style={{ color: "#a0a0a0", fontSize: "0.85rem" }}>Tx {index + 1}:</span>
                                        <span style={{ color: "#e0e0e0", fontFamily: "monospace", fontSize: "0.85rem", wordBreak: "break-all" }}>
                                            {hash}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                        {progress.details && (
                            <details style={{ marginTop: "15px" }}>
                                <summary style={{ color: "#4615C8", cursor: "pointer", padding: "10px", background: "#0D0C0D", borderRadius: "8px" }}>
                                    View Progress Details
                                </summary>
                                <pre style={{
                                    background: "#0D0C0D",
                                    padding: "15px",
                                    borderRadius: "8px",
                                    overflowX: "auto",
                                    color: "#e0e0e0",
                                    fontSize: "0.85rem",
                                    border: "1px solid rgba(255, 255, 255, 0.1)",
                                    marginTop: "10px"
                                }}>
                                    {JSON.stringify(progress.details, null, 2)}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
