// Type declarations for window.ethereum

interface EthereumProvider {
    request: (args: { method: string; params?: any[] }) => Promise<any>;
    isMetaMask?: boolean;
    on?: (event: string, handler: (...args: any[]) => void) => void;
    removeListener?: (event: string, handler: (...args: any[]) => void) => void;
}

declare global {
    interface Window {
        ethereum?: EthereumProvider;
    }
}

export {};
