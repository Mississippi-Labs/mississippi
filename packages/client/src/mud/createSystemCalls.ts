import { getComponentValue } from "@latticexyz/recs";
import { ClientComponents } from "./createClientComponents";
import { SetupNetworkResult } from "./setupNetwork";
import { singletonEntity, encodeEntity } from "@latticexyz/store-sync/recs";
import { message } from 'antd';
import eventEmitter from '../utils/eventEmitter';

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
    let time = new Date().getTime()
    let log = {
      time,
      msg: `move to ${steps[steps.length - 1][0]}, ${steps[steps.length - 1][1]}`
    }
    eventEmitter.emit('log', log)
    try {
      const tx = await worldContract.write.move([steps]);
      let r = await waitForTransaction(tx);
      let receipt = r.receipt
      log.block = receipt.blockNumber.toString(),
      eventEmitter.emit('log', log)
    } catch (error) {
      log.type = 'error'
      log.msg = 'move:' + error.cause.reason || error.cause.details
      eventEmitter.emit('log', log)
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
    let time = new Date().getTime()
    let log = {
      time,
      msg: `join battlefield`
    }
    eventEmitter.emit('log', log)
    try {
      const tx = await worldContract.write.joinBattlefield();
      let r = await waitForTransaction(tx);
      console.log('joinBattlefield success', new Date().getTime(), tx);
      let receipt = r.receipt
      log.block = receipt.blockNumber.toString()
      eventEmitter.emit('log', log)
      return tx
    } catch (error) {
      log.type = 'error'
      log.msg = 'joinBattlefield:' + error.cause.reason || error.cause.details
      eventEmitter.emit('log', log)
      console.log('joinBattlefield', error);
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
    let time = new Date().getTime()
    let log = {
      time,
      msg: `battle invitation with ${addr}`
    }
    eventEmitter.emit('log', log)
    try {
      const tx = await worldContract.write.battleInvitation([addr, steps]);
      let { receipt } = await waitForTransaction(tx);
      console.log('battleInvitation success', new Date().getTime(), tx);
      log.block = receipt.blockNumber.toString()
      eventEmitter.emit('log', log)
      wait = false
      return tx
    } catch (error) {
      log.type = 'error'
      log.msg = 'battleInvitation:' + error.cause.reason || error.cause.details
      eventEmitter.emit('log', log)
      console.log('battleInvitation', error);
      wait = false
    }
  }

  const confirmBattle = async (buffHash: any, battleId: any) => {
    if (wait) return
    wait = true
    console.log('confirmBattle', new Date().getTime());
    let time = new Date().getTime()
    let log = {
      time,
      msg: `confirm battle`
    }
    eventEmitter.emit('log', log)
    try {
      const tx = await worldContract.write.confirmBattle([buffHash, battleId]);
      let {receipt} = await waitForTransaction(tx);
      console.log('confirmBattle success', new Date().getTime(), tx);
      log.block = receipt.blockNumber.toString()
      eventEmitter.emit('log', log)
      wait = false
      return {
        type: 'success',
        data: getComponentValue(BattleList, encodeEntity({ battleId: "uint256" }, { battleId:  battleId}))
      }
    } catch (error) {
      log.type = 'error'
      log.msg = 'confirmBattle:' + error.cause.reason || error.cause.details
      eventEmitter.emit('log', log)
      console.log('confirmBattle', error);
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
    let time = new Date().getTime()
    let log = {
      time,
      msg: `reveal battle`
    }
    eventEmitter.emit('log', log)
    return new Promise((resolve, reject) => {
      worldContract.write.revealBattle([battleId, action, arg, nonce]).then((tx: any) => {
        waitForTransaction(tx).then((res: any) => {
          console.log('revealBattle success', new Date().getTime(), tx);
          let receipt = res.receipt
          log.block = receipt.blockNumber.toString()
          eventEmitter.emit('log', log)
          wait = false
          setTimeout(() => {
            resolve({
              type: 'success',
              data: getComponentValue(BattleList, encodeEntity({ battleId: "uint256" }, { battleId:  battleId}))
            })
          }, 100)
        }).catch((error: any) => {
          log.type = 'error'
          log.msg = 'revealBattle:' + error.cause.reason || error.cause.details
          eventEmitter.emit('log', log)
          console.log('revealBattle', error);
          wait = false
          reject({
            type: 'error',
            msg: error.cause.reason || error.cause.details || error.cause
          })
        })
      }).catch((error: any) => {
        log.type = 'error'
        log.msg = 'revealBattle:' + error.cause.reason || error.cause.details
        eventEmitter.emit('log', log)
        console.log('revealBattle', error);
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
    let time = new Date().getTime()
    let log = {
      time,
      msg: `open box`
    }
    eventEmitter.emit('log', log)
    try {
      const tx = await worldContract.write.openBox([boxId]);
      let { receipt } = await waitForTransaction(tx);
      log.block = receipt.blockNumber.toString()
      eventEmitter.emit('log', log)
      console.log('openBox success', new Date().getTime(), tx);
      wait = false
    } catch (error) {
      log.type = 'error'
      log.msg = 'openBox:' + error.cause.reason || error.cause.details
      eventEmitter.emit('log', log)
      console.log('openBox', error);
      wait = false
    }
  }

  const revealBox = async (boxId: any) => {
    if (wait) return
    wait = true
    console.log('revealBox', new Date().getTime());
    let time = new Date().getTime()
    let log = {
      time,
      msg: `reveal box`
    }
    eventEmitter.emit('log', log)
    try {
      const tx = await worldContract.write.revealBox([boxId]);
      let { receipt } = await waitForTransaction(tx);
      log.block = receipt.blockNumber.toString()
      eventEmitter.emit('log', log)
      console.log('revealBox success', new Date().getTime(), tx);
      wait = false
      return getComponentValue(BoxList, encodeEntity({ boxId: "uint256" }, { boxId:  boxId}));
    } catch (error) {
      log.type = 'error'
      log.msg = 'revealBox:' + error.cause.reason || error.cause.details
      eventEmitter.emit('log', log)
      console.log('revealBox', error);
      wait = false
    }
  }

  const getCollections = async (boxId: any, oreAmount: any, treasureAmount: any) => {
    if (wait) return
    wait = true
    let time = new Date().getTime()
    let log = {
      time,
      msg: `get collections ${oreAmount} Gems`
    }
    eventEmitter.emit('log', log)
    try {
      const tx = await worldContract.write.getCollections([boxId, oreAmount, treasureAmount]);
      let { receipt } = await waitForTransaction(tx);
      log.block = receipt.blockNumber.toString()
      eventEmitter.emit('log', log)
      wait = false
      return {
        type: 'success'
      }
    } catch (error) {
      log.type = 'error'
      log.msg = 'getCollections:' + error.cause.reason || error.cause.details
      eventEmitter.emit('log', log)
      console.log('getCollections', error);
      wait = false
      return {
        type: 'error'
      }
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

  const initUserInfo = async (addr) => {
    if (wait) return
    wait = true
    console.log('initUserInfo', new Date().getTime());
    try {
      const tx = await worldContract.write.initUserInfo([addr]);
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
    let time = new Date().getTime()
    let log = {
      time,
      msg: `force end`
    }
    eventEmitter.emit('log', log)
    try {
      const tx = await worldContract.write.forceEnd([battleId]);
      let { receipt } = await waitForTransaction(tx);
      log.block = receipt.blockNumber.toString()
      eventEmitter.emit('log', log)
      console.log('forceEnd success', new Date().getTime(), tx);
      wait = false
      return getComponentValue(BattleList, encodeEntity({ battleId: "uint256" }, { battleId:  battleId}))
    } catch (error) {
      log.type = 'error'
      log.msg = 'forceEnd:' + error.cause.reason || error.cause.details
      eventEmitter.emit('log', log)
      console.log('forceEnd', error);
      wait = false
      return {
        type: 'error'
      }
    }
  }

  const unlockUserLocation = async () => {
    console.log('unlockUserLocation', new Date().getTime());
    let time = new Date().getTime()
    let log = {
      time,
      msg: `unlock user location`
    }
    eventEmitter.emit('log', log)
    try {
      const tx = await worldContract.write.unlockUserLocation();
      let { receipt } = await waitForTransaction(tx);
      log.block = receipt.blockNumber.toString()
      eventEmitter.emit('log', log)
      console.log('unlockUserLocation success', new Date().getTime(), tx);
      return tx
    } catch (error) {
      log.type = 'error'
      log.msg = 'unlockUserLocation:' + error.cause.reason || error.cause.details
      eventEmitter.emit('log', log)
      console.log('unlockUserLocation', error);
    }
  }

  const goHome = async () => {
    let time = new Date().getTime()
    let log = {
      time,
      msg: `go home`
    }
    eventEmitter.emit('log', log)
    try {
      const tx = await worldContract.write.goHome();
      let { receipt } = await waitForTransaction(tx);
      log.block = receipt.blockNumber.toString()
      eventEmitter.emit('log', log)
      console.log('goHome', new Date().getTime());
      return tx
    } catch (error) {
      log.type = 'error'
      log.msg = 'goHome:' + error.cause.reason || error.cause.details
      eventEmitter.emit('log', log)
      console.log('goHome', error);
    }
  }

  const submitGem = async () => {
    let time = new Date().getTime()
    let log = {
      time,
      msg: `submit gem`
    }
    eventEmitter.emit('log', log)
    try {
      console.log('submitGem', new Date().getTime());
      const tx = await worldContract.write.submitGem();
      let { receipt } = await waitForTransaction(tx);
      log.block = receipt.blockNumber.toString()
      eventEmitter.emit('log', log)
      console.log('submitGem success', new Date().getTime(), tx);
      return tx
    } catch (error) {
      log.type = 'error'
      log.msg = 'submitGem:' + error.cause.reason || error.cause.details
      eventEmitter.emit('log', log)
      console.log('submitGem', error);
    }
  }

  const setGmaeOpen = async (b) => {
    try {
      console.log('setGmaeOpen', new Date().getTime());
      const tx = await worldContract.write.setGmaeOpen([b]);
      await waitForTransaction(tx);
      console.log('setGmaeOpen success', new Date().getTime(), tx);
      return tx
    } catch (error) {
      console.log('setGmaeOpen', error);
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
    goHome,
    setGmaeOpen
  };
}
