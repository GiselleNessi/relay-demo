# Relay Interactive Sandbox

Interactive sandbox for testing and learning Relay's cross-chain bridging. Try both the **Relay API** (direct REST calls) and **Relay SDK** approaches for bridging assets between chains.

**[🚀 Open in CodeSandbox →](https://githubbox.com/GiselleNessi/relay-demo)**

## What This Demo Shows

This demo walks you through the complete cross-chain bridge flow:

1. **Get Quote** - Request a quote for bridging assets (e.g., ETH from Base to Arbitrum)
2. **Execute** - Submit the transaction to your wallet
3. **Monitor** - Track the transaction status until completion

### Examples Included

- **API Examples** - Step-by-step guide using direct API calls (`fetch`)
- **SDK Examples** - Simplified approach using the Relay SDK with React hooks

## Quick Start

### CodeSandbox (Recommended)

1. Click the link above to open in CodeSandbox
2. Go to **Settings** → **Environment Variables**
3. Add `VITE_PRIVY_APP_ID` with your [Privy App ID](https://dashboard.privy.io/)
4. Connect your wallet and try the examples!

### Local Development

```bash
# Clone and install
git clone https://github.com/GiselleNessi/relay-demo.git
cd relay-demo
npm install

# Set up environment
cp .env.example .env
# Add your VITE_PRIVY_APP_ID to .env

# Run
npm run dev
```

### Troubleshooting

**"Frame ancestor is not allowed" / Privy iframe failed to load**

When running on CodeSandbox or other sandbox domains, add your preview URL to Privy's allowed domains:

1. Go to [Privy Dashboard](https://dashboard.privy.io/) → your app → **Settings** → **Allowed URLs**
2. Add your domain (e.g. `https://*.csb.app`, `https://*.codesandbox.io` for CodeSandbox previews)

See [Privy's allowed domains docs](https://docs.privy.io/recipes/dashboard/allowed-domains) for details.

## Learn More

- [What is Relay?](https://docs.relay.link/what-is-relay)
- [Relay API Quickstart](https://docs.relay.link/references/api/quickstart.md)
- [Relay API Documentation](https://docs.relay.link/references/api/overview.md)
