import { useEffect, useState } from 'react'
import { TickPriceItem, TokenBalance } from '@unisat/wallet-shared'
import {
  useChainType,
  useCurrentAccount,
  useI18n,
  useWallet,
  useTools,
  useNavigation,
  useSupportedAssets,
  useChain,
} from '..'
import { useInfiniteList } from './useInfiniteList'

export function useBRC20ListLogic() {
  const nav = useNavigation()
  const wallet = useWallet()
  const currentAccount = useCurrentAccount()
  const chainType = useChainType()
  const [priceMap, setPriceMap] = useState<{ [key: string]: TickPriceItem }>({})

  const {
    data: items,
    total,
    loading,
    hasMore,
    onRefresh,
    onLoadMore,
  } = useInfiniteList<TokenBalance>({
    fetcher: async (page, pageSize) => {
      const { list, total } = await wallet.getBRC20List(currentAccount.address, page, pageSize)
      if (list.length > 0) {
        wallet.getBrc20sPrice(list.map(item => item.ticker)).then(setPriceMap)
      }
      return { list, total }
    },
    dependencies: [currentAccount.address, chainType],
  })

  const onClickItem = (item: TokenBalance) => {
    nav.navigate('BRC20TokenScreen', { tokenBalance: item, ticker: item.ticker })
  }

  return { items, total, loading, hasMore, onRefresh, onLoadMore, onClickItem, priceMap }
}
