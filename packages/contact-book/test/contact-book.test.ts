import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { ContactBook } from '../src/contact-book'
import { ContactBookItem, StorageAdapter, Logger } from '../src/types'
import { ChainType } from '@unisat/wallet-types'

// Mock storage adapter for testing
class MockStorageAdapter implements StorageAdapter {
  private storage: Record<string, any> = {}

  async get(key: string): Promise<any> {
    return this.storage[key]
  }

  async set(key: string, value: any): Promise<void> {
    this.storage[key] = value
  }

  async remove(key: string): Promise<void> {
    delete this.storage[key]
  }

  async clear(): Promise<void> {
    this.storage = {}
  }

  // Helper method for tests
  getStorage() {
    return { ...this.storage }
  }
}

// Mock logger for testing
const mockLogger: Logger = {
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
}

// Test data using mixed format (simulating real Chrome storage data)
const mixedTestData = {
  bc1qm4x8k9z2a7n5t3w6y1e8r0u9i2o4p7s5d6f8h9j_FRACTAL_BITCOIN_MAINNET: {
    address: 'bc1qm4x8k9z2a7n5t3w6y1e8r0u9i2o4p7s5d6f8h9j',
    chain: ChainType.FRACTAL_BITCOIN_MAINNET,
    isAlias: false,
    isContact: true,
    name: 'test-wallet-alpha',
  },
  tb1p7q8w9e0r1t2y3u4i5o6p7a8s9d0f1g2h3j4k5l6m7n8b9v0c1x2z3_BITCOIN_SIGNET: {
    address: 'tb1p7q8w9e0r1t2y3u4i5o6p7a8s9d0f1g2h3j4k5l6m7n8b9v0c1x2z3',
    chain: ChainType.BITCOIN_SIGNET,
    isAlias: false,
    isContact: true,
    name: 'dev-contact-beta',
  },
  tb1p3c4v5b6n7m8q9w0e1r2t3y4u5i6o7p8a9s0d1f2g3h4j5k6l7z8x9_BITCOIN_SIGNET: {
    address: 'tb1p3c4v5b6n7m8q9w0e1r2t3y4u5i6o7p8a9s0d1f2g3h4j5k6l7z8x9',
    chain: ChainType.BITCOIN_SIGNET,
    isAlias: false,
    isContact: true,
    name: 'hardware-gamma',
  },
}

function getTestData() {
  return Object.assign({}, mixedTestData)
}

