/**
 * Storage adapters for contact book
 */
export { MemoryStorageAdapter } from './memory';
export { LocalStorageAdapter } from './localStorage';
export { ExtensionStorageAdapter } from './extension';
export { ExtensionPersistStoreAdapter } from './extensionPersist';

// Re-export types
export type { StorageAdapter } from '../types';