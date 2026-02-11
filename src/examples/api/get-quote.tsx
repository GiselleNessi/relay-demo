// Get Quote Example - Relay API
// POST /quote/v2 with body. Run the code below.

import { useState } from "react";
import { useWallets } from "@privy-io/react-auth";

const RELAY_API_URL = "https://api.relay.link";

const DEFAULT_USER = "0x0000000000000000000000000000000000000000";

export function GetQuoteExample() {
    const { wallets } = useWallets();
    const connectedAddress = wallets.length > 0 ? wallets[0]?.address : null;
    const user = connectedAddress || DEFAULT_USER;

    const [loading, setLoading] = useState(false);
    const [quoteResponse, setQuoteResponse] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const getQuote = async () => {
        setLoading(true);
        setError(null);
        setQuoteResponse(null);

        try {
            const body = {
                user,
                originChainId: 8453,
                destinationChainId: 42161,
                originCurrency: "0x0000000000000000000000000000000000000000",
                destinationCurrency: "0x0000000000000000000000000000000000000000",
                amount: "100000000000000",
                tradeType: "EXACT_INPUT",
            };

            const response = await fetch(`${RELAY_API_URL}/quote/v2`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || "Failed to get quote");
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

    const codeSnippet = `await fetch("https://api.relay.link/quote/v2", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    user: "0x...",
    originChainId: 8453,
    destinationChainId: 42161,
    amount: "100000000000000",
    tradeType: "EXACT_INPUT",
    ...
  }),
});`;

    return (
        <div className="example-page">
            <h2 className="example-title">API: Get Quote</h2>
            <p className="example-description">
                POST <code>/quote/v2</code> to get a bridge quote. Uses connected wallet or default. Run the code below.
            </p>

            <div className="example-snippet-box">
                <pre className="example-pre">{codeSnippet}</pre>
            </div>

            {connectedAddress && (
                <p className="example-description" style={{ marginBottom: "1rem" }}>
                    Using wallet: <code>{connectedAddress.slice(0, 6)}...{connectedAddress.slice(-4)}</code>
                </p>
            )}

            <button onClick={getQuote} disabled={loading} className="example-run-button">
                {loading ? "Getting quote…" : "Get quote"}
            </button>

            {error && (
                <div className="example-error">
                    <strong>Error:</strong> {error}
                </div>
            )}

            {quoteResponse && (
                <div className="example-result-section">
                    <h3 className="example-result-title">Result</h3>
                    <div className="example-result-box">
                        <div className="example-result-row">
                            <span className="example-result-label">Operation</span>
                            <span className="example-result-value">{quoteResponse.details?.operation || "N/A"}</span>
                        </div>
                        <div className="example-result-row">
                            <span className="example-result-label">You send</span>
                            <span className="example-result-value">
                                {quoteResponse.details?.currencyIn?.amountFormatted || quoteResponse.details?.currencyIn?.amount || "0"} ETH
                            </span>
                        </div>
                        <div className="example-result-row">
                            <span className="example-result-label">You receive</span>
                            <span className="example-result-value">
                                {quoteResponse.details?.currencyOut?.amountFormatted || quoteResponse.details?.currencyOut?.amount || "0"} ETH
                            </span>
                        </div>
                        <div className="example-result-row">
                            <span className="example-result-label">Request ID</span>
                            <span className="example-result-value mono">
                                {quoteResponse.steps?.[0]?.requestId || quoteResponse.requestId || "N/A"}
                            </span>
                        </div>
                    </div>
                    <details className="example-details">
                        <summary className="example-details-summary">Full JSON</summary>
                        <pre className="example-pre">{JSON.stringify(quoteResponse, null, 2)}</pre>
                    </details>
                </div>
            )}
        </div>
    );
}
