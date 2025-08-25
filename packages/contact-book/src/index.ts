/**
 * @unisat/contact-book - Universal contact book management with multi-chain support
 */

// Main ContactBook class
export { ContactBook } from './contact-book'

// Types and interfaces
export type {
  ContactBookItem,
  UIContactBookItem,
  ContactBookStore,
  StorageAdapter,
  Logger,
  ContactBookConfig,
} from './types'

// Storage adapters (also available via separate import)
export {
  MemoryStorageAdapter,
  LocalStorageAdapter,
  ExtensionStorageAdapter,
  ExtensionPersistStoreAdapter,
} from './adapters'

// Default export for convenience
export { ContactBook as default } from './contact-book'
