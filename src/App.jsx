import { createThirdwebClient } from "thirdweb";
import { ThirdwebProvider, ConnectButton, useActiveAccount, useActiveWalletChain } from "thirdweb/react";
import { ethereum } from "thirdweb/chains";
import { useState } from "react";
import "./App.css";

// Replace with your Thirdweb Client ID
const CLIENT_ID = "2f2c0683649094b5400861e502365d86"; // Get from https://thirdweb.com/dashboard

// Create a thirdweb client
const client = createThirdwebClient({ clientId: CLIENT_ID });

function AppContent() {
    const [relayResult, setRelayResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const account = useActiveAccount();
    const chain = useActiveWalletChain();

    const handleRelayTransaction = async () => {
        if (!account) {
            setError("Please connect your wallet first.");
            return;
        }

        setLoading(true);
        setError(null);
        setRelayResult(null);

        try {
            // Example: This is a demo - in production you would use Relay API
            // For now, we'll just show a message that wallet is connected
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate async operation

            setRelayResult({
                message: "Wallet connected! Ready to use Relay API.",
                note: "Configure Relay API to send actual transactions",
            });
        } catch (err) {
            setError(err.message || "Failed to process");
            console.error("Error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app-container">
            <div className="card">
                <h1>🚀 Relay API Demo</h1>
                <p className="subtitle">
                    Connect your wallet and send gasless transactions using Thirdweb Relay API
                </p>

                <div className="connect-section">
                    <ConnectButton
                        client={client}
                        chain={ethereum}
                    />
                </div>

                <div className="relay-section">
                    <h2>Relay API Example</h2>
                    <p className="description">
                        The Relay API allows you to send transactions without paying gas fees.
                        The gas is sponsored by the relay service.
                    </p>

                    <button
                        onClick={handleRelayTransaction}
                        disabled={loading || !account}
                        className="relay-button"
                    >
                        {loading ? "Processing..." : account ? "Test Relay API" : "Connect Wallet First"}
                    </button>

                    {error && (
                        <div className="error-message">
                            ⚠️ {error}
                        </div>
                    )}

                    {relayResult && (
                        <div className="success-message">
                            ✅ {relayResult.message}
                            {relayResult.note && (
                                <div className="task-id">
                                    {relayResult.note}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="info-section">
                    <h3>How it works:</h3>
                    <ol>
                        <li>Click "Connect Wallet" to connect your wallet</li>
                        <li>Once connected, the Relay API becomes available</li>
                        <li>Click "Send Gasless Transaction" to relay a transaction</li>
                        <li>The transaction is sent without requiring gas from your wallet</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}

function App() {
    return (
        <ThirdwebProvider>
            <AppContent />
        </ThirdwebProvider>
    );
}

export default App;

