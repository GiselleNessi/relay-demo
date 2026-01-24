// Relay SDK Configuration
// This file configures the Relay SDK client singleton
// The client can be retrieved with getClient() throughout the application

import {
    createClient,
    convertViemChainToRelayChain,
    MAINNET_RELAY_API,
    getClient as getRelayClient,
} from '@relayprotocol/relay-sdk';
import { base, arbitrum } from 'viem/chains';

// Create the Relay client singleton
// This creates a global instance that will be used throughout your application
// Wrap in try-catch to prevent app crash if SDK has issues
try {
    createClient({
        baseApiUrl: MAINNET_RELAY_API,
        source: "relay-api-demo",
        chains: [
            convertViemChainToRelayChain(base),
            convertViemChainToRelayChain(arbitrum)
        ],
        // Optional: Add other configuration options as needed
        // logLevel: LogLevel.INFO,
        // pollingInterval: 1000,
        // maxPollingAttemptsBeforeTimeout: 60,
    });
} catch (error) {
    console.error("Failed to initialize Relay SDK client:", error);
}

// Export a helper to get the configured client
// This retrieves the singleton instance created by createClient
export function getClient() {
    try {
        return getRelayClient();
    } catch (error) {
        console.error("Failed to get Relay client:", error);
        return null;
    }
}
