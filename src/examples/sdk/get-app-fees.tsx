// SDK Get App Fees Example
// This component demonstrates how to retrieve app fee balances using the Relay SDK

import { useState } from "react";

export function GetAppFeesExample() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const codeSnippet = `import { getClient } from "@relayprotocol/relay-sdk";

const wallet = "0x..."; // Replace with your wallet address

const balances = await getClient().actions.getAppFees({
  wallet,
});`;

    const handleRun = async () => {
        const address = prompt("Enter wallet address to check app fee balances (0x...):");
        if (!address || !address.startsWith("0x") || address.length !== 42) {
            setError("Please enter a valid wallet address");
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            // In a real app with SDK installed, you would use:
            // const balances = await getClient().actions.getAppFees({ wallet: address });
            
            // For this demo, we'll show what the result would look like
            // Note: This requires an API endpoint that might not be publicly available
            // So we'll simulate the response structure
            
            setResult({
                wallet: address,
                message: "In a real app with SDK installed, this would fetch app fee balances.",
                note: "App fees are collected automatically when you add a fee (in bps) to quotes. Use getAppFees to check your balance, then use claimAppFees to withdraw them."
            });
        } catch (err: any) {
            setError(err.message || "Failed to get app fees");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>SDK: Get App Fees</h2>
            <p style={{ color: "#b0b0b0", marginBottom: "20px" }}>
                Code snippet showing how to retrieve app fee balances for a specific wallet using the Relay SDK.
            </p>

            <div style={{
                background: "rgba(70, 21, 200, 0.1)",
                border: "1px solid rgba(70, 21, 200, 0.3)",
                borderRadius: "8px",
                padding: "15px",
                marginBottom: "20px"
            }}>
                <p style={{ color: "#b0b0b0", margin: 0, fontSize: "0.9rem" }}>
                    <strong style={{ color: "#4615C8" }}>What are app fees?</strong> App fees allow you to monetize your integration by adding a fee (in bps) to every quote. Revenue is collected automatically in USDC. Use this method to check your fee balance.
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

            {result && (
                <div>
                    <h3 style={{ color: "#e0e0e0" }}>Result</h3>
                    <div style={{
                        background: "#1a1a1a",
                        borderRadius: "12px",
                        padding: "20px",
                        marginBottom: "20px"
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                            <span style={{ color: "#a0a0a0" }}>Wallet:</span>
                            <span style={{ color: "#e0e0e0", fontFamily: "monospace", fontSize: "0.85rem", wordBreak: "break-all" }}>
                                {result.wallet}
                            </span>
                        </div>
                        <div style={{ padding: "10px 0" }}>
                            <p style={{ color: "#a0a0a0", margin: 0, fontSize: "0.9rem" }}>
                                {result.note}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
