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
import FAQ from '@/config/faq';

const Home = () => {

  const [roomId, setRoomId] = useState('');
  const [faqActiveIndex, setFaqActiveIndex] = useState(-1);
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
      </Swiper>

    </div>
  );
};

export default Home;