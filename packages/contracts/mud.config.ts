import { mudConfig } from "@latticexyz/world/register";

export default mudConfig({
  tables: {
    MapData: {
      schema: {
        xLen: "uint256",
        yLen: "uint256",
        mapArray: "int256[]", // Store supports dynamic arrays
      },
    },
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
        name: "uint256",
        url: "string",
      }
    },
  }
});
