# Relay API Sandbox with Dynamic

An interactive sandbox application for testing the Relay API, SDK, and exploring code snippets. This sandbox demonstrates cross-chain bridging with Dynamic wallet connection and provides live code examples that follow the Relay API Quickstart documentation.

## Features

- 🎮 **Live Demo**: Test the Relay API and SDK in real-time
- 💻 **Code Snippets**: View API and SDK code examples with multiple implementation approaches
- 🔌 **Wallet Connection**: Multiple wallet connection options (Dynamic SDK, Ethers.js)
- 🌉 **Cross-chain Bridging**: Bridge ETH from Base to Arbitrum via Relay API
- 📊 **Real-time Monitoring**: Track transaction status with live updates
- 🎨 **Dark Mode UI**: Modern, clean dark theme interface
- 📦 **External Sandboxes**: Links to StackBlitz and CodeSandbox for editing and experimenting with code
- ⚡ **Built with React and Vite**

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

### Live Demo Tab
1. Click the "Connect Wallet" button (Dynamic Widget)
2. Select your wallet provider or sign up with email/social
3. Once connected, click "2. Get Quote" to get a bridge quote
4. Click "3. Execute Bridge" to execute the cross-chain transaction
5. Monitor the transaction status in real-time as it progresses through the 5-step flow

### Code Snippets Tab
- Switch to the "Code Snippets" tab to view implementation examples
- Code snippets automatically update based on your current step in the demo
- Use the approach tabs to switch between different implementation methods:
  - **API (Direct)**: Direct API calls for maximum flexibility
  - **SDK (Dynamic)**: Using Dynamic SDK for wallet integration
  - **Direct Wallet (Ethers.js)**: Using Ethers.js directly
  - **Gas Sponsorship**: Examples with ERC-4337 and EIP-7702 smart accounts

### External Sandboxes
- For **Execute** and **Monitor** steps, use the "Open in StackBlitz" or "Open in CodeSandbox" buttons
- These external sandboxes provide:
  - **Full editability**: Edit code directly in the browser
  - **Package installation**: Install any npm packages you need
  - **Forking**: Clone and fork to create your own versions
  - **Sharing**: Share your customized code with the team
- The demo uses default code internally, but you can experiment freely in external sandboxes

## Code Snippets

The code snippets in this sandbox follow the **5-step flow from the Relay API Quickstart documentation**:

1. **Step 1: Configure** - Wallet connection examples (SDK and direct wallet methods)
2. **Step 2: Get Quote** - API examples for getting bridge/swap quotes (with and without gas sponsorship)
3. **Step 3: Execute** - Transaction execution examples using SDK and direct wallet methods
4. **Step 4: Monitor** - Status polling examples to track transaction progress
5. **Step 5: Optimize** - Advanced features including gas sponsorship, smart accounts, and app fees

The snippets dynamically update based on your progress through the demo and include real data from your session (wallet addresses, request IDs, API responses) when available. This allows you to see both the code examples and how they map to actual functionality.

## What is Relay API?

Relay API is a multichain payments network that enables cross-chain bridging, swapping, and call execution. You define the Intent (what the user wants), and Relay handles the Execution (how to get there). This sandbox demonstrates the complete 5-step flow from the Relay API Quickstart documentation, showing how to bridge ETH from Base to Arbitrum.

## Project Structure

```
relay-api-demo/
├── public/
│   └── logo.svg         # Relay API logo
├── src/
│   ├── App.jsx          # Main sandbox component with Relay API demo
│   ├── App.css          # Styles for the app (dark mode)
│   ├── main.jsx         # React entry point
│   └── index.css        # Global styles
├── index.html           # HTML template
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
└── README.md           # This file
```

## Console Logs

The sandbox includes comprehensive console logging for testing and debugging:
- Wallet connection/disconnection events
- Step transitions and state changes
- Quote request/response details
- Transaction execution details with explorer links
- Status monitoring with attempt tracking
- Error details with full stack traces

Open your browser's developer console (F12) to see detailed logs in real-time.

## Customization

To customize the bridge transaction, modify the `quoteRequest` object in the `handleGetQuote` function:

```javascript
const quoteRequest = {
  user: accountAddress,
  originChainId: 8453,        // Base
  destinationChainId: 42161,   // Arbitrum One
  originCurrency: "0x0000000000000000000000000000000000000000", // ETH
  destinationCurrency: "0x0000000000000000000000000000000000000000", // ETH
  amount: "100000000000000",   // 0.0001 ETH (18 decimals)
  tradeType: "EXACT_INPUT"
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

