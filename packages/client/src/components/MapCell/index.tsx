import React, { useContext, useEffect, useState } from 'react';
import { CellType } from '../../constants';
import { getCellClass, isMovable } from '@/utils';
import './styles.scss';
import Player, { IPlayer } from '@/components/Player';
import { DELIVERY } from '@/config/map';
import TreasureChest, { ITreasureChest } from '@/components/TreasureChest';
import GameContext from '@/context';
import { getDistance } from '@/utils/map';

interface ITransform {
  index: number;
  transform: string;
}

interface ICellClass {
  transforms: ITransform[];
  classList: number[];
}

export interface ICellClassCache {
  [k: string]: ICellClass
}

export interface ICoordinate {
  x: number;
  y: number;
}

interface IProps {
  coordinate: ICoordinate,
  cellClassCache: ICellClassCache;
  players?: IPlayer[];
  treasureChest?: ITreasureChest[];
  onMoveTo: (ICoordinate) => void;
  prevActionCoordinate: ICoordinate;
  onExeAction: (ICoordinate) => void;
}

const MapCell = (props: IProps) => {
  const { coordinate: { x, y}, cellClassCache, treasureChest = [], players = [], onMoveTo, onExeAction, prevActionCoordinate } = props;

  const [menuVisible, setMenuVisible] = useState(false);
  const [activePlayerId, setActivePlayerId] = useState(-1);

  const { mapData, openTreasureChest, setStartBattle, showUserInfo, previewPath, renderPreviewPaths = [], curAddr, players: AllPlayers } = useContext(GameContext);

  const isDelivery = DELIVERY.x === x && DELIVERY.y === y;
  const movable = isMovable(mapData[y][x]);

  if (!cellClassCache[`${y}-${x}`]) {
    cellClassCache[`${y}-${x}`] = getCellClass(mapData, { x, y});
  }

  const { transforms, classList } = cellClassCache[`${y}-${x}`];

  const onContextMenu = (e) => {
    onExeAction({ x, y});
    e.preventDefault();
    if (players.length > 0 || treasureChest.length > 0) {
      onClick();
      return;
    }
    if (movable) {
      onMoveTo({ x, y});
    }
  }

  const onClick = () => {
    onExeAction({ x, y});
    const curPlayer = AllPlayers.find(item => item.addr === curAddr);
    if (!curPlayer) {
      return;
    }
    if (treasureChest.length > 0 && getDistance({ x, y}, curPlayer) <= 1) {
      openTreasureChest(treasureChest[0].id);
      return;
    }
    if (players.length === 0) {
      return;
    }
    setMenuVisible(true);
    setActivePlayerId(players[0].addr)
  }

  const exeAction = (e, action) => {
    e.stopPropagation();
    setMenuVisible(false);
    const activePlayer = players.find((item) => item.addr === activePlayerId);
    switch (action) {
      case 'move':
        onMoveTo({x, y});
        break;
      case 'info':
        showUserInfo(activePlayer);
        break;
      case 'attack':
        setStartBattle(activePlayer);
        break;
    }
  }

  useEffect(() => {
    if (prevActionCoordinate.x !== x || prevActionCoordinate.y !== y) {
      setMenuVisible(false);
    }
  }, [prevActionCoordinate.x, prevActionCoordinate.y])

  const renderPreviewPath = renderPreviewPaths.find(item => item.x === x && item.y === y);

  return (
    <div
      className="mi-map-cell"
      onContextMenu={onContextMenu}
      onClick={onClick}
      onMouseEnter={() => {
        if (movable) {
          previewPath(x, y);
        }
      }}
    >
      <div className="cell-map-box">
        {
          classList.map((item, index) => {
            const transformStyle = transforms.find((item) => item.index === index);
            const style = transformStyle ? {
              transform: transformStyle.transform
            } : {};
            return (
              <div
                key={`${x}-${y}-${index}`}
                className={`inner-cell mi-wall-${item}`}
                style={style}
              />
            )
          })
        }
      </div>

      {
        renderPreviewPath && <div className={`render-preview-path ${renderPreviewPath.movable ? 'movable' : ''}`}/>
      }

      {
        isDelivery && <div className={'cell-map-delivery'}/>
      }

      {
        treasureChest.map((item) => <TreasureChest {...item} key={item.id} />)
      }

      {
        !isDelivery && players.map((player) => <Player key={player.addr} {...player}/>)
      }
      {
        menuVisible && (
          <div className="mi-cell-user-menu">
            {
              players.length > 1 && (
                <ul className="mi-cell-username-list">
                  {
                    players.slice(0, 3).map((player) => {
                      return (
                        <li
                          key={player.addr}
                          className={player.addr === activePlayerId ? 'active' : ''}
                          onClick={(e) => {
                            setActivePlayerId(player.addr);
                            e.stopPropagation();
                          }}
                        >{player.username}</li>
                      )
                    })
                  }
                </ul>
              )
            }
            
            <ul className="mi-cell-action-menu">
              {
                activePlayerId !== curAddr && (
                  <li>
                    <button className="mi-btn" onClick={(e) => exeAction(e, 'move')}>move</button>
                  </li>
                )
              }
              {
                activePlayerId !== curAddr && (
                  <li>
                    <button className="mi-btn" onClick={(e) => exeAction(e, 'attack')}>attack</button>
                  </li>
                )
              }
              <li>
                <button className="mi-btn" onClick={(e) => exeAction(e, 'info')}>info</button>
              </li>
            </ul>
          </div>
        )
      }
    </div>
  );
};

export default MapCell;