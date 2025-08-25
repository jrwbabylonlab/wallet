import { PermissionService } from '../src/permission-service'
import { MemoryStorageAdapter } from '../src/adapters/memory'
import { ChainType } from '@unisat/wallet-types'
export const INTERNAL_REQUEST_ORIGIN = 'internal'

// Export interfaces for compatibility with extension
export interface ExtensionConnectedSite {
  origin: string
  icon: string
  name: string
  chain: ChainType
  e?: number
  isSigned: boolean
  isTop: boolean
  order?: number
  isConnected: boolean
}

export type ExtensionPermissionStore = {
  dumpCache: ReadonlyArray<any>
}

/**
 * Permission service wrapper - similar to the extension but for testing
 * Extends the base PermissionService with extension-like functionality
 */
export class PermissionServiceWrapper extends PermissionService {
  constructor() {
    // Create storage adapter using MemoryStorageAdapter for testing
    const storage = new MemoryStorageAdapter()

    // Call parent constructor with extension-compatible storage
    super({
      storage,
      logger: console,
      internalRequestOrigin: INTERNAL_REQUEST_ORIGIN,
    })
  }

  // Legacy method names for compatibility
  touchConnectedSite = (origin: string) => super.touchConnectedSite(origin)

  // Override init to ensure storage adapter is properly initialized
  async init(): Promise<void> {
    console.log('[PermissionService] Starting initialization...')

    // Then call parent init
    console.log('[PermissionService] Calling parent init...')
    await super.init()

    console.log('[PermissionService] Initialization complete')
  }
}
