import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      // Whether to polyfill `node:` protocol imports.
      protocolImports: true,
    }),
  ],
  resolve: {
    alias: {
      // Ensure axios resolves from project root when bundling @relayprotocol/relay-sdk
      axios: path.resolve(__dirname, 'node_modules/axios'),
    },
  },
  optimizeDeps: {
    include: ['axios', '@relayprotocol/relay-sdk', 'viem'],
  },
  define: {
    'process.env': {},
    global: 'globalThis',
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    allowedHosts: [
      '.csb.app',
      '.codesandbox.io',
    ],
  },
})
