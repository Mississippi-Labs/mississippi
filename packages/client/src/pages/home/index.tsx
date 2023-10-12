import React, { useState } from 'react';
import { Col, Row, Button, Input, message } from 'antd';
import './styles.scss';
import { useNavigate } from 'react-router-dom';
import AvatarSelector from '@/components/AvatarSelector';
import { connect } from '@/service/connection';
import HomeHeader from '@/pages/home/header';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css';

const Home = () => {

  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState<null | string>(null);
  const navigate = useNavigate();

  SwiperCore.use([Mousewheel])

  const join = () => {
    if (!setRoomId) {
      message.error('Please input the room id');
      return;
    }
    if (!username) {
      message.error('Please input your username');
      return;
    }
    if (!avatar) {
      message.error('Please select an avatar');
      return;
    }
    navigate('/game', {
      state: {
        avatar,
        roomId,
        username
      }
    });
  }


  return (
    <div className="mi-home-page">
      <HomeHeader/>
      <Swiper
        direction={'vertical'}
        mousewheel
        onSlideChange={() => console.log('slide change')}
        onSwiper={(swiper) => console.log(swiper)}
      >
        <SwiperSlide>
          <section className={"mi-section mi-section1"}>
            <button className={'play-btn'}>Play Now</button>

            <div className="scroll-tip">
              Scroll
            </div>
          </section>
        </SwiperSlide>
        <SwiperSlide>
          <section className={"mi-section mi-section2"}>
            <div className="mi-home-desc">
              <h2>Welcome to Mississippi for Gold Prospecting! </h2>
              <p>y'all! Just a heads up, your neighbors ain't the friendliest bunch. It's a wild ride of plunderin' and survivin', so go hunt that treasure and claim your bounty.</p>
            </div>
            <div className="mi-home-desc-wrapper">
              <dl className="mi-home-desc-item">
                <dt>Gameplay</dt>
                <dd>Mississippi is a fully on-chain roguelike PVP game where players battle for limited resources within a complex cave. Welcome to Mississippi for gold prospecting! Compete with others, take on greed, and see who comes out on top!</dd>
              </dl>
              <dl className="mi-home-desc-item">
                <dt>Mission</dt>
                <dd>To create great games only enabled by Web3. We are striving to find and leverage the unique fun factor that Web3 offers.</dd>
              </dl>
              <dl className="mi-home-desc-item">
                <dt>Approach</dt>
                <dd>We will keep exploring the potential of Autonomous Worlds. The composability of Autonomous Worlds will pave the way for a new labor relations between developers and game players.</dd>
              </dl>
            </div>
          </section>
        </SwiperSlide>
        <SwiperSlide>
          <section className={"mi-section mi-section-faq"}>
            <h2>Frequently Asked Questions</h2>
            <div className="faq-wrapper">
              <dl>
                <dt>How to play?</dt>
                <dd>As a player, you start each round by drawing a character card. Each card comes with random attributes like health, attack, speed, and equipment capacity. In the Alpha test, card draws are on the house – no charge. This NFT card is your ticket to the game. Once you're in, you can earn points by digging or plundering opponents for treasures on the map and hauling them out of the tunnel entrance.</dd>
              </dl>
              <dl>
                <dt>How to dig treasures?</dt>
                <dd>Players will enter a randomly generated map with pre-placed treasures. Different treasures have different point values. Once you successfully extract treasures out of the cave, you will be rewarded with points for this match. In the game, your movement speed is directly affected by your starting attributes and load, so you must decide when to start transporting treasure out of the cave based on how much treasure you've found.</dd>
              </dl>
              <dl>
                <dt>What is the battling system?</dt>
                <dd>Inside the cave, the player can initiate a battle against another character within attack range. Battles will be turn-based, with the player having the option to attack or run away, and the outcome  will be based on the behavioral choices of both players, as well as their strategy choices in relation to each other. The loser of the battle will lose all items in their backpack after death, and then the player will be teleported out of the cave and re-randomize their character.</dd>
              </dl>
              <dl>
                <dt>How long will a match last?</dt>
                <dd>Each season is estimated to last 3~5 days. Within the same season, players can enter the cave multiple times and bring out the treasure multiple times to gain points, after the season is over we will count the players' points to rank them, and players at the top of the list will be rewarded with bounties.</dd>
              </dl>
              <dl>
                <dt>What is the leaderboard?</dt>
                <dd>Gold diggers, the loot from the cave will earn you points, and the top ten warriors in accumulated points will receive a bounty reward!</dd>
              </dl>
            </div>
          </section>
        </SwiperSlide>
      </Swiper>

    </div>
  );
};

export default Home;