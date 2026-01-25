// Relay SDK Configuration
// This file configures the Relay SDK client singleton
// The client can be retrieved with getClient() throughout the application

let clientInitialized = false;
let getRelayClientFn: (() => any) | null = null;

// Initialize the Relay SDK client asynchronously (non-blocking)
// This won't prevent the app from rendering
(async () => {
    try {
        const sdkModule = await import('@relayprotocol/relay-sdk');
        const chainsModule = await import('viem/chains');
        
        sdkModule.createClient({
            baseApiUrl: sdkModule.MAINNET_RELAY_API,
            source: "relay-api-demo",
            chains: [
                sdkModule.convertViemChainToRelayChain(chainsModule.base),
                sdkModule.convertViemChainToRelayChain(chainsModule.arbitrum)
            ],
        });
        clientInitialized = true;
        getRelayClientFn = sdkModule.getClient;
        console.log('✅ Relay SDK client initialized successfully');
    } catch (error: any) {
        console.warn("⚠️ Relay SDK initialization failed:", error?.message || error);
        console.warn("📝 SDK examples will not work, but API examples should still function.");
    }
})();

// Export a helper to get the configured client (synchronous)
// This retrieves the singleton instance created by createClient
export function getClient() {
    if (!clientInitialized || !getRelayClientFn) {
        return null;
    }
    try {
        return getRelayClientFn();
    } catch (error) {
        console.error("Failed to get Relay client:", error);
        return null;
    }
}
