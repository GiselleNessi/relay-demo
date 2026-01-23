import { useState } from "react";
import "./App.css";
import { GetQuoteExample } from "./examples/api/get-quote";
import { ExecuteExample } from "./examples/api/execute";
import { MonitorExample } from "./examples/api/monitor";

// This is the app that runs in CodeSandbox
// It shows all available examples organized by category

interface Example {
    id: string;
    title: string;
    description: string;
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
                title: "Step 2: Get Quote",
                description: "Get a quote for cross-chain bridging using the Relay API",
                component: GetQuoteExample,
                file: "src/examples/api/get-quote.tsx"
            },
            {
                id: "execute",
                title: "Step 3: Execute",
                description: "Execute a transaction from a quote response",
                component: ExecuteExample,
                file: "src/examples/api/execute.tsx"
            },
            {
                id: "monitor",
                title: "Step 4: Monitor",
                description: "Monitor transaction status using the requestId",
                component: MonitorExample,
                file: "src/examples/api/monitor.tsx"
            }
        ],
        sdk: [
            {
                id: "coming-soon",
                title: "SDK Examples",
                description: "SDK examples coming soon",
                disabled: true
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
                            fontSize: "0.9rem"
                        }}
                    >
                        ← Back to Examples
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

                <div className="examples-grid">
                    {/* API Examples */}
                    <div className="example-category">
                        <h2 className="category-title">API Examples</h2>
                        <p className="category-description">
                            Follow the Relay API Quickstart guide step by step
                        </p>
                        <div className="examples-list">
                            {examples.api.map((example) => (
                                <div
                                    key={example.id}
                                    className={`example-card ${example.disabled ? "disabled" : ""}`}
                                    onClick={() => handleExampleClick(example)}
                                    style={{
                                        cursor: example.disabled ? "not-allowed" : "pointer"
                                    }}
                                >
                                    <h3>{example.title}</h3>
                                    <p>{example.description}</p>
                                    {example.file && (
                                        <p style={{ fontSize: "0.85rem", color: "#888", marginTop: "10px" }}>
                                            File: <code>{example.file}</code>
                                        </p>
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
                                >
                                    <h3>{example.title}</h3>
                                    <p>{example.description}</p>
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
