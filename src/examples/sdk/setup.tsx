// SDK Setup Example - Configure Relay SDK
// This component demonstrates how to set up the Relay SDK

import { useEffect, useState } from "react";

export function SetupExample() {
    const [setupCode, setSetupCode] = useState<string>("");
    const [isConfigured, setIsConfigured] = useState(false);
    const [configStatus, setConfigStatus] = useState<string>("");

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
        setConfigStatus("SDK not installed. Install with: npm install @relayprotocol/relay-sdk viem");
    }, []);

    const handleConfigureSDK = async () => {
        // SDK is not installed in this demo
        // This button demonstrates what would happen if SDK was installed
        setConfigStatus("SDK not installed. To use the SDK in your project, run: npm install @relayprotocol/relay-sdk viem");
        
        // In a real app with SDK installed, you would do:
        // import { createClient, convertViemChainToRelayChain, MAINNET_RELAY_API } from '@relayprotocol/relay-sdk';
        // import { base, arbitrum } from 'viem/chains';
        // 
        // createClient({
        //   baseApiUrl: MAINNET_RELAY_API,
        //   source: "your-app.com",
        //   chains: [
        //     convertViemChainToRelayChain(base),
        //     convertViemChainToRelayChain(arbitrum)
        //   ],
        // });
    };

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
                background: "#1a1a1a",
                borderRadius: "12px",
                padding: "20px",
                marginTop: "20px"
            }}>
                <h3 style={{ color: "#e0e0e0", marginTop: 0 }}>Try It</h3>
                <p style={{ color: "#b0b0b0", marginBottom: "15px" }}>
                    Click the button below to see what happens when configuring the SDK:
                </p>
                <button
                    onClick={handleConfigureSDK}
                    disabled={isConfigured}
                    style={{
                        padding: "12px 24px",
                        background: isConfigured ? "#666" : "#4615C8",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "1rem",
                        fontWeight: 600,
                        cursor: isConfigured ? "not-allowed" : "pointer",
                        opacity: isConfigured ? 0.6 : 1
                    }}
                >
                    {isConfigured ? "✓ SDK Configured" : "Configure SDK"}
                </button>
                {configStatus && (
                    <p style={{
                        color: isConfigured ? "#4ade80" : "#fbbf24",
                        marginTop: "15px",
                        marginBottom: 0,
                        fontSize: "0.9rem"
                    }}>
                        {configStatus}
                    </p>
                )}
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
