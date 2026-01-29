// SDK Get Quote + Execute Example
// Get a quote and execute in one flow on the same page.

import { useState } from "react";
import { getClient } from "@relayprotocol/relay-sdk";
import { usePrivyWalletClient } from "../../utils/wallet";

// Safe display: ensure we never render objects (React throws)
function safeStr(val: unknown): string {
    if (val == null) return "";
    if (typeof val === "string") return val;
    if (typeof val === "number" || typeof val === "boolean") return String(val);
    return String(val);
}

function formatAddress(addr: unknown): string {
    const s = safeStr(addr);
    if (s.length >= 10) return `${s.slice(0, 6)}...${s.slice(-4)}`;
    return s || "—";
}

// Map status to known CSS class (avoids invalid class names)
function statusClass(status: unknown): string {
    const s = safeStr(status).toLowerCase().replace(/\s+/g, "-");
    const known = ["completed", "pending", "success", "failed", "waiting", "refunded", "validated"];
    return known.includes(s) ? `status-${s}` : "status-default";
}

export function GetQuoteSDKExample() {
    const { getWalletClient, address, isConnected } = usePrivyWalletClient();
    const [walletAddress, setWalletAddress] = useState("");
    const [loading, setLoading] = useState(false);
    const [quoteResponse, setQuoteResponse] = useState<any>(null);
    const [progress, setProgress] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleRun = async () => {
        const rawAddress = (isConnected && address) ? address : walletAddress;
        const addressToUse = typeof rawAddress === "string" ? rawAddress : safeStr(rawAddress);

        if (!addressToUse || !addressToUse.startsWith("0x") || addressToUse.length !== 42) {
            setError("Please connect a wallet or enter a valid address (0x...).");
            return;
        }

        setLoading(true);
        setError(null);
        setQuoteResponse(null);
        setProgress(null);

        try {
            const client = getClient();
            const wallet = await getWalletClient();

            if (!client || !wallet) {
                throw new Error("Client or wallet not available. Connect your wallet.");
            }

            // Hardcoded getQuote call – then execute on the same page
            const quote = await client.actions.getQuote({
                chainId: 8453,
                toChainId: 42161,
                currency: "0x0000000000000000000000000000000000000000",
                toCurrency: "0x0000000000000000000000000000000000000000",
                amount: "100000000000000",
                wallet,
                user: addressToUse,
                recipient: addressToUse,
                tradeType: "EXACT_INPUT"
            });

            setQuoteResponse(quote);

            await client.actions.execute({
                quote,
                wallet,
                onProgress: ({ steps, currentStep, currentStepItem, txHashes, details }) => {
                    const currentStepIndex = steps?.findIndex(step => step.id === currentStep?.id) ?? -1;
                    const stepNumber = currentStepIndex >= 0 ? currentStepIndex + 1 : 1;
                    setProgress({
                        currentStep: stepNumber,
                        totalSteps: steps?.length || 1,
                        stepName: currentStep?.action || "Processing",
                        status: currentStepItem?.status || "pending",
                        txHashes: txHashes || [],
                        details
                    });
                }
            });
        } catch (err: any) {
            setError(err.message ?? "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="example-page">
            <h2 className="example-title">SDK: Get Quote + Execute</h2>
            <p className="example-description">
                Get a quote and execute in one flow. Run the example to see both.
            </p>

            {isConnected && address && (
                <div className="example-badge success">
                    ✓ Using connected wallet: <code>{formatAddress(address)}</code>
                </div>
            )}

            {!isConnected && (
                <div className="example-badge error">
                    Connect your wallet at the top of the page to run this example.
                </div>
            )}

            <div className="example-field">
                <label className="example-label">
                    Wallet address {isConnected && address ? "(using connected)" : "(optional override)"}:
                </label>
                <input
                    type="text"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value.trim())}
                    placeholder={address || "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"}
                    disabled={!!(isConnected && address)}
                    className={`example-input ${!(isConnected && address) && (!walletAddress || walletAddress.length !== 42) ? "invalid" : ""}`}
                />
            </div>

            <button
                onClick={handleRun}
                disabled={loading || !isConnected}
                className="example-run-button"
            >
                {loading ? "Running..." : "Run Example"}
            </button>

            {error && (
                <div className="example-error">
                    <strong>Error:</strong> {error}
                </div>
            )}

            {quoteResponse && (
                <div className="example-result-section">
                    <h3 className="example-result-title">Quote</h3>
                    <div className="example-result-box">
                        <div className="example-result-row">
                            <span className="example-result-label">Operation</span>
                            <span className="example-result-value">
                                {safeStr(quoteResponse.details?.operation) || "N/A"}
                            </span>
                        </div>
                        <div className="example-result-row">
                            <span className="example-result-label">You Send</span>
                            <span className="example-result-value">
                                {safeStr(quoteResponse.details?.currencyIn?.amountFormatted ?? quoteResponse.details?.currencyIn?.amount ?? "0")} ETH
                            </span>
                        </div>
                        <div className="example-result-row">
                            <span className="example-result-label">You Receive</span>
                            <span className="example-result-value">
                                {safeStr(quoteResponse.details?.currencyOut?.amountFormatted ?? quoteResponse.details?.currencyOut?.amount ?? "0")} ETH
                            </span>
                        </div>
                    </div>
                    <details className="example-details">
                        <summary className="example-details-summary">View full JSON</summary>
                        <pre className="example-pre">
                            {(() => {
                                try {
                                    return JSON.stringify(quoteResponse, null, 2);
                                } catch {
                                    return String(quoteResponse);
                                }
                            })()}
                        </pre>
                    </details>
                </div>
            )}

            {progress && (
                <div className="example-result-section">
                    <h3 className="example-result-title">Execution progress</h3>
                    <div className="example-result-box">
                        <div className="example-result-row">
                            <span className="example-result-label">Step</span>
                            <span className="example-result-value">
                                {safeStr(progress.currentStep)} / {safeStr(progress.totalSteps)}
                            </span>
                        </div>
                        <div className="example-result-row">
                            <span className="example-result-label">Status</span>
                            <span className={`example-result-value ${statusClass(progress.status)}`}>
                                {safeStr(progress.status)}
                            </span>
                        </div>
                        {progress.txHashes?.length > 0 && (
                            <div className="example-result-tx-list">
                                <span className="example-result-label">Transaction hashes</span>
                                {progress.txHashes.map((hash: unknown, i: number) => (
                                    <div key={`tx-${i}-${safeStr(hash).slice(0, 10)}`} className="example-result-row">
                                        <span className="example-result-label">Tx {i + 1}</span>
                                        <span className="example-result-value mono">{safeStr(hash)}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                        {progress.details && (
                            <details className="example-details">
                                <summary className="example-details-summary">Progress details</summary>
                                <pre className="example-pre">
                                    {(() => {
                                        try {
                                            return JSON.stringify(progress.details, null, 2);
                                        } catch {
                                            return String(progress.details);
                                        }
                                    })()}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
