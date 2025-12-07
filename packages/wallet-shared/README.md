# @unisat/wallet-shared

Shared type definitions, constants, error codes, and utilities for the UniSat wallet ecosystem.

## Overview

This package provides common types, constants, error handling, and utility functions used across UniSat wallet products. It is designed to ensure consistency and reduce duplication in wallet-related services and applications.

## Features

- **Type Definitions**: Comprehensive types for accounts, activities, addresses, assets, transactions, permissions, preferences, and more.
- **Constants**: Platform and common constants for wallet operations.
- **Error Handling**: Standardized error codes and messages for wallet operations.
- **Utilities**: Event bus and i18n helpers for background scripts and services.

## Installation

```bash
pnpm add @unisat/wallet-shared
# or
npm install @unisat/wallet-shared
```

## Usage

```typescript
import { ErrorCodes, WalletError } from '@unisat/wallet-shared/errors'
import { bgEventBus } from '@unisat/wallet-shared/utils'
import { NetworkType, AddressType } from '@unisat/wallet-shared/types'

// Example: Throwing a standardized error
throw new WalletError(ErrorCodes.INSUFFICIENT_BTC_UTXO)

// Example: Using the event bus
bgEventBus.emit('wallet:updated', {
  /* ... */
})
```

## License

MIT License.
