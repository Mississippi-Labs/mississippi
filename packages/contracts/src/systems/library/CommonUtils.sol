// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import {console} from "forge-std/console.sol";
import { BattleState, Buff, PlayerState } from "../../codegen/Types.sol";
import { Position } from "../Common.sol";
import { GAME_CONFIG_KEY, BATTLE_CONFIG_KEY } from "../../Constants.sol";
import { Player, GameConfig, BattleListData, BattleList } from "../../codegen/Tables.sol";
import { MerkleProof } from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";


library CommonUtils {
  function abs_substruction(uint16 a, uint16 b) internal pure returns (uint16) {
    if (a > b) {
      return a - b;
    } else {
      return b - a;
    }
  }

  function isNear(uint16 _x1, uint16 _x2, uint16 _y1, uint16 _y2) internal pure returns (bool) {
    uint16 x_diff = abs_substruction(_x1, _x2);
    uint16 y_diff = abs_substruction(_y1, _y2);
    return x_diff <= 1 && y_diff <= 1 && x_diff != y_diff;
  }

  function zeroSub(uint8 a, uint8 b) internal pure returns (uint8) {
    uint8 result = a > b ? a - b : 0;
    return result;
  }

  function dice(uint8 number, uint8 threshold, uint8 increaseX, uint8 increaseY) internal pure returns (uint8) {
    //掷骰子,产生根据规则的随机数
    require(threshold > 0 && increaseY > 0 && increaseX > 0, "invalid params");
    uint8 result;
    number = zeroSub(number, threshold);
    if (number > 0) {
      uint8 multiplier = number / increaseX;
      result = multiplier * increaseY;
      return result;
    } else {
      return 0;
    }
  }

  function onlyBattlePlayer(uint256 _battleId, BattleState _battleState) internal view returns (bool) {
    bool r = true;
    BattleListData memory battle = BattleList.get(_battleId);

    BattleState battleState = battle.attacker == msg.sender ? battle.attackerState : battle.defenderState;

    require(battle.attacker == msg.sender || battle.defender == msg.sender, "You are not in this battle");
    require(battleState == _battleState, "You are in the wrong state");

    r = !battle.isEnd;
    return r;
  }

  function CheckContinuity(address _msgSender, Position[] memory moveList) internal view  {
      // 验证行走轨迹合法且连续
      uint8 prefer = 1;
      for (uint256 i; i < moveList.length; i++) {

          uint16 x2 = i > 0 ? moveList[i - 1].x : Player.getX(_msgSender);
          uint16 y2 = i > 0 ? moveList[i - 1].y : Player.getY(_msgSender);
          console.log(" step : ", i, x2, y2);
          if (i > 1) {
              console.log(" move : ", moveList[i].x, moveList[i].y);
          }
          require(
              CommonUtils.isNear(moveList[i].x, x2, moveList[i].y, y2),
              "invalied move"
          );
          // 判断用户每一个移动连续性以及合法性,不能超出1格, 不能斜着走,不能原地踏步
          Position memory info = moveList[i];
          //prefer的意思是可以通行
          bytes32 leaf = keccak256(
              abi.encodePacked(info.x, ",", info.y, ",", prefer)
          );
          bool isValidLeaf = MerkleProof.verify(info.proof, GameConfig.getMerkleRoot(GAME_CONFIG_KEY), leaf);
          require(isValidLeaf, "bad position");
      }
  }
}
