import { IPlayer } from '@/components/Player';
import { ITreasureChest } from '@/components/TreasureChest';

export const RankMockData = [
  {
    name: 'aaaa',
    score: 100,
    id: 1
  },
  {
    name: 'aaaa1',
    score: 99,
    id: 2
  },
  {
    name: 'aaaa2',
    score: 50,
    id: 3
  },
  {
    name: 'aaaa3',
    score: 5,
    id: 4
  },
];


export const PlayersMockData: IPlayer[] = [
  {
    id: 3,
    username: 'Me',
    x: 5,
    y: 4,
    gem: 0,
    equip: {
      head: 'ChristmasHat',
      handheld: 'Beer',
      clothes: 'Chain'
    },
  },
  {
    id: 1,
    username: 'Piter',
    x: 18,
    y: 10,
    gem: 2,
    equip: {
      head: 'HiTechGlasses',
      handheld: 'Guitar',
      clothes: 'Niddle'
    },
  },
  {
    id: 6,
    username: 'Tom',
    gem: 5,
    x: 18,
    y: 13,
    equip: {
      head: 'Robber',
      handheld: 'Shield',
      clothes: 'Deliver'
    },
  },
  {
    id: 8,
    username: 'Stone',
    x: 18,
    y: 13,
    gem: 8,
    equip: {
      head: 'Turban',
      handheld: 'Wand',
      clothes: 'Shirt'
    },
  },
];

export const CurIdMockData = 3;

export const UserAddress = '0X1234567894519845184814';

export const TreasureChestMockData: ITreasureChest[] = [
  {
    id: 1,
    x: 6,
    y: 6,
    gem: 3
  },
  {
    id: 2,
    x: 17,
    y: 12,
    gem: 5
  }
];

