import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { hardhat, sepolia, mainnet } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Decentralized Voting System',
  projectId: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6', // Dummy project ID for local development
  chains: [
    hardhat,
    sepolia,
    ...(process.env.VITE_ENABLE_MAINNET === 'true' ? [mainnet] : []),
  ],
  ssr: false,
});
