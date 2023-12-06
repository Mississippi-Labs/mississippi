declare const abi: [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "length",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "accessedIndex",
        "type": "uint256"
      }
    ],
    "name": "Store_IndexOutOfBounds",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "expected",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "received",
        "type": "uint256"
      }
    ],
    "name": "Store_InvalidDynamicDataLength",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "expected",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "received",
        "type": "uint256"
      }
    ],
    "name": "Store_InvalidFieldNamesLength",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "expected",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "received",
        "type": "uint256"
      }
    ],
    "name": "Store_InvalidKeyNamesLength",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "bytes2",
        "name": "expected",
        "type": "bytes2"
      },
      {
        "internalType": "ResourceId",
        "name": "resourceId",
        "type": "bytes32"
      },
      {
        "internalType": "string",
        "name": "resourceIdString",
        "type": "string"
      }
    ],
    "name": "Store_InvalidResourceType",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint40",
        "name": "startWithinField",
        "type": "uint40"
      },
      {
        "internalType": "uint40",
        "name": "deleteCount",
        "type": "uint40"
      },
      {
        "internalType": "uint40",
        "name": "fieldLength",
        "type": "uint40"
      }
    ],
    "name": "Store_InvalidSplice",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "expected",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "received",
        "type": "uint256"
      }
    ],
    "name": "Store_InvalidValueSchemaLength",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "ResourceId",
        "name": "tableId",
        "type": "bytes32"
      },
      {
        "internalType": "string",
        "name": "tableIdString",
        "type": "string"
      }
    ],
    "name": "Store_TableAlreadyExists",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "ResourceId",
        "name": "tableId",
        "type": "bytes32"
      },
      {
        "internalType": "string",
        "name": "tableIdString",
        "type": "string"
      }
    ],
    "name": "Store_TableNotFound",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "resource",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "caller",
        "type": "address"
      }
    ],
    "name": "World_AccessDenied",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "World_AlreadyInitialized",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "bytes4",
        "name": "functionSelector",
        "type": "bytes4"
      }
    ],
    "name": "World_CallbackNotAllowed",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "delegator",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "delegatee",
        "type": "address"
      }
    ],
    "name": "World_DelegationNotFound",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "bytes4",
        "name": "functionSelector",
        "type": "bytes4"
      }
    ],
    "name": "World_FunctionSelectorAlreadyExists",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "bytes4",
        "name": "functionSelector",
        "type": "bytes4"
      }
    ],
    "name": "World_FunctionSelectorNotFound",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "balance",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "World_InsufficientBalance",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "contractAddress",
        "type": "address"
      },
      {
        "internalType": "bytes4",
        "name": "interfaceId",
        "type": "bytes4"
      }
    ],
    "name": "World_InterfaceNotSupported",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "ResourceId",
        "name": "resourceId",
        "type": "bytes32"
      },
      {
        "internalType": "string",
        "name": "resourceIdString",
        "type": "string"
      }
    ],
    "name": "World_InvalidResourceId",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "bytes2",
        "name": "expected",
        "type": "bytes2"
      },
      {
        "internalType": "ResourceId",
        "name": "resourceId",
        "type": "bytes32"
      },
      {
        "internalType": "string",
        "name": "resourceIdString",
        "type": "string"
      }
    ],
    "name": "World_InvalidResourceType",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "ResourceId",
        "name": "resourceId",
        "type": "bytes32"
      },
      {
        "internalType": "string",
        "name": "resourceIdString",
        "type": "string"
      }
    ],
    "name": "World_ResourceAlreadyExists",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "ResourceId",
        "name": "resourceId",
        "type": "bytes32"
      },
      {
        "internalType": "string",
        "name": "resourceIdString",
        "type": "string"
      }
    ],
    "name": "World_ResourceNotFound",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "system",
        "type": "address"
      }
    ],
    "name": "World_SystemAlreadyExists",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "World_UnlimitedDelegationNotAllowed",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "storeVersion",
        "type": "bytes32"
      }
    ],
    "name": "HelloStore",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "worldVersion",
        "type": "bytes32"
      }
    ],
    "name": "HelloWorld",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "ResourceId",
        "name": "tableId",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "bytes32[]",
        "name": "keyTuple",
        "type": "bytes32[]"
      }
    ],
    "name": "Store_DeleteRecord",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "ResourceId",
        "name": "tableId",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "bytes32[]",
        "name": "keyTuple",
        "type": "bytes32[]"
      },
      {
        "indexed": false,
        "internalType": "bytes",
        "name": "staticData",
        "type": "bytes"
      },
      {
        "indexed": false,
        "internalType": "PackedCounter",
        "name": "encodedLengths",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "bytes",
        "name": "dynamicData",
        "type": "bytes"
      }
    ],
    "name": "Store_SetRecord",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "ResourceId",
        "name": "tableId",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "bytes32[]",
        "name": "keyTuple",
        "type": "bytes32[]"
      },
      {
        "indexed": false,
        "internalType": "uint48",
        "name": "start",
        "type": "uint48"
      },
      {
        "indexed": false,
        "internalType": "uint40",
        "name": "deleteCount",
        "type": "uint40"
      },
      {
        "indexed": false,
        "internalType": "PackedCounter",
        "name": "encodedLengths",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "Store_SpliceDynamicData",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "ResourceId",
        "name": "tableId",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "bytes32[]",
        "name": "keyTuple",
        "type": "bytes32[]"
      },
      {
        "indexed": false,
        "internalType": "uint48",
        "name": "start",
        "type": "uint48"
      },
      {
        "indexed": false,
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "Store_SpliceStaticData",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint16",
        "name": "_x",
        "type": "uint16"
      },
      {
        "internalType": "uint16",
        "name": "_y",
        "type": "uint16"
      }
    ],
    "name": "CreateBox",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "GetSeasonInfo",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_userContract",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_lootContract",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_pluginContract",
        "type": "address"
      },
      {
        "internalType": "bytes32",
        "name": "_merkleRoot",
        "type": "bytes32"
      }
    ],
    "name": "Init",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_root",
        "type": "bytes32"
      }
    ],
    "name": "SetMapMerkleRoot",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_start",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_end",
        "type": "uint256"
      }
    ],
    "name": "SetSeasonInfo",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_user",
        "type": "address"
      }
    ],
    "name": "SetUserContract",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "ResourceId",
            "name": "systemId",
            "type": "bytes32"
          },
          {
            "internalType": "bytes",
            "name": "callData",
            "type": "bytes"
          }
        ],
        "internalType": "struct SystemCallData[]",
        "name": "systemCalls",
        "type": "tuple[]"
      }
    ],
    "name": "batchCall",
    "outputs": [
      {
        "internalType": "bytes[]",
        "name": "returnDatas",
        "type": "bytes[]"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "from",
            "type": "address"
          },
          {
            "internalType": "ResourceId",
            "name": "systemId",
            "type": "bytes32"
          },
          {
            "internalType": "bytes",
            "name": "callData",
            "type": "bytes"
          }
        ],
        "internalType": "struct SystemCallFromData[]",
        "name": "systemCalls",
        "type": "tuple[]"
      }
    ],
    "name": "batchCallFrom",
    "outputs": [
      {
        "internalType": "bytes[]",
        "name": "returnDatas",
        "type": "bytes[]"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_targetAddress",
        "type": "address"
      },
      {
        "components": [
          {
            "internalType": "uint16",
            "name": "x",
            "type": "uint16"
          },
          {
            "internalType": "uint16",
            "name": "y",
            "type": "uint16"
          },
          {
            "internalType": "bytes32[]",
            "name": "proof",
            "type": "bytes32[]"
          }
        ],
        "internalType": "struct Position[]",
        "name": "positionList",
        "type": "tuple[]"
      }
    ],
    "name": "battleInvitation",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "ResourceId",
        "name": "systemId",
        "type": "bytes32"
      },
      {
        "internalType": "bytes",
        "name": "callData",
        "type": "bytes"
      }
    ],
    "name": "call",
    "outputs": [
      {
        "internalType": "bytes",
        "name": "",
        "type": "bytes"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "delegator",
        "type": "address"
      },
      {
        "internalType": "ResourceId",
        "name": "systemId",
        "type": "bytes32"
      },
      {
        "internalType": "bytes",
        "name": "callData",
        "type": "bytes"
      }
    ],
    "name": "callFrom",
    "outputs": [
      {
        "internalType": "bytes",
        "name": "",
        "type": "bytes"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_buffHash",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "_battleId",
        "type": "uint256"
      }
    ],
    "name": "confirmBattle",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "creator",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "ResourceId",
        "name": "tableId",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32[]",
        "name": "keyTuple",
        "type": "bytes32[]"
      }
    ],
    "name": "deleteRecord",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_battleId",
        "type": "uint256"
      }
    ],
    "name": "forceEnd",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_battleId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "addr",
        "type": "address"
      }
    ],
    "name": "getBattlePlayerHp",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_boxId",
        "type": "uint256"
      },
      {
        "internalType": "uint16",
        "name": "_oreAmount",
        "type": "uint16"
      },
      {
        "internalType": "uint16",
        "name": "_treasureAmount",
        "type": "uint16"
      }
    ],
    "name": "getCollections",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "ResourceId",
        "name": "tableId",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32[]",
        "name": "keyTuple",
        "type": "bytes32[]"
      },
      {
        "internalType": "uint8",
        "name": "dynamicFieldIndex",
        "type": "uint8"
      }
    ],
    "name": "getDynamicField",
    "outputs": [
      {
        "internalType": "bytes",
        "name": "",
        "type": "bytes"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "ResourceId",
        "name": "tableId",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32[]",
        "name": "keyTuple",
        "type": "bytes32[]"
      },
      {
        "internalType": "uint8",
        "name": "dynamicFieldIndex",
        "type": "uint8"
      }
    ],
    "name": "getDynamicFieldLength",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "ResourceId",
        "name": "tableId",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32[]",
        "name": "keyTuple",
        "type": "bytes32[]"
      },
      {
        "internalType": "uint8",
        "name": "dynamicFieldIndex",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "start",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "end",
        "type": "uint256"
      }
    ],
    "name": "getDynamicFieldSlice",
    "outputs": [
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "ResourceId",
        "name": "tableId",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32[]",
        "name": "keyTuple",
        "type": "bytes32[]"
      },
      {
        "internalType": "uint8",
        "name": "fieldIndex",
        "type": "uint8"
      },
      {
        "internalType": "FieldLayout",
        "name": "fieldLayout",
        "type": "bytes32"
      }
    ],
    "name": "getField",
    "outputs": [
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "ResourceId",
        "name": "tableId",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32[]",
        "name": "keyTuple",
        "type": "bytes32[]"
      },
      {
        "internalType": "uint8",
        "name": "fieldIndex",
        "type": "uint8"
      }
    ],
    "name": "getField",
    "outputs": [
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "ResourceId",
        "name": "tableId",
        "type": "bytes32"
      }
    ],
    "name": "getFieldLayout",
    "outputs": [
      {
        "internalType": "FieldLayout",
        "name": "fieldLayout",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "ResourceId",
        "name": "tableId",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32[]",
        "name": "keyTuple",
        "type": "bytes32[]"
      },
      {
        "internalType": "uint8",
        "name": "fieldIndex",
        "type": "uint8"
      },
      {
        "internalType": "FieldLayout",
        "name": "fieldLayout",
        "type": "bytes32"
      }
    ],
    "name": "getFieldLength",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "ResourceId",
        "name": "tableId",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32[]",
        "name": "keyTuple",
        "type": "bytes32[]"
      },
      {
        "internalType": "uint8",
        "name": "fieldIndex",
        "type": "uint8"
      }
    ],
    "name": "getFieldLength",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "addr",
        "type": "address"
      }
    ],
    "name": "getInfo",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "ResourceId",
        "name": "tableId",
        "type": "bytes32"
      }
    ],
    "name": "getKeySchema",
    "outputs": [
      {
        "internalType": "Schema",
        "name": "keySchema",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "addr",
        "type": "address"
      }
    ],
    "name": "getPosition",
    "outputs": [
      {
        "internalType": "uint16",
        "name": "",
        "type": "uint16"
      },
      {
        "internalType": "uint16",
        "name": "",
        "type": "uint16"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "ResourceId",
        "name": "tableId",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32[]",
        "name": "keyTuple",
        "type": "bytes32[]"
      },
      {
        "internalType": "FieldLayout",
        "name": "fieldLayout",
        "type": "bytes32"
      }
    ],
    "name": "getRecord",
    "outputs": [
      {
        "internalType": "bytes",
        "name": "staticData",
        "type": "bytes"
      },
      {
        "internalType": "PackedCounter",
        "name": "encodedLengths",
        "type": "bytes32"
      },
      {
        "internalType": "bytes",
        "name": "dynamicData",
        "type": "bytes"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "ResourceId",
        "name": "tableId",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32[]",
        "name": "keyTuple",
        "type": "bytes32[]"
      }
    ],
    "name": "getRecord",
    "outputs": [
      {
        "internalType": "bytes",
        "name": "staticData",
        "type": "bytes"
      },
      {
        "internalType": "PackedCounter",
        "name": "encodedLengths",
        "type": "bytes32"
      },
      {
        "internalType": "bytes",
        "name": "dynamicData",
        "type": "bytes"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getSenderPosition",
    "outputs": [
      {
        "internalType": "uint16",
        "name": "",
        "type": "uint16"
      },
      {
        "internalType": "uint16",
        "name": "",
        "type": "uint16"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "ResourceId",
        "name": "tableId",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32[]",
        "name": "keyTuple",
        "type": "bytes32[]"
      },
      {
        "internalType": "uint8",
        "name": "fieldIndex",
        "type": "uint8"
      },
      {
        "internalType": "FieldLayout",
        "name": "fieldLayout",
        "type": "bytes32"
      }
    ],
    "name": "getStaticField",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "getUserInfo",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "ResourceId",
        "name": "tableId",
        "type": "bytes32"
      }
    ],
    "name": "getValueSchema",
    "outputs": [
      {
        "internalType": "Schema",
        "name": "valueSchema",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "goHome",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "ResourceId",
        "name": "resourceId",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "grantee",
        "type": "address"
      }
    ],
    "name": "grantAccess",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_player",
        "type": "address"
      }
    ],
    "name": "initPlayerHp",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_player",
        "type": "address"
      }
    ],
    "name": "initUserInfo",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "contract IModule",
        "name": "coreModule",
        "type": "address"
      }
    ],
    "name": "initialize",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "contract IModule",
        "name": "module",
        "type": "address"
      },
      {
        "internalType": "bytes",
        "name": "args",
        "type": "bytes"
      }
    ],
    "name": "installModule",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "contract IModule",
        "name": "module",
        "type": "address"
      },
      {
        "internalType": "bytes",
        "name": "args",
        "type": "bytes"
      }
    ],
    "name": "installRootModule",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "joinBattlefield",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "uint16",
            "name": "x",
            "type": "uint16"
          },
          {
            "internalType": "uint16",
            "name": "y",
            "type": "uint16"
          },
          {
            "internalType": "bytes32[]",
            "name": "proof",
            "type": "bytes32[]"
          }
        ],
        "internalType": "struct Position[]",
        "name": "moveList",
        "type": "tuple[]"
      }
    ],
    "name": "move",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "uint16",
            "name": "x",
            "type": "uint16"
          },
          {
            "internalType": "uint16",
            "name": "y",
            "type": "uint16"
          }
        ],
        "internalType": "struct Coordinate[]",
        "name": "cList",
        "type": "tuple[]"
      }
    ],
    "name": "multCreateBox",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_boxId",
        "type": "uint256"
      }
    ],
    "name": "openBox",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "ResourceId",
        "name": "tableId",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32[]",
        "name": "keyTuple",
        "type": "bytes32[]"
      },
      {
        "internalType": "uint8",
        "name": "dynamicFieldIndex",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "byteLengthToPop",
        "type": "uint256"
      }
    ],
    "name": "popFromDynamicField",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "ResourceId",
        "name": "tableId",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32[]",
        "name": "keyTuple",
        "type": "bytes32[]"
      },
      {
        "internalType": "uint8",
        "name": "dynamicFieldIndex",
        "type": "uint8"
      },
      {
        "internalType": "bytes",
        "name": "dataToPush",
        "type": "bytes"
      }
    ],
    "name": "pushToDynamicField",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "delegatee",
        "type": "address"
      },
      {
        "internalType": "ResourceId",
        "name": "delegationControlId",
        "type": "bytes32"
      },
      {
        "internalType": "bytes",
        "name": "initCallData",
        "type": "bytes"
      }
    ],
    "name": "registerDelegation",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "ResourceId",
        "name": "systemId",
        "type": "bytes32"
      },
      {
        "internalType": "string",
        "name": "systemFunctionSignature",
        "type": "string"
      }
    ],
    "name": "registerFunctionSelector",
    "outputs": [
      {
        "internalType": "bytes4",
        "name": "worldFunctionSelector",
        "type": "bytes4"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "ResourceId",
        "name": "namespaceId",
        "type": "bytes32"
      }
    ],
    "name": "registerNamespace",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "ResourceId",
        "name": "namespaceId",
        "type": "bytes32"
      },
      {
        "internalType": "ResourceId",
        "name": "delegationControlId",
        "type": "bytes32"
      },
      {
        "internalType": "bytes",
        "name": "initCallData",
        "type": "bytes"
      }
    ],
    "name": "registerNamespaceDelegation",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "ResourceId",
        "name": "systemId",
        "type": "bytes32"
      },
      {
        "internalType": "string",
        "name": "worldFunctionSignature",
        "type": "string"
      },
      {
        "internalType": "bytes4",
        "name": "systemFunctionSelector",
        "type": "bytes4"
      }
    ],
    "name": "registerRootFunctionSelector",
    "outputs": [
      {
        "internalType": "bytes4",
        "name": "worldFunctionSelector",
        "type": "bytes4"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "ResourceId",
        "name": "tableId",
        "type": "bytes32"
      },
      {
        "internalType": "contract IStoreHook",
        "name": "hookAddress",
        "type": "address"
      },
      {
        "internalType": "uint8",
        "name": "enabledHooksBitmap",
        "type": "uint8"
      }
    ],
    "name": "registerStoreHook",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "ResourceId",
        "name": "systemId",
        "type": "bytes32"
      },
      {
        "internalType": "contract WorldContextConsumer",
        "name": "system",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "publicAccess",
        "type": "bool"
      }
    ],
    "name": "registerSystem",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "ResourceId",
        "name": "systemId",
        "type": "bytes32"
      },
      {
        "internalType": "contract ISystemHook",
        "name": "hookAddress",
        "type": "address"
      },
      {
        "internalType": "uint8",
        "name": "enabledHooksBitmap",
        "type": "uint8"
      }
    ],
    "name": "registerSystemHook",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "ResourceId",
        "name": "tableId",
        "type": "bytes32"
      },
      {
        "internalType": "FieldLayout",
        "name": "fieldLayout",
        "type": "bytes32"
      },
      {
        "internalType": "Schema",
        "name": "keySchema",
        "type": "bytes32"
      },
      {
        "internalType": "Schema",
        "name": "valueSchema",
        "type": "bytes32"
      },
      {
        "internalType": "string[]",
        "name": "keyNames",
        "type": "string[]"
      },
      {
        "internalType": "string[]",
        "name": "fieldNames",
        "type": "string[]"
      }
    ],
    "name": "registerTable",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_battleId",
        "type": "uint256"
      },
      {
        "internalType": "bytes32",
        "name": "_action",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "_arg",
        "type": "uint256"
      },
      {
        "internalType": "bytes32",
        "name": "_nonce",
        "type": "bytes32"
      }
    ],
    "name": "revealBattle",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_boxId",
        "type": "uint256"
      }
    ],
    "name": "revealBox",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_battleId",
        "type": "uint256"
      }
    ],
    "name": "revealWinner",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "ResourceId",
        "name": "resourceId",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "grantee",
        "type": "address"
      }
    ],
    "name": "revokeAccess",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_userTokenId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_lootTokenId",
        "type": "uint256"
      }
    ],
    "name": "selectBothNFT",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_tokenId",
        "type": "uint256"
      }
    ],
    "name": "selectLootNFT",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_tokenId",
        "type": "uint256"
      }
    ],
    "name": "selectUserNft",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "ResourceId",
        "name": "tableId",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32[]",
        "name": "keyTuple",
        "type": "bytes32[]"
      },
      {
        "internalType": "uint8",
        "name": "dynamicFieldIndex",
        "type": "uint8"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "setDynamicField",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "ResourceId",
        "name": "tableId",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32[]",
        "name": "keyTuple",
        "type": "bytes32[]"
      },
      {
        "internalType": "uint8",
        "name": "fieldIndex",
        "type": "uint8"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "setField",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "ResourceId",
        "name": "tableId",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32[]",
        "name": "keyTuple",
        "type": "bytes32[]"
      },
      {
        "internalType": "uint8",
        "name": "fieldIndex",
        "type": "uint8"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      },
      {
        "internalType": "FieldLayout",
        "name": "fieldLayout",
        "type": "bytes32"
      }
    ],
    "name": "setField",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bool",
        "name": "_b",
        "type": "bool"
      }
    ],
    "name": "setGmaeOpen",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      }
    ],
    "name": "setInfo",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "ResourceId",
        "name": "tableId",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32[]",
        "name": "keyTuple",
        "type": "bytes32[]"
      },
      {
        "internalType": "bytes",
        "name": "staticData",
        "type": "bytes"
      },
      {
        "internalType": "PackedCounter",
        "name": "encodedLengths",
        "type": "bytes32"
      },
      {
        "internalType": "bytes",
        "name": "dynamicData",
        "type": "bytes"
      }
    ],
    "name": "setRecord",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "ResourceId",
        "name": "tableId",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32[]",
        "name": "keyTuple",
        "type": "bytes32[]"
      },
      {
        "internalType": "uint8",
        "name": "fieldIndex",
        "type": "uint8"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      },
      {
        "internalType": "FieldLayout",
        "name": "fieldLayout",
        "type": "bytes32"
      }
    ],
    "name": "setStaticField",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "ResourceId",
        "name": "tableId",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32[]",
        "name": "keyTuple",
        "type": "bytes32[]"
      },
      {
        "internalType": "uint8",
        "name": "dynamicFieldIndex",
        "type": "uint8"
      },
      {
        "internalType": "uint40",
        "name": "startWithinField",
        "type": "uint40"
      },
      {
        "internalType": "uint40",
        "name": "deleteCount",
        "type": "uint40"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "spliceDynamicData",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "ResourceId",
        "name": "tableId",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32[]",
        "name": "keyTuple",
        "type": "bytes32[]"
      },
      {
        "internalType": "uint48",
        "name": "start",
        "type": "uint48"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "spliceStaticData",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "storeVersion",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "version",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "submitGem",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "addr",
        "type": "address"
      },
      {
        "internalType": "uint16",
        "name": "x",
        "type": "uint16"
      },
      {
        "internalType": "uint16",
        "name": "y",
        "type": "uint16"
      }
    ],
    "name": "transfer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "ResourceId",
        "name": "fromNamespaceId",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "toAddress",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "transferBalanceToAddress",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "ResourceId",
        "name": "fromNamespaceId",
        "type": "bytes32"
      },
      {
        "internalType": "ResourceId",
        "name": "toNamespaceId",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "transferBalanceToNamespace",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "ResourceId",
        "name": "namespaceId",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "unlockUserLocation",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "ResourceId",
        "name": "tableId",
        "type": "bytes32"
      },
      {
        "internalType": "contract IStoreHook",
        "name": "hookAddress",
        "type": "address"
      }
    ],
    "name": "unregisterStoreHook",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "ResourceId",
        "name": "systemId",
        "type": "bytes32"
      },
      {
        "internalType": "contract ISystemHook",
        "name": "hookAddress",
        "type": "address"
      }
    ],
    "name": "unregisterSystemHook",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "worldVersion",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]; export default abi;
