import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemoryStorageAdapter } from '../src/adapters/memory';
import { ExtensionPersistStoreAdapter } from '../src/adapters/extensionPersist';

describe('Storage Adapters', () => {
  describe('MemoryStorageAdapter', () => {
    let adapter: MemoryStorageAdapter;

    beforeEach(() => {
      adapter = new MemoryStorageAdapter();
    });

    it('should initialize correctly', async () => {
      await adapter.init();
      
      // Should be able to perform operations after init
      await expect(adapter.get('test')).resolves.toBeUndefined();
    });

    it('should handle multiple init calls gracefully', async () => {
      await adapter.init();
      await adapter.init(); // Should not cause issues
      
      await expect(adapter.get('test')).resolves.toBeUndefined();
    });

    it('should store and retrieve data correctly', async () => {
      await adapter.init();
      
      const testData = { key: 'value', number: 42, array: [1, 2, 3] };
      
      // Store data
      await adapter.set('test-key', testData);
      
      // Retrieve data
      const retrieved = await adapter.get('test-key');
      expect(retrieved).toEqual(testData);
    });

    it('should return undefined for non-existent keys', async () => {
      await adapter.init();
      
      const result = await adapter.get('non-existent');
      expect(result).toBeUndefined();
    });

    it('should remove data correctly', async () => {
      await adapter.init();
      
      await adapter.set('to-remove', 'test value');
      expect(await adapter.get('to-remove')).toBe('test value');
      
      await adapter.remove('to-remove');
      expect(await adapter.get('to-remove')).toBeUndefined();
    });

    it('should clear all data', async () => {
      await adapter.init();
      
      // Add some data
      await adapter.set('key1', 'value1');
      await adapter.set('key2', 'value2');
      
      expect(await adapter.get('key1')).toBe('value1');
      expect(await adapter.get('key2')).toBe('value2');
      
      // Clear all
      await adapter.clear();
      
      expect(await adapter.get('key1')).toBeUndefined();
      expect(await adapter.get('key2')).toBeUndefined();
    });

    it('should auto-initialize on first access', async () => {
      // Don't call init() manually
      
      // First access should auto-initialize
      await adapter.set('auto-init-test', 'value');
      const result = await adapter.get('auto-init-test');
      
      expect(result).toBe('value');
    });

    it('should provide raw store access', async () => {
      await adapter.init();
      
      await adapter.set('raw-test-1', 'value1');
      await adapter.set('raw-test-2', 'value2');
      
      const rawStore = adapter.getRawStore();
      
      expect(rawStore).toEqual({
        'raw-test-1': 'value1',
        'raw-test-2': 'value2'
      });
    });
  });

  describe('ExtensionPersistStoreAdapter', () => {
    let adapter: ExtensionPersistStoreAdapter;
    let mockCreatePersistStore: any;
    let mockStore: any;

    beforeEach(() => {
      mockStore = { vault: null, booted: null };
      mockCreatePersistStore = vi.fn().mockResolvedValue(mockStore);
      
      adapter = new ExtensionPersistStoreAdapter(mockCreatePersistStore, 'keyring');
    });

    it('should initialize correctly with createPersistStore', async () => {
      await adapter.init();
      
      expect(mockCreatePersistStore).toHaveBeenCalledWith({
        name: 'keyring',
        template: { vault: null, booted: null },
        fromStorage: true
      });
    });

    it('should handle multiple init calls gracefully', async () => {
      await adapter.init();
      await adapter.init();
      
      // Should only call createPersistStore once
      expect(mockCreatePersistStore).toHaveBeenCalledTimes(1);
    });

    it('should return entire store for main storage key', async () => {
      await adapter.init();
      
      const result = await adapter.get('keyring');
      expect(result).toEqual(mockStore);
      expect(result).toBe(mockStore); // Same object reference
    });

    it('should return individual properties for other keys', async () => {
      await adapter.init();
      
      // Add a property to the mock store
      mockStore.testProperty = 'test value';
      
      const result = await adapter.get('testProperty');
      expect(result).toBe('test value');
    });

    it('should return undefined for non-existent keys', async () => {
      await adapter.init();
      
      const result = await adapter.get('nonexistent');
      expect(result).toBeUndefined();
    });

    it('should replace entire store when setting main storage key', async () => {
      await adapter.init();
      
      const newData = {
        vault: 'encrypted-vault-data',
        booted: 'encrypted-boot-data'
      };
      
      await adapter.set('keyring', newData);
      
      // Old properties should be removed
      expect(mockStore.vault).toBe('encrypted-vault-data');
      expect(mockStore.booted).toBe('encrypted-boot-data');
    });

    it('should set individual properties for non-main keys', async () => {
      await adapter.init();
      
      await adapter.set('customProperty', 'custom value');
      
      expect(mockStore.customProperty).toBe('custom value');
      // Should not affect existing properties
      expect(mockStore.vault).toBe(null);
    });

    it('should handle null/undefined values gracefully', async () => {
      await adapter.init();
      
      // Setting null should not crash
      await adapter.set('keyring', null);
      
      // Original data should remain
      expect(mockStore.vault).toBe(null);
      expect(mockStore.booted).toBe(null);
    });

    it('should remove individual properties', async () => {
      await adapter.init();
      
      mockStore.testProp = 'value';
      
      await adapter.remove('testProp');
      
      expect(mockStore.testProp).toBeUndefined();
    });

    it('should clear all properties', async () => {
      await adapter.init();
      
      mockStore.prop1 = 'value1';
      mockStore.prop2 = 'value2';
      
      await adapter.clear();
      
      expect(mockStore.prop1).toBeUndefined();
      expect(mockStore.prop2).toBeUndefined();
      expect(mockStore.vault).toBeUndefined();
    });

    it('should auto-initialize on first access', async () => {
      // Don't call init() manually
      
      // First access should auto-initialize
      const result = await adapter.get('keyring');
      
      expect(mockCreatePersistStore).toHaveBeenCalled();
      expect(result).toBe(mockStore);
    });

    it('should provide raw store access', async () => {
      await adapter.init();
      
      mockStore.debugProp = 'debug value';
      
      const rawStore = adapter.getRawStore();
      
      expect(rawStore).toBe(mockStore);
      expect(rawStore.debugProp).toBe('debug value');
    });

    it('should handle createPersistStore failure', async () => {
      const errorAdapter = new ExtensionPersistStoreAdapter(
        vi.fn().mockRejectedValue(new Error('Storage failed')),
        'keyring'
      );
      
      await expect(errorAdapter.init()).rejects.toThrow('Storage failed');
    });

    it('should handle complex object replacement correctly', async () => {
      await adapter.init();
      
      // Set initial complex data
      const originalData = {
        vault: 'original-vault',
        booted: 'original-boot',
        extra: { nested: 'value' }
      };
      
      await adapter.set('keyring', originalData);
      expect(mockStore.vault).toBe('original-vault');
      expect(mockStore.extra).toEqual({ nested: 'value' });
      
      // Replace with different structure
      const newData = {
        vault: 'new-vault',
        different: 'property'
      };
      
      await adapter.set('keyring', newData);
      
      // Old properties should be gone
      expect(mockStore.booted).toBeUndefined();
      expect(mockStore.extra).toBeUndefined();
      
      // New properties should be present
      expect(mockStore.vault).toBe('new-vault');
      expect(mockStore.different).toBe('property');
    });
  });

  describe('Adapter compatibility', () => {
    it('should implement same interface', () => {
      const memoryAdapter = new MemoryStorageAdapter();
      const extensionAdapter = new ExtensionPersistStoreAdapter(vi.fn(), 'test');
      
      // Both should have same methods
      expect(typeof memoryAdapter.init).toBe('function');
      expect(typeof memoryAdapter.get).toBe('function');
      expect(typeof memoryAdapter.set).toBe('function');
      expect(typeof memoryAdapter.remove).toBe('function');
      expect(typeof memoryAdapter.clear).toBe('function');
      
      expect(typeof extensionAdapter.init).toBe('function');
      expect(typeof extensionAdapter.get).toBe('function');
      expect(typeof extensionAdapter.set).toBe('function');
      expect(typeof extensionAdapter.remove).toBe('function');
      expect(typeof extensionAdapter.clear).toBe('function');
    });
  });
});