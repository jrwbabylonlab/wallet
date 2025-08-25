import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { PermissionServiceWrapper, INTERNAL_REQUEST_ORIGIN } from './permission-service-wrapper'
import { ChainType } from '@unisat/wallet-types'

// Mock console to avoid noise in tests
const originalConsole = console

describe('PermissionServiceWrapper', () => {
  let permissionService: PermissionServiceWrapper

  beforeEach(() => {
    // Mock console.log to reduce test output noise
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'debug').mockImplementation(() => {})

    permissionService = new PermissionServiceWrapper()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('initialization', () => {
    it('should create a new instance successfully', () => {
      expect(permissionService).toBeDefined()
      expect(permissionService).toBeInstanceOf(PermissionServiceWrapper)
    })

    it('should initialize successfully', async () => {
      await expect(permissionService.init()).resolves.not.toThrow()

      expect(console.log).toHaveBeenCalledWith('[PermissionService] Starting initialization...')
      expect(console.log).toHaveBeenCalledWith('[PermissionService] Calling parent init...')
      expect(console.log).toHaveBeenCalledWith('[PermissionService] Initialization complete')
    })

    it('should handle multiple init calls gracefully', async () => {
      await permissionService.init()
      await permissionService.init() // Second call should not cause issues

      expect(permissionService.getConnectedSites()).toEqual([])
    })
  })

  describe('basic site management', () => {
    beforeEach(async () => {
      await permissionService.init()
    })

    it('should add a connected site successfully', async () => {
      await permissionService.addConnectedSite(
        'https://test.com',
        'Test Site',
        'https://test.com/icon.png',
        ChainType.BITCOIN_MAINNET,
        false
      )

      const site = permissionService.getSite('https://test.com')
      expect(site).toBeDefined()
      expect(site?.origin).toBe('https://test.com')
      expect(site?.name).toBe('Test Site')
      expect(site?.chain).toBe(ChainType.BITCOIN_MAINNET)
      expect(site?.isConnected).toBe(true)
      expect(site?.isSigned).toBe(false)
    })

    it('should get connected sites correctly', async () => {
      await permissionService.addConnectedSite(
        'https://site1.com',
        'Site 1',
        'icon1.png',
        ChainType.BITCOIN_MAINNET,
        true
      )

      await permissionService.addConnectedSite(
        'https://site2.com',
        'Site 2',
        'icon2.png',
        ChainType.BITCOIN_TESTNET,
        false
      )

      const connectedSites = permissionService.getConnectedSites()
      expect(connectedSites).toHaveLength(2)

      const origins = connectedSites.map(site => site.origin)
      expect(origins).toContain('https://site1.com')
      expect(origins).toContain('https://site2.com')
    })

    it('should check permissions correctly', async () => {
      await permissionService.addConnectedSite(
        'https://permitted.com',
        'Permitted Site',
        'icon.png',
        ChainType.BITCOIN_MAINNET,
        false
      )

      expect(permissionService.hasPermission('https://permitted.com')).toBe(true)
      expect(permissionService.hasPermission('https://unknown.com')).toBe(false)
      expect(permissionService.hasPermission(INTERNAL_REQUEST_ORIGIN)).toBe(true)
    })

    it('should remove connected site correctly', async () => {
      await permissionService.addConnectedSite(
        'https://to-remove.com',
        'To Remove',
        'icon.png',
        ChainType.BITCOIN_MAINNET,
        false
      )

      expect(permissionService.hasPermission('https://to-remove.com')).toBe(true)

      await permissionService.removeConnectedSite('https://to-remove.com')

      // Site should still exist but be disconnected
      const site = permissionService.getSite('https://to-remove.com')
      expect(site?.isConnected).toBe(false)
      expect(permissionService.hasPermission('https://to-remove.com')).toBe(false)

      // Should not appear in connected sites list
      const connectedSites = permissionService.getConnectedSites()
      expect(connectedSites.find(s => s.origin === 'https://to-remove.com')).toBeUndefined()
    })
  })

  describe('site management operations', () => {
    beforeEach(async () => {
      await permissionService.init()

      // Add some test sites
      await permissionService.addConnectedSite(
        'https://site1.com',
        'Site 1',
        'icon1.png',
        ChainType.BITCOIN_MAINNET,
        false
      )

      await permissionService.addConnectedSite(
        'https://site2.com',
        'Site 2',
        'icon2.png',
        ChainType.BITCOIN_MAINNET,
        true
      )
    })

    it('should update connected site correctly', async () => {
      await permissionService.updateConnectSite(
        'https://site1.com',
        { name: 'Updated Site 1', isSigned: true },
        true
      )

      const updatedSite = permissionService.getSite('https://site1.com')
      expect(updatedSite?.name).toBe('Updated Site 1')
      expect(updatedSite?.isSigned).toBe(true)
      expect(updatedSite?.origin).toBe('https://site1.com') // Should preserve other properties
    })

    it('should pin and unpin sites correctly', async () => {
      // Pin a site
      await permissionService.topConnectedSite('https://site1.com', 1)

      let site = permissionService.getSite('https://site1.com')
      expect(site?.isTop).toBe(true)
      expect(site?.order).toBe(1)

      // Unpin the site
      await permissionService.unpinConnectedSite('https://site1.com')

      site = permissionService.getSite('https://site1.com')
      expect(site?.isTop).toBe(false)
    })

    it('should get recent connected sites with correct order', async () => {
      // Pin site2
      await permissionService.topConnectedSite('https://site2.com', 1)

      const recentSites = permissionService.getRecentConnectedSites()
      expect(recentSites).toHaveLength(2)

      // Pinned site should come first
      expect(recentSites[0]?.origin).toBe('https://site2.com')
      expect(recentSites[0]?.isTop).toBe(true)

      // Regular site should follow
      expect(recentSites[1]?.origin).toBe('https://site1.com')
      expect(recentSites[1]?.isTop).toBe(false)
    })

    it('should get sites by chain type', () => {
      const bitcoinSites = permissionService.getSitesByDefaultChain(ChainType.BITCOIN_MAINNET)
      expect(bitcoinSites).toHaveLength(2)

      const testnetSites = permissionService.getSitesByDefaultChain(ChainType.BITCOIN_TESTNET)
      expect(testnetSites).toHaveLength(0)
    })

    it('should handle touch connected site', async () => {
      await expect(permissionService.touchConnectedSite('https://site1.com')).resolves.not.toThrow()
    })

    it('should ignore touch for internal origin', async () => {
      await expect(
        permissionService.touchConnectedSite(INTERNAL_REQUEST_ORIGIN)
      ).resolves.not.toThrow()
    })
  })

  describe('statistics and utility functions', () => {
    beforeEach(async () => {
      await permissionService.init()

      await permissionService.addConnectedSite(
        'https://connected1.com',
        'Connected 1',
        'icon.png',
        ChainType.BITCOIN_MAINNET,
        false
      )
      await permissionService.addConnectedSite(
        'https://connected2.com',
        'Connected 2',
        'icon.png',
        ChainType.BITCOIN_MAINNET,
        false
      )
      await permissionService.topConnectedSite('https://connected1.com', 1) // Pin one site
    })

    it('should provide correct statistics', () => {
      const stats = permissionService.getStats()

      expect(stats.total).toBe(2) // Total sites in cache
      expect(stats.connected).toBe(2) // Connected sites
      expect(stats.pinned).toBe(1) // Pinned sites
    })

    it('should check if origin is internal', () => {
      expect(permissionService.isInternalOrigin(INTERNAL_REQUEST_ORIGIN)).toBe(true)
      expect(permissionService.isInternalOrigin('https://external.com')).toBe(false)
    })

    it('should clear all permissions', async () => {
      await permissionService.clearAllPermissions()

      const connectedSites = permissionService.getConnectedSites()
      expect(connectedSites).toHaveLength(0)

      const stats = permissionService.getStats()
      expect(stats.total).toBe(0)
      expect(stats.connected).toBe(0)
      expect(stats.pinned).toBe(0)
    })

    it('should set recent connected sites order', async () => {
      const site1 = permissionService.getSite('https://connected1.com')
      const site2 = permissionService.getSite('https://connected2.com')

      expect(site1).toBeDefined()
      expect(site2).toBeDefined()

      // Reorder sites (site2 first, then site1)
      await permissionService.setRecentConnectedSites([site2!, site1!])

      const recentSites = permissionService.getRecentConnectedSites()
      // Note: pinned sites still come first regardless of the order we set
      expect(recentSites[0]?.origin).toBe('https://connected1.com') // Still pinned
      expect(recentSites[1]?.origin).toBe('https://connected2.com')
    })
  })

  describe('edge cases and error handling', () => {
    beforeEach(async () => {
      await permissionService.init()
    })

    it('should handle operations on non-existent sites', async () => {
      await expect(
        permissionService.updateConnectSite('https://non-existent.com', { name: 'Updated' })
      ).resolves.not.toThrow()

      await expect(
        permissionService.removeConnectedSite('https://non-existent.com')
      ).resolves.not.toThrow()
      await expect(
        permissionService.topConnectedSite('https://non-existent.com')
      ).resolves.not.toThrow()
      await expect(
        permissionService.unpinConnectedSite('https://non-existent.com')
      ).resolves.not.toThrow()
    })

    it('should handle empty state correctly', () => {
      expect(permissionService.getConnectedSites()).toEqual([])
      expect(permissionService.getRecentConnectedSites()).toEqual([])
      expect(permissionService.getSite('https://any.com')).toBeUndefined()
      expect(permissionService.hasPermission('https://any.com')).toBe(false)

      const stats = permissionService.getStats()
      expect(stats.total).toBe(0)
      expect(stats.connected).toBe(0)
      expect(stats.pinned).toBe(0)
    })

    it('should handle getWithoutUpdate correctly', async () => {
      await permissionService.addConnectedSite(
        'https://test.com',
        'Test',
        'icon.png',
        ChainType.BITCOIN_MAINNET,
        false
      )

      const site = permissionService.getWithoutUpdate('https://test.com')
      expect(site).toBeDefined()
      expect(site?.origin).toBe('https://test.com')
    })

    it('should handle getConnectedSite correctly', async () => {
      await permissionService.addConnectedSite(
        'https://test.com',
        'Test',
        'icon.png',
        ChainType.BITCOIN_MAINNET,
        false
      )

      const site = permissionService.getConnectedSite('https://test.com')
      expect(site).toBeDefined()
      expect(site?.isConnected).toBe(true)

      // Disconnect the site
      await permissionService.removeConnectedSite('https://test.com')

      const disconnectedSite = permissionService.getConnectedSite('https://test.com')
      expect(disconnectedSite).toBeUndefined()
    })
  })
})
