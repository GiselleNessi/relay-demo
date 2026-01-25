// SDK Get App Fees Example
// This component demonstrates how to retrieve app fee balances using the Relay SDK

import { useState, useEffect } from "react";
import { usePrivyWalletClient } from "../../utils/wallet";

export function GetAppFeesExample() {
    const { address, isConnected } = usePrivyWalletClient();
    const [walletAddress, setWalletAddress] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [sdkAvailable, setSdkAvailable] = useState(false);

    const codeSnippet = `import { getClient } from "@relayprotocol/relay-sdk";

const wallet = "0x..."; // Replace with your wallet address

const balances = await getClient().actions.getAppFees({
  wallet,
});`;

    // Check if SDK is available and sync wallet address
    useEffect(() => {
        import("@relayprotocol/relay-sdk").then(() => {
            setSdkAvailable(true);
        }).catch(() => {
            setSdkAvailable(false);
        });

        // Auto-fill wallet address from Privy
        if (isConnected && address) {
            setWalletAddress(address);
        }
    }, [isConnected, address]);

    const handleRun = async () => {
        // Use connected wallet address if available, otherwise use manual input
        const addressToUse = (isConnected && address) ? address : walletAddress;
        
        if (!addressToUse || !addressToUse.startsWith("0x") || addressToUse.length !== 42) {
            setError("Please connect a wallet at the top of the page or enter a valid wallet address (0x...)");
            return;
        }

        if (!sdkAvailable) {
            setError("Relay SDK is not installed. Please install @relayprotocol/relay-sdk to use this example.");
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            // Use SDK to get app fees
            const { getClient } = await import("../../config/relay");
            const client = getClient();
            
            if (!client) {
                throw new Error("SDK client not available");
            }

            const balances = await client.actions.getAppFees({
                wallet: addressToUse,
            });

            setResult({
                success: true,
                balances,
                wallet: addressToUse,
                message: "App fee balances retrieved successfully!"
            });
        } catch (err: any) {
            setError(err.message || "Failed to get app fees");
            console.error("Get app fees error:", err);
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
                    Wallet Address {isConnected && address ? "(using connected wallet)" : "(optional override)"}:
                </label>
                <input
                    type="text"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value.trim())}
                    placeholder={address || "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"}
                    disabled={isConnected && !!address}
                    style={{
                        width: "100%",
                        padding: "12px",
                        background: "#1a1a1a",
                        border: `1px solid ${!walletAddress || walletAddress.length !== 42 
                            ? "rgba(255, 107, 107, 0.5)" 
                            : "rgba(255, 255, 255, 0.1)"}`,
                        borderRadius: "8px",
                        color: "#e0e0e0",
                        fontSize: "1rem",
                        boxSizing: "border-box",
                        opacity: isConnected && !!address ? 0.6 : 1,
                        cursor: isConnected && !!address ? "not-allowed" : "text"
                    }}
                />
            </div>

            <button
                onClick={handleRun}
                disabled={loading || !sdkAvailable}
                style={{
                    width: "100%",
                    padding: "15px 30px",
                    background: sdkAvailable ? "#4615C8" : "#1a1a1a",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    cursor: (loading || !sdkAvailable) ? "not-allowed" : "pointer",
                    opacity: (loading || !sdkAvailable) ? 0.6 : 1,
                    marginBottom: "20px"
                }}
            >
                {loading ? "Getting App Fees..." : "Get App Fees"}
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
                        {result.balances && (
                            <details style={{ marginTop: "15px" }}>
                                <summary style={{ color: "#4615C8", cursor: "pointer", padding: "10px", background: "#0D0C0D", borderRadius: "8px" }}>
                                    View App Fee Balances
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
                                    {JSON.stringify(result.balances, null, 2)}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
