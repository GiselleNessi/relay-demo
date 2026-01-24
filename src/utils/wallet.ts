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
        const provider = await wallet.getEip1193Provider();
        
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
