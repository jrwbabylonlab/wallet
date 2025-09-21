import { configureStore } from '@reduxjs/toolkit';
import type { AppState } from '../types';

// Import reducers (to be implemented)
// import { accountsReducer } from '../slices/accounts';
// import { transactionsReducer } from '../slices/transactions';
// import { settingsReducer } from '../slices/settings';
// import { globalReducer } from '../slices/global';
// import { keyringsReducer } from '../slices/keyrings';
// import { uiReducer } from '../slices/ui';

/**
 * Create store with platform-specific middleware and persistence
 */
export function createWalletStore(options?: {
  persistedKeys?: string[];
  middleware?: any[];
}) {
  return configureStore({
    reducer: {
      // accounts: accountsReducer,
      // transactions: transactionsReducer,
      // settings: settingsReducer,
      // global: globalReducer,
      // keyrings: keyringsReducer,
      // ui: uiReducer,
    },
    middleware: (getDefaultMiddleware) => {
      let middleware = getDefaultMiddleware({ thunk: true });
      
      if (options?.middleware) {
        middleware = middleware.concat(options.middleware);
      }
      
      return middleware;
    },
    // Platform-specific preloaded state will be handled by the consuming app
  });
}

export type WalletStore = ReturnType<typeof createWalletStore>;
export type WalletDispatch = WalletStore['dispatch'];
export type { AppState };