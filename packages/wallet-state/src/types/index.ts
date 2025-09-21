// Redux state types
export interface AppState {
  accounts: AccountsState;
  transactions: TransactionsState;
  settings: SettingsState;
  global: GlobalState;
  keyrings: KeyringsState;
  ui: UIState;
}

// Individual state slice types (to be populated from existing code)
export interface AccountsState {
  // To be populated with actual account state structure
}

export interface TransactionsState {
  // To be populated with actual transaction state structure
}

export interface SettingsState {
  // To be populated with actual settings state structure
}

export interface GlobalState {
  // To be populated with actual global state structure
}

export interface KeyringsState {
  // To be populated with actual keyrings state structure
}

export interface UIState {
  // To be populated with actual UI state structure
}

// Re-export common types
export * from '@unisat/wallet-types';