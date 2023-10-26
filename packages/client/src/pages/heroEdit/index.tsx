import React, { useEffect } from 'react';
import imgSrc from '@/assets/img/hero/Hair/Hair2.png'
import './styles.scss';

const HeroComps = ['HEAD', 'EARS', 'BODY', 'EYES', 'MASK', 'HAIR', 'ARMOR', 'HELMET', 'WEAPON', 'SHIELD', 'CAPE', 'BACK'];

const HeroEdit = () => {

  useEffect(() => {
    const c = document.querySelector('canvas');
    const img = document.querySelector('img');
    const ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    setTimeout(() => {
      ctx.scale(8,8)
      ctx.drawImage(img, 0, 0);
    }, 2000)
    // ctx.
  }, [])
  return (
    <div className={'mi-hero-page'}>
      {/*<div className="hero-preview">*/}
      {/*  {*/}
      {/*    HeroComps.map((comp) => {*/}
      {/*      return <div className={`hero-comp ${comp}`} key={comp}/>*/}
      {/*    })*/}
      {/*  }*/}
      {/*</div>*/}
      <img src={imgSrc} alt="" width={768}/>
      <canvas width={512} height={512}/>
    </div>
  );
};

export default HeroEdit;