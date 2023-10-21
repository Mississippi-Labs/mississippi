import { createContext } from 'react';
import { CurIdMockData, PlayersMockData, RankMockData, TreasureChestMockData } from "@/mock/data";

const GameContext = createContext({
  CurIdMockData,
  PlayersMockData,
  RankMockData,
  TreasureChestMockData,
  setCount: () => {
    //
  },
});

export default GameContext;