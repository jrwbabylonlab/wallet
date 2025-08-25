# @unisat/permission-service

Cross-platform permission management service for web3 applications.

## Features

- **Cross-platform**: Works in browsers, Node.js, and browser extensions
- **Storage Adapters**: Flexible storage backend (memory, localStorage, extension storage)
- **LRU Cache**: Efficient permission caching with automatic cleanup
- **Type Safe**: Full TypeScript support
- **Site Management**: Pin, unpin, and organize connected sites

## Installation

```bash
npm install @unisat/permission-service
# or
yarn add @unisat/permission-service
```

## Quick Start

```typescript
import { PermissionService, MemoryStorageAdapter, ChainType } from '@unisat/permission-service';

// Create with memory storage
const permissionService = new PermissionService({
  storage: new MemoryStorageAdapter(),
  storageKey: 'permissions'
});

// Initialize
await permissionService.init();

// Add a connected site
await permissionService.addConnectedSite(
  'https://example.com',
  'Example DApp',
  'https://example.com/icon.png',
  ChainType.BITCOIN_MAINNET
);

// Check permissions
const hasPermission = permissionService.hasPermission('https://example.com');
console.log(hasPermission); // true
```

## Storage Adapters

### Memory Storage
```typescript
import { MemoryStorageAdapter } from '@unisat/permission-service/adapters';

const storage = new MemoryStorageAdapter();
```

### LocalStorage (Browser)
```typescript
import { LocalStorageAdapter } from '@unisat/permission-service/adapters';

const storage = new LocalStorageAdapter();
```

### Extension Storage
```typescript
import { ExtensionPersistStoreAdapter } from '@unisat/permission-service/adapters';
import { createPersistStore } from '@/background/utils';

const storage = new ExtensionPersistStoreAdapter(createPersistStore, 'permissions');
```

## API Reference

### PermissionService

Main service class for managing permissions.

#### Methods

- `init()`: Initialize the service
- `addConnectedSite(origin, name, icon, chain)`: Add a connected site
- `hasPermission(origin)`: Check if origin has permission
- `getSite(origin)`: Get site information
- `getConnectedSites()`: Get all connected sites
- `removeConnectedSite(origin)`: Remove a connected site
- `topConnectedSite(origin)`: Pin site to top
- `unpinConnectedSite(origin)`: Unpin site

## License

MIT