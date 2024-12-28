import React, { useRef, useState } from 'react';
import { Stage } from '@pixi/react';
import Player from '@/components/PIXIPlayers/Player';
import DuelField, { AttackType, IDuelFieldMethod } from '@/components/DuelField';

import './styles.scss';
import { playerA, playerB } from '@/mock/data';


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