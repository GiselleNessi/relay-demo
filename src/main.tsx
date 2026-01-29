import React from 'react'
import ReactDOM from 'react-dom/client'
import { PrivyProvider } from '@privy-io/react-auth'
// Initialize Relay SDK client (errors handled in relay.ts)
import './config/relay'
import App from './App'
import './index.css'

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element not found')
}

// Use VITE_PRIVY_APP_ID from env, or default for demo. Set in .env or CodeSandbox env vars.
const privyAppId = import.meta.env.VITE_PRIVY_APP_ID || '';
const DEFAULT_APP_ID = 'cmksmuxeh00hml40e5tlgyi22';
const appIdToUse = privyAppId || DEFAULT_APP_ID;

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <PrivyProvider
      appId={appIdToUse}
      config={{
        loginMethods: ['email', 'wallet', 'sms'],
        appearance: {
          theme: 'dark',
          accentColor: '#4615C8',
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      <App />
    </PrivyProvider>
  </React.StrictMode>,
)
