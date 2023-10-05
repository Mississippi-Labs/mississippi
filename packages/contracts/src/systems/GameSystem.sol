// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import {MerkleProof} from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import { Game } from "../codegen/Tables.sol";
import { BattleState, Buff, PlayerState } from "../codegen/Types.sol";
import { BattleListData, BattleList, Player, PlayerData, 
    PlayerLocationLock, BoxListData, BoxList, RandomList, RandomListData} from "../codegen/Tables.sol";


contract GameSystem is System {
    bytes32 constant GAME_KEY = keccak256("Game-Key");


    event NewRandom(uint256 randomId, address author);
    event MoveEvent(address indexed player, uint16 x, uint16 y);
    event AttackStart(address player, address target);

    struct Move {
        uint16 x;
        uint16 y;
        bytes32[] proof;
    }

    /*
    bytes32 public merkleRoot;
    uint256 public maxAttackzDistance = 10;
    uint256 public maxMoveDistance = 15;
    uint256 public roomId;
    uint256 public battleId;
    uint256 public randomId;
    uint256 public boxId;
    uint256 public maxBoxBindTime = 120;
    uint256 public maxTimeLimit = 120;
    uint256 public maxUserLocationLockTime = 120;
    uint16 public OriginX = 100;
    uint16 public OriginY = 100;
    */

    constructor(bytes32 root) {
        Game.setMerkleRoot(GAME_KEY, root);
        Game.setMaxAttackzDistance(GAME_KEY, 10);
        Game.setMaxMoveDistance(GAME_KEY, 15);
        Game.setMaxTimeLimit(GAME_KEY, 120);
        Game.setMaxUserLocationLockTime(GAME_KEY, 120);
        Game.setOriginX(GAME_KEY, 100);
        Game.setOriginY(GAME_KEY, 100);
        Game.setMaxBoxBindTime(GAME_KEY, 120);
    }


    modifier onlyBattlePlayer(uint256 _battleId, BattleState _battleState) {
        BattleListData memory battle = BattleList.get(_battleId);

        BattleState battleState = battle.attacker == _msgSender()
            ? battle.attackerState
            : battle.defenderState;

        require(
            battle.attacker == _msgSender() || battle.defender == _msgSender(),
            "You are not in this battle"
        );
        require(battleState == _battleState, "You are in the wrong state");

        require(!battle.isEnd, "Battle is end");

        _;
    }

    function isNear(
        uint16 _x1,
        uint16 _x2,
        uint16 _y1,
        uint16 _y2
    ) internal pure returns (bool) {
        uint16 x_diff = abs_substruction(_x1, _x2);
        uint16 y_diff = abs_substruction(_y1, _y2);
        return x_diff <= 1 && y_diff <= 1 && x_diff != y_diff;
    }
 

    modifier CheckContinuity(Move[] memory moveList) {
        // 验证行走轨迹合法且连续
        uint8 prefer = 1;
        for (uint256 i; i < moveList.length; i++) {

            uint16 x2 = i > 0 ? moveList[i - 1].x : Player.getX(_msgSender());
            uint16 y2 = i > 0 ? moveList[i - 1].y : Player.getY(_msgSender());
            require(
                isNear(moveList[i].x, x2, moveList[i].y, y2),
                "invalied move"
            );
            // 判断用户每一个移动连续性以及合法性,不能超出1格, 不能斜着走,不能原地踏步
            Move memory info = moveList[i];
            //prefer的意思是可以通行
            bytes32 leaf = keccak256(
                abi.encodePacked(info.x, ",", info.y, ",", prefer)
            );
            bool isValidLeaf = MerkleProof.verify(info.proof, Game.getMerkleRoot(GAME_KEY), leaf);
            require(isValidLeaf, "bad position");
        }
        _;
    }

    function move(Move[] memory moveList) external CheckContinuity(moveList) {
        // 限制移动速度,每次移动需要间隔一定时间
        require(PlayerLocationLock.get(_msgSender()) == 0, "You are locked");
        require(
            moveList.length > 0 && moveList.length <= Game.getMaxMoveDistance(GAME_KEY),
            "invalid move distance"
        );

        // Player[_msgSender()].x = moveList[moveList.length - 1].x;
        // Player[_msgSender()].y = moveList[moveList.length - 1].y;
        Player.setX(_msgSender(), moveList[moveList.length - 1].x);
        Player.setY(_msgSender(), moveList[moveList.length - 1].y);

        emit MoveEvent(
            _msgSender(),
            moveList[moveList.length - 1].x,
            moveList[moveList.length - 1].y
        );
    }

    function battleInvitation(
        address _targetAddress,
        Move[] memory moveList
    ) external CheckContinuity(moveList) {
        // 攻击,首先确定地图x,y上有具体用户,其次确定用户之间最短距离proof为10
        // 需要考虑一个格子上有多个用户的情况//一个格子只能有一个人
        // 判断对战双方的状态是否是Exploring
   
        // PlayerData memory player = Player.get(_msgSender());
        // PlayerData storage target = Player.get(_targetAddress);

        require(
            moveList.length > 0 && moveList.length <= Game.getMaxAttackzDistance(GAME_KEY),
            "invalid attack distance"
        );
        // require(
        //     player.state == PlayerState.Exploring &&
        //         target.state == PlayerState.Exploring,
        //     "Each player must be in exploring state"
        // );
        // require(
        //     target.x == moveList[moveList.length - 1].x &&
        //         target.y == moveList[moveList.length - 1].y,
        //     "Target must be in the end of continuity"
        // );
        require(
            Player.getState(_msgSender()) == PlayerState.Exploring &&
               Player.getState(_targetAddress) == PlayerState.Exploring,
            "Each player must be in exploring state"
        );
        require(
            Player.getX(_targetAddress) == moveList[moveList.length - 1].x &&
                Player.getY(_targetAddress) == moveList[moveList.length - 1].y,
            "Target must be in the end of continuity"
        );

        // player.state = PlayerState.Attacking;
        // target.state = PlayerState.Attacking;
        Player.setState(_msgSender(), PlayerState.Attacking);
        Player.setState(_targetAddress, PlayerState.Attacking);

        // Battle storage battle = BattleList[battleId];
        uint256 battleId = Game.getBattleId(GAME_KEY);
        // BattleListData storage battle = BattleList.get(battleId);
        // battle.attacker = _msgSender();
        // battle.defender = _targetAddress;
        // battle.timestamp = block.timestamp;
        // battle.attackerHP = player.HP; //这里应该是根据装备来判断
        // battle.defenderHP = target.HP;
        BattleList.setAttacker(battleId, _msgSender());
        BattleList.setDefender(battleId, _targetAddress);
        BattleList.setTimestamp(battleId, block.timestamp);
        BattleList.setAttackerHP(battleId, Player.getHP(_msgSender()));
        BattleList.setDefenderHP(battleId, Player.getHP(_targetAddress));

        // battleId++;
        Game.setBattleId(GAME_KEY, battleId + 1);


        emit AttackStart(_msgSender(), _targetAddress);
    }

    function confirmBattle(
        bytes32 _buffHash,
        uint256 _battleId
    ) external onlyBattlePlayer(_battleId, BattleState.Inited) {
        // 战斗是否有用户
        //战斗是否结束
        //是否已超时
        // Battle storage battle = BattleList[_battleId];

        // require(
        //     block.timestamp - BattleList.getTimeStamp.timestamp < maxTimeLimit,
        //     "Battle is timeout"
        // );
        require(
            block.timestamp - BattleList.getTimestamp(_battleId) < Game.getMaxTimeLimit(GAME_KEY),
            "Battle is timeout"
        );
        // 战斗是否已经选择buff
        // BattleState _battleState = battle.attacker == _msgSender()
        //     ? battle.attackerState
        //     : battle.defenderState;
        BattleState _battleState = BattleList.getAttacker(_battleId) == _msgSender()
            ? BattleList.getAttackerState(_battleId)
            : BattleList.getDefenderState(_battleId);

        require(
            _battleState == BattleState.Inited,
            "You have already selected buff"
        );
        // 当前实现方法非常不优雅,使用两个额外存储槽来存储用户的选择
        // if (battle.attacker == _msgSender()) {
        //     battle.attackerBuffHash = _buffHash;
        //     battle.attackerState = BattleState.Confirmed;
        // } else {
        //     battle.defenderBuffHash = _buffHash;
        //     battle.defenderState = BattleState.Confirmed;
        // }
        if (BattleList.getAttacker(_battleId) == _msgSender()) {
            BattleList.setAttackerBuffHash(_battleId, _buffHash);
            BattleList.setAttackerState(_battleId, BattleState.Confirmed);
        } else {
            BattleList.setDefenderBuffHash(_battleId, _buffHash);
            BattleList.setDefenderState(_battleId, BattleState.Confirmed);
        }

        // TODO需要一个event通知前端验证buff
    }

    function revealBattle(
        uint256 _battleId,
        bytes32 _action,
        uint256 _arg,
        bytes32 _nonce
    ) external onlyBattlePlayer(_battleId, BattleState.Confirmed) {
        // TODO揭示阶段也应该添加时间限制
        // Battle storage battle = BattleList[_battleId];
        // BattleState _battleState = battle.attacker == _msgSender()
        //     ? battle.attackerState
        //     : battle.defenderState;

        // bytes32 moveHash = battle.attacker == _msgSender()
        //     ? battle.attackerBuffHash
        //     : battle.defenderBuffHash;
        address attacker = BattleList.getAttacker(_battleId);

        bytes32 moveHash =  attacker == _msgSender()
            ? BattleList.getAttackerBuffHash(_battleId)
            : BattleList.getDefenderBuffHash(_battleId);

        bytes32 proofHash = keccak256(abi.encodePacked(_action, _arg, _nonce));
        require(moveHash == proofHash, "Invalid move hash proof");
        // if (battle.attacker == _msgSender()) {
        //     battle.attackerAction = _action;
        //     battle.attackerArg = _arg;
        //     battle.attackerState = BattleState.Revealed;
        // } else {
        //     battle.defenderAction = _action;
        //     battle.defenderArg = _arg;
        //     battle.defenderState = BattleState.Revealed;
        // }
        // if (
        //     battle.attackerState == BattleState.Revealed &&
        //     battle.defenderState == BattleState.Revealed
        // ) {
        //     // 结算战斗
        //     revealWinner(_battleId);
        // }
        if (attacker == _msgSender()) {
            BattleList.setAttackerAction(_battleId, _action);
            BattleList.setAttackerArg(_battleId, _arg);
            BattleList.setAttackerState(_battleId, BattleState.Revealed);
        } else {
            BattleList.setDefenderAction(_battleId, _action);
            BattleList.setDefenderArg(_battleId, _arg);
            BattleList.setDefenderState(_battleId, BattleState.Revealed);
        }
        if (
            BattleList.getAttackerState(_battleId) == BattleState.Revealed &&
            BattleList.getDefenderState(_battleId) == BattleState.Revealed
        ) {
            // 结算战斗
            revealWinner(_battleId);
        }
    }

    function revealWinner(
        uint256 _battleId
    ) public onlyBattlePlayer(_battleId, BattleState.Revealed) {
        // 结算战斗
        BattleListData memory battle = BattleList.get(_battleId);
        bytes32 attackerAction = battle.attackerAction;
        bytes32 defenderAction = battle.defenderAction;
        uint256 attackerFirepower = 100;
        uint256 defenderFirepower = 100;

        // address attacker = BattleList.getAttacker(_battleId);
        // address defender = BattleList.getDefender(_battleId);
        //用户的指令为attack,esacpe,useProps几种方案,attackArg和defenderArg分别是伴随指令传递的参数,对应执行attack,esacpe,useProps几个函数并传入参数
        // 默认用户的攻击力都为100,防御力都为100,攻击力和防御力在未来都是根据装备来判断
        //如果双方都执行attack,则对比buff,buff相同攻击力没有增益,否则按照water>fire>wind>water的顺序给优胜者增加50%攻击力
        //如果对方执行escape,则判断buff是否大于对方的buff,如果大于则对方逃跑成功
        if (
            attackerAction == bytes32("attack") &&
            defenderAction == bytes32("attack")
        ) {
            // Buff attackerBuff = Buff(battle.attackerArg);
            // Buff defenderBuff = Buff(battle.defenderArg); 
            Buff attackerBuff = Buff(battle.attackerArg);
            Buff defenderBuff = Buff(battle.defenderArg);
            // 任意攻击buff都强于None
            uint256 attackerAttackPower = getAttackPower(
                attackerBuff,
                defenderBuff,
                attackerFirepower
            );
            uint256 defenderAttackPower = getAttackPower(
                defenderBuff,
                attackerBuff,
                defenderFirepower
            );
            // battle.attackerHP = getAttackResult(
            //     battle.attackerHP,
            //     defenderAttackPower
            // );
            // battle.defenderHP = getAttackResult(
            //     battle.defenderHP,
            //     attackerAttackPower
            // );
            // if (battle.attackerHP == 0 || battle.defenderHP == 0) {
                // address  winner = battle.attackerHP == 0
                //     ? battle.defender
                //     : battle.attacker;
                // address looser = battle.attackerHP == 0
                //     ? battle.attacker
                //     : battle.defender;
                // battle.winer = winner;

                // battle.isEnd = true;
                
                
                // loseGame(looser,winner);
                // UserInfo[battle.winer].HP = initUserHP(battle.winer);
                // TODO这里应该跟一个清算函数
                // 胜利者解除战斗形态,血量恢复20%
                // 失败者传送到非战区,血量回满
            // }
            // battle.attackerHP = getAttackResult(
            //     battle.attackerHP,
            //     defenderAttackPower
            // );
            // battle.defenderHP = getAttackResult(
            //     battle.defenderHP,
            //     attackerAttackPower
            // );

            
            BattleList.setAttackerHP(_battleId, getAttackResult(
                battle.attackerHP,
                defenderAttackPower
            ));
            BattleList.setDefenderHP(_battleId, getAttackResult(
                battle.defenderHP,
                attackerAttackPower
            ));

            

            if (battle.attackerHP == 0 || battle.defenderHP == 0) {
                address winner = battle.attackerHP == 0? battle.defender : battle.attacker;
                address looser = battle.attackerHP == 0
                    ? battle.attacker
                    : battle.defender;
                BattleList.setWinner(_battleId, winner);
                BattleList.setIsEnd(_battleId, true);
                // battle.winner = winner;
                // battle.isEnd = true;
                loseGame(looser, winner);

                Player.setHP(winner, initUserHP(winner));

                // TODO这里应该跟一个清算函数
                // 胜利者解除战斗形态,血量恢复20%
                // 失败者传送到非战区,血量回满
            }
            
        }

        
        if (
            attackerAction == bytes32("escape") &&
            defenderAction == bytes32("escape")
        ) {
            // 双方都逃走,则战斗结束(这里应该都传送到更远地方)
            // battle.isEnd = true;
            // battle.winer = address(0);

            BattleList.setIsEnd(_battleId, true);
            BattleList.setWinner(_battleId, address(0));

            return;
        }
        if (
            attackerAction == bytes32("escape") &&
            defenderAction == bytes32("attack")
        ) {
            Buff attackerBuff = Buff(battle.defenderArg);
            Buff defenderBuff = Buff(battle.defenderArg);
            // 任意攻击buff都强于None
            if (
                attackerBuff == defenderBuff ||
                compareBuff(attackerBuff, defenderBuff) == 2
            ) {
                // 逃跑成功
                Player.setState(battle.attacker, PlayerState.Exploring);
                Player.setState(battle.defender, PlayerState.Exploring);
                // PlayerLocationLock[battle.defender] = block.timestamp; //将被逃跑方禁锢一段时间
                PlayerLocationLock.set(battle.defender, block.timestamp);
            } else {
                // 逃跑失败,被动挨打
                uint256 defenderAttackPower = getAttackPower(
                    defenderBuff,
                    attackerBuff,
                    defenderFirepower
                );
                // battle.attackerHP = getAttackResult(
                //     battle.attackerHP,
                //     defenderAttackPower
                // );
                // if (battle.attackerHP == 0) {
                //     battle.winer = battle.defender;
                //     battle.isEnd = true;
                // }
                BattleList.setAttackerHP(_battleId, getAttackResult(
                    battle.attackerHP,
                    defenderAttackPower
                ));
                if (BattleList.getAttackerHP(_battleId) == 0) {
                   
                    // battle.winer = battle.defender;
                    // battle.isEnd = true;
                    BattleList.setWinner(_battleId, battle.defender);
                    BattleList.setIsEnd(_battleId, true);
                }
            }
        }
        if (
            attackerAction == bytes32("attack") &&
            defenderAction == bytes32("escape")
        ) {
            Buff attackerBuff = Buff(battle.attackerArg);
            Buff defenderBuff = Buff(battle.defenderArg);
            // 任意攻击buff都强于None
            if (
                attackerBuff == defenderBuff ||
                compareBuff(defenderBuff, attackerBuff) == 2
            ) {
                // 逃跑成功
                // Player[battle.defender].state = PlayerState.Exploring;
                // Player[battle.attacker].state = PlayerState.Exploring;
                // PlayerLocationLock[battle.attacker] = block.timestamp; //将被逃跑方禁锢一段时间
                Player.setState(battle.defender, PlayerState.Exploring);
                Player.setState(battle.attacker, PlayerState.Exploring);
                PlayerLocationLock.set(battle.attacker, block.timestamp);
            } else {
                  // 逃跑失败,被动挨打
                uint256 attackerAttackPower = getAttackPower(
                    attackerBuff,
                    defenderBuff,
                    attackerFirepower
                );

                BattleList.setDefenderHP(_battleId, getAttackResult(
                    battle.defenderHP,
                    attackerAttackPower
                ));
                
                if (BattleList.getDefenderHP(_battleId) == 0) {
                    // battle.winer = battle.attacker;
                    // battle.isEnd = true;

                    BattleList.setWinner(_battleId, battle.attacker);
                    BattleList.setIsEnd(_battleId, true);
                    
                }
            }
        }
        
    }

    function loseGame(address _looser, address _winner) internal {
        // 游戏失败,将用户脱离战区,血量回满
        // TODO 背包系统,宝物系统
        // User storage losser = UserInfo[_looser];
        // outBattlefield(_looser);
        // Box storage box = BoxList[roomId][boxId];
        // box.x = losser.x;
        // box.y = losser.y;
        // box.opened = true;
        // box.openTime = block.timestamp;
        // box.owner = _winner;
        // boxId++;
        // box.oreBalance = losser.oreBalance;
        // box.treasureBalance = losser.treasureBalance;
        // losser.oreBalance = 0;
        // losser.treasureBalance = 0;
        // box.dropTime = block.timestamp;

        outBattlefield(_looser);
        PlayerData memory losser = Player.get(_looser);
        uint256 boxId = Game.getBoxId(GAME_KEY);
        BoxListData memory box;
        box.x = losser.x;
        box.y = losser.y;
        box.opened = true;
        box.openTime = block.timestamp;
        box.owner = _winner;
        box.oreBalance = losser.oreBalance;
        box.treasureBalance = losser.treasureBalance;
        box.dropTime = block.timestamp;
        BoxList.set(Game.getRoomId(GAME_KEY), boxId, box);

        Player.setOreBalance(_looser, 0);
        Player.setTreasureBalance(_looser, 0);
        Game.setRoomId(GAME_KEY, boxId+1);
    }

    function goHome() external {
        // 回家,将用户脱离战区,血量回满
        PlayerData memory player = Player.get(_msgSender());
        require(
            player.state == PlayerState.Exploring,
            "You should in exploring state"
        );
        require(
            player.x == Game.getOriginX(GAME_KEY) && player.y == Game.getOriginY(GAME_KEY),
            "You are not in the origin point"
        );
        outBattlefield(_msgSender());
    }

    function initUserHP(address _user) public pure returns (uint256) {
        return 400;
    }

    function raiseUserHP(
        uint256 _targetHP,
        uint256 _percent,
        address _user
    ) public {
        Player.setHP(_user, (_targetHP * _percent) / 100);
    }

    function unlockUserLocation() external {
        // 用户自行解锁
        require(PlayerLocationLock.get(_msgSender()) != 0, "You are not locked");
        require(
            PlayerLocationLock.get(_msgSender()) + Game.getMaxUserLocationLockTime(GAME_KEY) <
                block.timestamp,
            "You are not locked"
        );
        PlayerLocationLock.set(_msgSender(), 0);
    }

    function getAttackResult(
        uint256 _hp,
        uint256 _attackPower
    ) internal pure returns (uint256) {
        // TODO 后期添加防御力抵消对方的攻击力
        if (_attackPower > _hp) {
            return 0;
        }
        return _hp - _attackPower;
    }

    function getAttackPower(
        Buff _myBuff,
        Buff _targetBuff,
        uint256 _attackPower
    ) internal pure returns (uint256) {
        // TODO 后期添加防御力抵消对方的攻击力
        if (compareBuff(_myBuff, _targetBuff) == 0) {
            return (_attackPower * 7) / 10;
        }
        if (compareBuff(_myBuff, _targetBuff) == 2) {
            return (_attackPower * 13) / 10;
        }

        return _attackPower;
    }

    function compareBuff(
        Buff _myBuff,
        Buff _targetBuff
    ) internal pure returns (uint256) {
        // 0表示失败,1表示相当,2表示胜利
        if (
            (_myBuff == Buff.Water && _targetBuff == Buff.Fire) ||
            (_myBuff == Buff.Wind && _targetBuff == Buff.Water) ||
            (_myBuff == Buff.Fire && _targetBuff == Buff.Wind)
        ) {
            return 2;
        }
        if (
            (_myBuff == Buff.Fire && _targetBuff == Buff.Water) ||
            (_myBuff == Buff.Water && _targetBuff == Buff.Wind) ||
            (_myBuff == Buff.Wind && _targetBuff == Buff.Fire)
        ) {
            return 0;
        }
        return 1;
    }

    function settleBattle() external {}

    function createLootBox() external {}

    function takeLoot() external {}

    function dropLoot() external {}

    //------非战区空间部分

    function transfer(uint16 x, uint16 y) external {
        //传送门,将用户在战区和非战区移动
        // 将用户坐标随机转移到指定位置
        // Player[_msgSender()].x = x;
        // Player[_msgSender()].y = y;
        Player.setX(_msgSender(), x);
        Player.setY(_msgSender(), y);
    }

    function abs_substruction(
        uint16 a,
        uint16 b
    ) internal pure returns (uint16) {
        if (a > b) {
            return a - b;
        } else {
            return b - a;
        }
    }

    function setMerkleRoot(bytes32 root) external {
        // TODO onlyowner
        // merkleRoot = root;
        Game.setMerkleRoot(GAME_KEY, root);
    }

    function joinBattlefield(address _user) public {
        // 加入战区,用户实际上是送到原点,状态改为探索中
        // User storage player = Player[_user];
        PlayerState playerState = Player.getState(_user);
        require(
            playerState == PlayerState.Preparing || playerState == PlayerState.Idle,
            "You should in preparing state"
        );
        // player.x = OriginX; //实际上是送到原点//TODO通过常数设置原点参数
        // player.y = OriginX;
        // battlefieldPlayers.push(_user);
        // Player[_user].state = PlayerState.Exploring;
        Player.setX(_user, Game.getOriginX(GAME_KEY));
        Player.setY(_user, Game.getOriginY(GAME_KEY));
        Game.pushBattlefieldPlayers(GAME_KEY, _user);
        Player.setState(_user, PlayerState.Exploring);
    }

    function outBattlefield(address _user) internal {
        // 脱离战区,则将用户血量回满,坐标不变,状态改为准备中
        // User storage player = Player[_user];
        // require(
        //     player.state == PlayerState.Exploring,
        //     "You should in exploring state"
        // );
        require(
            Player.getState(_user) == PlayerState.Exploring,
            "You should in exploring state"
        );

        // player.HP = initUserHP(_user); //

        // if (battlefieldPlayers.length <= 1) {
        //     // 直接清零
        //     battlefieldPlayers = new address[](0);
        // } else {
        //     for (uint256 i; i < battlefieldPlayers.length; i++) {
        //         if (battlefieldPlayers[i] == _user) {
        //             battlefieldPlayers[i] = battlefieldPlayers[
        //                 battlefieldPlayers.length - 1
        //             ];
        //             battlefieldPlayers.pop();
        //         }
        //     }
        // }
        // Player[_user].state = PlayerState.Preparing;
        
        Player.setHP(_user, initUserHP(_user));

        for (uint256 i; i < Game.lengthBattlefieldPlayers(GAME_KEY); i++) {
            if (Game.getItemBattlefieldPlayers(GAME_KEY, i) == _user) {
                Game.updateBattlefieldPlayers(GAME_KEY, i, Game.getItemBattlefieldPlayers(GAME_KEY, Game.lengthBattlefieldPlayers(GAME_KEY) - 1));
                Game.popBattlefieldPlayers(GAME_KEY);
            }
        }
        Player.setState(_user, PlayerState.Preparing);
    }

    function requestRandom() external {
        // Random storage r = randomList[randomId];
        // r.author = _msgSender();
        // r.blockNumber = block.number;

        uint256 randomId = Game.getRandomId(GAME_KEY);
        RandomList.setAuthor(randomId, _msgSender());
        RandomList.setBlockNumber(randomId, block.number);

        emit NewRandom(randomId, _msgSender());
    }

    function getRandom(
        uint256 _randomId,
        uint256 _count
    ) internal view returns (uint8[] memory) {
        require(
            _msgSender() == RandomList.getAuthor(_randomId),
            "only random creator can get random"
        );
        uint8[] memory randomNumberList = new uint8[](_count);
        RandomListData memory r = RandomList.get(_randomId);
        require(
            block.number >= r.blockNumber + 2,
            "too early to get random seed"
        );
        uint256 seed = uint256(blockhash(r.blockNumber + 2));
        // 一次处理一个uint256随机数
        uint256 randomNumber = uint256(keccak256(abi.encodePacked(seed)));

        // 截断后存入属性数组
        for (uint8 i = 0; i < _count; i++) {
            uint8 digit = uint8(randomNumber % 100);
            randomNumberList[i] = digit;
            randomNumber = randomNumber / 100;
        }
        return randomNumberList;
    }

    function creatBox(uint16 _x, uint16 _y) internal {
        // Box storage box = BoxList[roomId][boxId];
        // box.x = _x;
        // box.y = _y;
        // box.randomId = randomId;
        // randomId++;
        // boxId++;

        uint256 roomId = Game.getRoomId(GAME_KEY);
        uint256 boxId = Game.getBoxId(GAME_KEY);
        BoxList.setX(roomId, boxId, _x);
        BoxList.setY(roomId, boxId, _y);

        uint256 randomId = Game.getRandomId(GAME_KEY);
        BoxList.setRandomId(roomId, boxId, randomId);
        Game.setRandomId(GAME_KEY, randomId + 1);
        Game.setBoxId(GAME_KEY, boxId + 1);
    }

    function getCollections(uint256 _boxId, uint16 _oreAmount,uint16 _treasureAmount) internal {
        // require(BoxList[roomId][_boxId].dropTime != 0, "Invalid box");
        // Box storage _box = BoxList[roomId][_boxId];
        // User storage _user = UserInfo[_box.owner];
        // require(
        //     isNear(_box.x, _user.x, _box.y, _user.y),
        //     "You are not near the box"
        // );
        // require(_box.opened == true, "Box is not opened");
        // if(block.timestamp<_box.openTime+maxBoxBindTime){
        //     require(msg.sender==_box.owner,"The box is waiting for its opener, please wait");
        // }
        // require(_oreAmount<=_box.oreBalance&&_treasureAmount<=_box.treasureBalance,"Invalid amount");
        // _box.oreBalance-=_oreAmount;
        // _box.treasureBalance-=_treasureAmount;
        // _user.oreBalance+=_oreAmount;
        // _user.treasureBalance+=_treasureAmount;

        uint256 roomId = Game.getRoomId(GAME_KEY);
        uint256 boxId = Game.getBoxId(GAME_KEY);
        require(BoxList.getDropTime(roomId, _boxId) != 0, "Invalid box");
        BoxListData memory _box = BoxList.get(roomId, boxId);
        PlayerData memory _user = Player.get(_box.owner);
        require(
            isNear(_box.x, _user.x, _box.y, _user.y),
            "You are not near the box"
        );
        require(_box.opened == true, "Box is not opened");
        if(block.timestamp<_box.openTime + Game.getMaxBoxBindTime(GAME_KEY)){
            require(msg.sender==_box.owner,"The box is waiting for its opener, please wait");
        }
        require(_oreAmount<=_box.oreBalance&&_treasureAmount<=_box.treasureBalance,"Invalid amount");
        BoxList.setOreBalance(roomId, boxId, _box.oreBalance - _oreAmount);
        BoxList.setTreasureBalance(roomId, boxId, _box.treasureBalance - _treasureAmount);
        Player.setOreBalance(_box.owner, _user.oreBalance + _oreAmount);
        Player.setTreasureBalance(_box.owner, _user.treasureBalance + _treasureAmount);
    }

    function openBox(uint256 _boxId) external {
        // 宝箱打开时init内容物,根据自带randomId来实现随机
        // require(BoxList[roomId][_boxId].dropTime != 0, "Invalid box");
        // Box storage _box = BoxList[roomId][_boxId];
        // User storage _user = UserInfo[_box.owner];
        // require(
        //     isNear(_box.x, _user.x, _box.y, _user.y),
        //     "You are not near the box"
        // );
        // require(_box.opened == false, "Box is opened");
        // uint8[] memory randomNumberList = getRandom(_box.randomId, 2);
        // uint8 oreBalance = dice(randomNumberList[0],20,10,1);
        // uint8 treasureBalance = dice(randomNumberList[1],80,10,1);
        // _box.oreBalance = oreBalance;
        // _box.treasureBalance = treasureBalance;
        // _box.opened = true;
        // _box.openTime = block.timestamp;

        uint256 roomId = Game.getRoomId(GAME_KEY);
        uint256 boxId = Game.getBoxId(GAME_KEY);
        require(BoxList.getDropTime(roomId, _boxId) != 0, "Invalid box");
        BoxListData memory _box = BoxList.get(roomId, boxId);
        PlayerData memory _user = Player.get(_box.owner);
        require(
            isNear(_box.x, _user.x, _box.y, _user.y),
            "You are not near the box"
        );
        require(_box.opened == false, "Box is opened");
        uint8[] memory randomNumberList = getRandom(_box.randomId, 2);
        uint8 oreBalance = dice(randomNumberList[0],20,10,1);
        uint8 treasureBalance = dice(randomNumberList[1],80,10,1);
        BoxList.setOreBalance(roomId, boxId, oreBalance);
        BoxList.setTreasureBalance(roomId, boxId, treasureBalance);
        BoxList.setOpened(roomId, boxId, true);
        BoxList.setOpenTime(roomId, boxId, block.timestamp);
    }

    function zeroSub(uint8 a, uint8 b) internal pure returns (uint8) {
        uint8 result = a > b ? a - b : 0;
        return result;
    }

    
    function dice(
        uint8 number,
        uint8 threshold,
        uint8 increaseX,
        uint8 increaseY
    ) internal pure returns (uint8) {
        //掷骰子,产生根据规则的随机数
        require(threshold > 0&&increaseY>0&&increaseX>0, "invalid params");
        uint8 result;
        number = zeroSub(number, threshold);
        if (number>0) {
            uint8 multiplier = number / increaseX;
            result = multiplier * increaseY;
            return result;
        } else {
            return 0;
        }
    }
}


    






    



