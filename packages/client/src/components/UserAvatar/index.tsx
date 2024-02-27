import React, {useEffect, useState} from 'react';
import './styles.scss';
import UserAddress from '@/components/UserAddress';
import { Stage } from '@pixi/react';
import Player, { IPlayer } from '@/components/PIXIPlayers/Player';
import gemImg from '@/assets/img/gem.png';

interface IProps extends IPlayer {
  address: string;
}

const UserAvatar = (props: IProps) => {
  const [diffHp, setDiffHp] = useState(0);
  const { address, balance, ...rest } = props;
  useEffect(() => {
    setDiffHp(props.diffHp)
    setTimeout(() => {
      setDiffHp(0)
    }, 1000)
  }, [props.diffHp])
  return (
    <div className="mi-c-user-avatar">
      <div className={`avatar-box`}>
        <Stage width={60} height={60} options={{ resolution: 1, backgroundAlpha: 0 }}>
          <Player {...rest} size={60} x={0} y={0.3} isPlaying={false} name={''} />
        </Stage>
      </div>

      <div className='user-info'>
        <div className='user-hp'>
          <div className='now-hp' ><div className='hp' style={{width: (props.hp / props.maxHp) * 100 + '%'}}></div></div>
          {
            diffHp > 0 ? <div className='diff-hp'>+{diffHp}</div> : null
          }
        </div>
        <div className='gems'>
          <img src={gemImg} alt=""/>
          <p>{props.oreBalance}</p>
        </div>
      </div>
    </div>
  );
};

export default UserAvatar;