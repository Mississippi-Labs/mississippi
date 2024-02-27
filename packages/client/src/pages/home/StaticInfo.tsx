import React, { useState } from 'react';
import { Mousewheel } from 'swiper/modules';
import SwiperCore from 'swiper';
import './staticInfo.scss';
import FAQ from '@/config/faq';

import imgPlayer from '@/assets/img/player_1.png';
import imgPlayer2 from '@/assets/img/player_2.png';
import imgPlayers from '@/assets/img/players.png';
// import indexDuckImg from '@/assets/img/duck_index.svg';
import indexDuckImg_1 from '@/assets/duck/1.svg';
import indexDuckImg_2 from '@/assets/duck/2.svg';
import indexDuckImg_3 from '@/assets/duck/3.svg';
import indexDuckImg_4 from '@/assets/duck/4.svg';
import indexDuckImg_5 from '@/assets/duck/5.svg';
import gemImg from '@/assets/duck/gem.svg';
import bgImg from '@/assets/img/slate.svg';

import lxDaoIcon from '@/assets/img/lxdao.png';
import web3Icon from '@/assets/img/web3.png';
import crownIcon from '@/assets/img/crown.png';

interface IProps {
  onPlay: () => void;
  isOpen: boolean;
}

const StaticInfo = (props: IProps) => {
  const { onPlay, isOpen } = props;

  const [faqActiveIndex, setFaqActiveIndex] = useState(-1);
  SwiperCore.use([Mousewheel]);

  return (
    <div className={'static-info'}>

          <section className={"mi-section index-section"}>
            <div className="section-box">
              <div className="intro-box">
                <img src={bgImg} alt="" className="bg-img"/>
                <div className='intro-main'>
                  <h1 className={'intro-title'}>Welcome to Mississippi</h1>
                  <p>
                    An ancient cave, cursed by its creator, opens intermittently as if alive <br/><br/>

                    The cavern is rich in energy gems that prudent adventurers can take, while those who miss the time to leave due to greed will be trapped in the cavern forever <br/><br/>

                    The Mississippi Company executives saw the value of the caves and decided to monopolize them <br/><br/>

                    Just when the plan was about to succeed, a group of crazy duck adventurers stormed into the cave...
                  </p>
                  <button className="play-btn mi-btn" onClick={onPlay}>{(!isOpen) ? 'Please wait for open demo day' : 'PLAY NOW'}</button>
                </div>
              </div>
            </div>
            <div className={'img-wrap'}>
              <img src={indexDuckImg_1} alt="" className="duck duck-1"/>
              <img src={indexDuckImg_2} alt="" className="duck duck-2"/>
              <img src={indexDuckImg_3} alt="" className="duck duck-3"/>
              <img src={indexDuckImg_4} alt="" className="duck duck-4"/>
              <img src={indexDuckImg_5} alt="" className="duck duck-5"/>
              <img src={gemImg} alt="" className="gem"/>
            </div>
          </section>

          <section className={"mi-section mi-section2"}>
            <div className="mi-home-desc">
              <div className="mi-home-desc-title-wrap">
                <h2>Start From A Game, Then A World</h2>
              </div>
              <p>A game has a single purpose, while a world holds infinite.</p>
              <img src={imgPlayer} alt="" className="player p1"/>
              <img src={imgPlayer2} alt="" className="player p2"/>
            </div>
            <div className="mi-home-desc-wrapper">
              <dl className="mi-home-desc-item">
                <dt>What is the game all about</dt>
                <dd>We start from a PVP rogue-like game. Explore randomly-dropped gems, strategically forge godlike equipment, and loot each other's treasures. All within the expansive Mississippi cave. </dd>
              </dl>
              <dl className="mi-home-desc-item">
                <dt>How does it evolve into a world</dt>
                <dd>We plan to expand the game to be a simulation game. Players will be divided into factions, with the game's purpose evolving from individual competition to collective competition.

                  Each fraction will have their own unique economies, political systems, technical capabilities, foreign policies, and even cultural beliefs. Members will collaborate to create a joint, on-chain history, driven by Web3's public ledger.</dd>
              </dl>
              <dl className="mi-home-desc-item">
                <dt>Why we are based on Lootverse</dt>
                <dd>Lootverse is a series of communities derived from the original Loot bags, representing the the core value of Autonomous Worlds: To create 5% of the fundamental rules, while encouraging others to create the remaining 95% and even more.</dd>
              </dl>
              <dl className="mi-home-desc-item">
                <dt>How to play</dt>
                <dd>
                  As a player, you start each round by drawing a character card. Each card comes with random attributes like health, attack, speed, and equipment capacity. In the Alpha test, card draws are on the house – no charge. This NFT card is your ticket to the game. Once you're in, you can earn points by digging or plundering opponents for treasures on the map and hauling them out of the entrance.
                </dd>
              </dl>
              <dl className="mi-home-desc-item">
                <dt>How to mine treasures</dt>
                <dd>Players will enter a randomly generated map with pre-placed treasures. Different treasures have different point values. Once you successfully extract treasures out of the cave, you will be rewarded with points for this match. In the game, your movement speed is directly affected by your starting attributes and load, so you must decide when to start transporting treasure out of the cave based on how much treasure you've found.</dd>
              </dl>
              <dl className="mi-home-desc-item">
                <dt>What is the battling system</dt>
                <dd>
                  Inside the cave, the player can initiate a battle against another character within attack range. Battles will be turn-based, with the player having the option to attack or run away, and the outcome  will be based on the behavioral choices of both players, as well as their strategy choices in relation to each other. The loser of the battle will lose all items in their backpack after death, and then the player will be teleported out of the cave and re-randomize their character.
                </dd>
              </dl>
              <dl className="mi-home-desc-item">
                <dt>What is the leaderboard</dt>
                <dd>Gold diggers, the loot from the cave will earn you points, and the top players in accumulated points will receive future rewards!</dd>
              </dl>
            </div>
          </section>

          <section className={"mi-section mi-section-video"}>
            <h2>Official Trailer of Mississippi</h2>
            <iframe width="1280" height="720" src="https://www.youtube.com/embed/6Liyv37K7lM"
                    title="Official Trailer of Mississippi V1.2" frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen/>
          </section>

          <section className={"mi-section mi-section-faq"}>
            <h2>Frequently Asked Questions</h2>
            <div className="faq-wrapper">
              {
                FAQ.map((item, index) => {
                  return (
                    <dl
                      key={item.title}
                      onClick={() => setFaqActiveIndex(faqActiveIndex === index ? -1 : index)}
                    >
                      <dt className={faqActiveIndex === index ? 'active' : ''}>{item.title}</dt>
                      <dd>{item.content}</dd>
                    </dl>
                  )
                })
              }
            </div>
          </section>

          <section className={"mi-section mi-section-last"}>
            <img src={imgPlayers} alt="" className="players"/>
            <div className="player-desc">
              Hey, buddy, you've reached the horizon, <br/>  but the real excitement begins when you enter the cave!
            </div>
            <button className="play-btn mi-btn" onClick={onPlay}>{(!isOpen) ? 'Please wait for open demo day' : 'PLAY NOW'}</button>
            <div className="backed-by-wrapper">
              <h3>Backed by</h3>
              <ul>
                <li><img src={lxDaoIcon} alt=""/>
                  <p>LXDAO, an R&D driven DAO in APAC, dedicated to developing public goods</p>
                </li>
                <li><img src={crownIcon} alt=""/>
                  <p>Realms.World, the largest and most valuable on-chain game community</p>
                </li>
                <li><img src={web3Icon} alt=""/>
                  <p>Web3 social ecosystem with a strong focus on Autonomous Worlds</p>
                </li>
              </ul>
            </div>
          </section>
    </div>
  );
};

export default StaticInfo;