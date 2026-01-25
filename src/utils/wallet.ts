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
        // Privy wallets have different methods depending on wallet type
        let provider;
        
        // Log wallet structure for debugging
        console.log('Wallet object:', wallet);
        console.log('Wallet type:', wallet.walletClientType);
        console.log('Available methods:', Object.keys(wallet));
        
        try {
            // Method 1: Standard getEip1193Provider (for external wallets)
            if (typeof wallet.getEip1193Provider === 'function') {
                provider = await wallet.getEip1193Provider();
            } 
            // Method 2: Check if it's a method that needs to be called differently
            else if ('getEip1193Provider' in wallet && typeof (wallet as any).getEip1193Provider === 'function') {
                provider = await (wallet as any).getEip1193Provider();
            }
            // Method 3: For embedded wallets, check connector
            else if (wallet.walletClientType === 'privy' || wallet.walletClientType === 'embedded') {
                const privyWallet = wallet as any;
                // Try connector first
                if (privyWallet.connector) {
                    if (typeof privyWallet.connector.getProvider === 'function') {
                        provider = await privyWallet.connector.getProvider();
                    } else if (privyWallet.connector.provider) {
                        provider = privyWallet.connector.provider;
                    }
                }
                // Fallback to direct provider access
                if (!provider && privyWallet.provider) {
                    provider = privyWallet.provider;
                }
            }
            // Method 4: Check for provider directly
            else if ((wallet as any).provider) {
                provider = (wallet as any).provider;
            }
            // Method 5: Check connector
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
            console.error('Error getting wallet provider:', error);
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
