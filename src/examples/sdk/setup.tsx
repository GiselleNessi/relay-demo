// SDK Setup Example - Configure Relay SDK
// This component demonstrates how to set up the Relay SDK

import { useEffect, useState } from "react";

export function SetupExample() {
    const [setupCode, setSetupCode] = useState<string>("");
    const [isConfigured, setIsConfigured] = useState(false);

    useEffect(() => {
        // Show setup code
        const code = `import { createClient, convertViemChainToRelayChain, MAINNET_RELAY_API } from '@relayprotocol/relay-sdk';
import { base, arbitrum } from 'viem/chains';

// Create the Relay client
createClient({
  baseApiUrl: MAINNET_RELAY_API,
  source: "your-app.com", // Replace with your domain
  chains: [
    convertViemChainToRelayChain(base),
    convertViemChainToRelayChain(arbitrum)
  ],
});

// The client is now available globally via getClient()
import { getClient } from '@relayprotocol/relay-sdk';
const client = getClient();`;

        setSetupCode(code);

        // Check if SDK is configured (basic check)
        try {
            // @ts-ignore - SDK might not be installed in this demo
            if (typeof window !== 'undefined' && window.relayClient) {
                setIsConfigured(true);
            }
        } catch (e) {
            // SDK not configured
        }
    }, []);

    return (
        <div style={{ padding: "20px" }}>
            <h2>SDK Setup & Configuration</h2>
            <p>Configure the Relay SDK in your application. This is the foundation for all SDK examples.</p>

            <div style={{
                background: "#1a1a1a",
                borderRadius: "12px",
                padding: "20px",
                marginTop: "20px"
            }}>
                <h3 style={{ color: "#e0e0e0", marginTop: 0 }}>Installation</h3>
                <pre style={{
                    background: "#0D0C0D",
                    padding: "15px",
                    borderRadius: "8px",
                    overflowX: "auto",
                    color: "#e0e0e0",
                    fontSize: "0.9rem",
                    border: "1px solid rgba(255, 255, 255, 0.1)"
                }}>
{`npm install @relayprotocol/relay-sdk viem
# or
yarn add @relayprotocol/relay-sdk viem`}
                </pre>
            </div>

            <div style={{
                background: "#1a1a1a",
                borderRadius: "12px",
                padding: "20px",
                marginTop: "20px"
            }}>
                <h3 style={{ color: "#e0e0e0", marginTop: 0 }}>Configuration Code</h3>
                <pre style={{
                    background: "#0D0C0D",
                    padding: "15px",
                    borderRadius: "8px",
                    overflowX: "auto",
                    color: "#e0e0e0",
                    fontSize: "0.85rem",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    maxHeight: "400px",
                    overflowY: "auto"
                }}>
                    {setupCode}
                </pre>
            </div>

            <div style={{
                background: isConfigured ? "rgba(74, 222, 128, 0.1)" : "rgba(255, 193, 7, 0.1)",
                border: `1px solid ${isConfigured ? "rgba(74, 222, 128, 0.3)" : "rgba(255, 193, 7, 0.3)"}`,
                borderRadius: "8px",
                padding: "15px",
                marginTop: "20px"
            }}>
                <p style={{ color: isConfigured ? "#4ade80" : "#ffc107", margin: 0 }}>
                    <strong>{isConfigured ? "✓ SDK Configured" : "⚠ SDK Not Configured"}</strong>
                </p>
                <p style={{ color: "#a0a0a0", fontSize: "0.9rem", marginTop: "10px" }}>
                    {isConfigured 
                        ? "The Relay SDK is configured and ready to use."
                        : "In a real application, you would configure the SDK at the root of your app. For this demo, you can see the configuration code above."}
                </p>
            </div>

            <div style={{
                background: "#1a1a1a",
                borderRadius: "12px",
                padding: "20px",
                marginTop: "20px"
            }}>
                <h3 style={{ color: "#e0e0e0", marginTop: 0 }}>Key Points</h3>
                <ul style={{ color: "#b0b0b0", lineHeight: "1.8" }}>
                    <li><strong style={{ color: "#e0e0e0" }}>createClient</strong> creates a singleton instance used throughout your app</li>
                    <li><strong style={{ color: "#e0e0e0" }}>source</strong> should map to your domain for tracking</li>
                    <li><strong style={{ color: "#e0e0e0" }}>chains</strong> can be configured statically or dynamically</li>
                    <li>Use <strong style={{ color: "#e0e0e0" }}>getClient()</strong> to access the configured client</li>
                    <li>For testnets, use <strong style={{ color: "#e0e0e0" }}>TESTNET_RELAY_API</strong> instead</li>
                </ul>
            </div>
        </div>
    );
}
