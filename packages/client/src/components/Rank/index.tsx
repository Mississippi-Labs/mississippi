import React, { useState } from 'react';
import './styles.scss';

interface IUser {
  id: string | number;
  name: string;
  score: number;
}

interface IProps {
  data: IUser[];
  curId: number;
}

const Rank = (props: IProps) => {

  const { data, curId } = props;
  const curIndex = data.findIndex(item => item.id === curId);
  const [visible, setVisible] = useState(false);

  const toggleVisible = () => {
    setVisible(!visible);
  }

  return (
    <div className={`mi-c-rank ${visible ? '' : 'hidden'}`}>
      <div className="rank-title">Rank</div>
      <ul className="rank-list">
        {
          data.map((item, index) => {
            return (
              <li className="rank-info">
                <div className="rank-index">{index + 1}</div>
                <div className="name">{item.name}</div>
                <div className="score">{item.score}</div>
              </li>
            )
          })
        }
      </ul>
      <div className="rank-info my-rank-info">
        <div className="rank-index">{curIndex + 1}</div>
        <div className="name">ME</div>
        <div className="score">{data[curIndex].score}</div>
      </div>
      <div className="opt">
        <div className="toggle-visible" onClick={toggleVisible}/>
      </div>
    </div>
  );
};

export default Rank;