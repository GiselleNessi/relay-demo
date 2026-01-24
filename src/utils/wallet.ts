// Wallet connection utilities
// Simple wallet connection using window.ethereum (MetaMask, etc.)

export interface WalletState {
    address: string | null;
    chainId: number | null;
    isConnected: boolean;
}

export async function connectWallet(): Promise<WalletState> {
    if (typeof window === "undefined" || !window.ethereum) {
        throw new Error("No wallet detected. Please install MetaMask or another Web3 wallet.");
    }

    try {
        // Request account access
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        const address = accounts[0];

        // Get chain ID
        const chainIdHex = await window.ethereum.request({ method: "eth_chainId" });
        const chainId = parseInt(chainIdHex as string, 16);

        return {
            address,
            chainId,
            isConnected: true
        };
    } catch (error: any) {
        throw new Error(error.message || "Failed to connect wallet");
    }
}

export async function getWalletState(): Promise<WalletState | null> {
    if (typeof window === "undefined" || !window.ethereum) {
        return null;
    }

    try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length === 0) {
            return { address: null, chainId: null, isConnected: false };
        }

        const chainIdHex = await window.ethereum.request({ method: "eth_chainId" });
        const chainId = parseInt(chainIdHex as string, 16);

        return {
            address: accounts[0],
            chainId,
            isConnected: true
        };
    } catch {
        return null;
    }
}

// Get a viem wallet client from window.ethereum
export async function getWalletClient() {
    if (typeof window === "undefined" || !window.ethereum) {
        throw new Error("No wallet detected");
    }

    try {
        const { createWalletClient, custom } = await import("viem");
        const { base } = await import("viem/chains");

        const client = createWalletClient({
            chain: base,
            transport: custom(window.ethereum)
        });

        return client;
    } catch (error) {
        throw new Error("Failed to create wallet client");
    }
}
