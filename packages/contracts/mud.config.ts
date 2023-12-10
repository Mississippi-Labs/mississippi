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
      valueSchema: {
        start: "uint256",
        end: "uint256",
        no: "uint256",
      }
    },
    PlayerSeason: {
      keySchema: {
        addr: "address",
      },
      valueSchema: {
        oreBalance: "uint16",//为什么要用uint16
        attackCount: "uint16",
      }
    },
    Player: {
      keySchema: {
        addr: "address",
      },
      valueSchema: {
        x: "uint16",
        y: "uint16",
        oreBalance: "uint16",
        treasureBalance: "uint16",
        state: "PlayerState",
        lastBattleTime: "uint256"
        
      }
    },
    PlayerParams:{
      keySchema: {
        addr: "address",
      },
      valueSchema: {
        hp: "uint256",
        attack: "uint256",
        attackRange: "uint256",
        speed: "uint256",
        strength: "uint256",
        space: "uint256",
        maxHp: "uint256",
        name: "string"
      }
    },
    PlayerAddon: {
      keySchema: {
        addr: "address",
      },
      valueSchema: {
        lootId: "uint256",
        userId: "uint256"
      }
    },
    Ownable: {
      valueSchema: {
        owner: "address",
      }
    },
    GameConfig: {
     
      valueSchema: {
        merkleRoot: "bytes32",
        battleId: "uint256",
        randomId: "uint256",
        originX: "uint16",
        originY: "uint16",
        roomId: "uint256",
        boxId: "uint256",
        isOpen: "bool",
      }
    },
    BattleConfig: {
      valueSchema: {
        maxAttackzDistance: "uint256",
        maxMoveDistance: "uint256",
        maxTimeLimit: "uint256",
        maxUserLocationLockTime: "uint256",
        maxBoxBindTime: "uint256",
      }
    },
    Board: {
      keySchema: {
        addr: "address"
      },
      valueSchema: {
        x: "uint16",
        y: "uint16",
      }
    },
    MapBoard: {
      keySchema: {
        x: "uint16",
        y: "uint16",
      },
      valueSchema: {
        addresses: "address[]",
      }
    },
    RandomList: {
      keySchema: {
        id: "uint256",
      },
      valueSchema: {
        blockNumber: "uint256",
        author: "address",
      }
    },
    BattleList: {
      keySchema: {
        battleId: "uint256",
      },
      valueSchema: {
        attacker: "address",
        defender: "address",
        winner: "address",
        attackerHP: "uint256",
        defenderHP: "uint256",
        isEnd: "bool",
        endTimestamp: "uint256",
      }
    },
    BattleList1:{
      keySchema: {
        battleId: "uint256",
      },
      valueSchema: {
        attackerState: "BattleState",
        defenderState: "BattleState",
        attackerAction: "bytes32",
        defenderAction: "bytes32",
        attackerBuffHash: "bytes32",
        defenderBuffHash: "bytes32",
        attackerArg: "uint256",
        defenderArg: "uint256",
      }
    },
    PlayerLocationLock: {
      keySchema: {
        addr: "address",
      },
      valueSchema: {
        lockTime: "uint256",
      }
    },
    BoxList: {
      keySchema: {
        boxId: "uint256",
      },
      valueSchema: {
        x: "uint16",
        y: "uint16",
        oreBalance: "uint16",
        treasureBalance: "uint16",
        randomId: "uint256",
        // dropTime: "uint256",
        openTime: "uint256",
        opened: "bool",
        owner: "address",
      }
    },
    LootList1: {
      keySchema: {
        addr: "address",
      },
      valueSchema: {
        weapon: "string",
        chest: "string",
        head: "string",
        waist: "string",
        foot: "string",
      }

    },
    LootList2: {
      keySchema: {
        addr: "address",
      },
      valueSchema: {
        hand: "string",
        neck: "string",
        ring: "string"
      }

    },
    GlobalConfig: {
      dataStruct: false,
      valueSchema: {
        userContract: "address",
        lootContract: "address",
        pluginContract: "address",
      }
    }
  }
});
