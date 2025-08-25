import { describe, it, expect, beforeEach } from 'vitest'
import { PermissionService, MemoryStorageAdapter } from '../src'
import { ChainType } from '@unisat/wallet-types'

// Real data from the extension to ensure compatibility
const REAL_PERMISSION_DATA = {
  dumpCache: [
    {
      e: 0,
      k: 'https://pizzaswap.io',
      v: {
        chain: 'BITCOIN_MAINNET',
        icon: 'https://next-cdn.unisat.io/_/2025-v1140/logo/logo_ind_swap.svg',
        isConnected: true,
        isSigned: false,
        isTop: false,
        name: 'PizzaSwap',
        origin: 'https://pizzaswap.io',
      },
    },
    {
      e: 0,
      k: 'https://www.google.com',
      v: {
        chain: 'BTC',
        icon: '/images/branding/googleg/1x/googleg_standard_color_128dp.png',
        isConnected: true,
        isSigned: false,
        isTop: false,
        name: 'Google',
        origin: 'https://www.google.com',
      },
    },
    {
      e: 0,
      k: 'https://fractal.unisat.io',
      v: {
        chain: 'BTC',
        icon: 'https://fractal.unisat.io/img/favicon.ico',
        isConnected: true,
        isSigned: true,
        isTop: false,
        name: 'UniSat',
        origin: 'https://fractal.unisat.io',
      },
    },
    {
      e: 0,
      k: 'https://github.com',
      v: {
        chain: 'BITCOIN_MAINNET',
        icon: 'https://github.githubassets.com/favicons/favicon.png',
        isConnected: true,
        isSigned: false,
        isTop: false,
        name: 'brimless-lab',
        origin: 'https://github.com',
      },
    },
    {
      e: 0,
      k: 'https://idclub.io',
      v: {
        chain: 'BTC',
        icon: 'https://idclub.io/favicon.ico',
        isConnected: true,
        isSigned: true,
        isTop: false,
        name: 'iDclub | Ordinals',
        origin: 'https://idclub.io',
      },
    },
    {
      e: 0,
      k: 'https://mempool.space',
      v: {
        chain: 'BTC',
        icon: 'https://mempool.space/resources/favicons/favicon-32x32.png',
        isConnected: false,
        isSigned: true,
        isTop: false,
        name: 'mempool - Bitcoin Explorer',
        origin: 'https://mempool.space',
      },
    },
    {
      e: 0,
      k: 'https://funkybit.fun',
      v: {
        chain: 'BITCOIN_MAINNET',
        icon: 'https://funkybit.fun/favicon.png',
        isConnected: true,
        isSigned: true,
        isTop: false,
        name: 'funkybit | Making Bitcoin Funky',
        origin: 'https://funkybit.fun',
      },
    },
    {
      e: 0,
      k: 'https://demo.unisat.io',
      v: {
        chain: 'BTC',
        icon: 'https://demo.unisat.io/favicon.ico',
        isConnected: true,
        isSigned: true,
        isTop: false,
        name: 'Unisat Wallet Demo',
        origin: 'https://demo.unisat.io',
      },
    },
  ],
}

function getTestPermissionData() {
  return Object.assign({}, { dumpCache: [...REAL_PERMISSION_DATA.dumpCache] }, {})
}

