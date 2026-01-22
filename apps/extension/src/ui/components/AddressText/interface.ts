import { InputInfo } from '@/ui/pages/Approval/components/SignPsbt/types';
import { ColorTypes } from '@/ui/theme/colors';
import { ToAddressInfo } from '@unisat/wallet-shared';

export interface AddressTextProps {
  address?: string;
  addressInfo?: ToAddressInfo;
  textCenter?: boolean;
  color?: ColorTypes;
  inputInfo?: InputInfo;
}
