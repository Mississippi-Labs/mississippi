import { MUDChain, latticeTestnet, mudFoundry } from "@latticexyz/common/chains";

import { sepolia, arbitrumGoerli } from 'viem/chains'

arbitrumGoerli.rpcUrls.default.http = ['https://arbitrum-goerli.infura.io/v3/5ca372516740427e97512d4dfefd9c47'];
arbitrumGoerli.rpcUrls.default.webSocket = [ 'wss://arbitrum-goerli.infura.io/ws/v3/5ca372516740427e97512d4dfefd9c47'];

const testnet = {
    name: "Lidamao Testnet",
    id: 33784,
    network: "lidamao-testnet",
    nativeCurrency: { decimals: 18, name: "Ether", symbol: "ETH" },
    rpcUrls: {
      default: {
        http: ["http://8.217.213.253"],
        webSocket: ["http://8.217.213.253"],
      },
      public: {
        http: ["http://8.217.213.253"],
        webSocket: ["http://8.217.213.253"],
      },
    }
  }

// If you are deploying to chains other than anvil or Lattice testnet, add them here
export const supportedChains: MUDChain[] = [mudFoundry, latticeTestnet, sepolia, arbitrumGoerli, testnet];
