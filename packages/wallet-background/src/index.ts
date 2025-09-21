/**
 * UniSat Wallet Background - Main exports
 */

// Core background manager
export * from './background-manager';

// Adapters for cross-platform compatibility
export * from './adapters';

// Controllers
export * from './controllers';

// Re-export commonly used types
export type {
  BackgroundManagerConfig,
  BackgroundManagerEvents
} from './background-manager';