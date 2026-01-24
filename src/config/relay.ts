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

// Export a helper to get the configured client
// This retrieves the singleton instance created by createClient
export function getClient() {
    return getRelayClient();
}
