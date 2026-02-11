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

    const codeSnippet = `// quote from Get Quote example (or localStorage)
for (const step of quote.steps) {
  if (step.kind === "transaction") {
    const txData = step.items[0].data;
    const hash = await provider.request({
      method: "eth_sendTransaction",
      params: [{ from: userAddress, to: txData.to, data: txData.data, value: txData.value, ... }],
    });
  }
}`;

    return (
        <div className="example-page">
            <h2 className="example-title">API: Execute</h2>
            <p className="example-description">
                Iterate the quote <code>steps</code> and send transactions via your wallet. Run the code below (get a quote first).
            </p>

            <div className="example-snippet-box">
                <pre className="example-pre">{codeSnippet}</pre>
            </div>

            {!quoteResponse && (
                <p className="example-description" style={{ marginBottom: "1rem", color: "#fbbf24" }}>
                    Get a quote first (API: Get Quote), then run Execute.
                </p>
            )}

            <button
                onClick={handleExecute}
                disabled={loading || !quoteResponse}
                className={`example-run-button ${!quoteResponse ? "example-run-button-disabled" : ""}`}
            >
                {loading ? "Executing..." : "Execute Transaction"}
            </button>

            {error && (
                <div className="example-error">
                    <strong>Error:</strong> {error}
                </div>
            )}

            {txHash && (
                <div className="example-result-section">
                    <h3 className="example-result-title">Transaction Submitted</h3>
                    <div className="example-result-box">
                        <div className="example-result-row">
                            <span className="example-result-label">Transaction Hash:</span>
                            <span className="example-result-value mono">{txHash}</span>
                        </div>
                        {requestId && (
                            <div className="example-result-row">
                                <span className="example-result-label">Request ID:</span>
                                <span className="example-result-value mono">{requestId}</span>
                            </div>
                        )}
                    </div>
                    <p className="example-note-text">
                        Save the requestId above to monitor the transaction status in Step 4.
                    </p>
                </div>
            )}
        </div>
    );
}
