import { getComponentValue } from "@latticexyz/recs";
import { ClientComponents } from "./createClientComponents";
import { SetupNetworkResult } from "./setupNetwork";
import { singletonEntity, encodeEntity } from "@latticexyz/store-sync/recs";
import { message } from 'antd';

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
  { worldContract, waitForTransaction }: SetupNetworkResult,
  ClientComponents
) {
  const { Counter, Player, LootList1, LootList2, BoxList, BattleList } = ClientComponents;
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
      console.log('move', error);
      message.error(error.cause.reason || error.cause.details);
    }
    
    // return getComponentValue(Player, singletonEntity);
  };

  const getPosition = async (address) => {
    const tx = await worldContract.read.getPosition([address]);
    const result = await waitForTransaction(tx);
    await waitForTransaction(tx);
  };

  const joinBattlefield = async () => {
    try {
      const tx = await worldContract.write.joinBattlefield();
      await waitForTransaction(tx);
      return tx
    } catch (error) {
      console.log('joinBattlefield', error);
      message.error(error.cause.reason || error.cause.details);
    }
  }

  const transfer = async (addr: any, transferData: any) => {
    try {
      const tx = await worldContract.write.transfer([addr, ...transferData]);
      await waitForTransaction(tx);
    } catch (error) {
      console.log('transfer', error);
      message.error(error.cause.reason || error.cause.details);
    }
  }

  const battleInvitation = async (addr: any, steps: any) => {
    try {
      const tx = await worldContract.write.battleInvitation([addr, steps]);
      await waitForTransaction(tx);
    } catch (error) {
      console.log('battleInvitation', error);
      message.error(error.cause.reason || error.cause.details);
    }
  }

  const confirmBattle = async (buffHash: any, battleId: any) => {
    try {
      const tx = await worldContract.write.confirmBattle([buffHash, battleId]);
      await waitForTransaction(tx);
      return {
        type: 'success'
      }
    } catch (error) {
      console.log('confirmBattle', error);
      message.error(error.cause.reason || error.cause.details);
      return {
        type: 'error',
        msg: error.cause.reason || error.cause.details || error.cause
      }
    }
    
  }

  const revealBattle = async (battleId: any, action: any, arg: any, nonce: any) => {
    try {
      const tx = await worldContract.write.revealBattle([battleId, action, arg, nonce]);
      await waitForTransaction(tx);
    } catch (error) {
      console.log('revealBattle', error);
      message.error(error.cause.reason || error.cause.details);
    }
  }

  const selectBothNFT = async (userTokenId: any, lootTokenId: any, address: any) => {
    try {
      const tx = await worldContract.write.selectBothNFT([userTokenId, lootTokenId]);
      await waitForTransaction(tx);
      return {
        playerData: getComponentValue(Player, encodeEntity({ addr: "address" }, { addr:  address})),
        lootData: getComponentValue(LootList1, encodeEntity({ addr: "address" }, { addr:  address})),
      }
    } catch (error) {
      console.log('selectUserNft', error);
      message.error(error.cause.reason || error.cause.details);
    }
  }

  const selectUserNft = async (tokenId: any, address: any) => {
    try {
      const tx = await worldContract.write.selectUserNft([tokenId]);
      await waitForTransaction(tx);
      return getComponentValue(Player, encodeEntity({ addr: "address" }, { addr:  address}));
    } catch (error) {
      console.log('selectUserNft', error);
      message.error(error.cause.reason || error.cause.details);
    }
  }

  const selectLootNFT = async (tokenId: any, address: any) => {
    try {
      const tx = await worldContract.write.selectLootNFT([tokenId]);
      await waitForTransaction(tx);
      let LootList1Data = getComponentValue(LootList1, encodeEntity({ addr: "address" }, { addr:  address}));
      // let LootList2Data = getComponentValue(LootList2, encodeEntity({ addr: "address" }, { addr:  address}));
      return LootList1Data
    } catch (error) {
      console.log('selectLootNFT', error);
      message.error(error.cause.reason || error.cause.details);
    }
  }

  const openBox = async (boxId: any) => {
    try {
      const tx = await worldContract.write.openBox([boxId]);
      await waitForTransaction(tx);
    } catch (error) {
      console.log('openBox', error);
      message.error(error.cause.reason || error.cause.details);
    }
  }

  const revealBox = async (boxId: any) => {
    try {
      const tx = await worldContract.write.revealBox([boxId]);
      await waitForTransaction(tx);
      return getComponentValue(BoxList, encodeEntity({ boxId: "uint256" }, { boxId:  boxId}));
    } catch (error) {
      console.log('revealBox', error);
      message.error(error.cause.reason || error.cause.details);
    }
  }

  const getCollections = async (boxId: any, oreAmount: any, treasureAmount: any) => {
    try {
      const tx = await worldContract.write.getCollections([boxId, oreAmount, treasureAmount]);
      await waitForTransaction(tx);
    } catch (error) {
      console.log('getCollections', error);
      message.error(error.cause.reason || error.cause.details);
    }
  }

  const CreateBox = async (x: any, y: any) => {
    try {
      const tx = await worldContract.write.CreateBox([x, y]);
      await waitForTransaction(tx);
    } catch (error) {
      console.log('CreateBox', error);
      message.error(error.cause.reason || error.cause.details);
    }
  }

  const setInfo = async (name: any, url: any) => {
    try {
      const tx = await worldContract.write.setInfo([name, url]);
      await waitForTransaction(tx);
      return tx
    } catch (error) {
      console.log('setInfo', error);
      message.error(error.cause.reason || error.cause.details);
    }
  }

  const initUserInfo = async () => {
    try {
      const tx = await worldContract.write.initUserInfo();
      await waitForTransaction(tx);
      return tx
    } catch (error) {
      console.log('initUserInfo', error);
      message.error(error.cause.reason || error.cause.details);
    }
  }

  const forceEnd = async (battleId: any) => {
    try {
      const tx = await worldContract.write.forceEnd([battleId]);
      await waitForTransaction(tx);
      return getComponentValue(BattleList, encodeEntity({ battleId: "uint256" }, { battleId:  battleId}))
    } catch (error) {
      console.log('forceEnd', error);
      message.error(error.cause.reason || error.cause.details);
    }
  }

  const unlockUserLocation = async () => {
    try {
      const tx = await worldContract.write.unlockUserLocation();
      await waitForTransaction(tx);
      return tx
    } catch (error) {
      console.log('unlockUserLocation', error);
      message.error(error.cause.reason || error.cause.details);
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
    getBattlePlayerHp,
    setInfo,
    initUserInfo,
    selectBothNFT,
    forceEnd,
    unlockUserLocation
  };
}
