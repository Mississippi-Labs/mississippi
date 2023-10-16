import { getComponentValue } from "@latticexyz/recs";
import { ClientComponents } from "./createClientComponents";
import { SetupNetworkResult } from "./setupNetwork";
import { singletonEntity } from "@latticexyz/store-sync/recs";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
  { worldContract, waitForTransaction }: SetupNetworkResult,
  ClientComponents
) {
  const { Counter, Player } = ClientComponents;

  console.log(ClientComponents, 'ClientComponents')
  const increment = async () => {
    const tx = await worldContract.write.increment();
    await waitForTransaction(tx);
    return getComponentValue(Counter, singletonEntity);
  };

  const move = async (steps) => {
    console.log('move', steps)
    const tx = await worldContract.write.move([steps]);
    await waitForTransaction(tx);
    return getComponentValue(GameSystem, singletonEntity);
  };

  const joinBattlefield = async (addr) => {
    const tx = await worldContract.write.joinBattlefield([addr]);
    await waitForTransaction(tx);
  }

  return {
    increment,
    move
  };
}
