import React from 'react';
import './style.scss';

const Appearance = (props) => {

  const { boxesCount = 0, leaderboard = [] } = props;

  return (
    <div className={`mi-leaderboard`}>
      <div className='boxes'>Remaining Boxes: {boxesCount}</div>
      <div className="section-title">Leaderboard</div>
      {
        leaderboard.map((player, index) => (
          <div key={index} className='leaderboard-item'>
            <span className="player-score">{index + 1}.</span>
            <span className="player-name">{player.username}</span>
            <span className="player-gems">{player.oreBalance}</span>
          </div>
        ))
      }
    </div>
  );
};

export default Appearance;