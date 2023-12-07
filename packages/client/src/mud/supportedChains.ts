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

arbitrumGoerli.rpcUrls.default.http = ['https://arbitrum-goerli.infura.io/v3/5ca372516740427e97512d4dfefd9c47'];
arbitrumGoerli.rpcUrls.default.webSocket = [ 'wss://arbitrum-goerli.infura.io/ws/v3/5ca372516740427e97512d4dfefd9c47'];

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
  indexerUrl: "https://indexer.0xmssp.xyz/trpc",
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

/*
 * See https://mud.dev/tutorials/minimal/deploy#run-the-user-interface
 * for instructions on how to add networks.
 */
export const supportedChains: MUDChain[] = [mudFoundry, latticeTestnet, sepolia, arbitrumGoerli, testnet, redstone];
