import { beforeAll, afterAll } from 'vitest'
import * as bitcoin from 'bitcoinjs-lib'
import * as ecc from 'tiny-secp256k1'

beforeAll(() => {
  // Setup global test environment
  process.env.NODE_ENV = 'test'
  
  // Initialize ECC library for bitcoinjs-lib
  bitcoin.initEccLib(ecc)
})

afterAll(() => {
  // Cleanup after all tests
})