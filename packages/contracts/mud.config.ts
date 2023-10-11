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
      openAccess: false,
      accessList: [],
    },
    PlayerSystem: {
      name: "player",
      openAccess: true,
    },
    RandomSystem: {
      name: "random",
      openAccess: true,
    },
  },
  enums: {
    BattleState: ["Inited", "Confirmed", "Revealed"],
    PlayerState: ["Idle", "Preparing", "Exploring", "Attacking"],
    ActionType: ["Attack", "Escape", "Props"],
    Buff: ["None", "Fire", "Water", "Wind"],
    RandomState:["Inited","Pending","Confirmed"]
  },
  tables: {
    Season: {
      schema: {
        start: "uint256",
        end: "uint256",
        no: "uint256",
      }
    },
    Player: {
      keySchema: {
        addr: "address",
      },
      schema: {
        suitId : "uint256",
        equipmentId : "uint256",
        x : "uint16",
        y : "uint16",
        hP : "uint256",
        oreBalance: "uint16",
        treasureBalance: "uint16",
        state : "PlayerState",
        name: "string",
        url: "string",
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
        timestamp: "uint256",
        attackerArg: "uint256",
        defenderArg: "uint256",
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
        roomId: "uint256",
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
    }
  }
});
