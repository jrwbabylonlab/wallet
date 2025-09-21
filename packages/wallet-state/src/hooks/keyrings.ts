import { useWalletSelector } from './index';

export const useKeyringsState = () => {
  return useWalletSelector((state) => state.keyrings);
};

// Additional keyrings hooks will be migrated here