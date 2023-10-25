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

  const move = async (steps: any) => {
    console.log(worldContract)
    const tx = await worldContract.write.move([steps]);
    await waitForTransaction(tx);
    // return getComponentValue(Player, singletonEntity);
  };

  const getPosition = async (address) => {
    const tx = await worldContract.read.getPosition([address]);
    const result = await waitForTransaction(tx);
    console.log(result);
    // return getComponentValue(GameSystem, singletonEntity);
    await waitForTransaction(tx);
  };

  const joinBattlefield = async () => {
    const tx = await worldContract.write.joinBattlefield();
    await waitForTransaction(tx);
  }

  const transfer = async (transferData: any) => {
    const tx = await worldContract.write.transfer([...transferData]);
    await waitForTransaction(tx);
  }

  const battleInvitation = async (addr: any, steps: any) => {
    const tx = await worldContract.write.battleInvitation([addr, steps]);
    await waitForTransaction(tx);
  }

  const confirmBattle = async (buffHash: any, battleId: any) => {
    const tx = await worldContract.write.confirmBattle([buffHash, battleId]);
    await waitForTransaction(tx);
  }

  const revealBattle = async (battleId: any, action: any, arg: any, nonce: any) => {
    const tx = await worldContract.write.revealBattle([battleId, action, arg, nonce]);
    await waitForTransaction(tx);
  }

  const selectUserNft = async (tokenId: any) => {
    console.log(tokenId, 'tokenId')
    const tx = await worldContract.write.selectUserNft([tokenId]);
    console.log(new Date().getTime(), tx, 'tx')
    await waitForTransaction(tx);
    console.log(new Date().getTime(), tx, 'tx')
  }

  const openBox = async (boxId: any) => {
    const tx = await worldContract.write.openBox([boxId]);
    await waitForTransaction(tx);
  }

  const revealBox = async (boxId: any) => {
    const tx = await worldContract.write.revealBox([boxId]);
    await waitForTransaction(tx);
  }

  const getCollections = async (boxId: any, oreAmount: any, treasureAmount: any) => {
    const tx = await worldContract.write.getCollections([boxId, oreAmount, treasureAmount]);
    await waitForTransaction(tx);
  }

  const CreateBox = async (x: any, y: any) => {
    const tx = await worldContract.write.CreateBox([x, y]);
    await waitForTransaction(tx);
  }

  const getBattlePlayerHp = async (battleId: any, addr: any) => {
    const tx = await worldContract.write.getBattlePlayerHp([battleId, addr]);
    await waitForTransaction(tx);
  }
  return {
    increment,
    move,
    getPosition,
    joinBattlefield,
    transfer,
    battleInvitation,
    confirmBattle,
    selectUserNft,
    revealBattle,
    openBox,
    getCollections,
    revealBox,
    CreateBox,
    getBattlePlayerHp
  };
}
