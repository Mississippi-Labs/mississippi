import { getComponentValue } from "@latticexyz/recs";
import { ClientComponents } from "./createClientComponents";
import { SetupNetworkResult } from "./setupNetwork";
import { singletonEntity, encodeEntity } from "@latticexyz/store-sync/recs";
import { message } from 'antd';

let wait = false;

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
    console.log('move', new Date().getTime());
    try {
      const tx = await worldContract.write.move([steps]);
      await waitForTransaction(tx);
      console.log('move success', new Date().getTime(), tx);
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
    console.log('joinBattlefield', new Date().getTime());
    try {
      const tx = await worldContract.write.joinBattlefield();
      await waitForTransaction(tx);
      console.log('joinBattlefield success', new Date().getTime(), tx);
      return tx
    } catch (error) {
      console.log('joinBattlefield', error);
      message.error(error.cause.reason || error.cause.details);
    }
  }

  const transfer = async (addr: any, transferData: any) => {
    console.log('transfer', new Date().getTime());
    try {
      const tx = await worldContract.write.transfer([addr, ...transferData]);
      await waitForTransaction(tx);
      console.log('transfer success', new Date().getTime(), tx);
    } catch (error) {
      console.log('transfer', error);
      message.error(error.cause.reason || error.cause.details);
    }
  }

  const battleInvitation = async (addr: any, steps: any) => {
    if (wait) return
    wait = true
    console.log('battleInvitation', new Date().getTime());
    try {
      const tx = await worldContract.write.battleInvitation([addr, steps]);
      await waitForTransaction(tx);
      console.log('battleInvitation success', new Date().getTime(), tx);
      wait = false
      return tx
    } catch (error) {
      console.log('battleInvitation', error);
      message.error(error.cause.reason || error.cause.details);
      wait = false
    }
  }

  const confirmBattle = async (buffHash: any, battleId: any) => {
    if (wait) return
    wait = true
    console.log('confirmBattle', new Date().getTime());
    try {
      const tx = await worldContract.write.confirmBattle([buffHash, battleId]);
      await waitForTransaction(tx);
      console.log('confirmBattle success', new Date().getTime(), tx);
      wait = false
      return {
        type: 'success',
        data: getComponentValue(BattleList, encodeEntity({ battleId: "uint256" }, { battleId:  battleId}))
      }
    } catch (error) {
      console.log('confirmBattle', error);
      message.error(error.cause.reason || error.cause.details);
      wait = false
      return {
        type: 'error',
        msg: error.cause.reason || error.cause.details || error.cause
      }
    }
    
  }

  const revealBattle = async (battleId: any, action: any, arg: any, nonce: any) => {
    if (wait) return
    wait = true
    return new Promise((resolve, reject) => {
      worldContract.write.revealBattle([battleId, action, arg, nonce]).then((tx: any) => {
        waitForTransaction(tx).then((res: any) => {
          console.log('revealBattle success', new Date().getTime(), tx);
          wait = false
          setTimeout(() => {
            resolve({
              type: 'success',
              data: getComponentValue(BattleList, encodeEntity({ battleId: "uint256" }, { battleId:  battleId}))
            })
          }, 100)
        }).catch((error: any) => {
          console.log('revealBattle', error);
          message.error(error.cause.reason || error.cause.details);
          wait = false
          reject({
            type: 'error',
            msg: error.cause.reason || error.cause.details || error.cause
          })
        })
      }).catch((error: any) => {
        console.log('revealBattle', error);
        message.error(error.cause.reason || error.cause.details);
        wait = false
        reject({
          type: 'error',
          msg: error.cause.reason || error.cause.details || error.cause
        })
      })
    })
  }

  const selectBothNFT = async (userTokenId: any, lootTokenId: any, address: any) => {
    console.log('selectBothNFT', new Date().getTime());
    try {
      const tx = await worldContract.write.selectBothNFT([userTokenId, lootTokenId]);
      await waitForTransaction(tx);
      console.log('selectBothNFT success', new Date().getTime(), tx);
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
    console.log('selectUserNft', new Date().getTime());
    try {
      const tx = await worldContract.write.selectUserNft([tokenId]);
      await waitForTransaction(tx);
      console.log('selectUserNft success', new Date().getTime(), tx);
      return getComponentValue(Player, encodeEntity({ addr: "address" }, { addr:  address}));
    } catch (error) {
      console.log('selectUserNft', error);
      message.error(error.cause.reason || error.cause.details);
    }
  }

  const selectLootNFT = async (tokenId: any, address: any) => {
    console.log('selectLootNFT', new Date().getTime());
    try {
      const tx = await worldContract.write.selectLootNFT([tokenId]);
      await waitForTransaction(tx);
      console.log('selectLootNFT success', new Date().getTime(), tx);
      let LootList1Data = getComponentValue(LootList1, encodeEntity({ addr: "address" }, { addr:  address}));
      // let LootList2Data = getComponentValue(LootList2, encodeEntity({ addr: "address" }, { addr:  address}));
      return LootList1Data
    } catch (error) {
      console.log('selectLootNFT', error);
      message.error(error.cause.reason || error.cause.details);
    }
  }

  const openBox = async (boxId: any) => {
    if (wait) return
    wait = true
    console.log('openBox', new Date().getTime());
    try {
      const tx = await worldContract.write.openBox([boxId]);
      await waitForTransaction(tx);
      console.log('openBox success', new Date().getTime(), tx);
      wait = false
    } catch (error) {
      console.log('openBox', error);
      message.error(error.cause.reason || error.cause.details);
      wait = false
    }
  }

  const revealBox = async (boxId: any) => {
    if (wait) return
    wait = true
    console.log('revealBox', new Date().getTime());
    try {
      const tx = await worldContract.write.revealBox([boxId]);
      await waitForTransaction(tx);
      console.log('revealBox success', new Date().getTime(), tx);
      wait = false
      return getComponentValue(BoxList, encodeEntity({ boxId: "uint256" }, { boxId:  boxId}));
    } catch (error) {
      console.log('revealBox', error);
      message.error(error.cause.reason || error.cause.details);
      wait = false
    }
  }

  const getCollections = async (boxId: any, oreAmount: any, treasureAmount: any) => {
    if (wait) return
    wait = true
    try {
      const tx = await worldContract.write.getCollections([boxId, oreAmount, treasureAmount]);
      await waitForTransaction(tx);
      wait = false
    } catch (error) {
      console.log('getCollections', error);
      message.error(error.cause.reason || error.cause.details);
      wait = false
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
    console.log('setInfo', new Date().getTime());
    try {
      const tx = await worldContract.write.setInfo([name, url]);
      await waitForTransaction(tx);
      console.log('setInfo success', new Date().getTime(), tx);
      return tx
    } catch (error) {
      console.log('setInfo', error);
      message.error(error.cause.reason || error.cause.details);
    }
  }

  const initUserInfo = async () => {
    if (wait) return
    wait = true
    console.log('initUserInfo', new Date().getTime());
    try {
      const tx = await worldContract.write.initUserInfo();
      await waitForTransaction(tx);
      console.log('initUserInfo success', new Date().getTime(), tx);
      wait = false
      return tx
    } catch (error) {
      console.log('initUserInfo', error);
      message.error(error.cause.reason || error.cause.details);
      wait = false
    }
  }

  const forceEnd = async (battleId: any) => {
    if (wait) return
    wait = true
    console.log('forceEnd', new Date().getTime());
    try {
      const tx = await worldContract.write.forceEnd([battleId]);
      await waitForTransaction(tx);
      console.log('forceEnd success', new Date().getTime(), tx);
      wait = false
      return getComponentValue(BattleList, encodeEntity({ battleId: "uint256" }, { battleId:  battleId}))
    } catch (error) {
      console.log('forceEnd', error);
      // message.error(error.cause.reason || error.cause.details);
      wait = false
    }
  }

  const unlockUserLocation = async () => {
    console.log('unlockUserLocation', new Date().getTime());
    try {
      const tx = await worldContract.write.unlockUserLocation();
      await waitForTransaction(tx);
      console.log('unlockUserLocation success', new Date().getTime(), tx);
      return tx
    } catch (error) {
      console.log('unlockUserLocation', error);
      message.error(error.cause.reason || error.cause.details);
    }
  }

  const goHome = async () => {
    try {
      const tx = await worldContract.write.goHome();
      await waitForTransaction(tx);
      console.log('goHome', new Date().getTime());
      return tx
    } catch (error) {
      console.log('goHome', error);
      message.error(error.cause.reason || error.cause.details);
    }
  }

  const submitGem = async () => {
    try {
      const tx = await worldContract.write.submitGem();
      await waitForTransaction(tx);
      return tx
    } catch (error) {
      console.log('submitGem', error);
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
    unlockUserLocation,
    submitGem,
    goHome
  };
}
