// Complete SDK Flow Example
// This component demonstrates the complete workflow using the Relay SDK

import { useState } from "react";

export function CompleteFlowExample() {
    const [step, setStep] = useState<"quote" | "execute" | "monitor">("quote");
    const [quoteRequest, setQuoteRequest] = useState({
        user: "",
        chainId: 8453,
        toChainId: 42161,
        amount: "100000000000000",
    });
    const [loading, setLoading] = useState(false);
    const [quote, setQuote] = useState<any>(null);
    const [txHash, setTxHash] = useState<string | null>(null);
    const [requestId, setRequestId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGetQuote = async () => {
        if (!quoteRequest.user || quoteRequest.user.length !== 42) {
            setError("Please enter a valid wallet address");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch("https://api.relay.link/quote/v2", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user: quoteRequest.user,
                    originChainId: quoteRequest.chainId,
                    destinationChainId: quoteRequest.toChainId,
                    originCurrency: "0x0000000000000000000000000000000000000000",
                    destinationCurrency: "0x0000000000000000000000000000000000000000",
                    amount: quoteRequest.amount,
                    tradeType: "EXACT_INPUT"
                }),
            });

            if (!response.ok) throw new Error("Failed to get quote");
            const data = await response.json();
            setQuote(data);
            localStorage.setItem("relayQuoteResponse", JSON.stringify(data));
            setStep("execute");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleExecute = async () => {
        if (!quote || typeof window.ethereum === "undefined") {
            setError("Please get a quote first and ensure wallet is connected");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const provider = window.ethereum;
            await provider.request({ method: "eth_requestAccounts" });
            const accounts = await provider.request({ method: "eth_accounts" });
            const userAddress = accounts[0];

            const step = quote.steps[0];
            if (step.kind === "transaction") {
                const item = step.items[0];
                const hash = await provider.request({
                    method: "eth_sendTransaction",
                    params: [{
                        from: userAddress,
                        to: item.data.to,
                        data: item.data.data,
                        value: item.data.value,
                    }],
                });

                setTxHash(hash as string);
                setRequestId(step.requestId);
                setStep("monitor");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Complete SDK Flow</h2>
            <p>Complete workflow: Get Quote → Execute → Monitor using the Relay SDK.</p>

            <div style={{
                background: "rgba(70, 21, 200, 0.1)",
                border: "1px solid rgba(70, 21, 200, 0.3)",
                borderRadius: "8px",
                padding: "15px",
                marginBottom: "30px"
            }}>
                <p style={{ color: "#b0b0b0", margin: 0, fontSize: "0.9rem" }}>
                    <strong style={{ color: "#4615C8" }}>SDK Advantage:</strong> The SDK provides a seamless flow from quote to execution to monitoring, all with a clean API.
                </p>
            </div>

            {/* Step Indicator */}
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "30px",
                position: "relative"
            }}>
                <div style={{
                    flex: 1,
                    textAlign: "center",
                    position: "relative"
                }}>
                    <div style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        background: step === "quote" ? "#4615C8" : quote ? "#4ade80" : "#666",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        margin: "0 auto 10px"
                    }}>1</div>
                    <p style={{ color: step === "quote" ? "#4615C8" : "#a0a0a0", margin: 0, fontSize: "0.9rem" }}>Get Quote</p>
                </div>
                <div style={{
                    flex: 1,
                    textAlign: "center",
                    position: "relative"
                }}>
                    <div style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        background: step === "execute" ? "#4615C8" : txHash ? "#4ade80" : "#666",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        margin: "0 auto 10px"
                    }}>2</div>
                    <p style={{ color: step === "execute" ? "#4615C8" : "#a0a0a0", margin: 0, fontSize: "0.9rem" }}>Execute</p>
                </div>
                <div style={{
                    flex: 1,
                    textAlign: "center",
                    position: "relative"
                }}>
                    <div style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        background: step === "monitor" ? "#4615C8" : "#666",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        margin: "0 auto 10px"
                    }}>3</div>
                    <p style={{ color: step === "monitor" ? "#4615C8" : "#a0a0a0", margin: 0, fontSize: "0.9rem" }}>Monitor</p>
                </div>
            </div>

            {/* Step 1: Get Quote */}
            {step === "quote" && (
                <div>
                    <h3>Step 1: Get Quote</h3>
                    <div style={{ marginBottom: "20px" }}>
                        <label style={{ display: "block", marginBottom: "5px", color: "#b0b0b0" }}>
                            Wallet Address:
                        </label>
                        <input
                            type="text"
                            value={quoteRequest.user}
                            onChange={(e) => setQuoteRequest({ ...quoteRequest, user: e.target.value.trim() })}
                            placeholder="0x..."
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
                </div>
            )}

            {/* Step 2: Execute */}
            {step === "execute" && (
                <div>
                    <h3>Step 2: Execute</h3>
                    {quote && (
                        <div style={{
                            background: "#1a1a1a",
                            borderRadius: "12px",
                            padding: "20px",
                            marginBottom: "20px"
                        }}>
                            <p style={{ color: "#a0a0a0", margin: 0 }}>
                                Quote received! Ready to execute.
                            </p>
                        </div>
                    )}
                    <button
                        onClick={handleExecute}
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
                        {loading ? "Executing..." : "Execute Transaction"}
                    </button>
                </div>
            )}

            {/* Step 3: Monitor */}
            {step === "monitor" && (
                <div>
                    <h3>Step 3: Monitor</h3>
                    {txHash && requestId && (
                        <div style={{
                            background: "#1a1a1a",
                            borderRadius: "12px",
                            padding: "20px",
                            marginBottom: "20px"
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                                <span style={{ color: "#a0a0a0" }}>Transaction Hash:</span>
                                <span style={{ color: "#e0e0e0", fontFamily: "monospace", fontSize: "0.85rem", wordBreak: "break-all" }}>
                                    {txHash}
                                </span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0" }}>
                                <span style={{ color: "#a0a0a0" }}>Request ID:</span>
                                <span style={{ color: "#e0e0e0", fontFamily: "monospace", fontSize: "0.85rem", wordBreak: "break-all" }}>
                                    {requestId}
                                </span>
                            </div>
                        </div>
                    )}
                    <p style={{ color: "#a0a0a0" }}>
                        Use the Monitor example to track your transaction status using the requestId above.
                    </p>
                </div>
            )}

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

            <div style={{
                background: "#1a1a1a",
                borderRadius: "12px",
                padding: "20px",
                marginTop: "30px"
            }}>
                <h4 style={{ color: "#e0e0e0", marginTop: 0 }}>Complete SDK Code</h4>
                <pre style={{
                    background: "#0D0C0D",
                    padding: "15px",
                    borderRadius: "8px",
                    overflowX: "auto",
                    color: "#e0e0e0",
                    fontSize: "0.85rem",
                    border: "1px solid rgba(255, 255, 255, 0.1)"
                }}>
{`// 1. Get Quote
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
// The SDK handles monitoring internally`}
                </pre>
            </div>
        </div>
    );
}
