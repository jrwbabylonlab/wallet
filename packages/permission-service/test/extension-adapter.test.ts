import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ExtensionPersistStoreAdapter } from '../src/adapters'

// Mock createPersistStore function to simulate extension behavior
const mockCreatePersistStore = vi.fn()

// Real permission data from extension
const REAL_PERMISSION_DATA = {
  "dumpCache": [
    {"e": 0, "k": "https://pizzaswap.io", "v": {"chain": "BITCOIN_MAINNET", "icon": "https://next-cdn.unisat.io/_/2025-v1140/logo/logo_ind_swap.svg", "isConnected": true, "isSigned": false, "isTop": false, "name": "PizzaSwap", "origin": "https://pizzaswap.io"}},
    {"e": 0, "k": "https://www.google.com", "v": {"chain": "BTC", "icon": "/images/branding/googleg/1x/googleg_standard_color_128dp.png", "isConnected": true, "isSigned": false, "isTop": false, "name": "Google", "origin": "https://www.google.com"}},
    {"e": 0, "k": "https://mempool.space", "v": {"chain": "BTC", "icon": "https://mempool.space/resources/favicons/favicon-32x32.png", "isConnected": false, "isSigned": true, "isTop": false, "name": "mempool - Bitcoin Explorer", "origin": "https://mempool.space"}}
  ]
}

describe('ExtensionPersistStoreAdapter', () => {
  let adapter: ExtensionPersistStoreAdapter
  let mockStore: any

  beforeEach(() => {
    // Reset mock
    mockCreatePersistStore.mockReset()
    
    // Create a mock store that behaves like the extension's createPersistStore
    mockStore = { ...REAL_PERMISSION_DATA }
    
    // Mock createPersistStore to return our mock store
    mockCreatePersistStore.mockResolvedValue(mockStore)
    
    adapter = new ExtensionPersistStoreAdapter(mockCreatePersistStore, 'permission')
  })

  describe('initialization', () => {
    it('should initialize correctly with createPersistStore', async () => {
      await adapter.init()
      
      expect(mockCreatePersistStore).toHaveBeenCalledWith({
        name: 'permission',
        template: { dumpCache: [] },
        fromStorage: true
      })
    })

    it('should handle multiple init calls gracefully', async () => {
      await adapter.init()
      await adapter.init()
      
      // Should only call createPersistStore once
      expect(mockCreatePersistStore).toHaveBeenCalledTimes(1)
    })
  })

  describe('data access with real permission data', () => {
    beforeEach(async () => {
      await adapter.init()
    })

    it('should return entire store for main storage key', async () => {
      const result = await adapter.get('permission')
      
      expect(result).toEqual(REAL_PERMISSION_DATA)
      expect(result.dumpCache).toBeDefined()
      expect(result.dumpCache).toHaveLength(3)
    })

    it('should return undefined for non-existent keys', async () => {
      const result = await adapter.get('nonexistent')
      expect(result).toBeUndefined()
    })

    it('should access nested properties correctly', async () => {
      // Add a property to the mock store
      mockStore.testProperty = 'test value'
      
      const result = await adapter.get('testProperty')
      expect(result).toBe('test value')
    })
  })

  describe('data persistence', () => {
    beforeEach(async () => {
      await adapter.init()
    })

    it('should update entire store when setting main storage key', async () => {
      const newData = {
        dumpCache: [
          {"e": 0, "k": "https://new-site.com", "v": {"chain": "BITCOIN_MAINNET", "isConnected": true, "name": "New Site", "origin": "https://new-site.com"}}
        ]
      }
      
      await adapter.set('permission', newData)
      
      // Verify store was updated
      expect(mockStore.dumpCache).toEqual(newData.dumpCache)
      expect(mockStore.dumpCache).toHaveLength(1)
    })

    it('should replace store content completely when setting main key', async () => {
      const originalKeys = Object.keys(mockStore)
      expect(originalKeys).toContain('dumpCache')
      
      const newData = {
        newProperty: 'new value',
        anotherProperty: 123
      }
      
      await adapter.set('permission', newData)
      
      // Old properties should be removed
      expect(mockStore.dumpCache).toBeUndefined()
      
      // New properties should be present
      expect(mockStore.newProperty).toBe('new value')
      expect(mockStore.anotherProperty).toBe(123)
    })

    it('should set individual properties for non-main keys', async () => {
      await adapter.set('customProperty', 'custom value')
      
      expect(mockStore.customProperty).toBe('custom value')
      // Should not affect dumpCache
      expect(mockStore.dumpCache).toEqual(REAL_PERMISSION_DATA.dumpCache)
    })

    it('should handle null/undefined values gracefully', async () => {
      await adapter.set('permission', null)
      
      // Should not crash, but behavior may vary
      // In this case, it should not replace since value is null
      expect(mockStore.dumpCache).toEqual(REAL_PERMISSION_DATA.dumpCache)
    })
  })

  describe('data removal', () => {
    beforeEach(async () => {
      await adapter.init()
      // Add some test properties
      mockStore.testProp1 = 'value1'
      mockStore.testProp2 = 'value2'
    })

    it('should remove individual properties', async () => {
      await adapter.remove('testProp1')
      
      expect(mockStore.testProp1).toBeUndefined()
      expect(mockStore.testProp2).toBe('value2') // Should remain
      expect(mockStore.dumpCache).toBeDefined() // Should remain
    })

    it('should clear all properties', async () => {
      await adapter.clear()
      
      expect(mockStore.dumpCache).toBeUndefined()
      expect(mockStore.testProp1).toBeUndefined()
      expect(mockStore.testProp2).toBeUndefined()
    })
  })

  describe('error handling', () => {
    it('should handle createPersistStore failure', async () => {
      const errorAdapter = new ExtensionPersistStoreAdapter(
        vi.fn().mockRejectedValue(new Error('Storage failed')),
        'permission'
      )
      
      await expect(errorAdapter.init()).rejects.toThrow('Storage failed')
    })

    it('should auto-initialize on first access if not initialized', async () => {
      const uninitializedAdapter = new ExtensionPersistStoreAdapter(mockCreatePersistStore, 'permission')
      
      // Should auto-initialize on first get
      const result = await uninitializedAdapter.get('permission')
      
      expect(mockCreatePersistStore).toHaveBeenCalled()
      expect(result).toEqual(REAL_PERMISSION_DATA)
    })
  })

  describe('compatibility with original permission service', () => {
    beforeEach(async () => {
      await adapter.init()
    })

    it('should mimic original createPersistStore behavior exactly', async () => {
      // Original permission service did: this.store = storage || this.store
      const storageResult = await adapter.get('permission')
      
      // Should return the exact same structure as createPersistStore
      expect(storageResult).toEqual(mockStore)
      expect(storageResult).toBe(mockStore) // Should be the same object reference
    })

    it('should handle sync-like operations correctly', async () => {
      // Simulate what the original sync() method did
      const updatedData = {
        dumpCache: [
          ...REAL_PERMISSION_DATA.dumpCache,
          {"e": 0, "k": "https://new-site.com", "v": {"chain": "BITCOIN_MAINNET", "isConnected": true, "name": "New Site", "origin": "https://new-site.com"}}
        ]
      }
      
      await adapter.set('permission', updatedData)
      
      // Verify the update was applied
      const retrievedData = await adapter.get('permission')
      expect(retrievedData.dumpCache).toHaveLength(4)
      expect(retrievedData.dumpCache[3].k).toBe('https://new-site.com')
    })
  })
})