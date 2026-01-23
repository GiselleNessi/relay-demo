import "./App.css";

// This is the app that runs in CodeSandbox
// It shows all available examples organized by category

interface Example {
    id: string;
    title: string;
    description: string;
    file?: string; // Path to example file
    disabled?: boolean;
}

function App() {
    const examples: { api: Example[]; sdk: Example[]; more: Example[] } = {
        api: [
            {
                id: "get-quote",
                title: "Get Quote",
                description: "Get a quote for cross-chain bridging using the Relay API",
                file: "src/examples/api/get-quote.tsx"
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
                            Direct API integration examples using fetch and REST endpoints
                        </p>
                        <div className="examples-list">
                            {examples.api.map((example) => (
                                <div
                                    key={example.id}
                                    className={`example-card ${example.disabled ? "disabled" : ""}`}
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
