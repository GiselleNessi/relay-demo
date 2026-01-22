import "./App.css";

function App() {
    // Simple landing page - just title and button to open CodeSandbox
    const handleOpenCodeSandbox = async () => {
        // Call the openCodeSandbox function that's defined later in this file
        try {
            await openCodeSandbox();
        } catch (error) {
            console.error("Failed to open CodeSandbox:", error);
            // Fallback: open a new CodeSandbox
            window.open('https://codesandbox.io/s/new?file=/README.md', '_blank');
        }
    };

    return (
        <div className="app-container">
            <div className="card">
                <div className="logo-container">
                    <h1>Relay API Demo</h1>
                    <p className="subtitle">
                        Interactive demo for Relay API
                    </p>
                </div>

                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "20px",
                    padding: "40px 20px"
                }}>
                    <p style={{
                        color: "#b0b0b0",
                        fontSize: "1.1rem",
                        textAlign: "center",
                        maxWidth: "600px",
                        lineHeight: "1.6"
                    }}>
                        Click the button below to open the full interactive demo in CodeSandbox.
                        The demo includes a quote editor, transaction execution, and status monitoring.
                    </p>

                    <button
                        onClick={handleOpenCodeSandbox}
                        className="relay-button"
                        style={{
                            padding: "20px 40px",
                            fontSize: "1.2rem",
                            maxWidth: "400px"
                        }}
                    >
                        Open CodeSandbox Demo
                    </button>
                </div>
            </div>
        </div>
    );
}

