import React, { useRef, useState } from 'react';
import { Stage } from '@pixi/react';
import Player from '@/components/PIXIPlayers/Player';
import DuelField, { AttackType, IDuelFieldMethod } from '@/components/DuelField';

import './styles.scss';

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

const playerA = {
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

const playerB = {
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

const TestBattle = () => {

  const duel = useRef<IDuelFieldMethod>();
  const [attackType, setAttackType] = useState<AttackType>('sprint');
  const [role, setRole] = useState('left');

  return (
    <div >
      <div className={'opt'}>

        <button onClick={() => {
          duel.current.leftAttack(attackType);
        }}>left attack</button>

        <button onClick={() => {
          duel.current.rightAttack(attackType);
        }}>right attack</button>

        <select
          value={attackType}
          onChange={(e) => {
            setAttackType(e.target.value as AttackType)
          }}
        >
          <option value="sprint">Sprint</option>
          <option value="sneak">Sneak</option>
          <option value="magic">Magic</option>
        </select>

        <button onClick={() => {
          duel.current.kill(role);
        }}>kill</button>

        <select
          value={role}
          onChange={(e) => {
            setRole(e.target.value)
          }}
        >
          <option value="left">left</option>
          <option value="right">right</option>
        </select>
      </div>

      <DuelField
        ref={duel}
        leftPlayer={playerA}
        rightPlayer={playerB}
      />
    </div>
  );
};

export default TestBattle;