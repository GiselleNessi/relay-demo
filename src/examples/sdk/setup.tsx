// SDK Setup Example - Configure Relay SDK
// This component demonstrates how to set up the Relay SDK

import { useState } from "react";

export function SetupExample() {
    const [configStatus, setConfigStatus] = useState<string>("");

    const codeSnippet = `import { createClient, convertViemChainToRelayChain, MAINNET_RELAY_API } from '@relayprotocol/relay-sdk';
import { base, arbitrum } from 'viem/chains';

// Create the Relay client
createClient({
  baseApiUrl: MAINNET_RELAY_API,
  source: "your-app.com",
  chains: [
    convertViemChainToRelayChain(base),
    convertViemChainToRelayChain(arbitrum)
  ],
});

// The client is now available globally via getClient()
import { getClient } from '@relayprotocol/relay-sdk';
const client = getClient();`;

    const handleRun = () => {
        setConfigStatus("✓ Setup code shown above. Copy this code to your project after installing: npm install @relayprotocol/relay-sdk viem");
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>SDK Setup & Configuration</h2>
            <p style={{ color: "#b0b0b0", marginBottom: "20px" }}>
                Code snippet showing how to configure the Relay SDK in your application.
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

            <button
                onClick={handleRun}
                style={{
                    width: "100%",
                    padding: "15px 30px",
                    background: "#4615C8",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    marginBottom: "20px"
                }}
            >
                View Installation Instructions
            </button>

            {configStatus && (
                <div style={{
                    padding: "15px",
                    background: "rgba(74, 222, 128, 0.1)",
                    border: "1px solid rgba(74, 222, 128, 0.3)",
                    borderRadius: "8px",
                    color: "#4ade80"
                }}>
                    {configStatus}
                </div>
            )}
        </div>
    );
}
