// Get Quote Example - Step 2 from Relay API Quickstart
// This component demonstrates how to get a quote from Relay API

import { useState } from "react";

const RELAY_API_URL = "https://api.relay.link";

export function GetQuoteExample() {
    const [quoteRequest, setQuoteRequest] = useState({
        user: "", // Enter your wallet address (0x...)
        originChainId: 8453, // Base
        destinationChainId: 42161, // Arbitrum One
        originCurrency: "0x0000000000000000000000000000000000000000", // ETH
        destinationCurrency: "0x0000000000000000000000000000000000000000", // ETH
        amount: "100000000000000", // 0.0001 ETH (18 decimals)
        tradeType: "EXACT_INPUT" as const
    });

    const [loading, setLoading] = useState(false);
    const [quoteResponse, setQuoteResponse] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGetQuote = async () => {
        // Validate wallet address
        if (!quoteRequest.user || quoteRequest.user.trim() === "") {
            setError("Please enter your wallet address");
            return;
        }

        // Basic address validation (should start with 0x and be 42 characters)
        if (!quoteRequest.user.startsWith("0x") || quoteRequest.user.length !== 42) {
            setError("Invalid wallet address. Please enter a valid Ethereum address (0x...).");
            return;
        }

        setLoading(true);
        setError(null);
        setQuoteResponse(null);

        try {
            const response = await fetch(`${RELAY_API_URL}/quote/v2`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(quoteRequest),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to get quote");
            }

            const data = await response.json();
            setQuoteResponse(data);
            // Store in localStorage so Execute example can access it
            localStorage.setItem("relayQuoteResponse", JSON.stringify(data));
            console.log("Quote received:", data);
        } catch (err: any) {
            setError(err.message);
            console.error("Quote error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Step 1: Get Quote</h2>
            <p>Every action in Relay starts with a Quote. The quote endpoint handles all of your use cases, whether it's a bridge, swap, or cross-chain call.</p>

            <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "5px", color: "#b0b0b0" }}>
                    User Address (Required):
                </label>
                <input
                    type="text"
                    value={quoteRequest.user}
                    onChange={(e) =>
                        setQuoteRequest({ ...quoteRequest, user: e.target.value.trim() })
                    }
                    placeholder="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
                    style={{
                        width: "100%",
                        padding: "12px",
                        background: "#1a1a1a",
                        border: `1px solid ${!quoteRequest.user || quoteRequest.user.length !== 42 
                            ? "rgba(255, 107, 107, 0.5)" 
                            : "rgba(255, 255, 255, 0.1)"}`,
                        borderRadius: "8px",
                        color: "#e0e0e0",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                    }}
                />
                {!quoteRequest.user && (
                    <small style={{ color: "#ff6b6b", marginTop: "5px", display: "block" }}>
                        Please enter a valid Ethereum wallet address
                    </small>
                )}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "20px" }}>
                <div>
                    <label style={{ display: "block", marginBottom: "5px", color: "#b0b0b0" }}>
                        Origin Chain ID:
                    </label>
                    <input
                        type="number"
                        value={quoteRequest.originChainId}
                        onChange={(e) =>
                            setQuoteRequest({
                                ...quoteRequest,
                                originChainId: parseInt(e.target.value),
                            })
                        }
                        style={{
                            width: "100%",
                            padding: "12px",
                            background: "#1a1a1a",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            borderRadius: "8px",
                            color: "#e0e0e0",
                            fontSize: "1rem",
                            boxSizing: "border-box"
                        }}
                    />
                </div>

                <div>
                    <label style={{ display: "block", marginBottom: "5px", color: "#b0b0b0" }}>
                        Destination Chain ID:
                    </label>
                    <input
                        type="number"
                        value={quoteRequest.destinationChainId}
                        onChange={(e) =>
                            setQuoteRequest({
                                ...quoteRequest,
                                destinationChainId: parseInt(e.target.value),
                            })
                        }
                        style={{
                            width: "100%",
                            padding: "12px",
                            background: "#1a1a1a",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            borderRadius: "8px",
                            color: "#e0e0e0",
                            fontSize: "1rem",
                            boxSizing: "border-box"
                        }}
                    />
                </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "5px", color: "#b0b0b0" }}>
                    Amount (wei):
                </label>
                <input
                    type="text"
                    value={quoteRequest.amount}
                    onChange={(e) =>
                        setQuoteRequest({ ...quoteRequest, amount: e.target.value })
                    }
                    style={{
                        width: "100%",
                        padding: "12px",
                        background: "#1a1a1a",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "8px",
                        color: "#e0e0e0",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                    }}
                />
            </div>

            <button
                onClick={handleGetQuote}
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
                {loading ? "Getting Quote..." : "Get Quote"}
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

            {quoteResponse && (
                <div style={{ marginTop: "30px" }}>
                    <h3>Quote Response</h3>
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
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                            <span style={{ color: "#a0a0a0" }}>You Receive:</span>
                            <span style={{ color: "#e0e0e0", fontWeight: 600 }}>
                                {quoteResponse.details?.currencyOut?.amountFormatted || quoteResponse.details?.currencyOut?.amount || "0"} ETH
                            </span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0" }}>
                            <span style={{ color: "#a0a0a0" }}>Request ID:</span>
                            <span style={{ color: "#e0e0e0", fontWeight: 600, fontFamily: "monospace", fontSize: "0.85rem", wordBreak: "break-all" }}>
                                {quoteResponse.steps?.[0]?.requestId || quoteResponse.requestId || "N/A"}
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
