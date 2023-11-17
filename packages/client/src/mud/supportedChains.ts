import { MUDChain, latticeTestnet, mudFoundry } from "@latticexyz/common/chains";

import { sepolia, arbitrumGoerli } from 'viem/chains'

arbitrumGoerli.rpcUrls.default.http = ['https://arbitrum-goerli.infura.io/v3/5ca372516740427e97512d4dfefd9c47'];
arbitrumGoerli.rpcUrls.default.webSocket = [ 'wss://arbitrum-goerli.infura.io/ws/v3/5ca372516740427e97512d4dfefd9c47'];

const testnet = {
  name: "Mississippi testnet",
  id: 33784,
  network: "mississippi-testnet",
  nativeCurrency: { decimals: 18, name: "Ether", symbol: "ETH" },
  rpcUrls: {
    default: {
      http: ["https://rpc.0xmssp.xyz"],
      webSocket: ["https://rpc.0xmssp.xyz"],
    },
    public: {
      http: ["https://rpc.0xmssp.xyz"],
      webSocket: ["https://rpc.0xmssp.xyz"],
    },
  }
}

const redstone = {
  name: "Redstone testnet",
  id: 17001,
  network: "redstone-testnet",
  nativeCurrency: { decimals: 18, name: "Ether", symbol: "ETH" },
  rpcUrls: {
    default: {
      http: ["https://rpc.holesky.redstone.xyz"],
      webSocket: ["https://rpc.holesky.redstone.xyz"],
    },
    public: {
      http: ["https://rpc.holesky.redstone.xyz"],
      webSocket: ["https://rpc.holesky.redstone.xyz"],
    },
  }
}

// If you are deploying to chains other than anvil or Lattice testnet, add them here
export const supportedChains: MUDChain[] = [mudFoundry, latticeTestnet, sepolia, arbitrumGoerli, testnet, redstone];
