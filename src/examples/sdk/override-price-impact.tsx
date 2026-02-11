// Simple example: Get quote with overridePriceImpact
// Use case: Bypass "Swap impact is too high" when users want to trade long-tail assets despite high price impact.
// See: options.overridePriceImpact in getQuote().

import { useState } from "react";
import { getClient } from "@relayprotocol/relay-sdk";
import type { Execute } from "@relayprotocol/relay-sdk";

export function OverridePriceImpactExample() {
    const [quote, setQuote] = useState<Execute | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getQuote = async () => {
        setLoading(true);
        setError(null);
        setQuote(null);

        try {
            const client = getClient();
            if (!client) throw new Error("Relay client not available.");

            // Example: USDC from Ethereum to Base. Use overridePriceImpact to bypass "Swap impact is too high".
            const currency = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"; // USDC on Ethereum
            const toCurrency = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"; // USDC on Base

            const result = await client.actions.getQuote({
                chainId: 1,
                user: "0x0000000000000000000000000000000000000000",
                toChainId: 8453,
                amount: "1000000", // 1 USDC (6 decimals)
                currency,
                toCurrency,
                recipient: "0x0000000000000000000000000000000000000000",
                tradeType: "EXACT_INPUT",
                options: {
                    overridePriceImpact: true, // Bypass "Swap impact is too high"
                },
            });

            setQuote(result as Execute);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to get quote");
        } finally {
            setLoading(false);
        }
    };

    const codeSnippet = `const result = await client.actions.getQuote({
  chainId: 1,
  toChainId: 8453,
  amount: "1000000",
  currency: "0xA0b8...eB48",  // USDC Ethereum
  toCurrency: "0x8335...2913", // USDC Base
  user: "0x...",
  recipient: "0x...",
  tradeType: "EXACT_INPUT",
  options: { overridePriceImpact: true },
});`;

    return (
        <div className="example-page">
            <h2 className="example-title">Override price impact</h2>
            <p className="example-description">
                Bypass &quot;Swap impact is too high&quot; with <code>options.overridePriceImpact: true</code>. Run the code below.
            </p>

            <div className="example-snippet-box">
                <pre className="example-pre">{codeSnippet}</pre>
            </div>

            <button
                onClick={getQuote}
                disabled={loading}
                className="example-run-button"
            >
                {loading ? "Getting quote…" : "Get quote"}
            </button>

            {error && (
                <div className="example-error">
                    <strong>Error:</strong> {error}
                </div>
            )}

            {quote && (
                <div className="example-result-section">
                    <h3 className="example-result-title">Quote result</h3>

                    <div className="example-result-box">
                        <h4 className="example-result-title" style={{ fontSize: "1rem" }}>Summary</h4>
                        <table className="simple-table">
                            <tbody>
                                <tr>
                                    <td>Input</td>
                                    <td>
                                        {quote.details?.currencyIn?.amountFormatted}{" "}
                                        {quote.details?.currencyIn?.currency?.symbol ?? ""}{" "}
                                        (${quote.details?.currencyIn?.amountUsd ?? "—"})
                                    </td>
                                </tr>
                                <tr>
                                    <td>Output</td>
                                    <td>
                                        {quote.details?.currencyOut?.amountFormatted}{" "}
                                        {quote.details?.currencyOut?.currency?.symbol ?? ""}{" "}
                                        (${quote.details?.currencyOut?.amountUsd ?? "—"})
                                    </td>
                                </tr>
                                <tr>
                                    <td>Rate</td>
                                    <td>{String(quote.details?.rate ?? "—")}</td>
                                </tr>
                                <tr>
                                    <td>Time estimate</td>
                                    <td>{quote.details?.timeEstimate != null ? `${quote.details.timeEstimate}s` : "—"}</td>
                                </tr>
                                {quote.details?.totalImpact && (
                                    <tr>
                                        <td>Total impact</td>
                                        <td>
                                            {quote.details.totalImpact.percent}% ($
                                            {quote.details.totalImpact.usd ?? "—"})
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="example-result-box">
                        <h4 className="example-result-title" style={{ fontSize: "1rem" }}>Fees</h4>
                        <table className="simple-table">
                            <tbody>
                                <tr>
                                    <td>Gas</td>
                                    <td>${quote.fees?.gas?.amountUsd ?? "—"}</td>
                                </tr>
                                <tr>
                                    <td>Relayer</td>
                                    <td>${quote.fees?.relayer?.amountUsd ?? "—"}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {quote.steps?.length != null && quote.steps.length > 0 && (
                        <div className="example-result-box">
                            <h4 className="example-result-title" style={{ fontSize: "1rem" }}>Steps ({quote.steps.length})</h4>
                            <ol className="simple-list">
                                {quote.steps.map((step, i) => (
                                    <li key={i}>
                                        <strong>{step.action}</strong>: {step.description ?? ""}
                                    </li>
                                ))}
                            </ol>
                        </div>
                    )}

                    <details className="example-details">
                        <summary className="example-details-summary">Full response (JSON)</summary>
                        <pre className="example-pre">
                            {(() => {
                                try {
                                    return JSON.stringify(quote, null, 2);
                                } catch {
                                    return String(quote);
                                }
                            })()}
                        </pre>
                    </details>
                </div>
            )}
        </div>
    );
}
