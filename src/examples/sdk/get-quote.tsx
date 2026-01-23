// SDK Get Quote Example - Native Bridge
// This component demonstrates how to use the Relay SDK to get a quote

import { useState } from "react";

export function GetQuoteSDKExample() {
    const [quoteRequest, setQuoteRequest] = useState({
        chainId: 8453, // Base
        toChainId: 42161, // Arbitrum One
        currency: "0x0000000000000000000000000000000000000000", // ETH
        toCurrency: "0x0000000000000000000000000000000000000000", // ETH
        amount: "100000000000000", // 0.0001 ETH
        user: "",
        recipient: "",
        tradeType: "EXACT_INPUT" as const
    });

    const [loading, setLoading] = useState(false);
    const [quoteResponse, setQuoteResponse] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [sdkCode, setSdkCode] = useState("");
    const [usingSDK, setUsingSDK] = useState(false);

    const handleGetQuote = async () => {
        // Validate wallet address
        if (!quoteRequest.user || quoteRequest.user.trim() === "") {
            setError("Please enter your wallet address");
            return;
        }

        if (!quoteRequest.user.startsWith("0x") || quoteRequest.user.length !== 42) {
            setError("Invalid wallet address. Please enter a valid Ethereum address (0x...).");
            return;
        }

        setLoading(true);
        setError(null);
        setQuoteResponse(null);
        setUsingSDK(false);

        // Show the SDK code that would be used
        const code = `import { getClient } from '@relayprotocol/relay-sdk';
import { useWalletClient } from 'wagmi'; // or your wallet provider

const { data: wallet } = useWalletClient();

const quote = await getClient()?.actions.getQuote({
  chainId: ${quoteRequest.chainId},
  toChainId: ${quoteRequest.toChainId},
  currency: "${quoteRequest.currency}",
  toCurrency: "${quoteRequest.toCurrency}",
  amount: "${quoteRequest.amount}",
  wallet,
  user: "${quoteRequest.user}",
  recipient: "${quoteRequest.recipient || quoteRequest.user}",
  tradeType: "${quoteRequest.tradeType}"
});`;
        setSdkCode(code);

        // Note: SDK is not installed in this demo
        // In a real app with SDK installed, you would use:
        // const quote = await getClient()?.actions.getQuote({...});
        // For this demo, we use the API directly to show the functionality
        setUsingSDK(false);

        // Use API as fallback (or if SDK not available)
        try {
            const response = await fetch("https://api.relay.link/quote/v2", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user: quoteRequest.user,
                    originChainId: quoteRequest.chainId,
                    destinationChainId: quoteRequest.toChainId,
                    originCurrency: quoteRequest.currency,
                    destinationCurrency: quoteRequest.toCurrency,
                    amount: quoteRequest.amount,
                    tradeType: quoteRequest.tradeType
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to get quote");
            }

            const data = await response.json();
            setQuoteResponse(data);
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
            <h2>SDK: Get Quote (Native Bridge)</h2>
            <p style={{ color: "#b0b0b0", marginBottom: "20px" }}>
                This example shows you how to use the Relay SDK to get a quote. 
                <strong style={{ color: "#e0e0e0" }}> The SDK is not installed in this demo</strong>, so we're using the API directly, but showing you the SDK code you would write.
            </p>

            <div style={{
                background: "rgba(70, 21, 200, 0.1)",
                border: "1px solid rgba(70, 21, 200, 0.3)",
                borderRadius: "8px",
                padding: "15px",
                marginBottom: "20px"
            }}>
                <p style={{ color: "#b0b0b0", margin: 0, fontSize: "0.9rem" }}>
                    <strong style={{ color: "#4615C8" }}>SDK vs API:</strong> 
                </p>
                <div style={{ marginTop: "10px", color: "#a0a0a0", fontSize: "0.9rem" }}>
                    <p style={{ margin: "5px 0" }}><strong style={{ color: "#e0e0e0" }}>With API (what you see in API examples):</strong></p>
                    <code style={{ background: "#0D0C0D", padding: "5px 10px", borderRadius: "4px", display: "block", marginBottom: "10px" }}>
                        fetch('https://api.relay.link/quote/v2', {'{'} method: 'POST', body: JSON.stringify(...) {'}'})
                    </code>
                    <p style={{ margin: "5px 0" }}><strong style={{ color: "#e0e0e0" }}>With SDK (what this example shows):</strong></p>
                    <code style={{ background: "#0D0C0D", padding: "5px 10px", borderRadius: "4px", display: "block" }}>
                        await getClient()?.actions.getQuote({'{'} chainId, toChainId, amount, wallet, ... {'}'})
                    </code>
                </div>
            </div>

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
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "20px" }}>
                <div>
                    <label style={{ display: "block", marginBottom: "5px", color: "#b0b0b0" }}>
                        Origin Chain ID:
                    </label>
                    <input
                        type="number"
                        value={quoteRequest.chainId}
                        onChange={(e) =>
                            setQuoteRequest({
                                ...quoteRequest,
                                chainId: parseInt(e.target.value),
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
                        value={quoteRequest.toChainId}
                        onChange={(e) =>
                            setQuoteRequest({
                                ...quoteRequest,
                                toChainId: parseInt(e.target.value),
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
                {loading ? "Getting Quote..." : "Get Quote with SDK"}
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
                    <h3>SDK Code Used</h3>
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
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0" }}>
                            <span style={{ color: "#a0a0a0" }}>You Receive:</span>
                            <span style={{ color: "#e0e0e0", fontWeight: 600 }}>
                                {quoteResponse.details?.currencyOut?.amountFormatted || quoteResponse.details?.currencyOut?.amount || "0"} ETH
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
