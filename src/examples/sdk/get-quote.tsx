// SDK Get Quote + Execute Example
// Get a quote and execute in one flow on the same page.

import { useState } from "react";
import { getClient } from "@relayprotocol/relay-sdk";
import { usePrivyWalletClient } from "../../utils/wallet";

export function GetQuoteSDKExample() {
    const { getWalletClient, address, isConnected } = usePrivyWalletClient();
    const [walletAddress, setWalletAddress] = useState("");
    const [loading, setLoading] = useState(false);
    const [quoteResponse, setQuoteResponse] = useState<any>(null);
    const [progress, setProgress] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleRun = async () => {
        const addressToUse = (isConnected && address) ? address : walletAddress;

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
                    ✓ Using connected wallet: <code>{address.slice(0, 6)}...{address.slice(-4)}</code>
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
                                {quoteResponse.details?.operation || "N/A"}
                            </span>
                        </div>
                        <div className="example-result-row">
                            <span className="example-result-label">You Send</span>
                            <span className="example-result-value">
                                {quoteResponse.details?.currencyIn?.amountFormatted ?? quoteResponse.details?.currencyIn?.amount ?? "0"} ETH
                            </span>
                        </div>
                        <div className="example-result-row">
                            <span className="example-result-label">You Receive</span>
                            <span className="example-result-value">
                                {quoteResponse.details?.currencyOut?.amountFormatted ?? quoteResponse.details?.currencyOut?.amount ?? "0"} ETH
                            </span>
                        </div>
                    </div>
                    <details className="example-details">
                        <summary className="example-details-summary">View full JSON</summary>
                        <pre className="example-pre">{JSON.stringify(quoteResponse, null, 2)}</pre>
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
                                {progress.currentStep} / {progress.totalSteps}
                            </span>
                        </div>
                        <div className="example-result-row">
                            <span className="example-result-label">Status</span>
                            <span className={`example-result-value status-${progress.status}`}>
                                {progress.status}
                            </span>
                        </div>
                        {progress.txHashes?.length > 0 && (
                            <div className="example-result-tx-list">
                                <span className="example-result-label">Transaction hashes</span>
                                {progress.txHashes.map((hash: string, i: number) => (
                                    <div key={i} className="example-result-row">
                                        <span className="example-result-label">Tx {i + 1}</span>
                                        <span className="example-result-value mono">{hash}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                        {progress.details && (
                            <details className="example-details">
                                <summary className="example-details-summary">Progress details</summary>
                                <pre className="example-pre">{JSON.stringify(progress.details, null, 2)}</pre>
                            </details>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
