// SDK Setup Example - Configure Relay SDK
// This component demonstrates how to set up the Relay SDK

import { useEffect, useState } from "react";

export function SetupExample() {
    const [setupCode, setSetupCode] = useState<string>("");
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
        setConfigStatus("This example shows the SDK setup code. The SDK is not installed in this demo.");
    }, []);

    const handleConfigureSDK = () => {
        setConfigStatus("In a real project, after installing the SDK, this would configure it. For this demo, we're showing you the code pattern to use.");
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>SDK Setup & Configuration</h2>
            <p style={{ color: "#b0b0b0", marginBottom: "20px" }}>
                This example shows you how to configure the Relay SDK in your application. 
                <strong style={{ color: "#e0e0e0" }}> The SDK is not installed in this demo</strong>, so we're showing you the code patterns you would use.
            </p>

            <div style={{
                background: "rgba(70, 21, 200, 0.1)",
                border: "1px solid rgba(70, 21, 200, 0.3)",
                borderRadius: "8px",
                padding: "15px",
                marginBottom: "20px"
            }}>
                <p style={{ color: "#b0b0b0", margin: 0, fontSize: "0.9rem" }}>
                    <strong style={{ color: "#4615C8" }}>What is the SDK?</strong> The Relay SDK is a JavaScript library that provides a cleaner, type-safe API wrapper around the Relay API. Instead of making raw fetch calls, you use methods like <code style={{ background: "#1a1a1a", padding: "2px 6px", borderRadius: "4px" }}>getClient().actions.getQuote()</code>.
                </p>
            </div>

            <div style={{
                background: "#1a1a1a",
                borderRadius: "12px",
                padding: "20px",
                marginTop: "20px"
            }}>
                <h3 style={{ color: "#e0e0e0", marginTop: 0 }}>Installation</h3>
                <p style={{ color: "#a0a0a0", fontSize: "0.9rem", marginBottom: "10px" }}>
                    First, install the SDK and its peer dependency:
                </p>
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
                <p style={{ color: "#a0a0a0", fontSize: "0.9rem", marginBottom: "10px" }}>
                    Then, configure the SDK at the root of your application:
                </p>
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
                    Click the button to see what happens (this is just a demo - SDK is not installed):
                </p>
                <button
                    onClick={handleConfigureSDK}
                    style={{
                        padding: "12px 24px",
                        background: "#4615C8",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "1rem",
                        fontWeight: 600,
                        cursor: "pointer"
                    }}
                >
                    See SDK Configuration
                </button>
                {configStatus && (
                    <p style={{
                        color: "#fbbf24",
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

            <div style={{
                background: "rgba(255, 193, 7, 0.1)",
                border: "1px solid rgba(255, 193, 7, 0.3)",
                borderRadius: "8px",
                padding: "15px",
                marginTop: "20px"
            }}>
                <p style={{ color: "#ffc107", margin: 0, fontSize: "0.9rem" }}>
                    <strong>Note:</strong> In this demo, the SDK is not installed, so these examples show you the code patterns. 
                    The actual functionality uses the API directly. In your own project, after installing the SDK, you would use these exact code patterns.
                </p>
            </div>
        </div>
    );
}
