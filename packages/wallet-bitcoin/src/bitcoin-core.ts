import * as bitcoin from 'bitcoinjs-lib'
import ECPairModule, { ECPairAPI } from 'ecpair'
import * as tinysecp256k1 from 'tiny-secp256k1'
import * as bitcoinlabSecp256k1 from '@bitcoinerlab/secp256k1'

export type { ECPairInterface } from 'ecpair'
export { bitcoin }

export enum EccType {
  tiny = 'tiny',
  bitcoinlab = 'bitcoinlab',
}

class ECCManager {
  eccType: EccType = EccType.tiny

  private tinyEcc: any = tinysecp256k1
  private tinyEccPair: ECPairAPI
  private bitcoinlabEcc: any = bitcoinlabSecp256k1
  private bitcoinlabEccPair: ECPairAPI

  constructor() {
    // @ts-ignore
    this.tinyEccPair = (ECPairModule.default ? ECPairModule.default : ECPairModule)(this.tinyEcc)
    // @ts-ignore
    this.bitcoinlabEccPair = (ECPairModule.default ? ECPairModule.default : ECPairModule)(
      this.bitcoinlabEcc
    )

    this.setEccType(this.eccType)
  }

  setEccType(eccType: EccType) {
    this.eccType = eccType
    if (this.eccType === EccType.tiny) {
      bitcoin.initEccLib(this.tinyEcc)
    } else {
      bitcoin.initEccLib(this.bitcoinlabEcc)
    }
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
