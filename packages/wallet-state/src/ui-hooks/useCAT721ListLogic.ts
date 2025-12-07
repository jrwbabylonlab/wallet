import { useEffect, useState } from 'react'

import {
  AlkanesBalance,
  CAT20Balance,
  CAT721Balance,
  CAT_VERSION,
  TickPriceItem,
} from '@unisat/wallet-shared'

import {
  useChainType,
  useCurrentAccount,
  useI18n,
  useWallet,
  useTools,
  useNavigation,
  useSupportedAssets,
  useChain,
  getSupportedAssets,
} from '..'
import { useInfiniteList } from './useInfiniteList'

export function useCAT721ListLogic(version: CAT_VERSION) {
  const nav = useNavigation()
  const wallet = useWallet()
  const currentAccount = useCurrentAccount()
  const chainType = useChainType()
  const {
    data: tokens,
    total,
    loading,
    hasMore,
    onRefresh,
    onLoadMore,
  } = useInfiniteList<CAT721Balance>({
    fetcher: async (page, pageSize) => {
      const supportedAssets = getSupportedAssets(chainType, currentAccount.address)
      if (!supportedAssets.assets.CAT20) {
        return { list: [], total: 0 }
      }
      const { list, total } = await wallet.getCAT721List(
        version,
        currentAccount.address,
        page,
        pageSize
      )
      return { list, total }
    },
    dependencies: [currentAccount.address, version, chainType],
  })

  const onClickItem = (item: CAT721Balance) => {
    nav.navigate('CAT721CollectionScreen', { collectionId: item.collectionId, version })
  }

  return { tokens, total, loading, hasMore, onRefresh, onLoadMore, onClickItem }
}
