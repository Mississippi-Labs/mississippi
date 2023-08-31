import { mudConfig } from "@latticexyz/world/register";

// export default mudConfig({
//   tables: {
//     Counter: {
//       keySchema: {},
//       schema: "uint32",
//     },
//   },
// });

// export default mudConfig({
//   tables: {
//     RoundMap: {
//       keySchema: {
//         x: "uint32",
//         y: "uint32",
//       },
//       schema: "uint32",
//     },
//   },
// });

export default mudConfig({
  tables: {
    MapData: {
      schema: {
        xLen: "uint256",
        yLen: "uint256",
        mapArray: "int256[]", // Store supports dynamic arrays
      },
    },
  }
});
