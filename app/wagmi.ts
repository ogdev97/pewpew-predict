import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { bsc, bscTestnet } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'PewPew',
  projectId: 'YOUR_PROJECT_ID',
  chains: [bsc, bscTestnet],
  ssr: true,
});

