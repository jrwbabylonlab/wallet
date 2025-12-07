import { Inscription } from '@unisat/wallet-shared'

import { useChainType, useCurrentAccount, useNavigation, useWallet } from '..'
import { useInfiniteList } from './useInfiniteList'

export function useInscriptionListLogic() {
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
  } = useInfiniteList<Inscription>({
    fetcher: async (page, pageSize) => {
      const { list, total } = await wallet.getAllInscriptionList(
        currentAccount.address,
        page,
        pageSize
      )
      return { list, total }
    },
    dependencies: [currentAccount.address, chainType],
  })

  const onClickItem = (item: Inscription) => {
    nav.navigate('OrdinalsInscriptionScreen', {
      inscription: item,
      inscriptionId: item.inscriptionId,
    })
  }

  return { items, total, loading, hasMore, onRefresh, onLoadMore, onClickItem }
}
