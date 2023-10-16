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
<<<<<<< HEAD
    console.log('move', steps)
    const tx = await worldContract.write.move([steps]);
=======
    console.log(worldContract)
    const tx = await worldContract.write.move([steps]);
    await waitForTransaction(tx);
    // const result = getComponentValue(Player, singletonEntity)
    const result = getComponentValue(Player, '0x35be872A3C94Bf581A9DA4c653CE734380b75B7D')
    console.log(result)
    return result;
    // return getComponentValue(Player, singletonEntity);
  };

  const getPosition = async (address) => {
    const tx = await worldContract.read.getPosition([address]);
    const result = await waitForTransaction(tx);
    console.log(result);
    // return getComponentValue(GameSystem, singletonEntity);
>>>>>>> 79480b45a422439a77d4380ef42b0c72297f51a7
    await waitForTransaction(tx);
  };

  const joinBattlefield = async (addr) => {
    const tx = await worldContract.write.joinBattlefield([addr]);
    await waitForTransaction(tx);
  }

  return {
    increment,
    move,
<<<<<<< HEAD
=======
    getPosition,
>>>>>>> 79480b45a422439a77d4380ef42b0c72297f51a7
    joinBattlefield
  };
}
