# CodeSandbox Setup

## Environment Variables

This project requires a Privy App ID to enable wallet connection. 

### Setting Environment Variables in CodeSandbox

1. Click on the **Settings** icon (gear) in the left sidebar
2. Go to **Environment Variables** section
3. Add a new variable:
   - **Name**: `VITE_PRIVY_APP_ID`
   - **Value**: Your Privy App ID (e.g., `cmksmuxeh00hml40e5tlgyi22`)
4. Click **Save**
5. The dev server will automatically restart with the new environment variable

### Getting a Privy App ID

1. Go to [Privy Dashboard](https://dashboard.privy.io/)
2. Create a new app or select an existing one
3. Copy the App ID from the dashboard
4. Add it as an environment variable in CodeSandbox (see above)

### Troubleshooting

- If the app shows a blank page, check the browser console for errors
- If wallet connection doesn't work, verify the `VITE_PRIVY_APP_ID` is set correctly
- The app will still load without the Privy App ID, but wallet features won't work
