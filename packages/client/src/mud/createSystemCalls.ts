/*
 * Create the system calls that the client can use to ask
 * for changes in the World state (using the System contracts).
 */

import { Hex } from "viem";
import { SetupNetworkResult } from "./setupNetwork";

import eventEmitter from '../utils/eventEmitter';
import { message } from 'antd';

import { delay } from '../utils/delay';

export type SystemCalls = ReturnType<typeof createSystemCalls>;

let wait = false;

export function createSystemCalls(
  /*
   * The parameter list informs TypeScript that:
   *
   * - The first parameter is expected to be a
   *   SetupNetworkResult, as defined in setupNetwork.ts
   *
   *   Out of this parameter, we only care about two fields:
   *   - worldContract (which comes from getContract, see
   *     https://github.com/latticexyz/mud/blob/main/templates/react/packages/client/src/mud/setupNetwork.ts#L63-L69).
   *
   *   - waitForTransaction (which comes from syncToRecs, see
   *     https://github.com/latticexyz/mud/blob/main/templates/react/packages/client/src/mud/setupNetwork.ts#L77-L83).
   *
   * - From the second parameter, which is a ClientComponent,
   *   we only care about Counter. This parameter comes to use
   *   through createClientComponents.ts, but it originates in
   *   syncToRecs
   *   (https://github.com/latticexyz/mud/blob/main/templates/react/packages/client/src/mud/setupNetwork.ts#L77-L83).
   */
  { tables, useStore, worldContract, waitForTransaction, publicClient }: SetupNetworkResult
) {

  const getBlockNumber = async (tx: any) => {
    const receipt = await publicClient.getTransactionReceipt({ hash: tx });
    return receipt.blockNumber.toString()
  }

  const transfer = async (addr: any, transferData: any) => {
    try {
      const tx = await worldContract.write.transfer([addr, ...transferData]);
      await waitForTransaction(tx);
    } catch (error) {
      message.error(error.cause.reason || error.cause.details);
    }
  }

  const move = async (steps: any) => {
    let time = new Date().getTime()
    let log = {
      time,
      msg: `move to ${steps[steps.length - 1][0]}, ${steps[steps.length - 1][1]}`
    }
    eventEmitter.emit('log', log)
    try {
      const tx = await worldContract.write.move([steps]);
      await waitForTransaction(tx);
      const receipt = await publicClient.getTransactionReceipt({ hash: tx });
      // let receipt = r.receipt
      log.block = await getBlockNumber(tx)
      eventEmitter.emit('log', log)
    } catch (error) {
      console.log('move', error);
      log.type = 'error'
      log.msg = 'move:' + error.cause.reason || error.cause.details
      eventEmitter.emit('log', log)
      console.log('move', error);
      message.error(error.cause.reason || error.cause.details);
    }
  };

  const selectBothNFT = async (userTokenId: any, lootTokenId: any, address: any) => {
    try {
      const tx = await worldContract.write.selectBothNFT([userTokenId, lootTokenId]);
      await waitForTransaction(tx);
      await delay(300)
      return {
        playerData: useStore.getState().getValue(tables.PlayerParams, { addr: address }),
        lootData: useStore.getState().getValue(tables.LootList1, { addr: address })
      }
    } catch (error) {
      console.log('selectUserNft', error);
      message.error(error.cause.reason || error.cause.details);
      return {
        type: 'error'
      }
    }
  }

  const setInfo = async (name: any, url: any) => {
    console.log('setInfo', new Date().getTime());
    try {
      const tx = await worldContract.write.setInfo([name]);
      await waitForTransaction(tx);
      console.log('setInfo success', new Date().getTime(), tx);
      return tx
    } catch (error) {
      console.log('setInfo', error);
      message.error(error.cause.reason || error.cause.details);
    }
  }

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
      // let receipt = r.receipt
      log.block = await getBlockNumber(tx)
      eventEmitter.emit('log', log)
      return tx
    } catch (error) {
      log.type = 'error'
      log.msg = 'joinBattlefield:' + error.cause.reason || error.cause.details
      eventEmitter.emit('log', log)
      console.log('joinBattlefield', error);
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

  const openBox = async (boxId: any) => {
    if (wait) return
    wait = true
    let time = new Date().getTime()
    let log = {
      time,
      msg: `open box`
    }
    eventEmitter.emit('log', log)
    try {
      const tx = await worldContract.write.openBox([boxId]);
      await waitForTransaction(tx);
      log.block = await getBlockNumber(tx)
      eventEmitter.emit('log', log)
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
      await waitForTransaction(tx);
      log.block = await getBlockNumber(tx)
      eventEmitter.emit('log', log)
      console.log('revealBox success', new Date().getTime(), tx);
      wait = false
      await delay(300)
      return useStore.getState().getValue(tables.BoxList, { boxId })
    } catch (error) {
      console.log(error)
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
      await waitForTransaction(tx);
      log.block = await getBlockNumber(tx)
      eventEmitter.emit('log', log)
      wait = false
      await delay(300)
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

  const battleInvitation = async (addr: any, steps: any) => {
    if (wait) return
    wait = true
    let time = new Date().getTime()
    let log = {
      time,
      msg: `battle invitation with ${addr}`
    }
    eventEmitter.emit('log', log)
    try {
      const tx = await worldContract.write.battleInvitation([addr, steps]);
      await waitForTransaction(tx);
      log.block = await getBlockNumber(tx)
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
    let time = new Date().getTime()
    let log = {
      time,
      msg: `confirm battle`
    }
    eventEmitter.emit('log', log)
    try {
      const tx = await worldContract.write.confirmBattle([buffHash, battleId]);
      await waitForTransaction(tx);
      log.block = await getBlockNumber(tx)
      eventEmitter.emit('log', log)
      wait = false
      await delay(300)
      return {
        type: 'success',
        data: useStore.getState().getValue(tables.BattleList, { battleId })
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
    try {
      const tx = await worldContract.write.revealBattle([battleId, action, arg, nonce])
      await waitForTransaction(tx)
      log.block = await getBlockNumber(tx)
      eventEmitter.emit('log', log)
      wait = false
      await delay(300)
      return {
        type: 'success',
        data: useStore.getState().getValue(tables.BattleList, { battleId })
      }
    } catch (error) {
      log.type = 'error'
      log.msg = 'revealBattle:' + error.cause.reason || error.cause.details
      eventEmitter.emit('log', log)
      console.log('revealBattle', error);
      wait = false
      return {
        type: 'error',
        msg: error.cause.reason || error.cause.details || error.cause
      }
    }
  }

  const forceEnd = async (battleId: any) => {
    if (wait) return
    wait = true
    let time = new Date().getTime()
    let log = {
      time,
      msg: `force end`
    }
    eventEmitter.emit('log', log)
    try {
      const tx = await worldContract.write.forceEnd([battleId]);
      await waitForTransaction(tx);
      log.block = await getBlockNumber(tx)
      eventEmitter.emit('log', log)
      wait = false
      await delay(300)
      return useStore.getState().getValue(tables.BattleList, { battleId })
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
    let time = new Date().getTime()
    let log = {
      time,
      msg: `unlock user location`
    }
    eventEmitter.emit('log', log)
    try {
      const tx = await worldContract.write.unlockUserLocation();
      await waitForTransaction(tx);
      log.block = await getBlockNumber(tx)
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
      await waitForTransaction(tx);
      log.block = await getBlockNumber(tx)
      eventEmitter.emit('log', log)
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
      const tx = await worldContract.write.submitGem();
      await waitForTransaction(tx);
      log.block = await getBlockNumber(tx)
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
  

  return {
    move,
    selectBothNFT,
    setInfo,
    joinBattlefield,
    CreateBox,
    openBox,
    revealBox,
    getCollections,
    battleInvitation,
    confirmBattle,
    revealBattle,
    forceEnd,
    unlockUserLocation,
    goHome,
    submitGem,
    transfer,
    initUserInfo
  };
}
