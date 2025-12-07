import { AlkanesInfo, Inscription, TxType, UserToSignInput } from '@unisat/wallet-shared'
import { useEffect, useRef, useState } from 'react'
import { useI18n, useNavigation, useTools, useWallet } from 'src/context'
import { useCurrentAccount, useFeeRateBar, usePushBitcoinTxCallback } from 'src/hooks'
import { isValidAddress } from 'src/utils/bitcoin-utils'

export enum SendAlkanesNFTScreenStep {
  CREATE_TX = 0,
  SIGN_TX = 1,
}
export function useSendAlkanesNFTScreenLogic() {
  const nav = useNavigation()
  const props = nav.getRouteState<{
    alkanesInfo: AlkanesInfo
  }>()

  const { t } = useI18n()

  const alkanesInfo = props.alkanesInfo

  const [disabled, setDisabled] = useState(true)
  const [toInfo, setToInfo] = useState<{
    address: string
    domain: string
    inscription?: Inscription
  }>({
    address: '',
    domain: '',
    inscription: undefined,
  })

  const [error, setError] = useState('')

  const currentAccount = useCurrentAccount()

  const tools = useTools()

  const { feeRate } = useFeeRateBar()

  useEffect(() => {
    setError('')
    setDisabled(true)

    if (!isValidAddress(toInfo.address)) {
      return
    }

    if (feeRate <= 0) {
      return
    }

    setDisabled(false)
  }, [toInfo, feeRate])

  const transferData = useRef<{
    id: string
    commitTx: string
    commitToSignInputs: UserToSignInput[]
  }>({
    id: '',
    commitTx: '',
    commitToSignInputs: [],
  })

  const [step, setStep] = useState(0)

  const wallet = useWallet()

  const pushBitcoinTx = usePushBitcoinTxCallback()

  const onCreateTxHandleConfirm = async () => {
    tools.showLoading(true)
    try {
      const step1 = await wallet.createAlkanesSendTx({
        userAddress: currentAccount.address,
        userPubkey: currentAccount.pubkey,
        receiver: toInfo.address,
        alkaneid: alkanesInfo.alkaneid,
        amount: '1',
        feeRate,
      })
      if (step1) {
        transferData.current.commitTx = step1.psbtHex
        transferData.current.commitToSignInputs = step1.toSignInputs
        setStep(1)
      }
    } catch (e) {
      const msg = (e as any).message
      setError((e as any).message)
    } finally {
      tools.showLoading(false)
    }
  }

  const onCreateTxHandleBack = () => {
    nav.goBack()
  }

  const onSignPsbtHandleConfirm = async () => {
    async res => {
      tools.showLoading(true)
      try {
        if (res && res.psbtHex) {
          const { success, txid, error } = await pushBitcoinTx(res.psbtHex)
          if (success) {
            nav.navigate('TxSuccessScreen', { txid })
          } else {
            throw new Error(error)
          }
          return
        }

        const step3 = await wallet.signAlkanesSendTx({
          commitTx: transferData.current.commitTx,
          toSignInputs: transferData.current.commitToSignInputs as any,
        })
        nav.navigate('TxSuccessScreen', { txid: step3.txid })
      } catch (e) {
        nav.navigate('TxFailScreen', { error: (e as any).message })
      } finally {
        tools.showLoading(false)
      }
    }
  }

  const onSignPsbtHandleCancel = () => {
    setStep(SendAlkanesNFTScreenStep.CREATE_TX)
  }

  const onSignPsbtHandleBack = () => {
    setStep(SendAlkanesNFTScreenStep.CREATE_TX)
  }

  const signPsbtParams = {
    data: {
      psbtHex: transferData.current.commitTx,
      type: TxType.SIGN_TX,
      options: { autoFinalized: true, toSignInputs: transferData.current.commitToSignInputs },
    },
  }

  return {
    step,
    t,
    alkanesInfo,
    toInfo,
    disabled,
    error,
    setToInfo,

    onCreateTxHandleConfirm,
    onCreateTxHandleBack,

    onSignPsbtHandleConfirm,
    onSignPsbtHandleCancel,
    onSignPsbtHandleBack,
    signPsbtParams,
  }
}
