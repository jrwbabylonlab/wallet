import { bitcoin, getAddressType, publicKeyToScriptPk, toPsbtNetwork } from '@unisat/wallet-bitcoin'
import { DummyTxType } from '@unisat/wallet-shared'
import { AddressType, NetworkType } from '@unisat/wallet-types'
import { utxoToInput } from './transaction'
const DUMMY_TXID = '0000000000000000000000000000000000000000000000000000000000000000'

class DummyWallet {
  address: string
  pubkey: string

  utxoIndex: number = 0
  scriptPk: string
  addressType: AddressType
  networkType: NetworkType
  network: bitcoin.Network

  constructor(address: string, pubkey: string) {
    this.address = address
    this.pubkey = pubkey

    this.networkType = NetworkType.MAINNET
    const addressType = getAddressType(address, this.networkType)
    this.addressType = addressType
    this.scriptPk = publicKeyToScriptPk(pubkey, addressType, this.networkType)

    this.network = toPsbtNetwork(this.networkType)
  }

  getNextUtxoInput(satoshis: number): any {
    const utxo = {
      txid: DUMMY_TXID,
      vout: this.utxoIndex++,
      satoshis: satoshis,
      scriptPk: this.scriptPk,
      pubkey: this.pubkey,
      addressType: this.addressType,
      inscriptions: [],
    }

    return utxoToInput(utxo)!.data
  }
}

export function createDummyTx({
  address,
  pubkey,
  txType,
}: {
  address: string
  pubkey: string
  txType: DummyTxType
}) {
  const dummyWallet = new DummyWallet(address, pubkey)

  if (txType == DummyTxType.SEND_BTC) {
    const psbt = new bitcoin.Psbt({ network: dummyWallet.network })
    psbt.data.addInput(dummyWallet.getNextUtxoInput(1000000))
    psbt.addOutput({
      address: dummyWallet.address,
      value: 900000,
    })

    const toSignInputs = []
    toSignInputs.push({ index: 0, publicKey: dummyWallet.pubkey })

    return { psbt, toSignInputs }
  } else if (txType == DummyTxType.SPLIT_BTC) {
    const totalValue = 1000000
    const fee = 10000
    const psbt = new bitcoin.Psbt({ network: dummyWallet.network })
    psbt.data.addInput(dummyWallet.getNextUtxoInput(1000000))
    psbt.addOutput({
      address: dummyWallet.address,
      value: totalValue,
    })
    for (let i = 0; i < 500; i++) {
      psbt.addOutput({
        address: dummyWallet.address,
        value: parseInt(((totalValue - fee) / 500).toString()),
      })
    }

    const toSignInputs = []
    toSignInputs.push({ index: 0, publicKey: dummyWallet.pubkey })

    return { psbt, toSignInputs }
  } else if (txType == DummyTxType.MERGE_BTC) {
    const toSignInputs = []

    let totalInput = 0
    const fee = 10000
    const psbt = new bitcoin.Psbt({ network: dummyWallet.network })
    for (let i = 0; i < 500; i++) {
      psbt.data.addInput(dummyWallet.getNextUtxoInput(2000))
      totalInput += 2000
      toSignInputs.push({ index: i, publicKey: dummyWallet.pubkey })
    }
    psbt.addOutput({
      address: dummyWallet.address,
      value: totalInput - fee,
    })

    return { psbt, toSignInputs }
  } else if (txType == DummyTxType.LIST_ASSETS) {
    const psbt = new bitcoin.Psbt({ network: dummyWallet.network })

    const input = dummyWallet.getNextUtxoInput(330)
    input.sighashType =
      bitcoin.Transaction.SIGHASH_SINGLE | bitcoin.Transaction.SIGHASH_ANYONECANPAY
    psbt.data.addInput(input)
    psbt.addOutput({
      address: dummyWallet.address,
      value: 100000000,
    })
    psbt.setInputSequence(0, 0xfffffffd)

    const toSignInputs = []
    toSignInputs.push({ index: 0, publicKey: dummyWallet.pubkey })

    return { psbt, toSignInputs }
  }

  throw new Error('invalid dummy tx type')
}