describe('PermissionService', () => {
  let permissionService: PermissionService
  let storage: MemoryStorageAdapter

  beforeEach(async () => {
    storage = new MemoryStorageAdapter()
    permissionService = new PermissionService({
      storage,
      logger: console,
      internalRequestOrigin: 'internal',
    })
  })

  describe('initialization with real data', () => {
    it('should load existing permission data correctly', async () => {
      // Pre-populate storage with real data
      await storage.set('permission', getTestPermissionData())

      // Initialize service
      await permissionService.init()

      // Verify connected sites are loaded
      const connectedSites = permissionService.getConnectedSites()
      expect(connectedSites).toHaveLength(7) // 7 connected sites from real data

      // Verify specific sites
      const pizzaSwap = permissionService.getSite('https://pizzaswap.io')
      expect(pizzaSwap).toBeDefined()
      expect(pizzaSwap?.name).toBe('PizzaSwap')
      expect(pizzaSwap?.isConnected).toBe(true)
      expect(pizzaSwap?.chain).toBe('BITCOIN_MAINNET')

      // Verify disconnected site
      const mempool = permissionService.getSite('https://mempool.space')
      expect(mempool).toBeDefined()
      expect(mempool?.isConnected).toBe(false)
    })

    it('should maintain permission state correctly', async () => {
      await storage.set('permission', getTestPermissionData())
      await permissionService.init()

      // Test permission checks
      expect(permissionService.hasPermission('https://pizzaswap.io')).toBe(true)
      expect(permissionService.hasPermission('https://mempool.space')).toBe(false) // disconnected
      expect(permissionService.hasPermission('https://unknown-site.com')).toBe(false)
      expect(permissionService.hasPermission('internal')).toBe(true) // internal origin
    })
  })

  describe('site management', () => {
    it('should add new connected site correctly', async () => {
      await storage.set('permission', getTestPermissionData())
      await permissionService.init()

      await permissionService.addConnectedSite(
        'https://new-site.com',
        'New Site',
        'https://new-site.com/favicon.ico',
        ChainType.BITCOIN_MAINNET,
        false
      )

      const newSite = permissionService.getSite('https://new-site.com')
      expect(newSite).toBeDefined()
      expect(newSite?.isConnected).toBe(true)
      expect(newSite?.chain).toBe(ChainType.BITCOIN_MAINNET)

      // Should now have 8 connected sites
      expect(permissionService.getConnectedSites()).toHaveLength(8)
    })

    it('should remove connected site correctly', async () => {
      await storage.set('permission', getTestPermissionData())
      await permissionService.init()

      await permissionService.removeConnectedSite('https://pizzaswap.io')

      const removedSite = permissionService.getSite('https://pizzaswap.io')
      expect(removedSite?.isConnected).toBe(false)

      // Should now have 6 connected sites (7 original - 1 disconnected)
      expect(permissionService.getConnectedSites()).toHaveLength(6)
    })
  })

  describe('getConnectedSites method', () => {
    it('should return all connected sites correctly', async () => {
      await storage.set('permission', getTestPermissionData())
      await permissionService.init()

      // Debug: Check if lruCache is initialized (access via getStats)
      const stats = permissionService.getStats()
      console.log('Service stats (indicates lruCache status):', stats)

      const connectedSites = permissionService.getConnectedSites()
      console.log('Connected sites returned:', connectedSites)

      expect(connectedSites).toBeDefined()
      expect(Array.isArray(connectedSites)).toBe(true)

      // According to real data, we should have 7 connected sites (excluding mempool.space which has isConnected: false)
      expect(connectedSites).toHaveLength(7)

      // Verify all returned sites are connected
      connectedSites.forEach(site => {
        expect(site.isConnected).toBe(true)
      })

      // Check specific sites
      const pizzaSwap = connectedSites.find(site => site.origin === 'https://pizzaswap.io')
      expect(pizzaSwap).toBeDefined()
      expect(pizzaSwap?.name).toBe('PizzaSwap')

      // Verify disconnected site is not included
      const mempool = connectedSites.find(site => site.origin === 'https://mempool.space')
      expect(mempool).toBeUndefined()
    })

    it('should return empty array when no connected sites exist', async () => {
      // Initialize with empty data
      await storage.set('permission', { dumpCache: [] })
      await permissionService.init()

      const connectedSites = permissionService.getConnectedSites()
      expect(connectedSites).toBeDefined()
      expect(Array.isArray(connectedSites)).toBe(true)
      expect(connectedSites).toHaveLength(0)
    })

    it('should handle case when lruCache is undefined', async () => {
      // Don't initialize the service
      const connectedSites = permissionService.getConnectedSites()
      expect(connectedSites).toBeDefined()
      expect(Array.isArray(connectedSites)).toBe(true)
      expect(connectedSites).toHaveLength(0)
    })
  })

  describe('statistics', () => {
    it('should provide correct statistics', async () => {
      await storage.set('permission', Object.assign({}, getTestPermissionData()))
      await permissionService.init()

      const stats = permissionService.getStats()
      expect(stats.total).toBe(8) // Total sites in cache
      expect(stats.connected).toBe(7) // Connected sites (excluding mempool.space)
      expect(stats.pinned).toBe(0) // No pinned sites in real data
    })
  })
})
