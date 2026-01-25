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
        // Privy wallets may have different methods depending on wallet type
        let provider;
        try {
            // Try the standard method first
            if (typeof wallet.getEip1193Provider === 'function') {
                provider = await wallet.getEip1193Provider();
            } 
            // For embedded wallets, try getProvider method
            else if (typeof (wallet as any).getProvider === 'function') {
                provider = await (wallet as any).getProvider();
            }
            // Check if provider is directly available
            else if ((wallet as any).provider) {
                provider = (wallet as any).provider;
            }
            // For some wallet types, check connector
            else {
                const connector = (wallet as any).connector;
                if (connector) {
                    if (typeof connector.getProvider === 'function') {
                        provider = await connector.getProvider();
                    } else if (connector.provider) {
                        provider = connector.provider;
                    }
                }
            }
            
            if (!provider) {
                throw new Error(`Unable to get provider from wallet. Wallet type: ${wallet.walletClientType || 'unknown'}. Available methods: ${Object.keys(wallet).join(', ')}`);
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
