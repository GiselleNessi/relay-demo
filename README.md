# Relay API Examples

Interactive examples for Relay API integration. All examples are available in CodeSandbox.

## 🚀 Quick Start

**[Open in CodeSandbox →](https://githubbox.com/GiselleNessi/relay-demo)**

Click the link above to open this repository in CodeSandbox and explore all the examples interactively.

### CodeSandbox Setup

**Important**: This project requires a Privy App ID for wallet connection.

1. After opening in CodeSandbox, go to **Settings** (gear icon) → **Environment Variables**
2. Add a new variable:
   - **Name**: `VITE_PRIVY_APP_ID`
   - **Value**: Your Privy App ID (get one from [Privy Dashboard](https://dashboard.privy.io/))
3. The dev server will automatically restart
4. The app should now load and you can connect your wallet

### Local Development

1. Clone the repository
2. Copy `.env.example` to `.env` and add your Privy App ID:
   ```
   VITE_PRIVY_APP_ID=your_privy_app_id_here
   ```
3. Install dependencies: `npm install`
4. Run the dev server: `npm run dev`

## Examples

- **API Examples** - Direct API integration examples using fetch and REST endpoints
- **SDK Examples** - Examples using Relay SDK and React hooks

## Learn More

- [What is Relay?](https://docs.relay.link/what-is-relay)
- [Relay API Quickstart](https://docs.relay.link/references/api/quickstart.md)
- [Relay API Overview](https://docs.relay.link/references/api/overview.md)
