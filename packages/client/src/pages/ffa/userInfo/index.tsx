import React, { useEffect, useState } from 'react';
import './styles.scss';
import * as PIXI from 'pixi.js';
import { Stage } from '@pixi/react';
import Player, { IPlayer } from '@/components/PIXIPlayers/Player';


PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

export interface IUserInfo {
  player?: IPlayer;
}

const UserInfo = (props: IUserInfo) => {

  const { player } = props;
  const lootHasLoaded = player?.equip?.handheld && player?.equip?.head && player?.equip?.clothes;

  return (
    <div className={'ffa-userinfo-wrapper'}>
      <div className="left-main-content">
        <h3>User Info</h3>
        <div className={`user-detail-wrapper ${lootHasLoaded ? 'user-loaded' : ''}`}>
          <div className="user-detail-content">
            <div className="user-appearance-wrapper">
              <div className="user-appearance-box">
                <Stage width={256} height={256} options={{ resolution: 1, backgroundAlpha: 0 }}>
                  <Player size={128} x={0.5} y={0.5} equip={player?.equip ?? {}} action={'idle'} />
                </Stage>
              </div>
            </div>

            <div className={`user-attr-wrapper ffa-info-box ${lootHasLoaded ? 'loaded' : ''}`}>
              <dl>
                <dt>HP</dt>
                <dd><span className="base-attr">0</span></dd>
              </dl>
              <dl>
                <dt>Attack</dt>
                <dd><span className="base-attr">0</span></dd>
              </dl>
              <dl>
                <dt>Defense</dt>
                <dd><span className="base-attr">0</span></dd>
              </dl>
              <dl>
                <dt>Speed</dt>
                <dd><span className="base-attr">0</span></dd>
              </dl>
            </div>

          </div>

        </div>
      </div>
      <div className="right-main-content">
        <h3>How to play</h3>
        <div className="ffa-info-box how-to-play">

        </div>
      </div>
    </div>
  );
};

export default UserInfo;