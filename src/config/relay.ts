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

let clientInitialized = false;

// Create the Relay client singleton
// Wrap in try-catch to prevent app crash if SDK has issues
try {
    createClient({
        baseApiUrl: MAINNET_RELAY_API,
        source: "relay-api-demo",
        chains: [
            convertViemChainToRelayChain(base),
            convertViemChainToRelayChain(arbitrum)
        ],
    });
    clientInitialized = true;
} catch (error) {
    console.warn("Relay SDK initialization failed:", error);
    console.warn("SDK examples will not work, but API examples should still function.");
}

// Export a helper to get the configured client
export function getClient() {
    if (!clientInitialized) {
        return null;
    }
    try {
        return getRelayClient();
    } catch (error) {
        console.error("Failed to get Relay client:", error);
        return null;
    }
}
