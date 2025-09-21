# @unisat/wallet-state

Redux state management for UniSat wallet, designed to be shared between browser extension and mobile applications.

## Features

- 🔄 Cross-platform Redux store configuration
- 🏪 Typed state slices for all wallet data
- 🪝 Typed React hooks for state access
- 🔧 Flexible middleware and persistence configuration

## Usage

```typescript
import { createWalletStore, useAccountsState, useWalletDispatch } from '@unisat/wallet-state';

// Create store with platform-specific persistence
const store = createWalletStore({
  persistedKeys: ['ui', 'settings'],
  middleware: [/* platform-specific middleware */]
});

// Use in React components
function WalletComponent() {
  const accounts = useAccountsState();
  const dispatch = useWalletDispatch();
  
  // Component logic...
}
```

## Architecture

This package contains the Redux state management logic extracted from the browser extension, designed to be reused in the mobile application.

### Store
- `createWalletStore()` - Configurable store factory with platform-specific options

### Slices
- `accounts` - Account and keyring data
- `transactions` - Transaction history and pending transactions
- `settings` - User preferences and configuration
- `global` - Global application state
- `keyrings` - Keyring management state
- `ui` - UI-specific state (modals, navigation, etc.)

### Hooks
- Typed React hooks for each state slice
- `useWalletDispatch` - Typed dispatch hook
- `useWalletSelector` - Typed selector hook

## Migration Notes

The actual state structures and reducers are placeholders and will be populated by migrating the existing Redux logic from the extension and mobile applications.