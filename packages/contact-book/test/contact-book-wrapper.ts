import { ContactBook } from '../src/contact-book'
import { ExtensionPersistStoreAdapter } from '../src/adapters/extensionPersist'
import { ChainType } from '@unisat/wallet-types'

// Mock createPersistStore function to simulate extension behavior
const mockCreatePersistStore = async (config: any) => {
  // Return a simple object that behaves like extension storage
  const store: any = config.template || {}
  return store
}

// Export interfaces for compatibility with extension
export interface ExtensionContactBookItem {
  name: string
  address: string
  chain: ChainType
  isAlias: boolean
  isContact: boolean
  sortIndex?: number
}

export interface UIContactBookItem {
  name: string
  address: string
}

/**
 * ContactBook service - simple wrapper that initializes and exposes the ContactBook instance
 * This mimics the exact structure from unisat-extension
 */
export class ContactBookService extends ContactBook {
  constructor() {
    // Create storage adapter using the existing ExtensionPersistStoreAdapter
    const storage = new ExtensionPersistStoreAdapter(mockCreatePersistStore, 'contactBook')

    // Call parent constructor with extension-compatible storage
    super({
      storage,
      logger: console, // Use console for logging in development
    })
  }
}

// Create singleton instance like in the extension
const contactBookService = new ContactBookService()

export default contactBookService
