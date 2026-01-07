# Relay API Demo with Thirdweb

A simple demo application showing how to use Thirdweb's Relay API for gasless transactions with a connect button.

## Features

- 🔌 Wallet connection using Thirdweb ConnectButton
- ⛽ Gasless transactions via Relay API
- 🎨 Modern, clean UI
- ⚡ Built with React and Vite

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Get your Thirdweb Client ID:**
   - Go to [Thirdweb Dashboard](https://thirdweb.com/dashboard)
   - Create a new project or use an existing one
   - Copy your Client ID

3. **Configure the app:**
   - Open `src/App.jsx`
   - Replace `YOUR_THIRDWEB_CLIENT_ID` with your actual Client ID
   - Optionally change the `activeChain` to your preferred chain

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   - Navigate to `http://localhost:5173` (or the URL shown in terminal)

## How to Use

1. Click the "Connect Wallet" button
2. Select your wallet provider (MetaMask, WalletConnect, etc.)
3. Approve the connection
4. Once connected, click "Send Gasless Transaction" to test the Relay API

## What is Relay API?

The Relay API allows you to send blockchain transactions without paying gas fees. The gas is sponsored by the relay service, making it easier for users to interact with your dApp.

## Project Structure

```
relay-api-demo/
├── src/
│   ├── App.jsx          # Main app component with Relay API demo
│   ├── App.css          # Styles for the app
│   ├── main.jsx         # React entry point
│   └── index.css        # Global styles
├── index.html           # HTML template
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
└── README.md           # This file
```

## Customization

To customize the transaction being relayed, modify the `transaction` object in the `handleRelayTransaction` function:

```javascript
const transaction = {
  to: "0x...",      // Recipient address
  data: "0x",       // Transaction data (ABI-encoded)
  value: "0",       // Amount in wei
};
```

## Learn More

- [Thirdweb Documentation](https://portal.thirdweb.com/)
- [Relay API Guide](https://portal.thirdweb.com/relay)
- [Thirdweb React SDK](https://portal.thirdweb.com/react)

## Relay Docs

- **Relay docs index (LLM bundle)**: [`https://docs.relay.link/llms.txt`](https://docs.relay.link/llms.txt)  
- **API Overview**: [`https://docs.relay.link/references/api/overview.md`](https://docs.relay.link/references/api/overview.md)  
- **Quickstart**: [`https://docs.relay.link/references/api/quickstart.md`](https://docs.relay.link/references/api/quickstart.md)  
- **RelayKit Overview**: [`https://docs.relay.link/references/relay-kit/overview.md`](https://docs.relay.link/references/relay-kit/overview.md)  
- **useQuote hook**: [`https://docs.relay.link/references/relay-kit/hooks/useQuote.md`](https://docs.relay.link/references/relay-kit/hooks/useQuote.md)  
- **SwapWidget UI**: [`https://docs.relay.link/references/relay-kit/ui/swap-widget.md`](https://docs.relay.link/references/relay-kit/ui/swap-widget.md)  
- **What is Relay?**: [`https://docs.relay.link/what-is-relay.md`](https://docs.relay.link/what-is-relay.md)