// Function to create and open CodeSandbox with Relay API "Get Quote" example
const openCodeSandbox = async () => {
    try {
        console.log("Creating CodeSandbox with Relay API Get Quote example...");

        // App.js - Main component with quote example
        const appJs = `import { useState } from "react";
import "./App.css";

const RELAY_API_URL = "https://api.relay.link";

function App() {
  const [quoteRequest, setQuoteRequest] = useState({
    user: "", // Enter your wallet address (0x...)
    originChainId: 8453, // Base
    destinationChainId: 42161, // Arbitrum One
    originCurrency: "0x0000000000000000000000000000000000000000", // ETH
    destinationCurrency: "0x0000000000000000000000000000000000000000", // ETH
    amount: "100000000000000", // 0.0001 ETH (18 decimals)
    tradeType: "EXACT_INPUT"
  });

  const [loading, setLoading] = useState(false);
  const [quoteResponse, setQuoteResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleGetQuote = async () => {
    // Validate wallet address
    if (!quoteRequest.user || quoteRequest.user.trim() === "") {
      setError("Please enter your wallet address");
      return;
    }

    // Basic address validation (should start with 0x and be 42 characters)
    if (!quoteRequest.user.startsWith("0x") || quoteRequest.user.length !== 42) {
      setError("Invalid wallet address. Please enter a valid Ethereum address (0x...).");
      return;
    }

    setLoading(true);
    setError(null);
    setQuoteResponse(null);

    try {
      const response = await fetch(\`\${RELAY_API_URL}/quote/v2\`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(quoteRequest),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to get quote");
      }

      const data = await response.json();
      setQuoteResponse(data);
      console.log("Quote received:", data);
    } catch (err) {
      setError(err.message);
      console.error("Quote error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="card">
        <h1>Relay API - Get Quote Example</h1>
        <p className="subtitle">
          Bridge 0.0001 ETH from Base to Arbitrum One
        </p>

        <div className="form-section">
          <h2>Quote Request</h2>
          <div className="form-group">
            <label>User Address (Required):</label>
            <input
              type="text"
              value={quoteRequest.user}
              onChange={(e) =>
                setQuoteRequest({ ...quoteRequest, user: e.target.value.trim() })
              }
              placeholder="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
              style={{
                borderColor: !quoteRequest.user || quoteRequest.user.length !== 42 
                  ? "rgba(255, 107, 107, 0.5)" 
                  : "rgba(255, 255, 255, 0.1)"
              }}
            />
            {!quoteRequest.user && (
              <small style={{ color: "#ff6b6b", marginTop: "5px", display: "block" }}>
                Please enter a valid Ethereum wallet address
              </small>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Origin Chain ID:</label>
              <input
                type="number"
                value={quoteRequest.originChainId}
                onChange={(e) =>
                  setQuoteRequest({
                    ...quoteRequest,
                    originChainId: parseInt(e.target.value),
                  })
                }
              />
            </div>

            <div className="form-group">
              <label>Destination Chain ID:</label>
              <input
                type="number"
                value={quoteRequest.destinationChainId}
                onChange={(e) =>
                  setQuoteRequest({
                    ...quoteRequest,
                    destinationChainId: parseInt(e.target.value),
                  })
                }
              />
            </div>
          </div>

          <div className="form-group">
            <label>Amount (wei):</label>
            <input
              type="text"
              value={quoteRequest.amount}
              onChange={(e) =>
                setQuoteRequest({ ...quoteRequest, amount: e.target.value })
              }
            />
          </div>

          <button
            onClick={handleGetQuote}
            disabled={loading}
            className="primary-button"
          >
            {loading ? "Getting Quote..." : "Get Quote"}
          </button>
        </div>

        {error && (
          <div className="error-box">
            <strong>Error:</strong> {error}
          </div>
        )}

        {quoteResponse && (
          <div className="response-section">
            <h2>Quote Response</h2>
            <div className="quote-summary">
              <div className="summary-item">
                <span className="label">Operation:</span>
                <span className="value">
                  {quoteResponse.details?.operation || "N/A"}
                </span>
              </div>
              <div className="summary-item">
                <span className="label">You Send:</span>
                <span className="value">
                  {quoteResponse.details?.currencyIn?.amountFormatted || quoteResponse.details?.currencyIn?.amount || "0"} ETH (Chain{" "}
                  {quoteResponse.details?.currencyIn?.currency?.chainId})
                </span>
              </div>
              <div className="summary-item">
                <span className="label">You Receive:</span>
                <span className="value">
                  {quoteResponse.details?.currencyOut?.amountFormatted || quoteResponse.details?.currencyOut?.amount || "0"} ETH (Chain{" "}
                  {quoteResponse.details?.currencyOut?.currency?.chainId})
                </span>
              </div>
              {quoteResponse.details?.rate && (
                <div className="summary-item">
                  <span className="label">Rate:</span>
                  <span className="value">
                    1 ETH = {parseFloat(quoteResponse.details.rate).toFixed(6)} ETH
                  </span>
                </div>
              )}
              {quoteResponse.details?.totalImpact?.percent && (
                <div className="summary-item">
                  <span className="label">Price Impact:</span>
                  <span className="value" style={{
                    color: parseFloat(quoteResponse.details.totalImpact.percent) < 0 ? "#ff6b6b" : "#51cf66"
                  }}>
                    {quoteResponse.details.totalImpact.percent}%
                  </span>
                </div>
              )}
              <div className="summary-item">
                <span className="label">Gas Fee:</span>
                <span className="value">
                  ~$
                  {quoteResponse.fees?.gas?.amountUsd || "0.00"} USD
                </span>
              </div>
              <div className="summary-item">
                <span className="label">Relayer Fee:</span>
                <span className="value">
                  ~$
                  {quoteResponse.fees?.relayer?.amountUsd || "0.00"} USD
                </span>
              </div>
              <div className="summary-item">
                <span className="label">Request ID:</span>
                <span className="value request-id">
                  {quoteResponse.steps?.[0]?.requestId || quoteResponse.requestId || "N/A"}
                </span>
              </div>
            </div>

            <details className="json-viewer">
              <summary>View Full JSON Response</summary>
              <pre>{JSON.stringify(quoteResponse, null, 2)}</pre>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;`;

        // App.css - Styling
        const appCss = `.app-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background: #0a0a0a;
}

.card {
  background: #0D0C0D;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
  max-width: 800px;
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

h1 {
  color: #e0e0e0;
  font-size: 2rem;
  margin-bottom: 10px;
  text-align: center;
}

.subtitle {
  color: #a0a0a0;
  text-align: center;
  margin-bottom: 30px;
  font-size: 1rem;
}

.form-section {
  margin-bottom: 30px;
}

.form-section h2 {
  color: #e0e0e0;
  font-size: 1.3rem;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  color: #b0b0b0;
  margin-bottom: 5px;
  font-size: 0.9rem;
}

.form-group input {
  width: 100%;
  padding: 12px;
  background: #1a1a1a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #e0e0e0;
  font-size: 1rem;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #4615C8;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.primary-button {
  width: 100%;
  padding: 15px 30px;
  background: #4615C8;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  margin-top: 10px;
}

.primary-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(70, 21, 200, 0.4);
}

.primary-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-box {
  margin-top: 20px;
  padding: 15px;
  background: #3d1f1f;
  border: 1px solid #5a2a2a;
  border-radius: 8px;
  color: #ff6b6b;
}

.response-section {
  margin-top: 30px;
}

.response-section h2 {
  color: #e0e0e0;
  font-size: 1.3rem;
  margin-bottom: 20px;
}

.quote-summary {
  background: #1a1a1a;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.summary-item:last-child {
  border-bottom: none;
}

.summary-item .label {
  color: #a0a0a0;
  font-weight: 500;
}

.summary-item .value {
  color: #e0e0e0;
  font-weight: 600;
}

.summary-item .value.request-id {
  font-family: monospace;
  font-size: 0.85rem;
  word-break: break-all;
  text-align: right;
}

.json-viewer {
  margin-top: 20px;
}

.json-viewer summary {
  color: #4615C8;
  cursor: pointer;
  padding: 10px;
  background: #1a1a1a;
  border-radius: 8px;
  margin-bottom: 10px;
}

.json-viewer pre {
  background: #0D0C0D;
  padding: 15px;
  border-radius: 8px;
  overflow-x: auto;
  color: #e0e0e0;
  font-size: 0.85rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}`;

        // index.js - Entry point
        const indexJs = `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`;

        // index.css - Global styles
        const indexCss = `body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #0a0a0a;
  color: #e0e0e0;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}`;

        // package.json
        const packageJson = JSON.stringify({
            name: "relay-api-get-quote",
            version: "0.1.0",
            private: true,
            dependencies: {
                react: "^18.2.0",
                "react-dom": "^18.2.0",
                "react-scripts": "5.0.1"
            },
            scripts: {
                start: "react-scripts start",
                build: "react-scripts build",
                test: "react-scripts test",
                eject: "react-scripts eject"
            },
            browserslist: {
                production: [
                    ">0.2%",
                    "not dead",
                    "not op_mini all"
                ],
                development: [
                    "last 1 chrome version",
                    "last 1 firefox version",
                    "last 1 safari version"
                ]
            }
        }, null, 2);

        // README.md
        const readmeMd = `# Relay API - Get Quote Example

This example demonstrates how to get a quote from the Relay API for cross-chain bridging.

## Quick Start

1. Replace \`YOUR_WALLET_ADDRESS\` in the form with your actual wallet address
2. Click "Get Quote" to fetch a quote from Relay API
3. View the quote details including fees, amounts, and request ID

## What is a Quote?

Every action in Relay starts with a Quote. The quote endpoint:
- Calculates fees
- Finds the best route
- Generates transaction data
- Returns a \`requestId\` for tracking

## Example Request

This example bridges 0.0001 ETH from Base (Chain ID 8453) to Arbitrum One (Chain ID 42161).

## Learn More

- [Relay API Documentation](https://docs.relay.link/references/api/quickstart.md)
- [Relay API Quickstart](https://docs.relay.link/references/api/quickstart.md)

## Next Steps

After getting a quote, you can:
1. Execute the transaction using the data from the quote
2. Monitor the transaction status using the \`requestId\``;

        // public/index.html
        const indexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Relay API - Get Quote Example</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`;

        // .codesandbox/tasks.json - Auto-start configuration
        const tasksJson = JSON.stringify({
            setupTasks: [
                {
                    name: "Install Dependencies",
                    command: "npm install"
                }
            ],
            tasks: {
                start: {
                    name: "start",
                    command: "npm start",
                    runAtStart: true,
                    preview: {
                        port: 3000,
                        onReady: "when-initialized"
                    }
                }
            }
        }, null, 2);

        // .codesandbox/template.json
        const templateJson = JSON.stringify({
            title: "Relay API - Get Quote Example",
            description: "Example demonstrating how to get a quote from Relay API for cross-chain bridging",
            tags: ["react", "javascript", "relay-api", "web3", "cross-chain"],
            published: false
        }, null, 2);

        // Create CodeSandbox sandbox definition
        const sandboxDefinition = {
            template: "create-react-app",
            files: {
                "src/App.js": {
                    content: appJs,
                    isBinary: false
                },
                "src/App.css": {
                    content: appCss,
                    isBinary: false
                },
                "src/index.js": {
                    content: indexJs,
                    isBinary: false
                },
                "src/index.css": {
                    content: indexCss,
                    isBinary: false
                },
                "public/index.html": {
                    content: indexHtml,
                    isBinary: false
                },
                "package.json": {
                    content: packageJson,
                    isBinary: false
                },
                "README.md": {
                    content: readmeMd,
                    isBinary: false
                },
                ".codesandbox/tasks.json": {
                    content: tasksJson,
                    isBinary: false
                },
                ".codesandbox/template.json": {
                    content: templateJson,
                    isBinary: false
                }
            }
        };

        // Create CodeSandbox using POST API
        const response = await fetch(
            "https://codesandbox.io/api/v1/sandboxes/define?json=1",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(sandboxDefinition),
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const codesandboxUrl = `https://codesandbox.io/s/${data.sandbox_id}?file=/README.md&runonclick=1`;
        window.open(codesandboxUrl, "_blank");
        console.log("CodeSandbox created:", codesandboxUrl);
    } catch (error) {
        console.error("Failed to create CodeSandbox:", error);
        // Fallback: open a new sandbox
        window.open(
            "https://codesandbox.io/s/new?file=/README.md",
            "_blank"
        );
    }
};

export default App;
