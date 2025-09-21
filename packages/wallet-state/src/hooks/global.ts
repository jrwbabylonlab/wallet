import { useWalletSelector } from './index';

export const useGlobalState = () => {
  return useWalletSelector((state) => state.global);
};

// Additional global hooks will be migrated here