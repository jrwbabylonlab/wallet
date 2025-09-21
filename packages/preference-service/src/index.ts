/**
 * UniSat Preference Service - Cross-platform preference management
 */

export * from './preference-service'
export * from './types'

// adapters
export { ExtensionStorageAdapter } from './adapters/extension'
export { MemoryStorageAdapter } from './adapters/memory'
export { MobileStorageAdapter } from './adapters/mobile'

// utils
export { MigrationManager } from './utils/migration'
