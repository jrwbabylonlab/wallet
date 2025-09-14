import * as bitcoin from 'bitcoinjs-lib'
import ECPairModule, { ECPairAPI } from 'ecpair'

export type { ECPairInterface } from 'ecpair'
export { bitcoin }

export enum EccType {
  tiny = 'tiny',
  bitcoinlab = 'bitcoinlab',
}

class ECCManager {
  eccType: EccType = EccType.tiny

  private tinyEcc: any
  // @ts-ignore
  private tinyEccPair: ECPairAPI

  private bitcoinlabEcc: any
  // @ts-ignore
  private bitcoinlabEccPair: ECPairAPI

  constructor() {
    // Lazy load
    this.tinyEcc = import('tiny-secp256k1').then(v => {
      console.log('tiny-secp256k1 loaded')
      this.tinyEcc = v
      // @ts-ignore
      this.tinyEccPair = (ECPairModule.default ? ECPairModule.default : ECPairModule)(this.tinyEcc)
    })
    this.bitcoinlabEcc = import('@bitcoinerlab/secp256k1').then(v => {
      console.log('@bitcoinerlab/secp256k1 loaded')
      this.bitcoinlabEcc = v
      // @ts-ignore
      this.bitcoinlabEccPair = (ECPairModule.default ? ECPairModule.default : ECPairModule)(
        this.bitcoinlabEcc
      )
    })
  }

  get ecc() {
    if (this.eccType === EccType.tiny) {
      return this.tinyEcc
    } else {
      return this.bitcoinlabEcc
    }
  }

  get eccPair() {
    if (this.eccType === EccType.tiny) {
      return this.tinyEccPair
    } else {
      return this.bitcoinlabEccPair
    }
  }
}

export const eccManager = new ECCManager()
