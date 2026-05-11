# Derive Context Hash

> [!WARNING]
> **Experimental API**: `deriveContextHash` is experimental and may change in future versions.
> Use feature detection and provide a fallback path in production integrations.

### deriveContextHash

```
unisat.deriveContextHash(appName, context)
```

Derive a deterministic 32-byte value from the connected leaf's key material, an application name, and an arbitrary context string. The derivation uses HKDF-SHA-256 (RFC 5869).

**Requires user approval** — the wallet will show a confirmation dialog displaying the application name, context string, and requesting origin before deriving the value.

**Supported keyring types**: HD wallets (mnemonic), HD wallets (xpriv), and imported private keys.

**Parameters**

- `appName` - `string`: Application identifier (1–64 bytes, lowercase letters, digits, and hyphens only: `[a-z0-9\-]`). Provides mandatory app-level domain separation. Examples: `"babylon-vault"`, `"ordinals-market"`.
- `context` - `string`: Hex-encoded byte string (even-length, lowercase, no `0x` prefix, max 2048 hex characters / 1024 bytes). Application-specific data that determines the output within the app's namespace. Must not be empty.

**Returns**

- `Promise` - `string`: Hex-encoded 32-byte derived value (64 lowercase hex characters).

**Derivation Scheme**

```
salt   = "derive-context-hash"
info   = SHA-256(UTF8(appName)) || decode_hex(context)
output = HKDF-SHA-256(ikm, salt, info, 32)
```

The IKM source depends on wallet type:
- **Mnemonic-imported HD wallets:** the BIP-32 private key scalar at the sibling path `m/73681862'/coin_type'/account'/change/address_index`, where `coin_type / account / change / address_index` are taken from the connected user leaf (e.g. user leaf `m/44'/0'/0'/0/0` → IKM at `m/73681862'/0'/0'/0/0`).
- **xpriv-imported HD wallets and imported raw private keys:** the leftmost 32 bytes of `HMAC-SHA-512("derive-context-hash-from-k", connected_privkey)` (BIP-85 pattern). Outputs from these wallets are NOT interoperable with mnemonic-imported wallets of the same recovery phrase.

The `info` field is constructed by concatenating SHA-256(UTF8(appName)) (32 bytes, fixed-length) with the raw context bytes decoded from hex. Hashing appName ensures a fixed 32-byte prefix, eliminating length-confusion collisions.

**Output semantics — per-position**

Output is bound to the connected user leaf's `(coin_type, account, change, address_index)` quad:
- Different mnemonic, BIP-39 passphrase, account index, change index, or leaf index → different output.
- Same connected leaf called twice → same output.
- BIP-43 purpose / address-type changes (e.g. BIP-44 ↔ BIP-86) at the same `(coin, account, change, index)` do **not** rotate the IKM. Apps that need per-script-type rotation must encode the script type or pubkey in `context`.
- Switching mainnet ↔ testnet does **not** rotate the output: UniSat uses BIP-44 `coin_type = 0` paths for both, so the IKM is unchanged across networks. Applications that need network-bound outputs MUST encode the network in `context`.

---

**Example**

```javascript
try {
  const appName = "babylon-vault";
  const context = "a1b2c3d4e5f6..."; // hex-encoded context
  const hash = await window.unisat.deriveContextHash(appName, context);
  console.log(hash);
  // 64 lowercase hex chars (depends on the connected leaf's key material)
} catch (e) {
  console.log(e);
}
```

---

**Security**

- HKDF is a formally proven extract-then-expand KDF (Krawczyk, Crypto 2010; RFC 5869).
- The Extract step ensures even structured inputs (e.g., secp256k1 keys) produce a uniformly random pseudorandom key.
- The Expand step is a PRF — revealing many outputs for different contexts does not leak the seed or private key.
- The fixed salt `"derive-context-hash"` provides domain separation from BIP-32 and other HMAC uses.
- SHA-256(appName) prefix in the info field provides mandatory app-level domain separation.
- All intermediate key material is zeroed after use within the wallet.

**Known divergence from spec v2.0**

Spec v2.0 §2.2 requires that a wallet return an error when BIP-32 child derivation produces an invalid key (`IL ≥ n` or `kpar + IL ≡ 0 mod n`), rather than advancing to the next index. UniSat's BIP-32 derivation is provided by the `hdkey` library, which silently retries with `index + 1` in those cases. This applies to all BIP-32 derivations in the wallet (account creation, signing, and `deriveContextHash`), not just this method. The probability of an invalid child at any given index on secp256k1 is ≈ 2⁻¹²⁷ and has not been observed in practice. Cross-wallet reproducibility against another conforming wallet would diverge only if both wallets attempt to use the same astronomically-rare invalid leaf path; standard receive-address paths are unaffected.

**Use Cases**

- **HTLC preimages**: Derive a deterministic secret `s` for atomic swap flows. Commit `SHA256(s)` on-chain, reveal `s` later.
- **Deterministic key generation**: Use the output as seed material for application-specific cryptographic schemes (e.g., Lamport signatures).
