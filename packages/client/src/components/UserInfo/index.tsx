import React, { useEffect, useState } from 'react';
import './styles.scss';
import UserPackage from '@/components/UserPackage';
import Appearance from '@/components/Appearance';

export interface IUserInfo {
  head: string;
  clothes: string;
  handheld: string;
  gem?: number;
  userUrl?: string;
  lootUrl?: string;
  player?: any;
}

const UserInfo = (props: IUserInfo) => {

  const { handheld, head, clothes, gem = 0, userUrl, lootUrl, player } = props;
  const lootHasLoaded = (handheld && head && clothes) || (player?.equip?.handheld && player?.equip?.head && player?.equip?.clothes);
  console.log(handheld, head, clothes, lootHasLoaded);

  return (
    <div className={'mi-userinfo-wrapper'}>
      <div className="left-main-content">
        <h3>User info</h3>
        <div className="user-detail-wrapper">
          <div className="user-appearance-wrapper">
            <div className="user-appearance-box">
              <Appearance clothes={clothes || player?.equip?.clothes} handheld={handheld || player?.equip?.handheld} head={head || player?.equip?.head}/>
            </div>
          </div>
          <div className={`loot-wrapper ${lootHasLoaded ? 'loaded' : ''}`}>
            <div className="loot-detail">
              {
                userUrl ? <img src={userUrl} alt=""/> : null
              }
            </div>
            <div className="loot-detail">
              {
                lootUrl ? <img src={lootUrl} alt=""/> : null
              }
            </div>
          </div>
          <div className={`user-attr-wrapper ${lootHasLoaded ? 'loaded' : ''}`}>
            <dl>
              <dt>HP</dt>
              <dd><span className="base-attr">{lootHasLoaded ? player?.maxHp  : 0}</span><span className="extra-attr">{lootHasLoaded ? player?.maxHp?.toString() : ''}</span></dd>
            </dl>
            <dl>
              <dt>Attack</dt>
              <dd><span className="base-attr">{lootHasLoaded ? player?.attack?.toString() : 0}</span><span className="extra-attr">{lootHasLoaded ? player?.attack?.toString() : ''}</span></dd>
            </dl>
            <dl>
              <dt>AttackRange</dt>
              <dd><span className="base-attr">{lootHasLoaded ? player?.attackRange?.toString() : 0}</span><span className="extra-attr">{lootHasLoaded ? player?.attackRange?.toString() : ''}</span></dd>
            </dl>
            <dl>
              <dt>Speed</dt>
              <dd><span className="base-attr">{lootHasLoaded ? player?.speed?.toString() : 0}</span><span className="extra-attr">{lootHasLoaded ? player?.speed?.toString() : ''}</span></dd>
            </dl>
            <dl>
              <dt>Strength</dt>
              <dd><span className="base-attr">{lootHasLoaded ? player?.strength?.toString() : 0}</span><span className="extra-attr">{lootHasLoaded ?player?.strength?.toString() : ''}</span></dd>
            </dl>
            <dl>
              <dt>Space</dt>
              <dd><span className="base-attr">{lootHasLoaded ? player?.space?.toString() : 0}</span><span className="extra-attr">{lootHasLoaded ? player?.space?.toString() : ''}</span></dd>
            </dl>
          </div>
        </div>
      </div>
      <div className="right-main-content">
        <UserPackage
          gem={gem}
          title={'User Package'}
        />
        <UserPackage
          title={'Season Package'}
        />
      </div>
    </div>
  );
};

export default UserInfo;