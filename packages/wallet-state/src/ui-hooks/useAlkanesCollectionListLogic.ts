import { AlkanesCollection } from '@unisat/wallet-shared'

import { getSupportedAssets, useChainType, useCurrentAccount, useNavigation, useWallet } from '..'
import { useInfiniteList } from './useInfiniteList'

export function useAlkanesCollectionListLogic() {
  const nav = useNavigation()
  const wallet = useWallet()
  const currentAccount = useCurrentAccount()
  const chainType = useChainType()

  const {
    data: items,
    total,
    loading,
    hasMore,
    onRefresh,
    onLoadMore,
  } = useInfiniteList<AlkanesCollection>({
    fetcher: async (page, pageSize) => {
      const supportedAssets = getSupportedAssets(chainType, currentAccount.address)
      if (!supportedAssets.assets.alkanes) {
        return { list: [], total: 0 }
      }
      const { list, total } = await wallet.getAlkanesCollectionList(
        currentAccount.address,
        page,
        pageSize
      )

      return { list, total }
    },
    dependencies: [currentAccount.address, chainType],
  })

  const onClickItem = (item: AlkanesCollection) => {
    nav.navigate('AlkanesCollectionScreen', { alkaneid: item.alkaneid })
  }

  return { items, total, loading, hasMore, onRefresh, onLoadMore, onClickItem }
}
