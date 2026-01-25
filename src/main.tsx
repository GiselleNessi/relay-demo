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

const privyAppId = import.meta.env.VITE_PRIVY_APP_ID || '';

// Use default App ID if not set (for demo purposes)
// Users can override with their own in .env or CodeSandbox env vars
const DEFAULT_APP_ID = 'cmksmuxeh00hml40e5tlgyi22';
const appIdToUse = privyAppId || DEFAULT_APP_ID;

if (!privyAppId) {
  console.warn('⚠️ VITE_PRIVY_APP_ID is not set. Using default App ID for demo.');
  console.warn('📝 To use your own: Set VITE_PRIVY_APP_ID in .env or CodeSandbox environment variables');
}

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
