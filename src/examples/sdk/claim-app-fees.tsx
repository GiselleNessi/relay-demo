// SDK Claim App Fees Example
// This component demonstrates how to claim app fees using the Relay SDK

import { useState } from "react";

export function ClaimAppFeesExample() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

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

    const handleRun = async () => {
        if (typeof window.ethereum === "undefined") {
            setError("No wallet detected. Please install MetaMask or another Web3 wallet.");
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const provider = window.ethereum;
            await provider.request({ method: "eth_requestAccounts" });
            const accounts = await provider.request({ method: "eth_accounts" });
            const userAddress = accounts[0];

            // Get chain ID
            const chainId = await provider.request({ method: "eth_chainId" });
            const currentChainId = parseInt(chainId as string, 16);

            // For this demo, we'll show what the SDK call would do
            // In a real app with SDK installed, you would use:
            // const { data } = await getClient().actions.claimAppFees({...});
            
            setResult({
                message: "claimAppFees would be called with your wallet",
                wallet: userAddress,
                chainId: currentChainId,
                note: "In a real app with SDK installed, this would claim your app fees. The SDK handles the transaction execution automatically."
            });
        } catch (err: any) {
            setError(err.message || "Failed to connect wallet");
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
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                            <span style={{ color: "#a0a0a0" }}>Chain ID:</span>
                            <span style={{ color: "#e0e0e0", fontWeight: 600 }}>
                                {result.chainId}
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
