# @unisat/wallet-bitcoin

Bitcoin core utilities for UniSat wallet ecosystem.

## Features

- Bitcoin core functionality (bitcoin.js wrapper)
- ECDSA and Schnorr signature support
- Message signing utilities
- Taproot utilities
- Type-safe Bitcoin operations

## Installation

```bash
npm install @unisat/wallet-bitcoin
# or
yarn add @unisat/wallet-bitcoin
# or
pnpm add @unisat/wallet-bitcoin
```

## Usage

```typescript
import { bitcoin, ECPair, tweakSigner, signMessageOfDeterministicECDSA } from '@unisat/wallet-bitcoin';

// Create a key pair
const keyPair = ECPair.makeRandom();

// Use Bitcoin utilities
const network = bitcoin.networks.bitcoin;

// Sign a message
const signature = signMessageOfDeterministicECDSA(keyPair, 'Hello Bitcoin');
```

## API Reference

### Core Exports

- `bitcoin` - Bitcoin.js library instance
- `ECPair` - Elliptic curve pair utilities
- `ecc` - Elliptic curve cryptography functions

### Utilities

- `tweakSigner` - Transform signer for taproot
- `validator` - ECDSA signature validator
- `schnorrValidator` - Schnorr signature validator
- `toXOnly` - Convert public key to x-only format

### Message Signing

- `signMessageOfDeterministicECDSA` - Sign message using deterministic ECDSA
- `verifyMessageOfECDSA` - Verify ECDSA signed message

## License

MIT