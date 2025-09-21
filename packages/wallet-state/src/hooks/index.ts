import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { WalletDispatch } from '../store';
import type { AppState } from '../types';

// Typed hooks for the wallet store
export const useWalletDispatch = () => useDispatch<WalletDispatch>();
export const useWalletSelector: TypedUseSelectorHook<AppState> = useSelector;

// Re-export common hooks that will be migrated from existing code
export * from './accounts';
export * from './transactions';
export * from './settings';
export * from './global';
export * from './keyrings';
export * from './ui';