import { useState } from "react";
import { usePrivy, useWallets } from '@privy-io/react-auth';
import "./App.css";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { GetQuoteExample } from "./examples/api/get-quote";
import { ExecuteExample } from "./examples/api/execute";
import { MonitorExample } from "./examples/api/monitor";
import { GetQuoteSDKExample, OverridePriceImpactExample } from "./examples/sdk";

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
    const { ready, authenticated, login, logout, user } = usePrivy();
    const { wallets } = useWallets();
    const [selectedExample, setSelectedExample] = useState<Example | null>(null);

    const examples: { api: Example[]; sdk: Example[] } = {
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
                id: "get-quote-sdk",
                title: "Get Quote + Execute (SDK)",
                description: "Get a quote and execute in one flow on the same page",
                component: GetQuoteSDKExample,
                file: "src/examples/sdk/get-quote.tsx"
            },
            {
                id: "override-price-impact",
                title: "Override price impact (simple)",
                description: "Get quote with overridePriceImpact to bypass \"Swap impact is too high\" for long-tail assets",
                component: OverridePriceImpactExample,
                file: "src/examples/sdk/override-price-impact.tsx"
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

    // Show loading state only briefly
    if (!ready) {
        return (
            <div className="app-container">
                <div className="card card-loading">
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    // If an example is selected, show it
    if (selectedExample && selectedExample.component) {
        const Component = selectedExample.component;
        return (
            <div className="app-container">
                <div className="card card-example">
                    <button onClick={handleBack} className="btn-back">
                        <span>←</span> Back to Examples
                    </button>
                    <ErrorBoundary>
                        <Component />
                    </ErrorBoundary>
                </div>
            </div>
        );
    }

    // Show examples list
    const connectedAddress = wallets.length > 0 ? wallets[0]?.address : (user?.wallet?.address || null);
    const displayAddress = connectedAddress
        ? `${connectedAddress.slice(0, 6)}...${connectedAddress.slice(-4)}`
        : "";

    return (
        <div className="app-container">
            <div className="card">
                <div className="app-header">
                    <div>
                        <h1>Relay Interactive Sandbox</h1>
                        <p className="subtitle">
                            Test and learn Relay's cross-chain bridging with interactive examples
                        </p>
                    </div>
                    <div className="app-header-actions">
                        {authenticated && connectedAddress ? (
                            <>
                                <div className="badge-wallet">✓ {displayAddress}</div>
                                <button onClick={logout} className="btn-secondary">
                                    Disconnect
                                </button>
                            </>
                        ) : (
                            <button onClick={login} className="btn-primary">
                                Connect Wallet
                            </button>
                        )}
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
                                    className={`example-card example-card-clickable ${example.disabled ? "disabled" : ""}`}
                                    onClick={() => handleExampleClick(example)}
                                >
                                    {example.stepNumber && (
                                        <div className="example-card-step-badge">
                                            {example.stepNumber}
                                        </div>
                                    )}
                                    <h3>{example.title}</h3>
                                    <p>{example.description}</p>
                                    {example.file && (
                                        <p className="example-card-file">
                                            File: <code>{example.file}</code>
                                        </p>
                                    )}
                                    {!example.disabled && (
                                        <div className="example-card-cta">Click to Try →</div>
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
                                    className={`example-card example-card-clickable ${example.disabled ? "disabled" : ""}`}
                                    onClick={() => handleExampleClick(example)}
                                >
                                    {example.stepNumber && (
                                        <div className="example-card-step-badge">
                                            {example.stepNumber}
                                        </div>
                                    )}
                                    <h3>{example.title}</h3>
                                    <p>{example.description}</p>
                                    {example.file && (
                                        <p className="example-card-file">
                                            File: <code>{example.file}</code>
                                        </p>
                                    )}
                                    {!example.disabled && (
                                        <div className="example-card-cta">Click to Try →</div>
                                    )}
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
