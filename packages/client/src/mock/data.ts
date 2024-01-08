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

const hunterEquip = {
  head: 'Demon Crown',
  clothes: 'Demon Husk',
  handheld: 'Demon\'s Hands'
}

const warriorEquip = {
  head: 'Ancient Helm',
  clothes: 'Holy Chestplate',
  handheld: 'Holy Gauntlets'
}

export const playerA = {
  "x": 0.5,
  "y": 1.5,
  "hp": 115,
  "attack": 46,
  "attackRange": 4,
  "speed": 4,
  "strength": 35,
  "space": 3,
  "oreBalance": 0,
  "treasureBalance": 0,
  "state": 2,
  "lastBattleTime": 0,
  "maxHp": 115,
  "name": "V2",
  "url": "",
  "addr": "0xb53c83ef2467da36c687c81cb23140d92e3d10ba",
  "username": "V2",
  "equip": warriorEquip,
  "waiting": false,
  "action": "idle",
  "moving": false,
  "toward": "Right"
}

export const playerB = {
  "x": 5.1,
  "y": 1.5,
  "hp": 135,
  "attack": 40,
  "attackRange": 3,
  "speed": 4,
  "strength": 32,
  "space": 3,
  "oreBalance": 0,
  "treasureBalance": 0,
  "state": 2,
  "lastBattleTime": 0,
  "maxHp": 135,
  "name": "V",
  "url": "",
  "addr": "0xb58fd9cb0c9100bb6694a4d18627fb238d3bb893",
  "username": "V",
  "equip": hunterEquip,
  "waiting": false,
  "action": "idle",
  "moving": false,
  "toward": "Left"
}