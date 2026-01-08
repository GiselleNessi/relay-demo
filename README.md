# Relay API Demo with Dynamic

A simple demo application showing how to use Relay API for cross-chain bridging with Dynamic wallet connection.

## Features

- 🔌 Wallet connection using Dynamic Widget
- 🌉 Cross-chain bridging via Relay API
- 📊 Real-time transaction monitoring
- 🎨 Modern, clean UI
- ⚡ Built with React and Vite

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Get your Dynamic Environment ID:**
   - Go to [Dynamic Dashboard](https://app.dynamic.xyz)
   - Sign up or log in to your account
   - Create a new project or use an existing one
   - Copy your Environment ID from the dashboard

3. **Configure the app (choose one method):**
   
   **Method 1: Using Environment Variable (Recommended)**
   - Copy `.env.example` to `.env`: `cp .env.example .env`
   - Edit `.env` and add your Dynamic Environment ID
   - Restart the dev server
   
   **Method 2: Direct in Code**
   - Open `src/App.jsx`
   - Replace `YOUR_DYNAMIC_ENVIRONMENT_ID` with your actual Environment ID

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   - Navigate to `http://localhost:5173` (or the URL shown in terminal)

## How to Use

1. Click the "Connect Wallet" button (Dynamic Widget)
2. Select your wallet provider or sign up with email/social
3. Once connected, click "1. Get Quote" to get a bridge quote
4. Click "2. Execute Bridge" to execute the cross-chain transaction
5. Monitor the transaction status in real-time

## What is Relay API?

Relay API is a multichain payments network that enables cross-chain bridging, swapping, and call execution. You define the Intent (what the user wants), and Relay handles the Execution (how to get there). This demo shows how to bridge ETH from Base to Arbitrum.

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

- [Dynamic Documentation](https://www.dynamic.xyz/docs)
- [Dynamic React SDK](https://www.dynamic.xyz/docs/react-sdk)
- [Dynamic Quickstart](https://www.dynamic.xyz/docs/introduction/getting-started)

## Relay Docs

- **Relay docs index (LLM bundle)**: [`https://docs.relay.link/llms.txt`](https://docs.relay.link/llms.txt)  
- **API Overview**: [`https://docs.relay.link/references/api/overview.md`](https://docs.relay.link/references/api/overview.md)  
- **Quickstart**: [`https://docs.relay.link/references/api/quickstart.md`](https://docs.relay.link/references/api/quickstart.md)  
- **RelayKit Overview**: [`https://docs.relay.link/references/relay-kit/overview.md`](https://docs.relay.link/references/relay-kit/overview.md)  
- **useQuote hook**: [`https://docs.relay.link/references/relay-kit/hooks/useQuote.md`](https://docs.relay.link/references/relay-kit/hooks/useQuote.md)  
- **SwapWidget UI**: [`https://docs.relay.link/references/relay-kit/ui/swap-widget.md`](https://docs.relay.link/references/relay-kit/ui/swap-widget.md)  
- **What is Relay?**: [`https://docs.relay.link/what-is-relay.md`](https://docs.relay.link/what-is-relay.md)

