// Get Quote Example - Step 2 from Relay API Quickstart
// This component demonstrates how to get a quote from Relay API

import { useState, useEffect } from "react";
import { useWallets } from '@privy-io/react-auth';

const RELAY_API_URL = "https://api.relay.link";

export function GetQuoteExample() {
    const { wallets } = useWallets();
    const connectedAddress = wallets.length > 0 ? wallets[0]?.address : null;

    const [quoteRequest, setQuoteRequest] = useState({
        user: "", // Enter your wallet address (0x...)
        originChainId: 8453, // Base
        destinationChainId: 42161, // Arbitrum One
        originCurrency: "0x0000000000000000000000000000000000000000", // ETH
        destinationCurrency: "0x0000000000000000000000000000000000000000", // ETH
        amount: "100000000000000", // 0.0001 ETH (18 decimals)
        tradeType: "EXACT_INPUT" as const
    });

    // Auto-fill wallet address when connected
    useEffect(() => {
        if (connectedAddress && !quoteRequest.user) {
            setQuoteRequest(prev => ({ ...prev, user: connectedAddress }));
        }
    }, [connectedAddress, quoteRequest.user]);

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

    const userInputInvalid = !quoteRequest.user || quoteRequest.user.length !== 42;

    return (
        <div className="example-page">
            <h2 className="example-title">Step 1: Get Quote</h2>
            <p className="example-description">
                Every action in Relay starts with a Quote. The quote endpoint handles all of your use cases, whether it's a bridge, swap, or cross-chain call.
            </p>

            <div className="example-field">
                <label className="example-label">
                    User Address (Required):
                    {connectedAddress && (
                        <span className="example-label-inline">(using connected wallet)</span>
                    )}
                </label>
                <input
                    type="text"
                    value={quoteRequest.user}
                    onChange={(e) =>
                        setQuoteRequest({ ...quoteRequest, user: e.target.value.trim() })
                    }
                    placeholder={connectedAddress || "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"}
                    className={`example-input ${userInputInvalid ? "invalid" : ""}`}
                />
                {!quoteRequest.user && (
                    <small className={`example-helper ${userInputInvalid ? "example-helper-error" : ""}`}>
                        {connectedAddress
                            ? "Wallet connected but address not set. Please enter or connect wallet."
                            : "Please enter a valid Ethereum wallet address or connect your wallet above"}
                    </small>
                )}
                {connectedAddress && quoteRequest.user === connectedAddress && (
                    <small className="example-helper example-helper-success">
                        ✓ Using your connected wallet address
                    </small>
                )}
            </div>

            <div className="example-grid-2">
                <div className="example-field">
                    <label className="example-label">Origin Chain ID:</label>
                    <input
                        type="number"
                        value={quoteRequest.originChainId}
                        onChange={(e) =>
                            setQuoteRequest({
                                ...quoteRequest,
                                originChainId: parseInt(e.target.value),
                            })
                        }
                        className="example-input"
                    />
                </div>

                <div className="example-field">
                    <label className="example-label">Destination Chain ID:</label>
                    <input
                        type="number"
                        value={quoteRequest.destinationChainId}
                        onChange={(e) =>
                            setQuoteRequest({
                                ...quoteRequest,
                                destinationChainId: parseInt(e.target.value),
                            })
                        }
                        className="example-input"
                    />
                </div>
            </div>

            <div className="example-field">
                <label className="example-label">Amount (wei):</label>
                <input
                    type="text"
                    value={quoteRequest.amount}
                    onChange={(e) =>
                        setQuoteRequest({ ...quoteRequest, amount: e.target.value })
                    }
                    className="example-input"
                />
            </div>

            <button
                onClick={handleGetQuote}
                disabled={loading}
                className="example-run-button"
            >
                {loading ? "Getting Quote..." : "Get Quote"}
            </button>

            {error && (
                <div className="example-error">
                    <strong>Error:</strong> {error}
                </div>
            )}

            {quoteResponse && (
                <div className="example-result-section">
                    <h3 className="example-result-title">Quote Response</h3>
                    <div className="example-result-box">
                        <div className="example-result-row">
                            <span className="example-result-label">Operation:</span>
                            <span className="example-result-value">
                                {quoteResponse.details?.operation || "N/A"}
                            </span>
                        </div>
                        <div className="example-result-row">
                            <span className="example-result-label">You Send:</span>
                            <span className="example-result-value">
                                {quoteResponse.details?.currencyIn?.amountFormatted || quoteResponse.details?.currencyIn?.amount || "0"} ETH
                            </span>
                        </div>
                        <div className="example-result-row">
                            <span className="example-result-label">You Receive:</span>
                            <span className="example-result-value">
                                {quoteResponse.details?.currencyOut?.amountFormatted || quoteResponse.details?.currencyOut?.amount || "0"} ETH
                            </span>
                        </div>
                        <div className="example-result-row">
                            <span className="example-result-label">Request ID:</span>
                            <span className="example-result-value mono">
                                {quoteResponse.steps?.[0]?.requestId || quoteResponse.requestId || "N/A"}
                            </span>
                        </div>
                    </div>

                    <details className="example-details">
                        <summary className="example-details-summary">View Full JSON Response</summary>
                        <pre className="example-pre">{JSON.stringify(quoteResponse, null, 2)}</pre>
                    </details>
                </div>
            )}
        </div>
    );
}
