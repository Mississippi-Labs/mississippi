import { getComponentValue } from "@latticexyz/recs";
import { ClientComponents } from "./createClientComponents";
import { SetupNetworkResult } from "./setupNetwork";
import { singletonEntity } from "@latticexyz/store-sync/recs";
import { message } from 'antd';

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
    try {
      const tx = await worldContract.write.move([steps]);
      await waitForTransaction(tx);
    } catch (error) {
      message.error(error.cause.reason);
    }
    
    // return getComponentValue(Player, singletonEntity);
  };

  const getPosition = async (address) => {
    const tx = await worldContract.read.getPosition([address]);
    const result = await waitForTransaction(tx);
    console.log(result);
    await waitForTransaction(tx);
  };

  const joinBattlefield = async () => {
    try {
      const tx = await worldContract.write.joinBattlefield();
      await waitForTransaction(tx);
    } catch (error) {
      console.log('joinBattlefield', error);
      message.error(error.cause.reason);
    }
  }

  const transfer = async (addr: any, transferData: any) => {
    try {
      const tx = await worldContract.write.transfer([addr, ...transferData]);
      await waitForTransaction(tx);
    } catch (error) {
      message.error(error.cause.reason);
    }
  }

  const battleInvitation = async (addr: any, steps: any) => {
    try {
      const tx = await worldContract.write.battleInvitation([addr, steps]);
      await waitForTransaction(tx);
    } catch (error) {
      message.error(error.cause.reason);
    }
  }

  const confirmBattle = async (buffHash: any, battleId: any) => {
    try {
      const tx = await worldContract.write.confirmBattle([buffHash, battleId]);
      await waitForTransaction(tx);
    } catch (error) {
      message.error(error.cause.reason);
    }
    
  }

  const revealBattle = async (battleId: any, action: any, arg: any, nonce: any) => {
    try {
      const tx = await worldContract.write.revealBattle([battleId, action, arg, nonce]);
      await waitForTransaction(tx);
    } catch (error) {
      message.error(error.cause.reason);
    }
  }

  const selectUserNft = async (tokenId: any) => {
    try {
      const tx = await worldContract.write.selectUserNft([tokenId]);
      await waitForTransaction(tx);
    } catch (error) {
      console.log('selectUserNft', error);
      message.error(error.cause.reason);
    }
  }

  const selectLootNFT = async (tokenId: any) => {
    try {
      const tx = await worldContract.write.selectLootNFT([tokenId]);
      await waitForTransaction(tx);
    } catch (error) {
      console.log('selectLootNFT', error);
      message.error(error.cause.reason);
    }
  }

  const openBox = async (boxId: any) => {
    try {
      const tx = await worldContract.write.openBox([boxId]);
      await waitForTransaction(tx);
    } catch (error) {
      message.error(error.cause.reason);
    }
  }

  const revealBox = async (boxId: any) => {
    try {
      const tx = await worldContract.write.revealBox([boxId]);
      await waitForTransaction(tx);
    } catch (error) {
      message.error(error.cause.reason);
    }
  }

  const getCollections = async (boxId: any, oreAmount: any, treasureAmount: any) => {
    try {
      const tx = await worldContract.write.getCollections([boxId, oreAmount, treasureAmount]);
      await waitForTransaction(tx);
    } catch (error) {
      message.error(error.cause.reason);
    }
  }

  const CreateBox = async (x: any, y: any) => {
    try {
      const tx = await worldContract.write.CreateBox([x, y]);
      await waitForTransaction(tx);
    } catch (error) {
      message.error(error.cause.reason);
    }
  }

  const getBattlePlayerHp = async (battleId: any, addr: any) => {
    const data = await worldContract.read.getBattlePlayerHp([battleId, addr]);
    return data
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
    selectLootNFT,
    revealBattle,
    openBox,
    getCollections,
    revealBox,
    CreateBox,
    getBattlePlayerHp
  };
}
