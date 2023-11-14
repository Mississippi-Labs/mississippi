import { mudConfig } from "@latticexyz/world/register";

export default mudConfig({
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
    }
  },
  enums: {
    BattleState: ["Inited", "Confirmed", "Revealed"],
    PlayerState: ["Idle", "Preparing", "Exploring", "Attacking"],
    ActionType: ["Attack", "Escape", "Props"],
    Buff: ["None", "Fire", "Water", "Wind"],
    RandomState:["Inited","Pending","Confirmed"],
    BattleEndType: ["NotEnd", "NormalEnd", "AllEscape", "RoundEnd"],
  },
  tables: {
    Season: {
      schema: {
        start: "uint256",
        end: "uint256",
        no: "uint256",

      }
    },
    PlayerSeason: {
      keySchema: {
        addr: "address",
      },
      schema: {
        oreBalance: "uint16",//为什么要用uint16
        attackCount: "uint16",
      }
    },
    Player: {
      keySchema: {
        addr: "address",
      },
      schema: {
        x : "uint16",
        y : "uint16",
        hp : "uint256",
        attack : "uint256",
        attackRange : "uint256",
        speed : "uint256",
        strength : "uint256",
        space : "uint256",
        oreBalance: "uint16",
        treasureBalance: "uint16",
        state : "PlayerState",
        lastBattleTime: "uint256",
        maxHp: "uint256",
        name: "string",
        url: "string",
      }
    },
    PlayerAddon:{
      keySchema: {
        addr: "address",
      },
      schema: {
        lootId: "uint256",
        userId: "uint256"
      }
    },
    Ownable: {
      schema: {
        owner: "address",
      }
    },
    GameConfig: {
      dataStruct: false,
      schema: {
        merkleRoot: "bytes32",
        battleId: "uint256",
        randomId: "uint256",
        originX: "uint16",
        originY: "uint16",
        roomId: "uint256",
        boxId : "uint256",
        isOpen: "bool",
      }
    },
    BattleConfig: {
      dataStruct: false,
      schema: {
        maxAttackzDistance: "uint256",
        maxMoveDistance: "uint256",
        maxTimeLimit: "uint256",
        maxUserLocationLockTime: "uint256",
        maxBoxBindTime : "uint256",
        battlefieldPlayers: "address[]",
      }
    },
    Board: {  
      keySchema: {
        addr: "address"
      },
      schema: {
        x: "uint16",
        y: "uint16",
      }
    },
    MapBoard: {
      keySchema: {
        x: "uint16",
        y: "uint16",
      },
      schema: {
        addresses: "address[]",
      }
    },
    RandomList: {
      keySchema:{
        id: "uint256",
      },
      schema: {
        blockNumber: "uint256",
        author: "address",
    }},
    BattleList: {
      keySchema: {
        battleId: "uint256",
      },
      schema: {
        attacker: "address",
        defender: "address",
        winner: "address",
        round: "uint16",
        attackerHP: "uint256",
        defenderHP: "uint256",
        isEnd: "bool",
        attackerState: "BattleState",
        defenderState: "BattleState",
        attackerAction: "bytes32",
        defenderAction: "bytes32",
        attackerBuffHash: "bytes32",
        defenderBuffHash: "bytes32",
        startTimestamp: "uint256",
        attackerArg: "uint256",
        defenderArg: "uint256",
        endTimestamp: "uint256",
      }
    },
    PlayerLocationLock: {
      keySchema: {
        addr: "address",
      },
      schema: {
        lockTime: "uint256",
      }
    },
    BoxList : {
      keySchema: {
        boxId: "uint256",
      },
      schema: {
        lockTime: "uint256",
        x: "uint16",
        y: "uint16",
        oreBalance: "uint16",
        treasureBalance: "uint16",
        randomId: "uint256",
        dropTime: "uint256",
        openTime: "uint256",
        opened: "bool",
        owner: "address",
      }
    }, 
    LootList1:{
      keySchema:{
        addr: "address",
      },
      schema:{
        weapon:"string",
        chest:"string",
        head:"string",
        waist:"string",
        foot:"string",
      }

    },
    LootList2:{
      keySchema:{
        addr: "address",
      },
      schema:{
        hand:"string",
        neck:"string",
        ring:"string"
      }

    },
    GlobalConfig: {
      dataStruct: false,
      schema: {
        userContract: "address",
        lootContract: "address",
        pluginContract: "address",
      }
    }
  }
});
