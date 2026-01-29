// Initialize Relay SDK client singleton once at app startup.
// Use getClient() from '@relayprotocol/relay-sdk' anywhere to get the client.

import {
    createClient,
    convertViemChainToRelayChain,
    MAINNET_RELAY_API,
} from '@relayprotocol/relay-sdk';
import { base, arbitrum } from 'viem/chains';

createClient({
    baseApiUrl: MAINNET_RELAY_API,
    source: "relay-api-demo",
    chains: [
        convertViemChainToRelayChain(base),
        convertViemChainToRelayChain(arbitrum)
    ],
});
