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

import { MUDChain, mudFoundry } from "@latticexyz/common/chains";

/** @deprecated This chain is deprecated and will be going offline soon. Please switch to Garnet! */
const arbSepolia = {
  name: "ARB Sepolia testnet",
  id: 421614,
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://arb-sepolia.g.alchemy.com/v2/xQr0n2BqF1Hkkuw5_0YiEXeyQdSYoW1u"],
      webSocket: ["wss://arb-sepolia.g.alchemy.com/v2/xQr0n2BqF1Hkkuw5_0YiEXeyQdSYoW1u"],
    },
    public: {
      http: ["https://arb-sepolia.g.alchemy.com/v2/xQr0n2BqF1Hkkuw5_0YiEXeyQdSYoW1u"],
      webSocket: ["wss://arb-sepolia.g.alchemy.com/v2/xQr0n2BqF1Hkkuw5_0YiEXeyQdSYoW1u"],
    },
  },
  indexerUrl: 'https://indexer.lidamao.tech'
};

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

// const arbSepolia = {
//   name: "ARB Sepolia testnet",
//   id: 421614,
//   nativeCurrency: { decimals: 18, name: "Ether", symbol: "ETH" },
//   iconUrls: ['https://redstone.xyz/chain-icons/redstone.png'],
//   rpcUrls: {
//     default: {
//       http: ["https://arb-sepolia.g.alchemy.com/v2/rDwBqKe2Zy38AF5b-GB2Y5bfH7wspLM5"],
//       webSocket: ["wss://arb-sepolia.g.alchemy.com/v2/rDwBqKe2Zy38AF5b-GB2Y5bfH7wspLM5"],
//     }
//   }
// }

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
export const supportedChains: MUDChain[] = [mudFoundry, opBNB, opSepolia, arbSepolia, mudFoundry];
