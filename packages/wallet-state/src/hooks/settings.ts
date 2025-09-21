import { useWalletSelector } from './index';

export const useSettingsState = () => {
  return useWalletSelector((state) => state.settings);
};

// Additional settings hooks will be migrated here