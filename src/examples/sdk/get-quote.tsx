// SDK Get Quote Example - Native Bridge
// This component demonstrates how to use the Relay SDK to get a quote

import { useState, useEffect } from "react";
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { usePrivyWalletClient } from "../../utils/wallet";

export function GetQuoteSDKExample() {
    const { ready, authenticated, login } = usePrivy();
    const { wallets } = useWallets();
    const { getWalletClient, address, isConnected } = usePrivyWalletClient();
    const [walletAddress, setWalletAddress] = useState("");
    const [loading, setLoading] = useState(false);
    const [quoteResponse, setQuoteResponse] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [sdkAvailable, setSdkAvailable] = useState(false);

    const codeSnippet = `import { getClient } from '@relayprotocol/relay-sdk';
import { useWalletClient } from 'wagmi';

const { data: wallet } = useWalletClient();

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
});`;

    // Check if SDK is available and sync wallet address
    useEffect(() => {
        // Check if SDK is available
        import("@relayprotocol/relay-sdk").then(() => {
            setSdkAvailable(true);
        }).catch(() => {
            setSdkAvailable(false);
        });

        // Sync wallet address from Privy
        if (isConnected && address) {
            setWalletAddress(address);
        }

        // Try to get address from localStorage as fallback
        if (!walletAddress) {
            const storedQuote = localStorage.getItem("relayQuoteResponse");
            if (storedQuote) {
                try {
                    const quote = JSON.parse(storedQuote);
                    const storedAddress = quote.steps?.[0]?.items?.[0]?.data?.from || "";
                    if (storedAddress) setWalletAddress(storedAddress);
                } catch (e) {
                    // Ignore
                }
            }
        }
    }, [isConnected, address, walletAddress]);

    const handleRun = async () => {
        // Use connected wallet address if available, otherwise use manual input
        const addressToUse = (isConnected && address) ? address : walletAddress;
        
        if (!addressToUse || !addressToUse.startsWith("0x") || addressToUse.length !== 42) {
            setError("Please connect a wallet at the top of the page or enter a valid wallet address (0x...)");
            return;
        }

        setLoading(true);
        setError(null);
        setQuoteResponse(null);

        try {
            let data;

            // Try to use SDK if available and wallet is connected
            if (sdkAvailable && isConnected) {
                try {
                    const { getClient } = await import("@relayprotocol/relay-sdk");
                    const wallet = await getWalletClient();
                    const client = getClient();
                    
                    if (client && wallet) {
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
                        data = quote;
                    } else {
                        throw new Error("SDK client not available");
                    }
                } catch (sdkError: any) {
                    console.warn("SDK not available, falling back to API:", sdkError);
                    // Fall through to API call
                }
            }

            // Fallback to API if SDK not available or failed
            if (!data) {
                const response = await fetch("https://api.relay.link/quote/v2", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        user: addressToUse,
                        originChainId: 8453,
                        destinationChainId: 42161,
                        originCurrency: "0x0000000000000000000000000000000000000000",
                        destinationCurrency: "0x0000000000000000000000000000000000000000",
                        amount: "100000000000000",
                        tradeType: "EXACT_INPUT"
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Failed to get quote");
                }

                data = await response.json();
            }

            setQuoteResponse(data);
            localStorage.setItem("relayQuoteResponse", JSON.stringify(data));
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>SDK: Get Quote</h2>
            <p style={{ color: "#b0b0b0", marginBottom: "20px" }}>
                Code snippet showing how to get a quote using the Relay SDK.
            </p>

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
                    background: "rgba(251, 191, 36, 0.1)",
                    border: "1px solid rgba(251, 191, 36, 0.3)",
                    borderRadius: "8px",
                    color: "#fbbf24",
                    marginBottom: "20px",
                    fontSize: "0.9rem"
                }}>
                    <strong>Note:</strong> SDK not installed. This example will use the API directly. Install <code>@relayprotocol/relay-sdk</code> to use the SDK.
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
                {isConnected && address && (
                    <p style={{ color: "#a0a0a0", fontSize: "0.85rem", marginTop: "5px", marginBottom: 0 }}>
                        Using your connected wallet. You can override by entering a different address.
                    </p>
                )}
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

            {quoteResponse && (
                <div>
                    <h3 style={{ color: "#e0e0e0" }}>Result</h3>
                    <div style={{
                        background: "#1a1a1a",
                        borderRadius: "12px",
                        padding: "20px",
                        marginBottom: "20px"
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                            <span style={{ color: "#a0a0a0" }}>Operation:</span>
                            <span style={{ color: "#e0e0e0", fontWeight: 600 }}>
                                {quoteResponse.details?.operation || "N/A"}
                            </span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                            <span style={{ color: "#a0a0a0" }}>You Send:</span>
                            <span style={{ color: "#e0e0e0", fontWeight: 600 }}>
                                {quoteResponse.details?.currencyIn?.amountFormatted || quoteResponse.details?.currencyIn?.amount || "0"} ETH
                            </span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0" }}>
                            <span style={{ color: "#a0a0a0" }}>You Receive:</span>
                            <span style={{ color: "#e0e0e0", fontWeight: 600 }}>
                                {quoteResponse.details?.currencyOut?.amountFormatted || quoteResponse.details?.currencyOut?.amount || "0"} ETH
                            </span>
                        </div>
                    </div>

                    <details>
                        <summary style={{ color: "#4615C8", cursor: "pointer", padding: "10px", background: "#1a1a1a", borderRadius: "8px", marginBottom: "10px" }}>
                            View Full JSON Response
                        </summary>
                        <pre style={{
                            background: "#0D0C0D",
                            padding: "15px",
                            borderRadius: "8px",
                            overflowX: "auto",
                            color: "#e0e0e0",
                            fontSize: "0.85rem",
                            border: "1px solid rgba(255, 255, 255, 0.1)"
                        }}>
                            {JSON.stringify(quoteResponse, null, 2)}
                        </pre>
                    </details>
                </div>
            )}
        </div>
    );
}
