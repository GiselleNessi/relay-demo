import { DynamicContextProvider, DynamicWidget, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { useState, useEffect } from "react";
import QuoteRequestEditor from "./QuoteRequestEditor";
import "./App.css";

// Using the provided Dynamic Environment ID
const DYNAMIC_ENVIRONMENT_ID = "11020ac1-9030-4e39-a2da-825f8add3e82";

// Code snippets for each step with API and SDK approaches
const getCodeSnippets = (step, accountAddress, relayResult, status) => {
    const snippets = {
        step1: {
            title: "Step 1: Wallet Connection - Foundational Setup",
            approaches: [
                {
                    label: "SDK (Dynamic)",
                    code: `// Using Dynamic SDK for wallet connection
import { DynamicContextProvider, DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";

function App() {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: "YOUR_DYNAMIC_ENVIRONMENT_ID",
        walletConnectors: [EthereumWalletConnectors],
      }}
    >
      <DynamicWidget />
    </DynamicContextProvider>
  );
}

// Access wallet in your component
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";

function MyComponent() {
  const { primaryWallet } = useDynamicContext();
  const address = primaryWallet?.address;
  return <div>Connected: {address}</div>;
}`
                },
                {
                    label: "Direct Wallet (Ethers.js)",
                    code: `// Direct wallet connection using Ethers.js
import { ethers } from "ethers";

// Connect to MetaMask or other injected providers
async function connectWallet() {
  if (window.ethereum) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    return { provider, signer, address };
  }
}

// Or use WalletConnect, Coinbase Wallet, etc.
const provider = new ethers.JsonRpcProvider("https://mainnet.infura.io/v3/YOUR_KEY");
const wallet = new ethers.Wallet("PRIVATE_KEY", provider);`
                }
            ]
        },
        step2: {
            title: "Step 2: Get Quote - Bridge/Swap Quote",
            approaches: [
                {
                    label: "API (Direct)",
                    code: `// Get quote from Relay API - Direct API call
const RELAY_API_URL = "https://api.relay.link";

const quoteRequest = {
  user: "${accountAddress || "0x..."}",
  originChainId: 8453, // Base
  destinationChainId: 42161, // Arbitrum One
  originCurrency: "0x0000000000000000000000000000000000000000", // ETH
  destinationCurrency: "0x0000000000000000000000000000000000000000", // ETH
  amount: "100000000000000", // 0.0001 ETH (18 decimals)
  tradeType: "EXACT_INPUT"
};

const response = await fetch(\`\${RELAY_API_URL}/quote/v2\`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(quoteRequest),
});

const quoteData = await response.json();
// Contains: requestId, steps[], quotes, etc.`,
                    api: relayResult?.quote ? JSON.stringify(relayResult.quote, null, 2) : null
                },
                {
                    label: "API with Gas Sponsorship",
                    code: `// Get quote with gas sponsorship (ERC-4337 Smart Accounts)
const RELAY_API_URL = "https://api.relay.link";

const quoteRequest = {
  user: "${accountAddress || "0x..."}",
  originChainId: 8453,
  destinationChainId: 42161,
  originCurrency: "0x0000000000000000000000000000000000000000",
  destinationCurrency: "0x0000000000000000000000000000000000000000",
  amount: "100000000000000",
  tradeType: "EXACT_INPUT",
  // Enable gas sponsorship
  smartAccount: {
    type: "ERC4337",
    // Optional: Specify smart account address
    // address: "0x..."
  }
};

const response = await fetch(\`\${RELAY_API_URL}/quote/v2\`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(quoteRequest),
});

const quoteData = await response.json();`
                }
            ]
        },
        step3: {
            title: "Step 3: Execute Transaction",
            approaches: [
                {
                    label: "SDK (Dynamic Wallet)",
                    code: `// Execute using Dynamic SDK
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";

const { primaryWallet } = useDynamicContext();

// Execute steps from quote
async function executeQuote(quoteData) {
  for (const step of quoteData.steps) {
    const item = step.items[0];
    
    if (step.kind === 'transaction') {
      const hash = await primaryWallet.connector.sendTransaction({
        to: item.data.to,
        data: item.data.data || "0x",
        value: BigInt(item.data.value || "0"),
        chainId: 8453,
      });
      
      const requestId = step.requestId;
      console.log(\`TX Hash: \${hash}, Request ID: \${requestId}\`);
    } else if (step.kind === 'signature') {
      // Handle signature steps
      const signature = await primaryWallet.connector.signMessage(item.data.message);
    }
  }
}`
                },
                {
                    label: "Direct Wallet (Ethers.js)",
                    code: `// Execute using Ethers.js directly
import { ethers } from "ethers";

async function executeWithEthers(quoteData, signer) {
  for (const step of quoteData.steps) {
    const item = step.items[0];
    
    if (step.kind === 'transaction') {
      const tx = {
        to: item.data.to,
        data: item.data.data || "0x",
        value: item.data.value || "0",
      };
      
      const txResponse = await signer.sendTransaction(tx);
      const receipt = await txResponse.wait();
      
      const requestId = step.requestId;
      console.log(\`TX Hash: \${receipt.hash}, Request ID: \${requestId}\`);
    }
  }
}`
                }
            ]
        },
        step4: {
            title: "Step 4: Monitor Status",
            approaches: [
                {
                    label: "API (Polling)",
                    code: `// Monitor transaction status via API
const RELAY_API_URL = "https://api.relay.link";
const requestId = "${relayResult?.requestId || "YOUR_REQUEST_ID"}";

async function monitorStatus(requestId) {
  const checkStatus = async () => {
    const response = await fetch(
      \`\${RELAY_API_URL}/intents/status/v3?requestId=\${requestId}\`
    );
    
    const statusData = await response.json();
    const currentStatus = statusData.status;
    
    // Status lifecycle: waiting → pending → success
    console.log(\`Status: \${currentStatus}\`);
    
    if (currentStatus === 'success') {
      console.log("Bridge completed!");
      return;
    }
    
    if (currentStatus === 'failure' || currentStatus === 'refund') {
      console.error(\`Transaction \${currentStatus}\`);
      return;
    }
    
    // Poll every second
    if (currentStatus === 'pending' || currentStatus === 'waiting') {
      setTimeout(checkStatus, 1000);
    }
  };
  
  checkStatus();
}

monitorStatus(requestId);`,
                    api: status ? JSON.stringify({ status, requestId: relayResult?.requestId }, null, 2) : null
                }
            ]
        },
        step5: {
            title: "Step 5: Advanced - Gas Sponsorship & Smart Accounts",
            approaches: [
                {
                    label: "Gas Sponsorship (ERC-4337)",
                    code: `// Enable gas sponsorship with ERC-4337 Smart Accounts
const RELAY_API_URL = "https://api.relay.link";

const quoteRequest = {
  user: "0x...", // User's EOA address
  originChainId: 8453,
  destinationChainId: 42161,
  originCurrency: "0x0000000000000000000000000000000000000000",
  destinationCurrency: "0x0000000000000000000000000000000000000000",
  amount: "100000000000000",
  tradeType: "EXACT_INPUT",
  smartAccount: {
    type: "ERC4337",
    // Relay will create/manage smart account
    // User doesn't need to pay gas fees
  }
};

// Get quote with gas sponsorship
const response = await fetch(\`\${RELAY_API_URL}/quote/v2\`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(quoteRequest),
});

const quoteData = await response.json();
// Execute steps - gas fees are sponsored!`
                },
                {
                    label: "EIP-7702 Support",
                    code: `// Use EIP-7702 for enhanced smart account features
const quoteRequest = {
  user: "0x...",
  originChainId: 8453,
  destinationChainId: 42161,
  originCurrency: "0x0000000000000000000000000000000000000000",
  destinationCurrency: "0x0000000000000000000000000000000000000000",
  amount: "100000000000000",
  tradeType: "EXACT_INPUT",
  smartAccount: {
    type: "EIP7702",
    // Enhanced capabilities with EIP-7702
  }
};`
                },
                {
                    label: "App Fees",
                    code: `// Add app fees to monetize your integration
const quoteRequest = {
  user: "0x...",
  originChainId: 8453,
  destinationChainId: 42161,
  originCurrency: "0x0000000000000000000000000000000000000000",
  destinationCurrency: "0x0000000000000000000000000000000000000000",
  amount: "100000000000000",
  tradeType: "EXACT_INPUT",
  // Add fee in basis points (1 bps = 0.01%)
  appFeeBps: 10, // 0.1% fee
  // Fees collected automatically in USDC
};`
                }
            ]
        }
    };

    if (step >= 5) return snippets.step5;
    if (step >= 4 && relayResult?.requestId) return snippets.step4;
    if (step >= 3 && relayResult?.quote) return snippets.step3;
    if (step >= 2) return snippets.step2;
    return snippets.step1;
};

function QuoteSummary({ quoteResponse }) {
    if (!quoteResponse || !quoteResponse.details) return null;

    const details = quoteResponse.details;
    const fees = quoteResponse.fees;
    const step = quoteResponse.steps?.[0];

    return (
        <div style={{
            marginTop: "20px",
            padding: "20px",
            background: "#0D0C0D",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "12px"
        }}>
            <h3 style={{ marginTop: 0, marginBottom: "20px", color: "#e0e0e0", fontSize: "1.2rem" }}>
                Quote Summary
            </h3>

            {/* Operation Type */}
            <div style={{ marginBottom: "15px", padding: "10px", background: "#1a1a1a", borderRadius: "8px" }}>
                <div style={{ fontSize: "0.85rem", color: "#a0a0a0", marginBottom: "5px" }}>Operation</div>
                <div style={{ fontSize: "1rem", color: "#e0e0e0", fontWeight: 600, textTransform: "capitalize" }}>
                    {details.operation || "Bridge"}
                </div>
            </div>

            {/* Input/Output */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "15px", alignItems: "center", marginBottom: "15px" }}>
                {/* Input */}
                <div style={{ padding: "15px", background: "#1a1a1a", borderRadius: "8px" }}>
                    <div style={{ fontSize: "0.85rem", color: "#a0a0a0", marginBottom: "8px" }}>You Send</div>
                    <div style={{ fontSize: "1.1rem", color: "#e0e0e0", fontWeight: 600, marginBottom: "4px" }}>
                        {details.currencyIn?.amountFormatted || "0"} {details.currencyIn?.currency?.symbol || "ETH"}
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "#a0a0a0" }}>
                        {details.currencyIn?.currency?.name || ""} on Chain {details.currencyIn?.currency?.chainId || ""}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#888", marginTop: "4px" }}>
                        ~${parseFloat(details.currencyIn?.amountUsd || 0).toFixed(4)} USD
                    </div>
                </div>

                {/* Arrow */}
                <div style={{ fontSize: "1.5rem", color: "#4615C8" }}>→</div>

                {/* Output */}
                <div style={{ padding: "15px", background: "#1a1a1a", borderRadius: "8px" }}>
                    <div style={{ fontSize: "0.85rem", color: "#a0a0a0", marginBottom: "8px" }}>You Receive</div>
                    <div style={{ fontSize: "1.1rem", color: "#51cf66", fontWeight: 600, marginBottom: "4px" }}>
                        {details.currencyOut?.amountFormatted || "0"} {details.currencyOut?.currency?.symbol || "ETH"}
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "#a0a0a0" }}>
                        {details.currencyOut?.currency?.name || ""} on Chain {details.currencyOut?.currency?.chainId || ""}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#888", marginTop: "4px" }}>
                        ~${parseFloat(details.currencyOut?.amountUsd || 0).toFixed(4)} USD
                    </div>
                </div>
            </div>

            {/* Rate & Impact */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "15px" }}>
                <div style={{ padding: "12px", background: "#1a1a1a", borderRadius: "8px" }}>
                    <div style={{ fontSize: "0.85rem", color: "#a0a0a0", marginBottom: "5px" }}>Rate</div>
                    <div style={{ fontSize: "0.95rem", color: "#e0e0e0" }}>
                        1 {details.currencyIn?.currency?.symbol || "ETH"} = {parseFloat(details.rate || 0).toFixed(4)} {details.currencyOut?.currency?.symbol || "ETH"}
                    </div>
                </div>
                <div style={{ padding: "12px", background: "#1a1a1a", borderRadius: "8px" }}>
                    <div style={{ fontSize: "0.85rem", color: "#a0a0a0", marginBottom: "5px" }}>Price Impact</div>
                    <div style={{ fontSize: "0.95rem", color: parseFloat(details.totalImpact?.percent || 0) < 0 ? "#ff6b6b" : "#51cf66" }}>
                        {details.totalImpact?.percent || "0"}%
                    </div>
                </div>
            </div>

            {/* Fees Breakdown */}
            {fees && (
                <div style={{ marginBottom: "15px" }}>
                    <div style={{ fontSize: "0.85rem", color: "#a0a0a0", marginBottom: "8px" }}>Fees</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px", fontSize: "0.85rem" }}>
                        {fees.gas && parseFloat(fees.gas.amountUsd) > 0 && (
                            <div style={{ padding: "8px", background: "#1a1a1a", borderRadius: "6px" }}>
                                <div style={{ color: "#a0a0a0" }}>Gas</div>
                                <div style={{ color: "#e0e0e0" }}>~${parseFloat(fees.gas.amountUsd).toFixed(4)}</div>
                            </div>
                        )}
                        {fees.relayer && parseFloat(fees.relayer.amountUsd) > 0 && (
                            <div style={{ padding: "8px", background: "#1a1a1a", borderRadius: "6px" }}>
                                <div style={{ color: "#a0a0a0" }}>Relayer</div>
                                <div style={{ color: "#e0e0e0" }}>~${parseFloat(fees.relayer.amountUsd).toFixed(4)}</div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Additional Info */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "15px", paddingTop: "15px", borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}>
                {details.timeEstimate && (
                    <div>
                        <div style={{ fontSize: "0.85rem", color: "#a0a0a0" }}>Estimated Time</div>
                        <div style={{ fontSize: "0.95rem", color: "#e0e0e0" }}>{details.timeEstimate} seconds</div>
                    </div>
                )}
                {step?.requestId && (
                    <div>
                        <div style={{ fontSize: "0.85rem", color: "#a0a0a0" }}>Request ID</div>
                        <div style={{ fontSize: "0.8rem", color: "#888", fontFamily: "monospace", wordBreak: "break-all" }}>
                            {step.requestId}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function JsonViewer({ title, data, isExpanded, onToggle }) {
    if (!data) return null;

    return (
        <div style={{ marginTop: "15px" }}>
            <button
                onClick={onToggle}
                style={{
                    background: "#0D0C0D",
                    border: "1px solid #4615C8",
                    color: "#e0e0e0",
                    padding: "8px 16px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    width: "100%",
                    textAlign: "left",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}
            >
                <span>{title}</span>
                <span>{isExpanded ? "▼" : "▶"}</span>
            </button>
            {isExpanded && (
                <div className="code-block api-response" style={{ marginTop: "10px" }}>
                    <pre><code>{JSON.stringify(data, null, 2)}</code></pre>
                </div>
            )}
        </div>
    );
}

function CodeSnippet({ snippetData }) {
    const [activeApproach, setActiveApproach] = useState(0);

    if (!snippetData) return null;

    const currentApproach = snippetData.approaches[activeApproach];

    return (
        <div className="code-snippet-container">
            <h3 className="code-snippet-title">{snippetData.title}</h3>

            {/* Approach Tabs */}
            {snippetData.approaches.length > 1 && (
                <div className="approach-tabs">
                    {snippetData.approaches.map((approach, index) => (
                        <button
                            key={index}
                            className={`approach-tab ${activeApproach === index ? "active" : ""}`}
                            onClick={() => setActiveApproach(index)}
                        >
                            {approach.label}
                        </button>
                    ))}
                </div>
            )}

            {/* Code Block */}
            <div className="code-block">
                <pre><code>{currentApproach.code}</code></pre>
            </div>

            {/* API Response */}
            {currentApproach.api && (
                <>
                    <h4 className="code-snippet-subtitle">API Response:</h4>
                    <div className="code-block api-response">
                        <pre><code>{currentApproach.api}</code></pre>
                    </div>
                </>
            )}
        </div>
    );
}

function AppContent() {
    const [relayResult, setRelayResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [jsonData, setJsonData] = useState({
        quoteRequest: null,
        quoteResponse: null
    });
    const [expandedJson, setExpandedJson] = useState({
        quoteRequest: false,
        quoteResponse: false
    });
    const { primaryWallet, user } = useDynamicContext();

    // Get wallet address from Dynamic
    const accountAddress = primaryWallet?.address;

    // Helper to create default quote request
    const createDefaultQuoteRequest = (address) => ({
        user: address || "YOUR_WALLET_ADDRESS",
        originChainId: 8453,
        destinationChainId: 42161,
        originCurrency: "0x0000000000000000000000000000000000000000",
        destinationCurrency: "0x0000000000000000000000000000000000000000",
        amount: "100000000000000",
        tradeType: "EXACT_INPUT"
    });

    const [quoteRequestJson, setQuoteRequestJson] = useState(() =>
        JSON.stringify(createDefaultQuoteRequest(accountAddress), null, 2)
    );

    // Update quote request template when wallet connects
    useEffect(() => {
        if (accountAddress) {
            console.log("Wallet Connected:", {
                address: accountAddress,
                walletType: primaryWallet?.connector?.name || "Unknown",
                chainId: primaryWallet?.chainId || "Unknown",
                user: user?.email || user?.username || "Unknown"
            });
            // Update user address in quote request if it's still the placeholder
            try {
                const currentRequest = JSON.parse(quoteRequestJson);
                if (currentRequest.user === "YOUR_WALLET_ADDRESS" || !currentRequest.user) {
                    setQuoteRequestJson(JSON.stringify({
                        ...currentRequest,
                        user: accountAddress
                    }, null, 2));
                }
            } catch (e) {
                // Invalid JSON, will be caught on submit
            }
        }
    }, [accountAddress, primaryWallet, user]);

    // Get Quote using editable JSON from editor
    const handleGetQuote = async () => {
        setLoading(true);
        setError(null);
        setRelayResult(null);

        try {
            // Parse the JSON from editor
            let quoteRequest;
            try {
                quoteRequest = JSON.parse(quoteRequestJson);
            } catch (parseError) {
                throw new Error("Invalid JSON in quote request. Please check your syntax.");
            }

            // Validate required fields
            if (!quoteRequest.user || quoteRequest.user === "YOUR_WALLET_ADDRESS") {
                if (!accountAddress) {
                    throw new Error("Please connect your wallet or set the 'user' field to your wallet address.");
                }
                quoteRequest.user = accountAddress;
            }

            if (!quoteRequest.originChainId || !quoteRequest.destinationChainId) {
                throw new Error("Missing required fields: originChainId and destinationChainId are required.");
            }

            if (!quoteRequest.amount || !quoteRequest.tradeType) {
                throw new Error("Missing required fields: amount and tradeType are required.");
            }

            const RELAY_API_URL = "https://api.relay.link";

            console.log("Quote Request:", {
                url: `${RELAY_API_URL}/quote/v2`,
                method: "POST",
                request: quoteRequest,
                timestamp: new Date().toISOString()
            });

            const quoteResponse = await fetch(`${RELAY_API_URL}/quote/v2`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(quoteRequest),
            });

            console.log("Quote Response:", {
                status: quoteResponse.status,
                statusText: quoteResponse.statusText,
                ok: quoteResponse.ok,
                headers: Object.fromEntries(quoteResponse.headers.entries())
            });

            if (!quoteResponse.ok) {
                const errorData = await quoteResponse.json();
                console.error("Quote Error:", errorData);
                throw new Error(errorData.message || "Failed to get quote from Relay API");
            }

            const quoteData = await quoteResponse.json();
            console.log("Quote received successfully:", {
                requestId: quoteData.requestId,
                stepsCount: quoteData.steps?.length || 0,
                steps: quoteData.steps?.map(step => ({
                    kind: step.kind,
                    itemsCount: step.items?.length || 0,
                    requestId: step.requestId
                })) || [],
                fullResponse: quoteData
            });

            // Store JSON data for UI display
            setJsonData({
                quoteRequest: quoteRequest,
                quoteResponse: quoteData
            });

            setRelayResult({
                message: "Quote Retrieved Successfully!",
                quote: quoteData,
                requestId: quoteData.requestId,
                steps: quoteData.steps,
            });
            console.log("Quote request completed successfully");
        } catch (err) {
            console.error("Quote Error Details:", {
                error: err,
                message: err.message,
                stack: err.stack,
                timestamp: new Date().toISOString()
            });
            setError(err.message || "Failed to get quote from Relay API");
        } finally {
            setLoading(false);
            console.log("Quote request finished");
        }
    };


    // Log component mount
    useEffect(() => {
        console.log("Relay API Sandbox initialized");
        console.log("Documentation: https://docs.relay.link/references/api/quickstart.md");
    }, []);

    return (
        <div className="app-container">
            <div className="card">
                <div className="logo-container">
                    <img src="/logo.svg" alt="Relay API Logo" className="logo" />
                    <h1>Relay API Sandbox</h1>
                </div>
                <p className="subtitle">
                    Interactive code editor to test and explore Relay API
                </p>

                {/* Wallet Connection */}
                <div className="connect-section">
                    <DynamicWidget />
                    {!accountAddress && (
                        <p style={{ marginTop: "15px", fontSize: "0.9rem", color: "#a0a0a0", textAlign: "center" }}>
                            Connect your wallet to auto-fill the 'user' field, or manually set it in the editor
                        </p>
                    )}
                </div>

                {/* Quote Request Editor */}
                <div className="relay-section">
                    <h2>Quote Request Editor</h2>
                    <p className="description">
                        Edit the JSON below to customize your quote request. Change amounts, chains, currencies, or add optional parameters.
                    </p>
                    <div style={{
                        marginBottom: "20px",
                        padding: "12px",
                        background: "#1a1a1a",
                        borderRadius: "8px",
                        border: "1px solid rgba(70, 21, 200, 0.3)",
                        fontSize: "0.9rem",
                        color: "#b0b0b0"
                    }}>
                        <strong style={{ color: "#e0e0e0" }}>Note:</strong> Getting a quote is a read-only API call. No transaction is sent, no wallet signature is required, and no funds are moved. The quote shows you what would happen if you execute the transaction.
                    </div>

                    <QuoteRequestEditor
                        value={quoteRequestJson}
                        onChange={(value) => setQuoteRequestJson(value || "")}
                        theme="vs-dark"
                    />

                    <div style={{
                        marginTop: "20px",
                        display: "flex",
                        gap: "10px",
                        alignItems: "stretch"
                    }}>
                        <button
                            onClick={handleGetQuote}
                            disabled={loading}
                            className="relay-button"
                            style={{ flex: 1 }}
                        >
                            {loading ? "Getting Quote..." : "Get Quote"}
                        </button>
                        <button
                            onClick={() => {
                                setQuoteRequestJson(JSON.stringify(createDefaultQuoteRequest(accountAddress), null, 2));
                            }}
                            style={{
                                background: "#1a1a1a",
                                border: "1px solid #4615C8",
                                color: "#e0e0e0",
                                borderRadius: "10px",
                                padding: "15px 24px",
                                fontSize: "1.1rem",
                                fontWeight: 600,
                                cursor: "pointer",
                                transition: "all 0.2s",
                                minWidth: "120px"
                            }}
                            onMouseEnter={(e) => {
                                if (!e.target.disabled) {
                                    e.target.style.background = "#222222";
                                    e.target.style.borderColor = "#5a2ada";
                                }
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = "#1a1a1a";
                                e.target.style.borderColor = "#4615C8";
                            }}
                        >
                            Reset
                        </button>
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className="error-message" style={{ marginTop: "20px" }}>
                            {error}
                        </div>
                    )}

                    {/* Success Message */}
                    {relayResult && (
                        <div className="success-message" style={{ marginTop: "20px" }}>
                            <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
                                {relayResult.message}
                            </div>
                            {relayResult.requestId && (
                                <div className="task-id">
                                    Request ID: {relayResult.requestId}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Quote Summary */}
                    {relayResult?.quote && (
                        <QuoteSummary quoteResponse={relayResult.quote} />
                    )}

                    {/* JSON Data Viewers */}
                    {jsonData.quoteRequest && (
                        <JsonViewer
                            title="Quote Request JSON (sent to API)"
                            data={jsonData.quoteRequest}
                            isExpanded={expandedJson.quoteRequest}
                            onToggle={() => setExpandedJson(prev => ({ ...prev, quoteRequest: !prev.quoteRequest }))}
                        />
                    )}

                    {jsonData.quoteResponse && (
                        <JsonViewer
                            title="Quote Response JSON"
                            data={jsonData.quoteResponse}
                            isExpanded={expandedJson.quoteResponse}
                            onToggle={() => setExpandedJson(prev => ({ ...prev, quoteResponse: !prev.quoteResponse }))}
                        />
                    )}
                </div>

                <div className="info-section">
                    <h3>How to Use:</h3>
                    <ol>
                        <li><strong>Connect Wallet (Optional):</strong> Connect your wallet to auto-fill the 'user' field, or manually set your wallet address</li>
                        <li><strong>Edit Quote Request:</strong> Modify the JSON in the editor above - change amounts, chains, currencies, or add optional parameters</li>
                        <li><strong>Get Quote:</strong> Click "Get Quote" to send your request to the Relay API</li>
                        <li><strong>View Results:</strong> Expand the JSON viewers below to see the request you sent and the response you received</li>
                    </ol>
                    <div style={{ marginTop: "15px", padding: "10px", background: "#1a1a1a", borderRadius: "8px", fontSize: "0.9rem", color: "#b0b0b0" }}>
                        <p style={{ margin: 0 }}>
                            <strong>Tip:</strong> Try modifying the <code>amount</code>, <code>originChainId</code>, or <code>destinationChainId</code> fields to see different quotes. Check the <a href="https://docs.relay.link/references/api/quickstart.md" target="_blank" rel="noopener noreferrer" style={{ color: "#4615C8" }}>Relay API Quickstart</a> for more examples.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function App() {
    return (
        <DynamicContextProvider
            settings={{
                environmentId: DYNAMIC_ENVIRONMENT_ID,
                walletConnectors: [EthereumWalletConnectors],
            }}
        >
            <AppContent />
        </DynamicContextProvider>
    );
}

export default App;
