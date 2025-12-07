import { RawTxInfo, TokenBalance, TokenInfo, TokenTransfer, TxType } from '@unisat/wallet-shared'
import { useCallback, useEffect, useState } from 'react'
import { useI18n, useNavigation, useTools } from 'src/context'
import {
  useFeeRateBar,
  useFetchUtxosCallback,
  usePrepareSendOrdinalsInscriptionCallback,
  usePrepareSendOrdinalsInscriptionsCallback,
  usePushOrdinalsTxCallback,
} from 'src/hooks'
import { getAddressUtxoDust } from 'src/utils/bitcoin-utils'
import BigNumber from 'bignumber.js'

export enum BRC20SendTabKey {
  STEP1,
  STEP2,
  STEP3,
}

export interface ContextData {
  tabKey: BRC20SendTabKey
  tokenBalance: TokenBalance
  transferAmount: string
  transferableList: TokenTransfer[]
  inscriptionIdSet: Set<string>
  receiver: string
  rawTxInfo: RawTxInfo
  tokenInfo: TokenInfo
}

export interface UpdateContextDataParams {
  tabKey?: BRC20SendTabKey
  tokenBalance?: TokenBalance
  transferAmount?: string
  transferableList?: TokenTransfer[]
  inscriptionIdSet?: Set<string>
  receiver?: string
  rawTxInfo?: RawTxInfo
}

export interface BRC20SendStepParams {
  contextData: ContextData
  updateContextData: (params: UpdateContextDataParams) => void
}

export function useBRC20SendScreenLogic() {
  const nav = useNavigation()

  const props = nav.getRouteState<{
    tokenBalance: TokenBalance
    tokenInfo: TokenInfo
    selectedInscriptionIds: string[]
    selectedAmount: string
  }>()

  const tokenBalance = props.tokenBalance
  const selectedInscriptionIds = props.selectedInscriptionIds || []
  const selectedAmount = props.selectedAmount || '0'

  const [contextData, setContextData] = useState<ContextData>({
    tabKey: BRC20SendTabKey.STEP1,
    tokenBalance,
    transferAmount: selectedAmount,
    transferableList: [],
    inscriptionIdSet: new Set(selectedInscriptionIds),
    receiver: '',
    rawTxInfo: {
      psbtHex: '',
      rawtx: '',
    },
    tokenInfo: {
      totalSupply: '0',
      totalMinted: '0',
      decimal: 18,
      holder: '',
      inscriptionId: '',
      historyCount: 0,
      holdersCount: 0,
      logo: '',
    },
  })

  const updateContextData = useCallback((params: UpdateContextDataParams) => {
    setContextData(prev => {
      let changed = false
      const next = { ...prev }
      for (const key in params) {
        if (prev[key] !== params[key]) {
          next[key] = params[key]
          changed = true
        }
      }

      return changed ? next : prev
    })
  }, [])

  const onHeaderBack = () => {
    if (contextData.tabKey === BRC20SendTabKey.STEP2) {
      updateContextData({ tabKey: BRC20SendTabKey.STEP1 })
      return
    }
    nav.goBack()
  }

  const onTabClick = (key: string) => {
    updateContextData({ tabKey: key as any })
  }

  const { t } = useI18n()

  return {
    t,
    contextData,
    updateContextData,
    onHeaderBack,
    onTabClick,
  }
}

export function useBRC20SendScreenLogicStep1({
  contextData,
  updateContextData,
}: BRC20SendStepParams) {
  const { tokenBalance } = contextData

  const { t } = useI18n()

  const [disabled, setDisabled] = useState(true)

  useEffect(() => {
    setDisabled(true)
    if (new BigNumber(contextData.transferAmount).lte(0)) {
      return
    }

    setDisabled(false)
  }, [contextData.transferAmount])

  const onClickNext = () => {
    updateContextData({
      tabKey: BRC20SendTabKey.STEP2,
    })
  }

  return {
    t,
    disabled,
    tokenBalance,
    onClickNext,
  }
}
export function useBRC20SendScreenLogicStep2({
  contextData,
  updateContextData,
}: BRC20SendStepParams) {
  const nav = useNavigation()
  const fetchUtxos = useFetchUtxosCallback()
  const tools = useTools()
  const { t } = useI18n()
  useEffect(() => {
    tools.showLoading(true)
    fetchUtxos().finally(() => {
      tools.showLoading(false)
    })
  }, [])

  const feeRateBar = useFeeRateBar()

  const prepareSendOrdinalsInscriptions = usePrepareSendOrdinalsInscriptionsCallback()
  const prepareSendOrdinalsInscription = usePrepareSendOrdinalsInscriptionCallback()

  const [disabled, setDisabled] = useState(true)

  useEffect(() => {
    setDisabled(true)
    if (!contextData.receiver) {
      return
    }
    if (!feeRateBar.feeRate) {
      return
    }
    setDisabled(false)
  }, [contextData.receiver, feeRateBar.feeRate])

  const onStep2ClickNext = async () => {
    try {
      tools.showLoading(true)
      const inscriptionIds = Array.from(contextData.inscriptionIdSet)
      if (inscriptionIds.length === 1) {
        const rawTxInfo = await prepareSendOrdinalsInscription({
          toAddressInfo: { address: contextData.receiver, domain: '' },
          inscriptionId: inscriptionIds[0],
          feeRate: feeRateBar.feeRate,
          outputValue: getAddressUtxoDust(contextData.receiver),
        })
        nav.navigate('SignOrdinalsTransactionScreen', { rawTxInfo })
      } else {
        const rawTxInfo = await prepareSendOrdinalsInscriptions({
          toAddressInfo: { address: contextData.receiver, domain: '' },
          inscriptionIds,
          feeRate: feeRateBar.feeRate,
        })
        nav.navigate('SignOrdinalsTransactionScreen', { rawTxInfo })
      }

      // updateContextData({ tabKey: TabKey.STEP3, rawTxInfo: txInfo });
    } catch (e) {
      const error = e as Error
      console.log(error)
      tools.toastError(error.message)
    } finally {
      tools.showLoading(false)
    }
  }

  const onStep2ClickBack = async () => {
    if (contextData.tabKey === BRC20SendTabKey.STEP2) {
      updateContextData({ tabKey: BRC20SendTabKey.STEP1 })
    }
  }
  return {
    t,
    disabled,
    onStep2ClickNext,
    onStep2ClickBack,
  }
}

export function useBRC20SendScreenLogicStep3({
  contextData,
  updateContextData,
}: BRC20SendStepParams) {
  const { t } = useI18n()
  const nav = useNavigation()
  const pushOrdinalsTx = usePushOrdinalsTxCallback()

  const onSignPsbtConfirm = async res => {
    try {
      let txData = ''

      if (res && res.psbtHex) {
        txData = res.psbtHex
      } else if (res && res.rawtx) {
        txData = res.rawtx
      } else if (contextData.rawTxInfo.rawtx) {
        txData = contextData.rawTxInfo.rawtx
      } else {
        throw new Error(t('invalid_transaction_data'))
      }

      const { success, txid, error } = await pushOrdinalsTx(txData)
      if (success) {
        nav.navigate('TxSuccessScreen', { txid })
      } else {
        throw new Error(error)
      }
    } catch (e) {
      nav.navigate('TxFailScreen', { error: (e as any).message })
    }
  }

  const signPsbtParams = {
    data: {
      psbtHex: contextData.rawTxInfo.psbtHex,
      type: TxType.SIGN_TX,
      options: { autoFinalized: false },
    },
  }

  return {
    signPsbtParams,
    onSignPsbtConfirm,
  }
}
