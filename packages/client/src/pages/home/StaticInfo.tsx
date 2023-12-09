import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css';
import './staticInfo.scss';
import FAQ from '@/config/faq';

import imgPlayer from '@/assets/img/player_1.png';
import imgPlayer2 from '@/assets/img/player_2.png';
import imgPlayers from '@/assets/img/players.png';
import indexDuckImg from '@/assets/img/duck_index.svg';

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
      <Swiper
        direction={'vertical'}
        mousewheel
        onSlideChange={() => console.log('slide change')}
        onSwiper={(swiper) => console.log(swiper)}
      >
        <SwiperSlide>
          <section className={"mi-section index-section"}>
            <div className="section-box">
              <div className="intro-box">
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
            <img src={indexDuckImg} alt="duck" className={'duck-index'}/>

            <div className="scroll-tip">
              Scroll
            </div>
          </section>
        </SwiperSlide>
        <SwiperSlide>
          <section className={"mi-section mi-section2"}>
            <div className="mi-home-desc">
              <div className="mi-home-desc-title-wrap">
                <h2>Welcome to Mississippi for Gold Prospecting! </h2>
              </div>
              <p>y'all! Just a heads up, your neighbors ain't the friendliest bunch. It's a wild ride of plunderin' and survivin', so go hunt that treasure and claim your bounty.</p>
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
            </div>
          </section>
        </SwiperSlide>
        <SwiperSlide>
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
        </SwiperSlide>
        <SwiperSlide>
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
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default StaticInfo;