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
        try {
            // Method 1: Standard getEip1193Provider (for external wallets)
            if (typeof wallet.getEip1193Provider === 'function') {
                provider = await wallet.getEip1193Provider();
            } 
            // Method 2: For embedded wallets, use getEip1193Provider with different signature
            else if (wallet.walletClientType === 'privy' || wallet.walletClientType === 'embedded') {
                // Embedded wallets might need different handling
                // Try to access the provider through the wallet's internal structure
                const privyWallet = wallet as any;
                if (privyWallet.getEip1193Provider) {
                    provider = await privyWallet.getEip1193Provider();
                } else if (privyWallet.provider) {
                    provider = privyWallet.provider;
                } else if (privyWallet.connector?.provider) {
                    provider = privyWallet.connector.provider;
                } else {
                    // For embedded wallets, we might need to use Privy's provider directly
                    throw new Error(`Embedded wallet detected but provider not accessible. Wallet type: ${wallet.walletClientType}`);
                }
            }
            // Method 3: Check for provider directly
            else if ((wallet as any).provider) {
                provider = (wallet as any).provider;
            }
            // Method 4: Check connector
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
                // Log wallet structure for debugging
                console.error('Wallet object:', wallet);
                console.error('Wallet type:', wallet.walletClientType);
                console.error('Available keys:', Object.keys(wallet));
                throw new Error(`Unable to get provider from wallet. Wallet type: ${wallet.walletClientType || 'unknown'}`);
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
