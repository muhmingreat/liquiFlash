import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  celoSepolia,
  polygonAmoy,
  avalancheFuji,
  bscTestnet
} from 'wagmi/chains';

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || "8c56009316086f91475befb39832d746"

if (!projectId) {
  console.warn("Project ID is missing. Please add it to .env")
}

export const config = getDefaultConfig({
  appName: 'LiquiFlash Dashboard',
  projectId: projectId,
  chains: [celoSepolia, polygonAmoy, avalancheFuji, bscTestnet],
  ssr: true,
});
