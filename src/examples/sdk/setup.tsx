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

        // Try to configure the SDK
        try {
            // @ts-ignore - Dynamic import for SDK
            import('@relayprotocol/relay-sdk').then((sdk) => {
                const { createClient, convertViemChainToRelayChain, MAINNET_RELAY_API } = sdk;
                // @ts-ignore - Dynamic import for viem
                import('viem/chains').then((chains) => {
                    try {
                        createClient({
                            baseApiUrl: MAINNET_RELAY_API,
                            source: "relay-demo.codesandbox.io",
                            chains: [
                                convertViemChainToRelayChain(chains.base),
                                convertViemChainToRelayChain(chains.arbitrum)
                            ],
                        });
                        setIsConfigured(true);
                        setConfigStatus("SDK configured successfully!");
                    } catch (e: any) {
                        setConfigStatus(`Configuration error: ${e.message}`);
                    }
                });
            }).catch(() => {
                setConfigStatus("SDK not installed. This is a demo showing the setup code.");
            });
        } catch (e) {
            setConfigStatus("SDK not available in this environment.");
        }
    }, []);

    const handleConfigureSDK = async () => {
        try {
            // @ts-ignore
            const sdk = await import('@relayprotocol/relay-sdk');
            const chains = await import('viem/chains');
            
            const { createClient, convertViemChainToRelayChain, MAINNET_RELAY_API } = sdk;
            
            createClient({
                baseApiUrl: MAINNET_RELAY_API,
                source: "relay-demo.codesandbox.io",
                chains: [
                    convertViemChainToRelayChain(chains.base),
                    convertViemChainToRelayChain(chains.arbitrum)
                ],
            });
            
            setIsConfigured(true);
            setConfigStatus("✓ SDK configured successfully!");
        } catch (e: any) {
            setConfigStatus(`Error: ${e.message || "SDK not available"}`);
        }
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
                    Click the button below to configure the SDK in this demo:
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
