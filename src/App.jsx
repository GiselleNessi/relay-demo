import { DynamicContextProvider, DynamicWidget, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { useState, useEffect } from "react";
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
      console.log("✅ Bridge completed!");
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
    const [status, setStatus] = useState(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [activeTab, setActiveTab] = useState("demo");
    const { primaryWallet, user } = useDynamicContext();

    // Get wallet address from Dynamic
    const accountAddress = primaryWallet?.address;

    // Step 1: Configure - Check if wallet is connected
    const isConfigured = !!accountAddress;

    // Log wallet connection changes
    useEffect(() => {
        if (accountAddress) {
            console.log("🔌 Wallet Connected:", {
                address: accountAddress,
                walletType: primaryWallet?.connector?.name || "Unknown",
                chainId: primaryWallet?.chainId || "Unknown",
                user: user?.email || user?.username || "Unknown"
            });
            console.log("✅ Step 1 Complete: Wallet Configured");
        } else {
            console.log("🔌 Wallet Disconnected");
            console.log("1️⃣ Step 1: Please connect wallet");
        }
    }, [accountAddress, primaryWallet, user]);

    // Log step changes
    useEffect(() => {
        console.log(`📍 Current Step: ${currentStep}`, {
            isConfigured,
            hasQuote: !!relayResult?.quote,
            hasTxHash: !!relayResult?.txHash,
            status: status || "none",
            requestId: relayResult?.requestId || "none"
        });
    }, [currentStep, isConfigured, relayResult, status]);

    // Step 4: Monitor Status
    const monitorStatus = async (requestId) => {
        if (!requestId) {
            console.warn("⚠️ Cannot monitor status: No requestId provided");
            return;
        }

        console.log("🔍 Step 4: Starting Status Monitoring...");
        console.log(`📋 Request ID: ${requestId}`);

        const RELAY_API_URL = "https://api.relay.link";
        const maxAttempts = 60;
        let attempts = 0;

        const checkStatus = async () => {
            try {
                const statusUrl = `${RELAY_API_URL}/intents/status/v3?requestId=${requestId}`;
                console.log(`📡 Checking status (Attempt ${attempts + 1}/${maxAttempts}):`, {
                    url: statusUrl,
                    timestamp: new Date().toISOString()
                });

                const response = await fetch(statusUrl);

                if (!response.ok) {
                    console.error("❌ Status check failed:", {
                        status: response.status,
                        statusText: response.statusText
                    });
                    throw new Error("Failed to check status");
                }

                const statusData = await response.json();
                const currentStatus = statusData.status;
                setStatus(currentStatus);

                console.log(`📊 Status Update:`, {
                    status: currentStatus,
                    attempt: attempts + 1,
                    requestId: requestId,
                    fullResponse: statusData,
                    timestamp: new Date().toISOString()
                });

                if (currentStatus === 'waiting') {
                    console.log("⏳ Status: waiting - User submitted deposit transaction, waiting for indexing");
                } else if (currentStatus === 'pending') {
                    console.log("⏳ Status: pending - Deposit indexed, Relay Solver preparing fill transaction");
                } else if (currentStatus === 'success') {
                    console.log("🎉 SUCCESS! Status: success - Relay Solver executed Fill Tx, funds reached recipient!");
                    setRelayResult(prev => ({
                        ...prev,
                        message: "🎉 Step 4 Complete: Bridge Completed Successfully!",
                    }));
                    setCurrentStep(5);
                    console.log("✅ Step 4 Complete: Moving to Step 5 (Optimize)");
                    return;
                }

                if (currentStatus === 'failure' || currentStatus === 'refund') {
                    console.error(`❌ Transaction ${currentStatus}:`, {
                        status: currentStatus,
                        requestId: requestId,
                        timestamp: new Date().toISOString()
                    });
                    setError(`Transaction ${currentStatus}`);
                    return;
                }

                attempts++;
                if (attempts < maxAttempts && (currentStatus === 'pending' || currentStatus === 'waiting')) {
                    console.log(`⏭️ Will check again in 1 second... (${attempts}/${maxAttempts} attempts)`);
                    setTimeout(checkStatus, 1000);
                } else if (attempts >= maxAttempts) {
                    console.warn("⚠️ Max attempts reached for status monitoring");
                }
            } catch (err) {
                console.error("❌ Status check error:", {
                    error: err,
                    message: err.message,
                    attempt: attempts + 1,
                    requestId: requestId,
                    timestamp: new Date().toISOString()
                });
            }
        };

        console.log("⏰ Waiting 2 seconds before first status check...");
        setTimeout(checkStatus, 2000);
    };

    // Step 2: Get Quote
    const handleGetQuote = async () => {
        if (!accountAddress) {
            console.warn("⚠️ Cannot get quote: Wallet not connected");
            setError("Please connect your wallet first (Step 1: Configure).");
            return;
        }

        console.log("🚀 Step 2: Starting Quote Request...");
        setLoading(true);
        setError(null);
        setRelayResult(null);
        setStatus(null);
        setCurrentStep(2);

        try {
            const RELAY_API_URL = "https://api.relay.link";

            const quoteRequest = {
                user: accountAddress,
                originChainId: 8453,
                destinationChainId: 42161,
                originCurrency: "0x0000000000000000000000000000000000000000",
                destinationCurrency: "0x0000000000000000000000000000000000000000",
                amount: "100000000000000",
                tradeType: "EXACT_INPUT"
            };

            console.log("📤 Quote Request:", {
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

            console.log("📥 Quote Response:", {
                status: quoteResponse.status,
                statusText: quoteResponse.statusText,
                ok: quoteResponse.ok,
                headers: Object.fromEntries(quoteResponse.headers.entries())
            });

            if (!quoteResponse.ok) {
                const errorData = await quoteResponse.json();
                console.error("❌ Quote Error:", errorData);
                throw new Error(errorData.message || "Failed to get quote from Relay API");
            }

            const quoteData = await quoteResponse.json();
            console.log("✅ Quote received successfully:", {
                requestId: quoteData.requestId,
                stepsCount: quoteData.steps?.length || 0,
                steps: quoteData.steps?.map(step => ({
                    kind: step.kind,
                    itemsCount: step.items?.length || 0,
                    requestId: step.requestId
                })) || [],
                fullResponse: quoteData
            });

            setRelayResult({
                message: "✅ Step 2 Complete: Quote Retrieved!",
                quote: quoteData,
                requestId: quoteData.requestId,
                steps: quoteData.steps,
            });
            setCurrentStep(3);
            console.log("✅ Step 2 Complete: Moving to Step 3 (Execute)");
        } catch (err) {
            console.error("❌ Quote Error Details:", {
                error: err,
                message: err.message,
                stack: err.stack,
                timestamp: new Date().toISOString()
            });
            setError(err.message || "Failed to get quote from Relay API");
            setCurrentStep(1);
        } finally {
            setLoading(false);
            console.log("🏁 Quote request finished");
        }
    };

    // Step 3: Execute Transaction
    const handleExecute = async () => {
        if (!relayResult?.quote || !primaryWallet) {
            console.warn("⚠️ Cannot execute: Missing quote or wallet", {
                hasQuote: !!relayResult?.quote,
                hasWallet: !!primaryWallet,
                accountAddress: accountAddress || "none"
            });
            setError("Please get a quote first (Step 2) and ensure wallet is connected.");
            return;
        }

        console.log("🚀 Step 3: Starting Transaction Execution...");
        setLoading(true);
        setError(null);
        setCurrentStep(3);

        try {
            const quote = relayResult.quote;
            let requestId = null;

            console.log("📋 Execution Details:", {
                stepsCount: quote.steps?.length || 0,
                requestId: quote.requestId,
                wallet: {
                    address: accountAddress,
                    connector: primaryWallet?.connector?.name || "Unknown",
                    chainId: primaryWallet?.chainId || "Unknown"
                }
            });

            // Get the signer/provider from Dynamic wallet
            if (!primaryWallet) {
                console.error("❌ Wallet not available");
                throw new Error("Wallet not available");
            }

            console.log("🔄 Processing steps...");
            for (let i = 0; i < quote.steps.length; i++) {
                const step = quote.steps[i];
                const item = step.items[0];

                console.log(`📝 Processing step ${i + 1}/${quote.steps.length}:`, {
                    kind: step.kind,
                    requestId: step.requestId,
                    item: {
                        to: item?.data?.to,
                        value: item?.data?.value,
                        hasData: !!item?.data?.data
                    }
                });

                if (step.kind === 'transaction') {
                    console.log("💳 Executing transaction step...");

                    const txParams = {
                        to: item.data.to,
                        data: item.data.data || "0x",
                        value: BigInt(item.data.value || "0"),
                        chainId: 8453,
                    };

                    console.log("📤 Sending transaction:", {
                        ...txParams,
                        value: txParams.value.toString(),
                        walletMethod: primaryWallet.sendTransaction ? "sendTransaction" : "Using connector"
                    });

                    // Try different methods to send transaction with Dynamic SDK
                    let hash;

                    // Log available methods for debugging
                    console.log("🔍 Available wallet methods:", {
                        hasSendTransaction: !!primaryWallet.sendTransaction,
                        hasConnector: !!primaryWallet.connector,
                        connectorType: primaryWallet.connector?.constructor?.name,
                        connectorMethods: primaryWallet.connector ? Object.keys(primaryWallet.connector) : [],
                        walletMethods: Object.keys(primaryWallet)
                    });

                    if (typeof primaryWallet.sendTransaction === 'function') {
                        // Direct method on wallet
                        hash = await primaryWallet.sendTransaction(txParams);
                    } else if (primaryWallet.connector?.provider) {
                        // Use provider/signer pattern (common with Dynamic SDK)
                        try {
                            const provider = primaryWallet.connector.provider;
                            // For ethers v6
                            if (provider.getSigner) {
                                const signer = await provider.getSigner();
                                const txResponse = await signer.sendTransaction({
                                    to: item.data.to,
                                    data: item.data.data || "0x",
                                    value: item.data.value || "0",
                                });
                                hash = txResponse.hash;
                            }
                            // For ethers v5 or other providers
                            else if (provider.getSigner && typeof provider.getSigner === 'function') {
                                const signer = provider.getSigner();
                                const txResponse = await signer.sendTransaction({
                                    to: item.data.to,
                                    data: item.data.data || "0x",
                                    value: item.data.value || "0",
                                });
                                hash = txResponse.hash;
                            }
                            // Try direct sendTransaction on provider
                            else if (typeof provider.sendTransaction === 'function') {
                                const txResponse = await provider.sendTransaction({
                                    to: item.data.to,
                                    data: item.data.data || "0x",
                                    value: item.data.value || "0",
                                });
                                hash = txResponse.hash;
                            } else {
                                throw new Error("Provider doesn't support sendTransaction");
                            }
                        } catch (providerError) {
                            console.error("❌ Provider method failed:", providerError);
                            throw providerError;
                        }
                    } else if (typeof primaryWallet.connector?.sendTransaction === 'function') {
                        // Fallback to connector method if it exists
                        hash = await primaryWallet.connector.sendTransaction(txParams);
                    } else {
                        const errorMsg = "No transaction method available. Wallet methods: " + Object.keys(primaryWallet).join(", ");
                        console.error("❌", errorMsg);
                        throw new Error(errorMsg);
                    }
                    requestId = step.requestId;

                    console.log("✅ Transaction sent successfully:", {
                        txHash: hash,
                        requestId: requestId,
                        timestamp: new Date().toISOString(),
                        explorerUrl: `https://basescan.org/tx/${hash}`
                    });

                    setRelayResult(prev => ({
                        ...prev,
                        message: "✅ Step 3 Complete: Transaction Submitted!",
                        txHash: hash,
                        requestId: requestId,
                    }));

                    setCurrentStep(4);
                    console.log("✅ Step 3 Complete: Moving to Step 4 (Monitor Status)");

                    if (requestId) {
                        console.log("🔍 Starting status monitoring for requestId:", requestId);
                        monitorStatus(requestId);
                    }
                } else if (step.kind === 'signature') {
                    console.log("✍️ Step Kind: signature - Signature step detected");
                }
            }
        } catch (err) {
            console.error("❌ Execution Error Details:", {
                error: err,
                message: err.message,
                stack: err.stack,
                timestamp: new Date().toISOString()
            });
            setError(err.message || "Failed to execute transaction");
            setCurrentStep(2);
        } finally {
            setLoading(false);
            console.log("🏁 Transaction execution finished");
        }
    };

    // Log tab changes
    useEffect(() => {
        console.log(`📑 Tab switched to: ${activeTab}`);
    }, [activeTab]);

    // Log component mount
    useEffect(() => {
        console.log("🚀 Relay API Sandbox initialized");
        console.log("📚 Documentation: https://docs.relay.link/references/api/quickstart.md");
    }, []);

    const codeSnippet = getCodeSnippets(currentStep, accountAddress, relayResult, status);

    return (
        <div className="app-container">
            <div className="card">
                <div className="logo-container">
                    <img src="/logo.svg" alt="Relay API Logo" className="logo" />
                    <h1>Relay API Sandbox</h1>
                </div>
                <p className="subtitle">
                    Test the API, SDK, and explore code snippets
                </p>

                {/* Tabs */}
                <div className="tabs">
                    <button
                        className={`tab ${activeTab === "demo" ? "active" : ""}`}
                        onClick={() => setActiveTab("demo")}
                    >
                        🎮 Live Demo
                    </button>
                    <button
                        className={`tab ${activeTab === "code" ? "active" : ""}`}
                        onClick={() => setActiveTab("code")}
                    >
                        💻 Code Snippets
                    </button>
                </div>

                {activeTab === "demo" && (
                    <>
                        <div className="connect-section">
                            <DynamicWidget />
                            {!accountAddress && (
                                <p style={{ marginTop: "15px", fontSize: "0.9rem", color: "#a0a0a0", textAlign: "center" }}>
                                    Click the button above to connect your wallet or sign up with email/social
                                </p>
                            )}
                        </div>

                        <div className="relay-section">
                            <h2>Relay API Quickstart - 5-Step Flow</h2>
                            <p className="description">
                                Bridge 0.0001 ETH from Base to Arbitrum using Relay API.
                            </p>

                            {/* Step Progress Indicator */}
                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: "20px",
                                padding: "15px",
                                background: "#0D0C0D",
                                borderRadius: "10px",
                                fontSize: "0.9rem",
                                border: "1px solid #0D0C0D"
                            }}>
                                <div style={{ textAlign: "center", flex: 1 }}>
                                    <div style={{
                                        fontWeight: currentStep >= 1 ? "bold" : "normal",
                                        color: currentStep >= 1 ? "#4615C8" : "#707070"
                                    }}>
                                        {isConfigured ? "✅" : "1️⃣"} Configure
                                    </div>
                                </div>
                                <div style={{ textAlign: "center", flex: 1 }}>
                                    <div style={{
                                        fontWeight: currentStep >= 2 ? "bold" : "normal",
                                        color: currentStep >= 2 ? "#7c8cf8" : "#707070"
                                    }}>
                                        {relayResult?.quote ? "✅" : "2️⃣"} Quote
                                    </div>
                                </div>
                                <div style={{ textAlign: "center", flex: 1 }}>
                                    <div style={{
                                        fontWeight: currentStep >= 3 ? "bold" : "normal",
                                        color: currentStep >= 3 ? "#7c8cf8" : "#707070"
                                    }}>
                                        {relayResult?.txHash ? "✅" : "3️⃣"} Execute
                                    </div>
                                </div>
                                <div style={{ textAlign: "center", flex: 1 }}>
                                    <div style={{
                                        fontWeight: currentStep >= 4 ? "bold" : "normal",
                                        color: currentStep >= 4 ? "#7c8cf8" : "#707070"
                                    }}>
                                        {status === 'success' ? "✅" : status ? "⏳" : "4️⃣"} Monitor
                                    </div>
                                </div>
                                <div style={{ textAlign: "center", flex: 1 }}>
                                    <div style={{
                                        fontWeight: currentStep >= 5 ? "bold" : "normal",
                                        color: currentStep >= 5 ? "#7c8cf8" : "#707070"
                                    }}>
                                        {currentStep >= 5 ? "✅" : "5️⃣"} Optimize
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                <button
                                    onClick={handleGetQuote}
                                    disabled={loading || !accountAddress}
                                    className="relay-button"
                                >
                                    {loading && currentStep === 2 ? "Getting Quote..." : accountAddress ? "2. Get Quote" : "1. Connect Wallet First"}
                                </button>

                                {relayResult?.quote && (
                                    <button
                                        onClick={handleExecute}
                                        disabled={loading || !primaryWallet}
                                        className="relay-button"
                                        style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)" }}
                                    >
                                        {loading && currentStep === 3 ? "Executing..." : "3. Execute Bridge"}
                                    </button>
                                )}
                            </div>

                            {error && (
                                <div className="error-message">
                                    ⚠️ {error}
                                </div>
                            )}

                            {relayResult && (
                                <div className="success-message">
                                    <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
                                        {relayResult.message}
                                    </div>
                                    {relayResult.requestId && (
                                        <div className="task-id">
                                            Request ID: {relayResult.requestId}
                                        </div>
                                    )}
                                    {relayResult.txHash && (
                                        <div className="task-id">
                                            TX Hash: {relayResult.txHash}
                                        </div>
                                    )}
                                    {status && (
                                        <div className="task-id" style={{ marginTop: "8px", color: "#51cf66" }}>
                                            Status: {status}
                                            {status === 'waiting' && " - Deposit submitted, waiting for indexing"}
                                            {status === 'pending' && " - Deposit indexed, preparing fill transaction"}
                                            {status === 'success' && " - Bridge completed successfully!"}
                                        </div>
                                    )}
                                </div>
                            )}

                            {currentStep >= 5 && (
                                <div style={{
                                    marginTop: "20px",
                                    padding: "15px",
                                    background: "#0D0C0D",
                                    border: "2px solid #3b82f6",
                                    borderRadius: "10px"
                                }}>
                                    <h3 style={{ marginTop: 0, color: "#60a5fa" }}>🎉 Step 5: Optimize</h3>
                                    <p style={{ marginBottom: "10px", color: "#93c5fd" }}>
                                        You've successfully executed your first cross-chain transaction with Relay!
                                    </p>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {activeTab === "code" && (
                    <div className="code-section">
                        <CodeSnippet snippetData={codeSnippet} />
                        <div style={{ marginTop: "20px", padding: "15px", background: "#0D0C0D", borderRadius: "10px", fontSize: "0.9rem", color: "#b0b0b0", border: "1px solid #0D0C0D" }}>
                            <p style={{ margin: 0 }}>
                                💡 <strong>Tip:</strong> Switch to "Live Demo" to test the API and SDK in real-time. The code snippets update based on your current step. Use the approach tabs above to see different implementation methods.
                            </p>
                        </div>
                    </div>
                )}

                <div className="info-section">
                    <h3>Relay API Quickstart - 5 Steps:</h3>
                    <ol>
                        <li><strong>Configure:</strong> Connect wallet with ETH on Base (~$2 USD). Base URL: https://api.relay.link</li>
                        <li><strong>Quote:</strong> Call `/quote/v2` endpoint to get transaction data and steps array.</li>
                        <li><strong>Execute:</strong> Iterate through steps array. Check step.kind and submit using your wallet.</li>
                        <li><strong>Monitor:</strong> Poll `/intents/status/v3` with requestId every second.</li>
                        <li><strong>Optimize:</strong> Add App Fees, Smart Accounts, Transaction Indexing</li>
                    </ol>
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