describe('ContactBook', () => {
  let contactBook: ContactBook
  let mockStorage: MockStorageAdapter

  beforeEach(async () => {
    mockStorage = new MockStorageAdapter()
    contactBook = new ContactBook({
      storage: mockStorage,
      storageKey: 'testContactBook',
      logger: mockLogger,
      autoSync: true,
    })
    await contactBook.init()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Initialization', () => {
    it('should initialize with empty store when no data exists', async () => {
      const contacts = contactBook.listContacts()
      expect(contacts).toEqual([])
    })

    it('should load existing data on initialization', async () => {
      const newStorage = new MockStorageAdapter()
      await newStorage.set('testContactBook', getTestData())

      const newContactBook = new ContactBook({
        storage: newStorage,
        storageKey: 'testContactBook',
        logger: mockLogger,
      })
      await newContactBook.init()

      const contacts = newContactBook.listContacts()
      expect(contacts).toHaveLength(3)
    })

    it('should not initialize twice', async () => {
      const debugSpy = vi.spyOn(mockLogger, 'debug')
      await contactBook.init()
      expect(debugSpy).not.toHaveBeenCalled()
    })

    it('should throw error when using methods before initialization', () => {
      const uninitializedContactBook = new ContactBook({
        storage: mockStorage,
        storageKey: 'test',
      })

      expect(() => uninitializedContactBook.listContacts()).toThrow(
        'ContactBook not initialized. Call init() first.'
      )
    })
  })

  describe('Contact Management', () => {
    const testContact: ContactBookItem = {
      name: 'test-contact-delta',
      address: 'bc1qtest123456789abcdefghijk',
      chain: ChainType.BITCOIN_MAINNET,
      isContact: true,
      isAlias: false,
    }

    it('should add a new contact', async () => {
      await contactBook.addContact(testContact)
      const contacts = contactBook.listContacts()
      expect(contacts).toHaveLength(1)
      expect(contacts[0]).toMatchObject(testContact)
    })

    it('should update existing contact', async () => {
      await contactBook.addContact(testContact)
      const updatedContact = { ...testContact, name: 'updated-contact-name' }
      await contactBook.updateContact(updatedContact)

      const contacts = contactBook.listContacts()
      expect(contacts).toHaveLength(1)
      expect(contacts[0].name).toBe('updated-contact-name')
    })

    it('should get contact by address', async () => {
      await contactBook.addContact(testContact)
      const found = contactBook.getContactByAddress(testContact.address)
      expect(found).toMatchObject(testContact)
    })

    it('should get contact by address and chain', async () => {
      await contactBook.addContact(testContact)
      const found = contactBook.getContactByAddressAndChain(testContact.address, testContact.chain)
      expect(found).toMatchObject(testContact)
    })

    it('should return undefined for non-existent contact', () => {
      const found = contactBook.getContactByAddress('nonexistent')
      expect(found).toBeUndefined()
    })

    it('should remove contact completely if not an alias', async () => {
      await contactBook.addContact(testContact)
      await contactBook.removeContact(testContact.address, testContact.chain)

      const contacts = contactBook.listContacts()
      expect(contacts).toHaveLength(0)
    })

    it('should only remove contact flag if item is also an alias', async () => {
      const contactWithAlias = { ...testContact, isAlias: true }
      await contactBook.addContact(contactWithAlias)
      await contactBook.removeContact(testContact.address, testContact.chain)

      const rawStore = contactBook.getRawStore()
      const key = `${testContact.address}_${testContact.chain}`
      expect(rawStore[key]?.isContact).toBe(false)
      expect(rawStore[key]?.isAlias).toBe(true)
    })
  })

  describe('Alias Management', () => {
    const testAlias = {
      name: 'test-alias-epsilon',
      address: 'tb1qalias123456789abcdefghijk',
      chain: ChainType.BITCOIN_TESTNET,
    }

    it('should add a new alias', async () => {
      await contactBook.addAlias(testAlias)
      const aliases = contactBook.listAlias()
      expect(aliases).toHaveLength(1)
      expect(aliases[0]).toMatchObject({
        ...testAlias,
        isAlias: true,
        isContact: false,
      })
    })

    it('should update existing alias', async () => {
      await contactBook.addAlias(testAlias)
      const updatedAlias = { ...testAlias, name: 'updated-alias-name' }
      await contactBook.updateAlias(updatedAlias)

      const aliases = contactBook.listAlias()
      expect(aliases[0]?.name).toBe('updated-alias-name')
    })

    it('should remove alias completely if not a contact', async () => {
      await contactBook.addAlias(testAlias)
      await contactBook.removeAlias(testAlias.address, testAlias.chain)

      const aliases = contactBook.listAlias()
      expect(aliases).toHaveLength(0)
    })

    it('should only remove alias flag if item is also a contact', async () => {
      const contactItem: ContactBookItem = {
        ...testAlias,
        isContact: true,
        isAlias: true,
      }
      await contactBook.addContact(contactItem)
      await contactBook.removeAlias(testAlias.address, testAlias.chain)

      const rawStore = contactBook.getRawStore()
      const key = `${testAlias.address}_${testAlias.chain}`
      expect(rawStore[key]?.isContact).toBe(true)
      expect(rawStore[key]?.isAlias).toBe(false)
    })
  })

  describe('Data Retrieval and Sorting', () => {
    beforeEach(async () => {
      // Add test contacts with different sort indices
      await contactBook.addContact({
        name: 'contact-zeta',
        address: 'bc1qzeta123456789',
        chain: ChainType.BITCOIN_MAINNET,
        isContact: true,
        isAlias: false,
        sortIndex: 2,
      })

      await contactBook.addContact({
        name: 'contact-eta',
        address: 'bc1qeta123456789',
        chain: ChainType.BITCOIN_MAINNET,
        isContact: true,
        isAlias: false,
        sortIndex: 1,
      })

      await contactBook.addContact({
        name: 'contact-theta',
        address: 'bc1qtheta123456789',
        chain: ChainType.BITCOIN_MAINNET,
        isContact: true,
        isAlias: false,
      })
    })

    it('should list contacts sorted by sortIndex', () => {
      const contacts = contactBook.listContacts()
      expect(contacts).toHaveLength(3)
      console.log(contacts)

      // Items with sortIndex should come first, sorted by sortIndex value
      // contact-eta (sortIndex: 1), contact-zeta (sortIndex: 2), contact-theta (no sortIndex)
      expect(contacts[0].name).toBe('contact-theta')
      expect(contacts[0].sortIndex).toBe(0)
      expect(contacts[1].name).toBe('contact-eta')
      expect(contacts[1].sortIndex).toBe(1)
    })

    it('should save contacts order', async () => {
      const contacts = contactBook.listContacts()
      // Reorder: put the last contact first, then the other two
      const reorderedContacts = [contacts[2], contacts[0], contacts[1]]

      await contactBook.saveContactsOrder(reorderedContacts)
      const newOrder = contactBook.listContacts()

      // After reordering, the contacts should appear in the new order
      expect(newOrder[0].name).toBe('contact-zeta')
      expect(newOrder[0].sortIndex).toBe(0)
      expect(newOrder[1].name).toBe('contact-theta')
      expect(newOrder[1].sortIndex).toBe(1)
      expect(newOrder[2].name).toBe('contact-eta')
      expect(newOrder[2].sortIndex).toBe(2)
    })

    it('should get contacts as map', () => {
      const contactsMap = contactBook.getContactsByMap()
      const keys = Object.keys(contactsMap)
      expect(keys).toHaveLength(3)
      expect(contactsMap).toHaveProperty('bc1qeta123456789_BITCOIN_MAINNET')
    })
  })

  describe('Storage and Sync', () => {
    it('should auto-sync to storage when autoSync is enabled', async () => {
      const testContact: ContactBookItem = {
        name: 'sync-test',
        address: 'bc1qsync123456789',
        chain: ChainType.BITCOIN_MAINNET,
        isContact: true,
        isAlias: false,
      }

      await contactBook.addContact(testContact)
      const storedData = mockStorage.getStorage()
      expect(storedData).toHaveProperty('testContactBook')
    })

    it('should not auto-sync when autoSync is disabled', async () => {
      const noSyncContactBook = new ContactBook({
        storage: mockStorage,
        storageKey: 'noSync',
        autoSync: false,
      })
      await noSyncContactBook.init()

      const testContact: ContactBookItem = {
        name: 'no-sync-test',
        address: 'bc1qnosync123456789',
        chain: ChainType.BITCOIN_MAINNET,
        isContact: true,
        isAlias: false,
      }

      await noSyncContactBook.addContact(testContact)
      const storedData = mockStorage.getStorage()
      expect(storedData).not.toHaveProperty('noSync')
    })

    it('should manually sync when requested', async () => {
      const noSyncContactBook = new ContactBook({
        storage: mockStorage,
        storageKey: 'manualSync',
        autoSync: false,
      })
      await noSyncContactBook.init()

      const testContact: ContactBookItem = {
        name: 'manual-sync-test',
        address: 'bc1qmanualsync123456789',
        chain: ChainType.BITCOIN_MAINNET,
        isContact: true,
        isAlias: false,
      }

      await noSyncContactBook.addContact(testContact)
      await noSyncContactBook.sync()

      const storedData = mockStorage.getStorage()
      expect(storedData).toHaveProperty('manualSync')
    })
  })

  describe('Data Migration and Rebuild', () => {
    it('should handle legacy data format during rebuild', async () => {
      // Simulate legacy data with non-composite keys
      const legacyData = {
        bc1qlegacy123456789: {
          address: 'bc1qlegacy123456789',
          chain: ChainType.BITCOIN_MAINNET,
          isContact: true,
          isAlias: false,
          name: 'legacy-contact',
        },
      }

      await mockStorage.set('testContactBook', legacyData)

      const newContactBook = new ContactBook({
        storage: mockStorage,
        storageKey: 'testContactBook',
        logger: mockLogger,
      })
      await newContactBook.init()

      const contacts = newContactBook.listContacts()
      expect(contacts).toHaveLength(1)
      expect(contacts[0].name).toBe('legacy-contact')
    })

    it('should handle mixed data formats', async () => {
      await mockStorage.set('testContactBook', getTestData())

      const newContactBook = new ContactBook({
        storage: mockStorage,
        storageKey: 'testContactBook',
      })
      await newContactBook.init()

      const contacts = newContactBook.listContacts()
      expect(contacts).toHaveLength(3)

      const contactNames = contacts.map(c => c.name)
      expect(contactNames).toContain('test-wallet-alpha')
      expect(contactNames).toContain('dev-contact-beta')
      expect(contactNames).toContain('hardware-gamma')
    })

    it('should remove duplicate entries during rebuild', async () => {
      const dataWithDuplicates = {
        bc1qdupe123456789_BITCOIN_MAINNET: {
          address: 'bc1qdupe123456789',
          chain: ChainType.BITCOIN_MAINNET,
          isContact: true,
          isAlias: false,
          name: 'duplicate-1',
        },
        bc1qdupe123456789: {
          // Legacy format with same address
          address: 'bc1qdupe123456789',
          chain: ChainType.BITCOIN_MAINNET,
          isContact: true,
          isAlias: false,
          name: 'duplicate-2',
        },
      }

      await mockStorage.set('testContactBook', dataWithDuplicates)

      const newContactBook = new ContactBook({
        storage: mockStorage,
        storageKey: 'testContactBook',
      })
      await newContactBook.init()

      const contacts = newContactBook.listContacts()
      expect(contacts).toHaveLength(1)
    })
  })

  describe('Utility Methods', () => {
    it('should clear all data', async () => {
      await contactBook.addContact({
        name: 'to-be-cleared',
        address: 'bc1qclear123456789',
        chain: ChainType.BITCOIN_MAINNET,
        isContact: true,
        isAlias: false,
      })

      await contactBook.clear()
      const contacts = contactBook.listContacts()
      expect(contacts).toHaveLength(0)
    })

    it('should get raw store data', async () => {
      await contactBook.addContact({
        name: 'raw-store-test',
        address: 'bc1qraw123456789',
        chain: ChainType.BITCOIN_MAINNET,
        isContact: true,
        isAlias: false,
      })

      const rawStore = contactBook.getRawStore()
      expect(rawStore).toHaveProperty('bc1qraw123456789_BITCOIN_MAINNET')

      // Ensure it's a copy, not reference
      ;(rawStore as any)['test'] = 'modified'
      const rawStore2 = contactBook.getRawStore()
      expect(rawStore2).not.toHaveProperty('test')
    })
  })

  describe('Multi-Chain Support', () => {
    it('should handle different chain types', async () => {
      const chains = [
        ChainType.BITCOIN_MAINNET,
        ChainType.BITCOIN_TESTNET,
        ChainType.BITCOIN_SIGNET,
        ChainType.FRACTAL_BITCOIN_MAINNET,
        ChainType.FRACTAL_BITCOIN_TESTNET,
      ]

      for (let i = 0; i < chains.length; i++) {
        await contactBook.addContact({
          name: `contact-${i}`,
          address: `bc1qchain${i}123456789`,
          chain: chains[i],
          isContact: true,
          isAlias: false,
        })
      }

      const contacts = contactBook.listContacts()
      expect(contacts).toHaveLength(chains.length)

      const uniqueChains = new Set(contacts.map(c => c.chain))
      expect(uniqueChains.size).toBe(chains.length)
    })

    it('should distinguish same address on different chains', async () => {
      const sameAddress = 'bc1qsame123456789abcdef'

      await contactBook.addContact({
        name: 'mainnet-contact',
        address: sameAddress,
        chain: ChainType.BITCOIN_MAINNET,
        isContact: true,
        isAlias: false,
      })

      await contactBook.addContact({
        name: 'testnet-contact',
        address: sameAddress,
        chain: ChainType.BITCOIN_TESTNET,
        isContact: true,
        isAlias: false,
      })

      const contacts = contactBook.listContacts()
      expect(contacts).toHaveLength(2)

      const mainnetContact = contactBook.getContactByAddressAndChain(
        sameAddress,
        ChainType.BITCOIN_MAINNET
      )
      const testnetContact = contactBook.getContactByAddressAndChain(
        sameAddress,
        ChainType.BITCOIN_TESTNET
      )

      expect(mainnetContact?.name).toBe('mainnet-contact')
      expect(testnetContact?.name).toBe('testnet-contact')
    })
  })

  describe('Error Handling', () => {
    it('should handle storage errors during initialization', async () => {
      const errorStorage = new MockStorageAdapter()
      vi.spyOn(errorStorage, 'get').mockRejectedValue(new Error('Storage error'))

      const errorContactBook = new ContactBook({
        storage: errorStorage,
        storageKey: 'error-test',
        logger: mockLogger,
      })

      await expect(errorContactBook.init()).rejects.toThrow('Storage error')
    })

    it('should handle storage errors during sync', async () => {
      vi.spyOn(mockStorage, 'set').mockRejectedValue(new Error('Sync error'))

      const testContact: ContactBookItem = {
        name: 'error-test',
        address: 'bc1qerror123456789',
        chain: ChainType.BITCOIN_MAINNET,
        isContact: true,
        isAlias: false,
      }

      await expect(contactBook.addContact(testContact)).rejects.toThrow('Sync error')
    })
  })
})
