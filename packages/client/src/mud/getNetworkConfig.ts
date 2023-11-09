import { getBurnerPrivateKey } from "@latticexyz/common";
import worldsJson from "contracts/worlds.json";
import { supportedChains } from "./supportedChains";

const worlds = worldsJson as Partial<Record<string, { address: string; blockNumber?: number }>>;

export async function getNetworkConfig() {
  const params = new URLSearchParams(window.location.search);
  // const chainId = Number(params.get("chainId") || params.get("chainid") || (import.meta.env.DEV ? import.meta.env.TEST_CHAIN_ID : import.meta.env.VITE_CHAIN_ID) || 31337);
  const chainId = 33784;
  // const chainId = 31337;
  // const chainId = 421613;
  // console.log(supportedChains);
  if (import.meta.env.DEV) {
    
  }
  const chainIndex = supportedChains.findIndex((c) => c.id === chainId);
  const chain = supportedChains[chainIndex];
  if (!chain) {
    throw new Error(`Chain ${chainId} not found`);
  }

  const world = worlds[chain.id.toString()];
  const worldAddress = params.get("worldAddress") || world?.address;
  if (!worldAddress) {
    throw new Error(`No world address found for chain ${chainId}. Did you run \`mud deploy\`?`);
  }

  const initialBlockNumber = params.has("initialBlockNumber")
    ? Number(params.get("initialBlockNumber"))
    : world?.blockNumber ?? 0n;

  return {
    privateKey: getBurnerPrivateKey(),
    chainId,
    chain,
    faucetServiceUrl: params.get("faucet") ?? chain.faucetUrl,
    worldAddress,
    initialBlockNumber,
  };
}
