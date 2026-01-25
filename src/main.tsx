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

if (!privyAppId) {
  console.warn('⚠️ VITE_PRIVY_APP_ID is not set. Privy wallet connection will not work.');
  console.warn('📝 For CodeSandbox: Go to Settings > Environment Variables and add VITE_PRIVY_APP_ID');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <PrivyProvider
      appId={privyAppId}
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
