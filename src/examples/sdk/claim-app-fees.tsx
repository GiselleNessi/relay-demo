// SDK Claim App Fees Example
// This component demonstrates how to claim app fees using the Relay SDK

import { useState, useEffect } from "react";
import { usePrivyWalletClient } from "../../utils/wallet";

export function ClaimAppFeesExample() {
    const { getWalletClient, address, isConnected } = usePrivyWalletClient();
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [sdkAvailable, setSdkAvailable] = useState(false);
    const [chainId, setChainId] = useState(8453); // Base
    const [currency, setCurrency] = useState("0x833589fcd6edb6e08f4c7c32d4f71b54bda02913"); // USDC on Base
    const [recipient, setRecipient] = useState("");

    const codeSnippet = `import { getClient } from "@relayprotocol/relay-sdk";
import { useWalletClient } from "wagmi";

const { data: wallet } = useWalletClient();

const { data } = await getClient().actions.claimAppFees({
  wallet,
  chainId: 8453, // Base
  currency: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913", // USDC
  recipient: "0x...", // Optional
  amount: "10000000", // Optional (10 USDC)
  onProgress: ({steps, fees, breakdown, currentStep, currentStepItem, txHashes, details}) => {
    // custom handling
  },
});`;

    // Check if SDK is available
    useEffect(() => {
        import("@relayprotocol/relay-sdk").then(() => {
            setSdkAvailable(true);
        }).catch(() => {
            setSdkAvailable(false);
        });

        // Auto-fill recipient with connected wallet address
        if (isConnected && address && !recipient) {
            setRecipient(address);
        }
    }, [isConnected, address, recipient]);

    const handleRun = async () => {
        if (!sdkAvailable) {
            setError("Relay SDK is not installed. Please install @relayprotocol/relay-sdk to use this example.");
            return;
        }

        if (!isConnected) {
            setError("Please connect your wallet at the top of the page to use this example.");
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            // Use SDK to claim app fees
            const { getClient } = await import("../../config/relay");
            const wallet = await getWalletClient();
            const client = getClient();
            
            if (!client || !wallet) {
                throw new Error("SDK client or wallet not available");
            }

            const claimParams: any = {
                wallet,
                chainId,
                currency,
            };

            // Add optional recipient if provided
            if (recipient && recipient.trim() !== "") {
                claimParams.recipient = recipient.trim();
            }

            const data = await client.actions.claimAppFees(claimParams);
            
            setResult({
                success: true,
                data,
                wallet: address,
                chainId,
                currency,
                recipient: recipient || address,
                message: "App fees claimed successfully!"
            });
        } catch (err: any) {
            setError(err.message || "Failed to claim app fees");
            console.error("Claim app fees error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>SDK: Claim App Fees</h2>
            <p style={{ color: "#b0b0b0", marginBottom: "20px" }}>
                Code snippet showing how to claim app fees for a wallet using the Relay SDK.
            </p>

            <div style={{
                background: "rgba(70, 21, 200, 0.1)",
                border: "1px solid rgba(70, 21, 200, 0.3)",
                borderRadius: "8px",
                padding: "15px",
                marginBottom: "20px"
            }}>
                <p style={{ color: "#b0b0b0", margin: 0, fontSize: "0.9rem" }}>
                    <strong style={{ color: "#4615C8" }}>What are app fees?</strong> App fees allow you to monetize your integration by adding a fee (in bps) to every quote. Revenue is collected automatically in USDC. Use this method to claim those fees.
                </p>
            </div>

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

            {!sdkAvailable && (
                <div style={{
                    padding: "15px",
                    background: "rgba(255, 107, 107, 0.1)",
                    border: "1px solid rgba(255, 107, 107, 0.3)",
                    borderRadius: "8px",
                    color: "#ff6b6b",
                    marginBottom: "20px",
                    fontSize: "0.9rem"
                }}>
                    <strong>Error:</strong> Relay SDK is not installed. This example requires <code>@relayprotocol/relay-sdk</code> to run.
                </div>
            )}

            {isConnected && address && (
                <div style={{
                    padding: "12px",
                    background: "rgba(70, 21, 200, 0.1)",
                    border: "1px solid rgba(70, 21, 200, 0.3)",
                    borderRadius: "8px",
                    marginBottom: "20px",
                    fontSize: "0.9rem",
                    color: "#e0e0e0"
                }}>
                    ✓ Using connected wallet: <code style={{ color: "#4615C8" }}>{address.slice(0, 6)}...{address.slice(-4)}</code>
                </div>
            )}

            {!isConnected && (
                <div style={{
                    padding: "15px",
                    background: "rgba(255, 107, 107, 0.1)",
                    border: "1px solid rgba(255, 107, 107, 0.3)",
                    borderRadius: "8px",
                    color: "#ff6b6b",
                    marginBottom: "20px",
                    fontSize: "0.9rem"
                }}>
                    Please connect your wallet at the top of the page to use this example.
                </div>
            )}

            <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "5px", color: "#b0b0b0" }}>
                    Chain ID:
                </label>
                <input
                    type="number"
                    value={chainId}
                    onChange={(e) => setChainId(parseInt(e.target.value) || 8453)}
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

            <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "5px", color: "#b0b0b0" }}>
                    Currency (Token Address):
                </label>
                <input
                    type="text"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value.trim())}
                    placeholder="0x833589fcd6edb6e08f4c7c32d4f71b54bda02913"
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

            <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "5px", color: "#b0b0b0" }}>
                    Recipient (Optional - defaults to connected wallet):
                </label>
                <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value.trim())}
                    placeholder={address || "0x..."}
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
                onClick={handleRun}
                disabled={loading || !isConnected || !sdkAvailable}
                style={{
                    width: "100%",
                    padding: "15px 30px",
                    background: (isConnected && sdkAvailable) ? "#4615C8" : "#1a1a1a",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    cursor: (loading || !isConnected || !sdkAvailable) ? "not-allowed" : "pointer",
                    opacity: (loading || !isConnected || !sdkAvailable) ? 0.6 : 1,
                    marginBottom: "20px"
                }}
            >
                {loading ? "Claiming App Fees..." : "Claim App Fees"}
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
                        {result.success && (
                            <div style={{
                                padding: "12px",
                                background: "rgba(74, 222, 128, 0.1)",
                                border: "1px solid rgba(74, 222, 128, 0.3)",
                                borderRadius: "8px",
                                marginBottom: "15px",
                                color: "#4ade80",
                                fontSize: "0.9rem"
                            }}>
                                ✓ {result.message}
                            </div>
                        )}
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                            <span style={{ color: "#a0a0a0" }}>Wallet:</span>
                            <span style={{ color: "#e0e0e0", fontFamily: "monospace", fontSize: "0.85rem", wordBreak: "break-all" }}>
                                {result.wallet}
                            </span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                            <span style={{ color: "#a0a0a0" }}>Chain ID:</span>
                            <span style={{ color: "#e0e0e0", fontWeight: 600 }}>
                                {result.chainId}
                            </span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                            <span style={{ color: "#a0a0a0" }}>Currency:</span>
                            <span style={{ color: "#e0e0e0", fontFamily: "monospace", fontSize: "0.85rem", wordBreak: "break-all" }}>
                                {result.currency}
                            </span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                            <span style={{ color: "#a0a0a0" }}>Recipient:</span>
                            <span style={{ color: "#e0e0e0", fontFamily: "monospace", fontSize: "0.85rem", wordBreak: "break-all" }}>
                                {result.recipient}
                            </span>
                        </div>
                        {result.data && (
                            <details style={{ marginTop: "15px" }}>
                                <summary style={{ color: "#4615C8", cursor: "pointer", padding: "10px", background: "#0D0C0D", borderRadius: "8px" }}>
                                    View Full Response
                                </summary>
                                <pre style={{
                                    background: "#0D0C0D",
                                    padding: "15px",
                                    borderRadius: "8px",
                                    overflowX: "auto",
                                    color: "#e0e0e0",
                                    fontSize: "0.85rem",
                                    border: "1px solid rgba(255, 255, 255, 0.1)",
                                    marginTop: "10px"
                                }}>
                                    {JSON.stringify(result.data, null, 2)}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
