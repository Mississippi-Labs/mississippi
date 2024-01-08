import React, { useEffect, useState } from 'react';
import { Hero } from '@/config/hero';
import './styles.scss';
import UserInfo from '@/components/UserInfo';

const HeroComps = ['Back', 'Cape', 'Shield', 'Head', 'Ears', 'Body', 'Eyes', 'Mask', 'Hair', 'Armor', 'Helmet', 'Weapon'];
const Actions = ['idle', 'ready', 'run', 'jump', 'jab', 'slash', 'shot', 'climb', 'die', 'crawl', 'block'];

const HeroEdit = () => {

  const [appearance, setAppearance] = useState({});
  const [heroAction, setHeroActions] = useState(Actions[0]);

  useEffect(() => {
    HeroComps.forEach((comp) => {
      appearance[comp] = Hero[comp][0];
    });

    setAppearance({...appearance});
  }, []);

  const equip = {
    "clothes": "Ornate Chestplate",
    "handheld": "Club",
    "head": "Dragon's Crown"
  };

  return (
    <div className={'mi-hero-page'}>
      <UserInfo player={{ equip, oreBalance: 3, seasonOreBalance: 6 }}/>
      {/*<div className="actions">*/}
      {/*  <select*/}
      {/*    onChange={(e) => {*/}
      {/*      setHeroActions(e.target.value);*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    {*/}
      {/*      Actions.map(action => <option value={action} key={action}>{action}</option>)*/}
      {/*    }*/}
      {/*  </select>*/}
      {/*</div>*/}

      {/*<div className="hero-preview-wrap">*/}
      {/*  <div className={`hero-preview action-${heroAction}`}>*/}
      {/*    {*/}
      {/*      HeroComps.map((comp) => {*/}
      {/*        return (*/}
      {/*          <div*/}
      {/*            className={`hero-comp ${comp}`}*/}
      {/*            key={comp}*/}
      {/*            style={{*/}
      {/*              backgroundImage: appearance[comp] ? `url("/src/assets/img/hero/${comp}/${appearance[comp]}.png")` : 'none'*/}
      {/*            }}*/}
      {/*          />*/}
      {/*        )*/}
      {/*      })*/}
      {/*    }*/}
      {/*  </div>*/}
      {/*</div>*/}

      {/*<div className="select-wrap">*/}
      {/*  {*/}
      {/*    HeroComps.map((key) => {*/}
      {/*      return (*/}
      {/*        <div>*/}
      {/*          <label htmlFor="">{key}: </label>*/}
      {/*          <select*/}
      {/*            name=""*/}
      {/*            id=""*/}
      {/*            key={key}*/}
      {/*            onChange={(e) => {*/}
      {/*              appearance[key] = e.target.value;*/}
      {/*              setAppearance({ ...appearance });*/}
      {/*            }}*/}
      {/*          >*/}
      {/*            {*/}
      {/*              Hero[key].map((item) => <option value={item} key={item}>{item}</option>)*/}
      {/*            }*/}
      {/*          </select>*/}
      {/*        </div>*/}
      {/*      )*/}
      {/*    })*/}
      {/*  }*/}
      {/*</div>*/}
    </div>
  );
};

export default HeroEdit;