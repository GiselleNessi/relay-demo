import { useState } from "react";
import "./App.css";
import { GetQuoteExample } from "./examples/api/get-quote";
import { ExecuteExample } from "./examples/api/execute";
import { MonitorExample } from "./examples/api/monitor";
import { SetupExample, GetQuoteSDKExample, ExecuteProgressExample, CompleteFlowExample } from "./examples/sdk";

// This is the app that runs in CodeSandbox
// It shows all available examples organized by category

interface Example {
    id: string;
    title: string;
    description: string;
    stepNumber?: number;
    component?: React.ComponentType<any>;
    file?: string;
    disabled?: boolean;
}

function App() {
    const [selectedExample, setSelectedExample] = useState<Example | null>(null);
    const [quoteResponse, setQuoteResponse] = useState<any>(null);

    const examples: { api: Example[]; sdk: Example[]; more: Example[] } = {
        api: [
            {
                id: "get-quote",
                title: "Get Quote",
                description: "Get a quote for cross-chain bridging. This is the first step - click to start!",
                stepNumber: 1,
                component: GetQuoteExample,
                file: "src/examples/api/get-quote.tsx"
            },
            {
                id: "execute",
                title: "Execute",
                description: "Execute the transaction from your quote. Complete Step 1 first.",
                stepNumber: 2,
                component: ExecuteExample,
                file: "src/examples/api/execute.tsx"
            },
            {
                id: "monitor",
                title: "Monitor",
                description: "Monitor your transaction status. Use after executing Step 2.",
                stepNumber: 3,
                component: MonitorExample,
                file: "src/examples/api/monitor.tsx"
            }
        ],
        sdk: [
            {
                id: "setup",
                title: "Setup & Configuration",
                description: "Configure the Relay SDK in your application",
                stepNumber: 1,
                component: SetupExample,
                file: "src/examples/sdk/setup.tsx"
            },
            {
                id: "get-quote-sdk",
                title: "Get Quote (SDK)",
                description: "Use the SDK to get a quote for cross-chain bridging",
                stepNumber: 2,
                component: GetQuoteSDKExample,
                file: "src/examples/sdk/get-quote.tsx"
            },
            {
                id: "execute-progress",
                title: "Execute with Progress",
                description: "Execute with real-time progress updates using onProgress",
                stepNumber: 3,
                component: ExecuteProgressExample,
                file: "src/examples/sdk/execute-progress.tsx"
            },
            {
                id: "complete-flow",
                title: "Complete SDK Flow",
                description: "Full workflow: Quote → Execute → Monitor using SDK",
                component: CompleteFlowExample,
                file: "src/examples/sdk/complete-flow.tsx"
            }
        ],
        more: [
            {
                id: "coming-soon",
                title: "More Examples",
                description: "Additional examples coming soon",
                disabled: true
            }
        ]
    };

    const handleExampleClick = (example: Example) => {
        if (example.disabled || !example.component) return;
        setSelectedExample(example);
    };

    const handleBack = () => {
        setSelectedExample(null);
    };

    // If an example is selected, show it
    if (selectedExample && selectedExample.component) {
        const Component = selectedExample.component;
        return (
            <div className="app-container">
                <div className="card" style={{ maxWidth: "900px" }}>
                    <button
                        onClick={handleBack}
                        style={{
                            marginBottom: "20px",
                            padding: "10px 20px",
                            background: "#1a1a1a",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            borderRadius: "8px",
                            color: "#e0e0e0",
                            cursor: "pointer",
                            fontSize: "0.9rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px"
                        }}
                    >
                        <span>←</span> Back to Examples
                    </button>
                    <Component quoteResponse={quoteResponse} requestId={quoteResponse?.steps?.[0]?.requestId} />
                </div>
            </div>
        );
    }

    // Show examples list
    return (
        <div className="app-container">
            <div className="card">
                <div className="logo-container">
                    <h1>Relay API Examples</h1>
                    <p className="subtitle">
                        Interactive examples for Relay API integration
                    </p>
                </div>

                {/* Workflow Guide */}
                <div style={{
                    background: "linear-gradient(135deg, rgba(70, 21, 200, 0.1) 0%, rgba(70, 21, 200, 0.05) 100%)",
                    border: "1px solid rgba(70, 21, 200, 0.3)",
                    borderRadius: "12px",
                    padding: "25px",
                    marginBottom: "40px"
                }}>
                    <h3 style={{ color: "#e0e0e0", marginTop: 0, marginBottom: "15px", fontSize: "1.3rem" }}>
                        How to Use
                    </h3>
                    <p style={{ color: "#b0b0b0", marginBottom: "20px", lineHeight: "1.6" }}>
                        Follow these steps in order to complete a cross-chain bridge:
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                            <div style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                background: "#4615C8",
                                color: "white",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: "bold",
                                flexShrink: 0
                            }}>1</div>
                            <div style={{ flex: 1 }}>
                                <strong style={{ color: "#e0e0e0" }}>Get Quote</strong>
                                <p style={{ color: "#a0a0a0", margin: "5px 0 0 0", fontSize: "0.9rem" }}>
                                    Click the "Get Quote" card below to start. Enter your wallet address and get a quote for your bridge.
                                </p>
                            </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                            <div style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                background: "#4615C8",
                                color: "white",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: "bold",
                                flexShrink: 0
                            }}>2</div>
                            <div style={{ flex: 1 }}>
                                <strong style={{ color: "#e0e0e0" }}>Execute</strong>
                                <p style={{ color: "#a0a0a0", margin: "5px 0 0 0", fontSize: "0.9rem" }}>
                                    After getting a quote, click "Execute" to submit the transaction to your wallet.
                                </p>
                            </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                            <div style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                background: "#4615C8",
                                color: "white",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: "bold",
                                flexShrink: 0
                            }}>3</div>
                            <div style={{ flex: 1 }}>
                                <strong style={{ color: "#e0e0e0" }}>Monitor</strong>
                                <p style={{ color: "#a0a0a0", margin: "5px 0 0 0", fontSize: "0.9rem" }}>
                                    Use "Monitor" to track your transaction status using the requestId from execution.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="examples-grid">
                    {/* API Examples */}
                    <div className="example-category">
                        <h2 className="category-title">API Examples</h2>
                        <p className="category-description">
                            Follow the Relay API Quickstart guide step by step. Click on any step to try it!
                        </p>
                        <div className="examples-list">
                            {examples.api.map((example) => (
                                <div
                                    key={example.id}
                                    className={`example-card ${example.disabled ? "disabled" : ""}`}
                                    onClick={() => handleExampleClick(example)}
                                    style={{
                                        cursor: example.disabled ? "not-allowed" : "pointer",
                                        position: "relative",
                                        transition: "all 0.2s ease"
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!example.disabled) {
                                            e.currentTarget.style.transform = "translateY(-2px)";
                                            e.currentTarget.style.boxShadow = "0 4px 12px rgba(70, 21, 200, 0.3)";
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!example.disabled) {
                                            e.currentTarget.style.transform = "translateY(0)";
                                            e.currentTarget.style.boxShadow = "none";
                                        }
                                    }}
                                >
                                    {example.stepNumber && (
                                        <div style={{
                                            position: "absolute",
                                            top: "15px",
                                            right: "15px",
                                            width: "30px",
                                            height: "30px",
                                            borderRadius: "50%",
                                            background: "#4615C8",
                                            color: "white",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontWeight: "bold",
                                            fontSize: "0.9rem"
                                        }}>
                                            {example.stepNumber}
                                        </div>
                                    )}
                                    <h3>{example.title}</h3>
                                    <p>{example.description}</p>
                                    {example.file && (
                                        <p style={{ fontSize: "0.85rem", color: "#888", marginTop: "10px" }}>
                                            File: <code>{example.file}</code>
                                        </p>
                                    )}
                                    {!example.disabled && (
                                        <div style={{
                                            marginTop: "15px",
                                            padding: "8px 16px",
                                            background: "rgba(70, 21, 200, 0.2)",
                                            border: "1px solid rgba(70, 21, 200, 0.4)",
                                            borderRadius: "6px",
                                            color: "#4615C8",
                                            fontSize: "0.9rem",
                                            fontWeight: 600,
                                            textAlign: "center"
                                        }}>
                                            Click to Try →
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* SDK Examples */}
                    <div className="example-category">
                        <h2 className="category-title">SDK Examples</h2>
                        <p className="category-description">
                            Examples using Relay SDK and React hooks
                        </p>
                        <div className="examples-list">
                            {examples.sdk.map((example) => (
                                <div
                                    key={example.id}
                                    className={`example-card ${example.disabled ? "disabled" : ""}`}
                                    onClick={() => handleExampleClick(example)}
                                    style={{
                                        cursor: example.disabled ? "not-allowed" : "pointer",
                                        position: "relative",
                                        transition: "all 0.2s ease"
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!example.disabled) {
                                            e.currentTarget.style.transform = "translateY(-2px)";
                                            e.currentTarget.style.boxShadow = "0 4px 12px rgba(70, 21, 200, 0.3)";
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!example.disabled) {
                                            e.currentTarget.style.transform = "translateY(0)";
                                            e.currentTarget.style.boxShadow = "none";
                                        }
                                    }}
                                >
                                    {example.stepNumber && (
                                        <div style={{
                                            position: "absolute",
                                            top: "15px",
                                            right: "15px",
                                            width: "30px",
                                            height: "30px",
                                            borderRadius: "50%",
                                            background: "#4615C8",
                                            color: "white",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontWeight: "bold",
                                            fontSize: "0.9rem"
                                        }}>
                                            {example.stepNumber}
                                        </div>
                                    )}
                                    <h3>{example.title}</h3>
                                    <p>{example.description}</p>
                                    {example.file && (
                                        <p style={{ fontSize: "0.85rem", color: "#888", marginTop: "10px" }}>
                                            File: <code>{example.file}</code>
                                        </p>
                                    )}
                                    {!example.disabled && (
                                        <div style={{
                                            marginTop: "15px",
                                            padding: "8px 16px",
                                            background: "rgba(70, 21, 200, 0.2)",
                                            border: "1px solid rgba(70, 21, 200, 0.4)",
                                            borderRadius: "6px",
                                            color: "#4615C8",
                                            fontSize: "0.9rem",
                                            fontWeight: 600,
                                            textAlign: "center"
                                        }}>
                                            Click to Try →
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* More Examples */}
                    <div className="example-category">
                        <h2 className="category-title">More Examples</h2>
                        <p className="category-description">
                            Advanced examples and use cases
                        </p>
                        <div className="examples-list">
                            {examples.more.map((example) => (
                                <div
                                    key={example.id}
                                    className={`example-card ${example.disabled ? "disabled" : ""}`}
                                >
                                    <h3>{example.title}</h3>
                                    <p>{example.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="footer">
                    <p>
                        <a href="https://docs.relay.link/references/api/quickstart.md" target="_blank" rel="noopener noreferrer">
                            View Relay API Documentation
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default App;
