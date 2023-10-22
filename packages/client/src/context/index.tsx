import { createContext } from 'react';
import { CurIdMockData, PlayersMockData, RankMockData, TreasureChestMockData } from "@/mock/data";

const GameContext = createContext({
  curId: CurIdMockData,
  players: PlayersMockData,
  mapData: [[]],
  onPlayerMove: () => {
    //
  },
  treasureChest: [],
  openTreasureChest: () => {
    //
  }
});

export default GameContext;