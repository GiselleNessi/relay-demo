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

// Only render PrivyProvider if App ID is set, otherwise show a message
if (!privyAppId) {
  console.warn('⚠️ VITE_PRIVY_APP_ID is not set. Privy wallet connection will not work.');
  console.warn('📝 For CodeSandbox: Go to Settings > Environment Variables and add VITE_PRIVY_APP_ID');
  
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#0a0a0a',
        color: '#e0e0e0',
        fontFamily: 'system-ui, sans-serif',
        padding: '20px',
        textAlign: 'center'
      }}>
        <div style={{
          background: '#1a1a1a',
          padding: '40px',
          borderRadius: '12px',
          maxWidth: '500px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h1 style={{ marginTop: 0 }}>Relay API Examples</h1>
          <p style={{ color: '#a0a0a0', marginBottom: '20px' }}>
            Please set the <code style={{ background: '#0D0C0D', padding: '2px 6px', borderRadius: '4px' }}>VITE_PRIVY_APP_ID</code> environment variable to use this app.
          </p>
          <p style={{ color: '#888', fontSize: '0.9rem' }}>
            In CodeSandbox: Settings → Environment Variables → Add VITE_PRIVY_APP_ID
          </p>
        </div>
      </div>
    </React.StrictMode>
  );
} else {
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
  );
}
