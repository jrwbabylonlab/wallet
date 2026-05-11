/**
 * Deterministic context-based key derivation using HKDF (RFC 5869).
 *
 * ```
 * salt   = "derive-context-hash"
 * info   = SHA-256(UTF8(appName)) || contextBytes
 * output = HKDF-SHA-256(ikm, salt, info, 32)
 * ```
 *
 * IKM source depends on wallet type (resolved by the keyring layer):
 * - Mnemonic-imported HD: BIP-32 privkey at sibling path
 *   m/73681862'/coin_type'/account'/change/address_index
 * - Imported (raw) and xpriv-imported HD (no master access):
 *   leftmost 32 bytes of HMAC-SHA-512("derive-context-hash-from-k", privkey)
 *
 * @module derive-context-hash
 */

import { hkdf } from '@noble/hashes/hkdf'
import { hmac } from '@noble/hashes/hmac'
import { sha256 } from '@noble/hashes/sha256'
import { sha512 } from '@noble/hashes/sha512'

const SALT = 'derive-context-hash'
const OUTPUT_LENGTH = 32

/** BIP-43 purpose for the deriveContextHash sibling path. */
export const DERIVE_CONTEXT_HASH_PURPOSE = 73681862

const HMAC_WRAP_LABEL = 'derive-context-hash-from-k'

/**
 * Convert a Uint8Array to a hex string.
 */
function toHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * Derive a deterministic 32-byte value from key material, app name, and context.
 *
 * @param ikm     - Input key material: 32-byte private key.
 * @param appName - Application identifier (1-64 bytes, [a-z0-9\-]).
 * @param context - Context bytes decoded from hex.
 * @returns Hex-encoded 32-byte derived value.
 */
export function deriveContextHash(ikm: Uint8Array, appName: string, context: Uint8Array): string {
  if (ikm.length !== 32) {
    throw new Error(`Input key material must be 32 bytes, got ${ikm.length}`)
  }

  validateAppName(appName)

  // info = SHA-256(UTF8(appName)) || contextBytes
  const appNameHash = sha256(new TextEncoder().encode(appName))
  const info = new Uint8Array(appNameHash.length + context.length)
  info.set(appNameHash, 0)
  info.set(context, appNameHash.length)

  const derived = hkdf(sha256, ikm, SALT, info, OUTPUT_LENGTH)
  const result = toHex(derived)

  // Zero intermediate material
  derived.fill(0)
  info.fill(0)

  return result
}

/**
 * Wrap a 32-byte private key into IKM via HMAC-SHA-512 (BIP-85 pattern).
 * Argument order matches BIP-85: label is the HMAC key, privkey is the message.
 * Returns the leftmost 32 bytes of the HMAC output.
 *
 * Used for imported (raw) wallets and HD wallets without master-seed access
 * (e.g. xpriv-imported sub-path wallets). Outputs are NOT interoperable with
 * mnemonic-imported wallets of the same recovery phrase.
 */
export function wrapPrivateKeyAsIkm(privkey: Uint8Array): Uint8Array {
  if (privkey.length !== 32) {
    throw new Error(`privkey must be 32 bytes, got ${privkey.length}`)
  }
  const label = new TextEncoder().encode(HMAC_WRAP_LABEL)
  const mac = hmac(sha512, label, privkey)
  try {
    const ikm = new Uint8Array(32)
    ikm.set(mac.subarray(0, 32))
    return ikm
  } finally {
    mac.fill(0)
  }
}

/**
 * Validate the appName parameter per spec.
 * Must be 1-64 bytes, ASCII lowercase letters, digits, and hyphens only.
 */
export function validateAppName(appName: string): void {
  if (typeof appName !== 'string' || appName.length === 0) {
    throw new Error('appName must be a non-empty string')
  }
  const bytes = new TextEncoder().encode(appName)
  if (bytes.length > 64) {
    throw new Error(`appName must be at most 64 bytes, got ${bytes.length}`)
  }
  if (!/^[a-z0-9\-]+$/.test(appName)) {
    throw new Error('appName must contain only lowercase letters, digits, and hyphens')
  }
}

/**
 * Parse a hex-encoded context string into a Uint8Array.
 * Validates per spec: non-empty, even-length, lowercase hex only,
 * no 0x prefix, max 2048 hex characters (1024 bytes).
 */
export function parseHexContext(context: string): Uint8Array {
  if (typeof context !== 'string' || context.length === 0) {
    throw new Error('Context must be a non-empty string')
  }
  if (context.startsWith('0x') || context.startsWith('0X')) {
    throw new Error('Context must not have a 0x prefix')
  }
  if (context.length % 2 !== 0) {
    throw new Error('Context must be an even-length hex string')
  }
  if (context.length > 2048) {
    throw new Error('Context must not exceed 2048 hex characters (1024 bytes)')
  }
  if (!/^[0-9a-f]+$/.test(context)) {
    throw new Error('Context must be a lowercase hex string')
  }
  const bytes = new Uint8Array(context.length / 2)
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(context.substring(i * 2, i * 2 + 2), 16)
  }
  return bytes
}
