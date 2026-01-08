import { DynamicContextProvider, DynamicWidget, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { useState } from "react";
import "./App.css";

// Using the provided Dynamic Environment ID
const DYNAMIC_ENVIRONMENT_ID = "11020ac1-9030-4e39-a2da-825f8add3e82";

function AppContent() {
    const [relayResult, setRelayResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState(null);
    const [currentStep, setCurrentStep] = useState(1); // Track which step we're on
    const { primaryWallet, user } = useDynamicContext();

    // Get wallet address from Dynamic
    const accountAddress = primaryWallet?.address;

    // Step 1: Configure - Check if wallet is connected
    const isConfigured = !!accountAddress;

    // Step 4: Monitor Status
    const monitorStatus = async (requestId) => {
        if (!requestId) return;

        console.log("🚀 Step 4: Monitoring transaction status...");
        console.log(`Request ID: ${requestId}`);

        const RELAY_API_URL = "https://api.relay.link";
        const maxAttempts = 60; // Poll for up to 60 seconds
        let attempts = 0;

        const checkStatus = async () => {
            try {
                // Use the status endpoint with the requestId
                const response = await fetch(
                    `${RELAY_API_URL}/intents/status/v3?requestId=${requestId}`
                );

                if (!response.ok) {
                    throw new Error("Failed to check status");
                }

                const statusData = await response.json();
                const currentStatus = statusData.status;
                setStatus(currentStatus);
                console.log(`Status: ${currentStatus}`);

                // Status Lifecycle: waiting → pending → success
                if (currentStatus === 'waiting') {
                    console.log("⏳ Status: waiting - User submitted deposit transaction, waiting for indexing");
                } else if (currentStatus === 'pending') {
                    console.log("⏳ Status: pending - Deposit indexed, Relay Solver preparing fill transaction");
                } else if (currentStatus === 'success') {
                    console.log("✅ Status: success - Relay Solver executed Fill Tx, funds reached recipient!");
                    setRelayResult(prev => ({
                        ...prev,
                        message: "🎉 Step 4 Complete: Bridge Completed Successfully!",
                    }));
                    setCurrentStep(5);
                    return;
                }

                if (currentStatus === 'failure' || currentStatus === 'refund') {
                    setError(`Transaction ${currentStatus}`);
                    return;
                }

                // Poll this endpoint once per second (as per Relay API Quickstart Tip)
                attempts++;
                if (attempts < maxAttempts && (currentStatus === 'pending' || currentStatus === 'waiting')) {
                    setTimeout(checkStatus, 1000); // Poll every second
                }
            } catch (err) {
                console.error("Status check error:", err);
            }
        };

        // Start polling after a short delay
        setTimeout(checkStatus, 2000);
    };

    // Step 2: Get Quote
    const handleGetQuote = async () => {
        if (!accountAddress) {
            setError("Please connect your wallet first (Step 1: Configure).");
            return;
        }

        setLoading(true);
        setError(null);
        setRelayResult(null);
        setStatus(null);
        setCurrentStep(2);

        try {
            const RELAY_API_URL = "https://api.relay.link";

            // Example: Bridge 0.0001 ETH from Base to Arbitrum
            // This matches the Relay API Quickstart example
            const quoteRequest = {
                user: accountAddress,
                originChainId: 8453, // Base
                destinationChainId: 42161, // Arbitrum One
                originCurrency: "0x0000000000000000000000000000000000000000", // ETH
                destinationCurrency: "0x0000000000000000000000000000000000000000", // ETH
                amount: "100000000000000", // 0.0001 ETH (18 decimals)
                tradeType: "EXACT_INPUT"
            };

            console.log("🚀 Step 2: Getting Quote from Relay API...");
            console.log("Request:", quoteRequest);

            // Get quote from Relay API v2
            const quoteResponse = await fetch(`${RELAY_API_URL}/quote/v2`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(quoteRequest),
            });

            if (!quoteResponse.ok) {
                const errorData = await quoteResponse.json();
                throw new Error(errorData.message || "Failed to get quote from Relay API");
            }

            const quoteData = await quoteResponse.json();
            console.log("✅ Quote received:", quoteData);
            console.log("Steps array:", quoteData.steps);

            setRelayResult({
                message: "✅ Step 2 Complete: Quote Retrieved!",
                quote: quoteData,
                requestId: quoteData.requestId,
                steps: quoteData.steps,
            });
            setCurrentStep(3);
        } catch (err) {
            setError(err.message || "Failed to get quote from Relay API");
            console.error("Relay API error:", err);
            setCurrentStep(1);
        } finally {
            setLoading(false);
        }
    };

    // Step 3: Execute Transaction
    const handleExecute = async () => {
        if (!relayResult?.quote || !primaryWallet) {
            setError("Please get a quote first (Step 2) and ensure wallet is connected.");
            return;
        }

        setLoading(true);
        setError(null);
        setCurrentStep(3);

        try {
            const quote = relayResult.quote;
            let requestId = null;

            console.log("🚀 Step 3: Executing transaction...");
            console.log("Quote steps:", quote.steps);

            // Get the wallet connector from Dynamic
            const connector = primaryWallet.connector;
            if (!connector) {
                throw new Error("Wallet connector not available");
            }

            // Iterate through steps (as per Relay API Quickstart)
            for (const step of quote.steps) {
                // Although there is an array of items, you can safely select the first item
                // as there is just one returned for a simple ETH bridge
                const item = step.items[0];

                // Check the Step Kind: Identify if the step is a transaction or signature
                if (step.kind === 'transaction') {
                    console.log("📝 Step Kind: transaction");
                    console.log("Transaction data:", {
                        to: item.data.to,
                        data: item.data.data,
                        value: item.data.value,
                        chainId: 8453
                    });

                    // Send transaction using Dynamic's connector
                    const hash = await primaryWallet.connector.sendTransaction({
                        to: item.data.to,
                        data: item.data.data || "0x",
                        value: BigInt(item.data.value || "0"),
                        chainId: 8453, // Base chain ID
                    });

                    requestId = step.requestId;

                    console.log(`✅ Bridge Initiated: ${hash}`);
                    console.log(`requestId: ${requestId}`); // Save this for Step 4!

                    setRelayResult(prev => ({
                        ...prev,
                        message: "✅ Step 3 Complete: Transaction Submitted!",
                        txHash: hash,
                        requestId: requestId,
                    }));

                    setCurrentStep(4);

                    // Start monitoring (Step 4)
                    if (requestId) {
                        monitorStatus(requestId);
                    }
                } else if (step.kind === 'signature') {
                    // Handle signature steps if needed
                    console.log("📝 Step Kind: signature");
                    console.log("Signature step:", step);
                    // Follow the signatureKind provided in the step item to sign the message
                }
            }
        } catch (err) {
            setError(err.message || "Failed to execute transaction");
            console.error("Execution error:", err);
            setCurrentStep(2);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app-container">
            <div className="card">
                <h1>🚀 Relay API Demo</h1>
                <p className="subtitle">
                    Connect your wallet and send gasless transactions using Relay API with Dynamic
                </p>

                <div className="connect-section">
                    <DynamicWidget />
                    {!accountAddress && (
                        <p style={{ marginTop: "15px", fontSize: "0.9rem", color: "#666", textAlign: "center" }}>
                            Click the button above to connect your wallet or sign up with email/social
                        </p>
                    )}
                </div>

                <div className="relay-section">
                    <h2>Relay API Quickstart - 5-Step Flow</h2>
                    <p className="description">
                        Bridge 0.0001 ETH from Base to Arbitrum using Relay API.
                        Follow the exact flow from the Relay API Quickstart guide.
                    </p>

                    {/* Step Progress Indicator */}
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "20px",
                        padding: "15px",
                        background: "#f8f9fa",
                        borderRadius: "10px",
                        fontSize: "0.9rem"
                    }}>
                        <div style={{ textAlign: "center", flex: 1 }}>
                            <div style={{
                                fontWeight: currentStep >= 1 ? "bold" : "normal",
                                color: currentStep >= 1 ? "#667eea" : "#999"
                            }}>
                                {isConfigured ? "✅" : "1️⃣"} Configure
                            </div>
                        </div>
                        <div style={{ textAlign: "center", flex: 1 }}>
                            <div style={{
                                fontWeight: currentStep >= 2 ? "bold" : "normal",
                                color: currentStep >= 2 ? "#667eea" : "#999"
                            }}>
                                {relayResult?.quote ? "✅" : "2️⃣"} Quote
                            </div>
                        </div>
                        <div style={{ textAlign: "center", flex: 1 }}>
                            <div style={{
                                fontWeight: currentStep >= 3 ? "bold" : "normal",
                                color: currentStep >= 3 ? "#667eea" : "#999"
                            }}>
                                {relayResult?.txHash ? "✅" : "3️⃣"} Execute
                            </div>
                        </div>
                        <div style={{ textAlign: "center", flex: 1 }}>
                            <div style={{
                                fontWeight: currentStep >= 4 ? "bold" : "normal",
                                color: currentStep >= 4 ? "#667eea" : "#999"
                            }}>
                                {status === 'success' ? "✅" : status ? "⏳" : "4️⃣"} Monitor
                            </div>
                        </div>
                        <div style={{ textAlign: "center", flex: 1 }}>
                            <div style={{
                                fontWeight: currentStep >= 5 ? "bold" : "normal",
                                color: currentStep >= 5 ? "#667eea" : "#999"
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
                                <div className="task-id" style={{ marginTop: "8px", color: "#059669" }}>
                                    Status: {status}
                                    {status === 'waiting' && " - Deposit submitted, waiting for indexing"}
                                    {status === 'pending' && " - Deposit indexed, preparing fill transaction"}
                                    {status === 'success' && " - Bridge completed successfully!"}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 5: Optimize - Information */}
                    {currentStep >= 5 && (
                        <div style={{
                            marginTop: "20px",
                            padding: "15px",
                            background: "#f0f9ff",
                            border: "2px solid #0ea5e9",
                            borderRadius: "10px"
                        }}>
                            <h3 style={{ marginTop: 0, color: "#0ea5e9" }}>🎉 Step 5: Optimize</h3>
                            <p style={{ marginBottom: "10px", color: "#0369a1" }}>
                                You've successfully executed your first cross-chain transaction with Relay!
                                Check out advanced features to customize the experience:
                            </p>
                            <ul style={{ color: "#0369a1", marginLeft: "20px" }}>
                                <li><strong>App Fees:</strong> Monetize by adding a fee (in bps) to every quote. Revenue collected automatically in USDC.</li>
                                <li><strong>Smart Accounts:</strong> Use ERC-4337 and EIP-7702 for Gas Sponsorship and Atomic Batching.</li>
                                <li><strong>Transaction Indexing:</strong> Handle complex settlement scenarios.</li>
                            </ul>
                        </div>
                    )}
                </div>

                <div className="info-section">
                    <h3>Relay API Quickstart - 5 Steps:</h3>
                    <ol>
                        <li><strong>Configure:</strong> Connect wallet with ETH on Base (~$2 USD). Base URL: https://api.relay.link</li>
                        <li><strong>Quote:</strong> Every action starts with a Quote. Call `/quote/v2` endpoint to get transaction data and steps array.</li>
                        <li><strong>Execute:</strong> Iterate through steps array. Check step.kind (transaction/signature) and submit using your wallet.</li>
                        <li><strong>Monitor:</strong> Poll `/intents/status/v3` with requestId every second. Status: waiting → pending → success</li>
                        <li><strong>Optimize:</strong> Add App Fees, Smart Accounts (ERC-4337/EIP-7702), Transaction Indexing</li>
                    </ol>
                    <div style={{ marginTop: "15px", padding: "10px", background: "#e3f2fd", borderRadius: "8px" }}>
                        <p style={{ fontSize: "0.9rem", color: "#1976d2", margin: 0 }}>
                            💡 <strong>Prerequisites:</strong> EOA wallet with ~$2 USD equivalent ETH on Base chain (Chain ID: 8453)
                        </p>
                        <p style={{ fontSize: "0.9rem", color: "#1976d2", margin: "5px 0 0 0" }}>
                            📚 <strong>Learn More:</strong> See <a href="https://docs.relay.link/references/api/quickstart.md" target="_blank" rel="noopener noreferrer" style={{ color: "#1976d2", textDecoration: "underline" }}>Relay API Quickstart</a>
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

