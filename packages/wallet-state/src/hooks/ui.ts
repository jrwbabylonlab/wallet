import { useWalletSelector } from './index';

export const useUIState = () => {
  return useWalletSelector((state) => state.ui);
};

// Additional UI hooks will be migrated here