import { bitcoin } from '@unisat/wallet-bitcoin'
import { SignMessageType } from '@unisat/wallet-shared'
import { SignPsbtOptions } from '../types'

export interface AbstractWallet {
  signPsbt(psbt: bitcoin.Psbt, opts?: SignPsbtOptions): Promise<bitcoin.Psbt>
  signMessage(text: string, type: SignMessageType): Promise<string>
}
