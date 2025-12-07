import { AddressTokenSummary, CHAINS_MAP, TickPriceItem, TokenBalance } from '@unisat/wallet-shared'
import { useMemo, useState } from 'react'
import { useI18n, useWallet } from 'src/context'
import { useChain, useChainType, useCurrentAccount } from 'src/hooks'
import BigNumber from 'bignumber.js'

export interface BRC20BalanceCardProps {
  tokenBalance: TokenBalance
  onClick?: () => void
  price?: TickPriceItem
}
export function useBRC20BalanceCardLogic(props: BRC20BalanceCardProps) {
  const {
    price,
    tokenBalance: {
      ticker,
      overallBalance,
      transferableBalance,
      selfMint,
      displayName,
      tag,
      swapBalance,
      progBalance,
    },
    onClick,
  } = props

  const account = useCurrentAccount()
  const [tokenSummary, setTokenSummary] = useState<AddressTokenSummary>()
  const [loading, setLoading] = useState(false)
  const wallet = useWallet()
  const { t } = useI18n()

  const deploy_count = tokenSummary ? (tokenSummary.tokenInfo.holder == account.address ? 1 : 0) : 0
  let _names: string[] = []
  const _amounts: string[] = []
  if (deploy_count > 0) {
    _names.push('Deploy')
    _amounts.push('')
  }
  if (tokenSummary) {
    tokenSummary.transferableList.forEach(v => {
      _names.push('Transfer')
      _amounts.push(v.amount)
    })
  }

  for (let i = 0; i < _names.length; i++) {
    if (i == 3) {
      if (_names.length > 4) {
        if (deploy_count > 0) {
          _names[i] = `${_names.length - 3}+`
        } else {
          _names[i] = `${_names.length - 2}+`
        }
        _amounts[i] = ''
      }
      break
    }
  }
  _names = _names.splice(0, 4)

  const onSwapBalance = swapBalance
  const onProgBalance = progBalance
  const inWalletBalance = overallBalance

  const totalBalance = useMemo(() => {
    return new BigNumber(inWalletBalance)
      .plus(new BigNumber(onSwapBalance || 0))
      .plus(new BigNumber(onProgBalance || 0))
      .toString()
  }, [inWalletBalance, onSwapBalance, onProgBalance])

  const hasOutWalletBalance = (onSwapBalance || onProgBalance || '0')! !== '0'

  const chainType = useChainType()
  const brc20Url = CHAINS_MAP[chainType]?.iconBaseUrl
  const brc20IconUrl = `${brc20Url}/brc20/${ticker}`
  const chain = useChain()
  const showPrice = chain.showPrice

  return {
    price,
    showPrice,
    ticker,
    displayName,
    tag,
    onClick,
    totalBalance,
    hasOutWalletBalance,
    selfMint,
    onProgBalance,
    inWalletBalance,
    onSwapBalance,
    t,
    brc20IconUrl,
    overallBalance,
    transferableBalance,
  }
}
