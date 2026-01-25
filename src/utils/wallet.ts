// Wallet connection utilities using Privy
// This file provides utilities for getting wallet clients compatible with Relay SDK

import { useWallets, usePrivy } from '@privy-io/react-auth';
import { createWalletClient, custom } from 'viem';
import { base } from 'viem/chains';

// Get a viem wallet client from Privy
// This can be used in components that have access to Privy hooks
export function usePrivyWalletClient() {
    const { ready, authenticated } = usePrivy();
    const { wallets } = useWallets();
    
    const getWalletClient = async () => {
        if (!ready || !authenticated) {
            throw new Error("Please connect your wallet first");
        }

        const wallet = wallets[0];
        if (!wallet) {
            throw new Error("No wallet found. Please connect a wallet.");
        }

        // Get the EIP1193 provider from Privy
        // Check if the method exists, otherwise try alternative approaches
        let provider;
        try {
            if (typeof wallet.getEip1193Provider === 'function') {
                provider = await wallet.getEip1193Provider();
            } else if (wallet.provider) {
                // Some Privy wallet objects have provider directly
                provider = wallet.provider;
            } else if (wallet.walletClient) {
                // Some wallets expose walletClient directly
                return wallet.walletClient;
            } else {
                // Try to get provider from the wallet's connector
                const connector = (wallet as any).connector;
                if (connector && connector.getProvider) {
                    provider = await connector.getProvider();
                } else {
                    throw new Error("Unable to get provider from wallet. Wallet type: " + wallet.walletClientType);
                }
            }
        } catch (error: any) {
            throw new Error(`Failed to get wallet provider: ${error.message}`);
        }
        
        const client = createWalletClient({
            account: wallet.address as `0x${string}`,
            chain: base,
            transport: custom(provider)
        });

        return client;
    };

    return {
        getWalletClient,
        wallet: wallets[0],
        address: wallets[0]?.address,
        isConnected: ready && authenticated && wallets.length > 0
    };
}
