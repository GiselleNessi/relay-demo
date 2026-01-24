// Relay SDK Configuration
// This file configures the Relay SDK client singleton

import { createClient, MAINNET_RELAY_API, convertViemChainToRelayChain } from '@relayprotocol/relay-sdk';
import { base, arbitrum } from 'viem/chains';

// Create the Relay client singleton
// This will be used throughout the application
export const relayClient = createClient({
    baseApiUrl: MAINNET_RELAY_API,
    source: "relay-api-demo",
    chains: [
        convertViemChainToRelayChain(base),
        convertViemChainToRelayChain(arbitrum)
    ]
});

// Export a helper to get the client
export function getClient() {
    return relayClient;
}
