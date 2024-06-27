/*
 * The supported chains.
 * By default, there are only two chains here:
 *
 * - mudFoundry, the chain running on anvil that pnpm dev
 *   starts by default. It is similar to the viem anvil chain
 *   (see https://viem.sh/docs/clients/test.html), but with the
 *   basefee set to zero to avoid transaction fees.
 * - latticeTestnet, our public test network.
 *
 */

import { MUDChain, latticeTestnet, mudFoundry } from "@latticexyz/common/chains";
import { sepolia, arbitrumGoerli } from 'viem/chains'

arbitrumGoerli.rpcUrls.default.http = ['https://arbitrum-goerli.publicnode.com'];
arbitrumGoerli.rpcUrls.default.webSocket = [ 'wss://arbitrum-goerli.publicnode.com'];


const testnet = {
  name: "Mississippi testnet",
  id: 33784,
  network: "mississippi-testnet",
  nativeCurrency: { decimals: 18, name: "Ether", symbol: "ETH" },
  rpcUrls: {
    default: {
      http: ["https://rpc1.0xmssp.xyz"],
      webSocket: ["https://rpc1.0xmssp.xyz"],
    },
    public: {
      http: ["https://rpc1.0xmssp.xyz"],
      webSocket: ["https://rpc1.0xmssp.xyz"],
    },
  },
}

const opSepolia = {
  name: "OP Sepolia testnet",
  id: 11155420,
  network: "OP Sepolia",
  nativeCurrency: { decimals: 18, name: "Ether", symbol: "ETH" },
  rpcUrls: {
    default: {
      http: ["https://opt-sepolia.g.alchemy.com/v2/bce2VN0gO5fwujxkK1p9hR6W2sQR8smT"],
      webSocket: ["wss://opt-sepolia.g.alchemy.com/v2/bce2VN0gO5fwujxkK1p9hR6W2sQR8smT"],
    },
    public: {
      http: ["https://opt-sepolia.g.alchemy.com/v2/bce2VN0gO5fwujxkK1p9hR6W2sQR8smT"],
      webSocket: ["wss://opt-sepolia.g.alchemy.com/v2/bce2VN0gO5fwujxkK1p9hR6W2sQR8smT"],
    },
  },
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

const opBNB = {
  id: 204,
  name: 'opBNB Mainnet',
  network: 'opBNB Mainnet',
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18,
  },
  rpcUrls: {
    public: { 
      http: ['https://opbnb-mainnet-rpc.bnbchain.org'],
      webSocket: ['https://opbnb-mainnet-rpc.bnbchain.org'],
    },
    default: { http: ['https://opbnb-mainnet-rpc.bnbchain.org'], webSocket: ['https://opbnb-mainnet-rpc.bnbchain.org'] },
  }
}

/*
 * See https://mud.dev/tutorials/minimal/deploy#run-the-user-interface
 * for instructions on how to add networks.
 */
export const supportedChains: MUDChain[] = [mudFoundry, latticeTestnet, sepolia, arbitrumGoerli, testnet, redstone, opBNB, opSepolia];
