// SDK Setup Example - Configure Relay SDK
// This component demonstrates how to set up the Relay SDK

import { useEffect, useState } from "react";

export function SetupExample() {
    const [setupCode, setSetupCode] = useState<string>("");
    const [configStatus, setConfigStatus] = useState<string>("");
    const [source, setSource] = useState<string>("your-app.com");
    const [selectedChains, setSelectedChains] = useState<string[]>(["base", "arbitrum"]);

    const generateSetupCode = () => {
        const chainImports = selectedChains.map(chain => `    convertViemChainToRelayChain(${chain})`).join(',\n');
        const code = `import { createClient, convertViemChainToRelayChain, MAINNET_RELAY_API } from '@relayprotocol/relay-sdk';
import { ${selectedChains.join(', ')} } from 'viem/chains';

// Create the Relay client
createClient({
  baseApiUrl: MAINNET_RELAY_API,
  source: "${source}", // Your app domain
  chains: [
${chainImports}
  ],
});

// The client is now available globally via getClient()
import { getClient } from '@relayprotocol/relay-sdk';
const client = getClient();`;

        setSetupCode(code);
        setConfigStatus(`✓ Generated setup code for ${source} with chains: ${selectedChains.join(', ')}`);
    };

    useEffect(() => {
        generateSetupCode();
    }, [source, selectedChains]);

    return (
        <div style={{ padding: "20px" }}>
            <h2>SDK Setup & Configuration</h2>
            <p style={{ color: "#b0b0b0", marginBottom: "20px" }}>
                Learn how to configure the Relay SDK. Try the interactive example below to see the setup code in action.
            </p>

            <div style={{
                background: "rgba(70, 21, 200, 0.1)",
                border: "1px solid rgba(70, 21, 200, 0.3)",
                borderRadius: "8px",
                padding: "15px",
                marginBottom: "20px"
            }}>
                <p style={{ color: "#b0b0b0", margin: 0, fontSize: "0.9rem" }}>
                    <strong style={{ color: "#4615C8" }}>What is the SDK?</strong> The Relay SDK is a JavaScript library that provides a cleaner, type-safe API wrapper around the Relay API. 
                    Instead of making raw fetch calls, you use methods like <code style={{ background: "#1a1a1a", padding: "2px 6px", borderRadius: "4px" }}>getClient().actions.getQuote()</code>.
                    <br /><br />
                    <strong style={{ color: "#4615C8" }}>Try it:</strong> Scroll down and click "Generate Setup Code" to see your configuration code!
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
                <h3 style={{ color: "#e0e0e0", marginTop: 0 }}>Try It - Customize Your Setup</h3>
                <p style={{ color: "#b0b0b0", marginBottom: "20px", fontSize: "0.9rem" }}>
                    Customize the setup code below. The code will update automatically as you change the values!
                </p>

                <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", marginBottom: "5px", color: "#b0b0b0" }}>
                        Source (Your App Domain):
                    </label>
                    <input
                        type="text"
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                        placeholder="your-app.com"
                        style={{
                            width: "100%",
                            padding: "12px",
                            background: "#0D0C0D",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            borderRadius: "8px",
                            color: "#e0e0e0",
                            fontSize: "1rem",
                            boxSizing: "border-box"
                        }}
                    />
                </div>

                <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", marginBottom: "10px", color: "#b0b0b0" }}>
                        Select Chains:
                    </label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                        {["base", "arbitrum", "optimism", "polygon", "ethereum"].map((chain) => (
                            <label
                                key={chain}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    padding: "10px 15px",
                                    background: selectedChains.includes(chain) ? "rgba(70, 21, 200, 0.2)" : "#0D0C0D",
                                    border: `1px solid ${selectedChains.includes(chain) ? "#4615C8" : "rgba(255, 255, 255, 0.1)"}`,
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    color: "#e0e0e0"
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedChains.includes(chain)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedChains([...selectedChains, chain]);
                                        } else {
                                            setSelectedChains(selectedChains.filter(c => c !== chain));
                                        }
                                    }}
                                    style={{ cursor: "pointer" }}
                                />
                                <span style={{ textTransform: "capitalize" }}>{chain}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <button
                    onClick={generateSetupCode}
                    style={{
                        width: "100%",
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
                    Generate Setup Code
                </button>
                {configStatus && (
                    <p style={{
                        color: "#4ade80",
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
                background: "rgba(70, 21, 200, 0.1)",
                border: "1px solid rgba(70, 21, 200, 0.3)",
                borderRadius: "8px",
                padding: "15px",
                marginTop: "20px"
            }}>
                <p style={{ color: "#b0b0b0", margin: 0, fontSize: "0.9rem" }}>
                    <strong style={{ color: "#4615C8" }}>Next Steps:</strong> Copy the generated code above and use it in your project after installing the SDK with <code style={{ background: "#1a1a1a", padding: "2px 6px", borderRadius: "4px" }}>npm install @relayprotocol/relay-sdk viem</code>
                </p>
            </div>
        </div>
    );
}
