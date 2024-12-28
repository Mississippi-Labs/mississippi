import { defineWorld } from "@latticexyz/world";

export default defineWorld({
  systems: {
    BattleSystem: {
      name: "battle",
      openAccess: true,
    },
    GameSystem: {
      name: "game",
      openAccess: true,
    },
    GMSystem: {
      name: "gm",
      openAccess: true,
    },
    PlayerSystem: {
      name: "player",
      openAccess: true,
    },
    BoxSystem: {
      name: "box",
      openAccess: true,
    },
    MoveSystem: {
      name: "move",
      openAccess: true,
    },
    InitSystem: {
      name: "init",
      openAccess: true,
    }
  },
  enums: {
    BattleState: ["Inited", "Confirmed", "Revealed"],
    PlayerState: ["Idle", "Preparing", "Exploring", "Attacking"],
    ActionType: ["Attack", "Escape", "Props"],
    Buff: ["None", "Fire", "Water", "Wind"],
    RandomState: ["Inited", "Pending", "Confirmed"],
    BattleEndType: ["NotEnd", "NormalEnd", "AllEscape", "RoundEnd"],
  },
  tables: {
    Season: {
      schema: {
        start: "uint256",
        end: "uint256",
        no: "uint256",
      },
      key: [],
    },
    PlayerSeason: {
      schema: {
        oreBalance: "uint16",//为什么要用uint16
        attackCount: "uint16",
        addr: "address",
      },
      key: ["addr"],
    },
    Player: {
      schema: {
        x: "uint16",
        y: "uint16",
        oreBalance: "uint16",
        treasureBalance: "uint16",
        state: "PlayerState",
        lastBattleTime: "uint256",
        addr: "address",
      },
      key: ["addr"],
    },
    PlayerParams:{
      schema: {
        hp: "uint256",
        attack: "uint256",
        attackRange: "uint256",
        speed: "uint256",
        strength: "uint256",
        space: "uint256",
        maxHp: "uint256",
        name: "string",
        addr: "address",
      },
      key: ["addr"],
    },
    PlayerAddon: {
      schema: {
        lootId: "uint256",
        userId: "uint256",
        addr: "address",
      },
      key: ["addr"],
    },
    Ownable: {
      schema: {
        owner: "address",
      },
      key: [],
    },
    GameConfig: {
      schema: {
        merkleRoot: "bytes32",
        battleId: "uint256",
        randomId: "uint256",
        originX: "uint16",
        originY: "uint16",
        roomId: "uint256",
        boxId: "uint256",
        isOpen: "bool",
      },
      key: [],
    },
    BattleConfig: {
      schema: {
        maxAttackzDistance: "uint256",
        maxMoveDistance: "uint256",
        maxTimeLimit: "uint256",
        maxUserLocationLockTime: "uint256",
        maxBoxBindTime: "uint256",
      },
      key: [],
    },
    Board: {
      schema: {
        x: "uint16",
        y: "uint16",
        addr: "address"
      },
      key: ['addr'],
    },
    MapBoard: {
      schema: {
        addresses: "address[]",
        x: "uint16",
        y: "uint16",
      },
      key: ['x', 'y'],
    },
    RandomList: {
      schema: {
        blockNumber: "uint256",
        author: "address",
        id: "uint256",
      },
      key: ["id"],
    },
    BattleList: {
      schema: {
        attacker: "address",
        defender: "address",
        winner: "address",
        attackerHP: "uint256",
        defenderHP: "uint256",
        isEnd: "bool",
        endTimestamp: "uint256",
        battleId: "uint256",
      },
      key: ["battleId"],
    },
    BattleList1:{
      schema: {
        attackerState: "BattleState",
        defenderState: "BattleState",
        attackerAction: "bytes32",
        defenderAction: "bytes32",
        attackerBuffHash: "bytes32",
        defenderBuffHash: "bytes32",
        attackerArg: "uint256",
        defenderArg: "uint256",
        battleId: "uint256",
      },
      key: ["battleId"],
    },
    PlayerLocationLock: {
      schema: {
        lockTime: "uint256",
        addr: "address",
      },
      key: ["addr"],
    },
    BoxList: {
      schema: {
        x: "uint16",
        y: "uint16",
        oreBalance: "uint16",
        treasureBalance: "uint16",
        randomId: "uint256",
        // dropTime: "uint256",
        openTime: "uint256",
        opened: "bool",
        owner: "address",
        boxId: "uint256",
      },
      key: ["boxId"],
    },
    LootList1: {
      schema: {
        weapon: "string",
        chest: "string",
        head: "string",
        waist: "string",
        foot: "string",
        addr: "address",
      },
      key: ["addr"],
    },
    LootList2: {
      schema: {
        hand: "string",
        neck: "string",
        ring: "string",
        addr: "address",
      },
      key: ["addr"],

    },
    GlobalConfig: {
      schema: {
        userContract: "address",
        lootContract: "address",
        pluginContract: "address",
      },
      key: [],
      codegen: {
        dataStruct: false,
      },
    }
  }
});
