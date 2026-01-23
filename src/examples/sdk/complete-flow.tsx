// Complete SDK Flow Example
// This component demonstrates the complete workflow using the Relay SDK

import { useState } from "react";

export function CompleteFlowExample() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const codeSnippet = `// 1. Get Quote
const quote = await getClient()?.actions.getQuote({
  chainId: 8453,
  toChainId: 42161,
  currency: "0x0000000000000000000000000000000000000000",
  toCurrency: "0x0000000000000000000000000000000000000000",
  amount: "100000000000000",
  wallet,
  user: "0x...",
  recipient: "0x...",
  tradeType: "EXACT_INPUT"
});

// 2. Execute with progress
getClient()?.actions.execute({
  quote,
  wallet,
  onProgress: ({ currentStep, txHashes, details }) => {
    // Update UI
  }
});

// 3. Monitor (automatic via SDK, or use status endpoint)
// The SDK handles monitoring internally`;

    const handleRun = async () => {
        const address = prompt("Enter your wallet address (0x...):");
        if (!address || !address.startsWith("0x") || address.length !== 42) {
            setError("Please enter a valid wallet address");
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            // Step 1: Get Quote
            const quoteResponse = await fetch("https://api.relay.link/quote/v2", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user: address,
                    originChainId: 8453,
                    destinationChainId: 42161,
                    originCurrency: "0x0000000000000000000000000000000000000000",
                    destinationCurrency: "0x0000000000000000000000000000000000000000",
                    amount: "100000000000000",
                    tradeType: "EXACT_INPUT"
                }),
            });

            if (!quoteResponse.ok) throw new Error("Failed to get quote");
            const quote = await quoteResponse.json();
            localStorage.setItem("relayQuoteResponse", JSON.stringify(quote));

            setResult({
                step: "quote",
                quote: {
                    operation: quote.details?.operation,
                    youSend: quote.details?.currencyIn?.amountFormatted,
                    youReceive: quote.details?.currencyOut?.amountFormatted,
                    requestId: quote.steps?.[0]?.requestId
                }
            });

            // Note: In a real SDK implementation, execute and monitor would happen automatically
            // For this demo, we just show the quote result
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Complete SDK Flow</h2>
            <p style={{ color: "#b0b0b0", marginBottom: "20px" }}>
                Code snippet showing the complete workflow: Get Quote → Execute → Monitor using the Relay SDK.
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

            <button
                onClick={handleRun}
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
                    opacity: loading ? 0.6 : 1,
                    marginBottom: "20px"
                }}
            >
                {loading ? "Running..." : "Run Example"}
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

            {result && (
                <div>
                    <h3 style={{ color: "#e0e0e0" }}>Result</h3>
                    <div style={{
                        background: "#1a1a1a",
                        borderRadius: "12px",
                        padding: "20px",
                        marginBottom: "20px"
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                            <span style={{ color: "#a0a0a0" }}>Operation:</span>
                            <span style={{ color: "#e0e0e0", fontWeight: 600 }}>
                                {result.quote.operation || "N/A"}
                            </span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                            <span style={{ color: "#a0a0a0" }}>You Send:</span>
                            <span style={{ color: "#e0e0e0", fontWeight: 600 }}>
                                {result.quote.youSend || "0"} ETH
                            </span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0" }}>
                            <span style={{ color: "#a0a0a0" }}>You Receive:</span>
                            <span style={{ color: "#e0e0e0", fontWeight: 600 }}>
                                {result.quote.youReceive || "0"} ETH
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
