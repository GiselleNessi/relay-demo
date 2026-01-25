// Execute Example - Step 3 from Relay API Quickstart
// This component demonstrates how to execute a transaction from a quote

import { useState, useEffect } from "react";

interface ExecuteProps {
    quoteResponse?: any; // Quote response from Step 2
}

export function ExecuteExample({ quoteResponse: propQuoteResponse }: ExecuteProps) {
    const [loading, setLoading] = useState(false);
    const [txHash, setTxHash] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [requestId, setRequestId] = useState<string | null>(null);
    const [quoteResponse, setQuoteResponse] = useState<any>(propQuoteResponse);

    // Try to load quote from localStorage if not provided as prop
    useEffect(() => {
        if (!quoteResponse) {
            const stored = localStorage.getItem("relayQuoteResponse");
            if (stored) {
                try {
                    setQuoteResponse(JSON.parse(stored));
                } catch (e) {
                    console.error("Failed to parse stored quote:", e);
                }
            }
        }
    }, [quoteResponse]);

    const handleExecute = async () => {
        if (!quoteResponse || !quoteResponse.steps) {
            setError("Please get a quote first (Step 2)");
            return;
        }

        // Check if wallet is available
        if (typeof window.ethereum === "undefined") {
            setError("No wallet detected. Please install MetaMask or another Web3 wallet.");
            return;
        }

        setLoading(true);
        setError(null);
        setTxHash(null);
        setRequestId(null);

        try {
            const provider = window.ethereum;
            if (!provider) {
                throw new Error("No wallet provider available");
            }

            // Type assertion for provider
            const ethereumProvider = provider as {
                request: (args: { method: string; params?: any[] }) => Promise<any>;
            };

            // Request account access
            await ethereumProvider.request({ method: "eth_requestAccounts" });
            const accounts = await ethereumProvider.request({ method: "eth_accounts" });
            const userAddress = accounts[0] as string;

            // Get chain ID
            const chainId = await ethereumProvider.request({ method: "eth_chainId" });
            const originChainId = parseInt(chainId as string, 16);

            // Check if we're on the correct chain
            const quoteOriginChainId = quoteResponse.steps[0]?.items[0]?.data?.chainId;
            if (originChainId !== quoteOriginChainId) {
                // Switch chain if needed
                try {
                    await ethereumProvider.request({
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

            // Iterate through steps
            for (const step of quoteResponse.steps) {
                if (step.kind === "transaction") {
                    const item = step.items[0];
                    const txData = item.data;

                    console.log("Submitting Transaction...", txData);

                    // Send transaction
                    const hash = await ethereumProvider.request({
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

                    setTxHash(hash as string);
                    setRequestId(step.requestId);
                    console.log(`✅ Bridge Initiated: ${hash}`);
                    console.log(`requestId: ${step.requestId}`);
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
            <h2>Step 2: Execute</h2>
            <p>The quote endpoint returns a steps array. You need to iterate through these steps and prompt the user to sign or submit them.</p>

            {!quoteResponse && (
                <div style={{
                    padding: "15px",
                    background: "#2a2a1a",
                    border: "1px solid #5a5a2a",
                    borderRadius: "8px",
                    color: "#ffd700",
                    marginBottom: "20px"
                }}>
                    <strong>Note:</strong> Please complete Step 1 (Get Quote) first to get a quote response.
                </div>
            )}

            <button
                onClick={handleExecute}
                disabled={loading || !quoteResponse}
                style={{
                    width: "100%",
                    padding: "15px 30px",
                    background: quoteResponse ? "#4615C8" : "#666",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    cursor: loading || !quoteResponse ? "not-allowed" : "pointer",
                    opacity: loading || !quoteResponse ? 0.6 : 1
                }}
            >
                {loading ? "Executing..." : "Execute Transaction"}
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

            {txHash && (
                <div style={{ marginTop: "30px" }}>
                    <h3>Transaction Submitted</h3>
                    <div style={{
                        background: "#1a1a1a",
                        borderRadius: "12px",
                        padding: "20px",
                        marginBottom: "20px"
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                            <span style={{ color: "#a0a0a0" }}>Transaction Hash:</span>
                            <span style={{ color: "#e0e0e0", fontFamily: "monospace", fontSize: "0.85rem", wordBreak: "break-all" }}>
                                {txHash}
                            </span>
                        </div>
                        {requestId && (
                            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0" }}>
                                <span style={{ color: "#a0a0a0" }}>Request ID:</span>
                                <span style={{ color: "#e0e0e0", fontFamily: "monospace", fontSize: "0.85rem", wordBreak: "break-all" }}>
                                    {requestId}
                                </span>
                            </div>
                        )}
                    </div>
                    <p style={{ color: "#a0a0a0", fontSize: "0.9rem" }}>
                        Save the requestId above to monitor the transaction status in Step 4.
                    </p>
                </div>
            )}
        </div>
    );
}
