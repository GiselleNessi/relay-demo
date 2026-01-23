// SDK Get Quote Example - Native Bridge
// This component demonstrates how to use the Relay SDK to get a quote

import { useState } from "react";

export function GetQuoteSDKExample() {
    const [loading, setLoading] = useState(false);
    const [quoteResponse, setQuoteResponse] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const codeSnippet = `import { getClient } from '@relayprotocol/relay-sdk';
import { useWalletClient } from 'wagmi';

const { data: wallet } = useWalletClient();

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
});`;

    const handleRun = async () => {
        // Get user address from localStorage or prompt
        const storedQuote = localStorage.getItem("relayQuoteResponse");
        let userAddress = "";
        
        if (storedQuote) {
            try {
                const quote = JSON.parse(storedQuote);
                userAddress = quote.steps?.[0]?.items?.[0]?.data?.from || "";
            } catch (e) {
                // Ignore
            }
        }

        if (!userAddress) {
            const address = prompt("Enter your wallet address (0x...):");
            if (!address || !address.startsWith("0x") || address.length !== 42) {
                setError("Please enter a valid wallet address");
                return;
            }
            userAddress = address;
        }

        setLoading(true);
        setError(null);
        setQuoteResponse(null);

        try {
            const response = await fetch("https://api.relay.link/quote/v2", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user: userAddress,
                    originChainId: 8453,
                    destinationChainId: 42161,
                    originCurrency: "0x0000000000000000000000000000000000000000",
                    destinationCurrency: "0x0000000000000000000000000000000000000000",
                    amount: "100000000000000",
                    tradeType: "EXACT_INPUT"
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to get quote");
            }

            const data = await response.json();
            setQuoteResponse(data);
            localStorage.setItem("relayQuoteResponse", JSON.stringify(data));
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>SDK: Get Quote</h2>
            <p style={{ color: "#b0b0b0", marginBottom: "20px" }}>
                Code snippet showing how to get a quote using the Relay SDK.
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

            {quoteResponse && (
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
                                {quoteResponse.details?.operation || "N/A"}
                            </span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                            <span style={{ color: "#a0a0a0" }}>You Send:</span>
                            <span style={{ color: "#e0e0e0", fontWeight: 600 }}>
                                {quoteResponse.details?.currencyIn?.amountFormatted || quoteResponse.details?.currencyIn?.amount || "0"} ETH
                            </span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0" }}>
                            <span style={{ color: "#a0a0a0" }}>You Receive:</span>
                            <span style={{ color: "#e0e0e0", fontWeight: 600 }}>
                                {quoteResponse.details?.currencyOut?.amountFormatted || quoteResponse.details?.currencyOut?.amount || "0"} ETH
                            </span>
                        </div>
                    </div>

                    <details>
                        <summary style={{ color: "#4615C8", cursor: "pointer", padding: "10px", background: "#1a1a1a", borderRadius: "8px", marginBottom: "10px" }}>
                            View Full JSON Response
                        </summary>
                        <pre style={{
                            background: "#0D0C0D",
                            padding: "15px",
                            borderRadius: "8px",
                            overflowX: "auto",
                            color: "#e0e0e0",
                            fontSize: "0.85rem",
                            border: "1px solid rgba(255, 255, 255, 0.1)"
                        }}>
                            {JSON.stringify(quoteResponse, null, 2)}
                        </pre>
                    </details>
                </div>
            )}
        </div>
    );
}
