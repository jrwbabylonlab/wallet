import { AddressRunesTokenSummary } from '@unisat/wallet-shared'
import { ChainType } from '@unisat/wallet-types'
import { useEffect, useMemo, useState } from 'react'
import { useI18n, useNavigation, useTools, useWallet } from 'src/context'
import {
  useChainType,
  useCurrentAccount,
  useOrdinalsWebsite,
  useResetTxState,
  useRunesMarketPlaceWebsite,
  useTxExplorerUrl,
  useUnisatWebsite,
} from 'src/hooks'

export function useRunesTokenScreenLogic() {
  const nav = useNavigation()
  const { runeid } = nav.getRouteState<{
    runeid: string
  }>()
  const [tokenSummary, setTokenSummary] = useState<AddressRunesTokenSummary>({
    runeBalance: {
      runeid: '',
      rune: '',
      spacedRune: '',
      amount: '',
      symbol: '',
      divisibility: 0,
    },
    runeInfo: {
      rune: '',
      runeid: '',
      spacedRune: '',
      symbol: '',
      premine: '',
      mints: '',
      divisibility: 0,
      etching: '',
      terms: {
        amount: '',
        cap: '',
        heightStart: 0,
        heightEnd: 0,
        offsetStart: 0,
        offsetEnd: 0,
      },
      number: 0,
      height: 0,
      txidx: 0,
      timestamp: 0,
      burned: '',
      holders: 0,
      transactions: 0,
      mintable: false,
      remaining: '',
      start: 0,
      end: 0,
      supply: '0',
      parent: '',
    },
  })

  const wallet = useWallet()

  const account = useCurrentAccount()

  const [loading, setLoading] = useState(true)

  const { t } = useI18n()

  useEffect(() => {
    wallet.getAddressRunesTokenSummary(account.address, runeid).then(tokenSummary => {
      setTokenSummary(tokenSummary)
      setLoading(false)
    })
  }, [])

  const unisatWebsite = useUnisatWebsite()

  const enableMint = tokenSummary.runeInfo.mintable

  const enableTransfer = useMemo(() => {
    let enable = false
    if (tokenSummary.runeBalance.amount !== '0') {
      enable = true
    }
    return enable
  }, [tokenSummary])

  const tools = useTools()

  const ordinalsWebsite = useOrdinalsWebsite()

  const resetTxState = useResetTxState()

  const txExplorerUrl = useTxExplorerUrl(tokenSummary.runeInfo.etching)

  const chainType = useChainType()
  const enableTrade = useMemo(() => {
    if (
      chainType === ChainType.BITCOIN_MAINNET ||
      chainType === ChainType.FRACTAL_BITCOIN_MAINNET
    ) {
      return true
    } else {
      return false
    }
  }, [chainType])
  const marketPlaceUrl = useRunesMarketPlaceWebsite(tokenSummary.runeInfo.spacedRune)

  const onClickMint = () => {
    const newUrl = `${unisatWebsite}/runes/inscribe?only=1&tab=mint&rune=${tokenSummary?.runeInfo?.rune}`
    nav.navToUrl(newUrl)
  }

  const onClickSend = () => {
    resetTxState()
    nav.navigate('SendRunesScreen', {
      runeBalance: tokenSummary.runeBalance,
      runeInfo: tokenSummary.runeInfo,
    })
  }

  const onClickTrade = () => {
    if (marketPlaceUrl) {
      nav.navToUrl(marketPlaceUrl)
    }
  }

  return {
    runeid,
    tokenSummary,
    loading,
    t,

    enableMint,
    onClickMint,

    tools,
    ordinalsWebsite,
    txExplorerUrl,

    enableTransfer,
    onClickSend,

    enableTrade,
    onClickTrade,
  }
}
