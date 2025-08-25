# UniSat Wallet Toolkit

A modular Bitcoin wallet toolkit with pluggable keyring architecture.

> ⚠️ **Important Notice**: This toolkit is primarily designed for UniSat products and internal development use. Third-party usage is at your own risk. We recommend thorough evaluation before using in production environments. UniSat does not provide support or warranty for external usage.

## 🚀 Features

- **Modular Design**: Each keyring type is a separate package
- **Pluggable Architecture**: Register only the keyring types you need  
- **TypeScript First**: Full type safety and excellent IDE support
- **Tree Shakable**: Import only what you use
- **Platform Agnostic**: Works in browsers, Node.js, and mobile apps

## 📦 Packages

### Core Services

- `@unisat/keyring-service` - Keyring service for managing Bitcoin wallets
- `@unisat/wallet-types` - Shared type definitions for the wallet ecosystem
- `@unisat/wallet-bitcoin` - Bitcoin core utilities and address management

### API & Transaction Helpers

- `@unisat/wallet-api` - UniSat wallet API client with Bitcoin ecosystem support
- `@unisat/tx-helpers` - Bitcoin transaction helpers for BTC, Inscriptions, Runes

### Additional Services

- `@unisat/permission-service` - Cross-platform permission management for web3 apps
- `@unisat/contact-book` - Universal contact book with multi-chain support
- `@unisat/i18n` - Internationalization utilities
- `@unisat/babylon-service` - Babylon Bitcoin staking service

## 🔧 Usage

### Basic Setup

```typescript
import { KeyringService } from '@unisat/keyring-service'
import { WalletApi } from '@unisat/wallet-api'
import { sendBtc } from '@unisat/tx-helpers'

// Initialize keyring service
const keyringService = new KeyringService()

// Create HD wallet
const wallet = await keyringService.createKeyring('HD', {
  mnemonic: 'your twelve word mnemonic phrase here...',
})

// Use API client
const api = new WalletApi({ endpoint: 'https://api.unisat.io' })
const balance = await api.bitcoin.getBalance('bc1qaddress...')
```

### Browser Extension

```typescript
import { KeyringService } from '@unisat/keyring-service'
import { PermissionService } from '@unisat/permission-service'
import { WalletApi } from '@unisat/wallet-api'

// Full featured setup for browser extension
const keyringService = new KeyringService()
const permissionService = new PermissionService()
const api = new WalletApi()

// Handle dApp connections
await permissionService.requestPermission('https://dapp.com')
```

### Transaction Building

```typescript
import { sendBtc, sendInscription } from '@unisat/tx-helpers'
import { KeyringService } from '@unisat/keyring-service'

const keyring = new KeyringService()

// Send BTC transaction
const btcTx = await sendBtc({
  from: 'bc1qfrom...',
  to: 'bc1qto...',
  amount: 100000, // sats
  feeRate: 10
})

// Send inscription
const inscriptionTx = await sendInscription({
  from: 'bc1qfrom...',
  to: 'bc1qto...',
  inscriptionId: 'abc123...i0',
  feeRate: 15
})
```

## 🏗️ Development

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Lint code
pnpm lint

# Type check
pnpm typecheck
```

## 📄 License

MIT License - see LICENSE file for details.

## 📦 Publishing

```bash
# Create changeset for version bump
pnpm changeset

# Update versions
pnpm changeset version

# Install dependencies and build
pnpm install
pnpm build

# Publish to npm
pnpm changeset publish
```

## ⚠️ Disclaimer

This toolkit is primarily designed for UniSat products. While it's open source, please note:

- Third-party usage is at your own risk
- No official support for external implementations  
- Thoroughly test before production use
- UniSat is not liable for issues arising from external usage

## 🤝 Contributing

This project is primarily for UniSat internal development. External contributions should be discussed via issues first.
