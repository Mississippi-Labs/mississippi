import React, { useEffect, useState } from 'react';
import { CellType } from '../../constants';
import { getCellClass, isMovable } from '@/utils';
import './styles.scss';
import Player, { IPlayer } from '@/components/Player';
import { DELIVERY } from '@/config/map';

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
  mapData: number[][];
  cellClassCache: ICellClassCache;
  players?: IPlayer[];
  onMoveTo: (ICoordinate) => void;
  prevActionCoordinate: ICoordinate;
  onExeAction: (ICoordinate) => void;
}

const MapCell = (props: IProps) => {
  const { coordinate: { x, y}, mapData, cellClassCache, players, onMoveTo, onExeAction, prevActionCoordinate } = props;

  const [menuVisible, setMenuVisible] = useState(false);
  const [activePlayerId, setActivePlayerId] = useState(-1);
  const isDelivery = DELIVERY.x === x && DELIVERY.y === y;

  if (!cellClassCache[`${y}-${x}`]) {
    cellClassCache[`${y}-${x}`] = getCellClass(mapData, { x, y});
  }

  const { transforms, classList } = cellClassCache[`${y}-${x}`];

  const onContextMenu = (e) => {
    onExeAction({ x, y});
    e.preventDefault();
    const curMapDataType = mapData[y][x];
    if (isMovable(curMapDataType)) {
      onMoveTo({ x, y});
    }
  }

  const onClick = () => {
    onExeAction({ x, y});
    if (!players || players?.length === 0) {
      return;
    }
    setMenuVisible(true);
    setActivePlayerId(players[0].id)
  }

  const exeAction = (e, action) => {
    e.stopPropagation();
    setMenuVisible(false);
    switch (action) {
      case 'move':
        onMoveTo({x, y});
        break;
      case 'info':
        break;
      case 'attack':
        break;
    }
  }

  useEffect(() => {
    if (prevActionCoordinate.x !== x || prevActionCoordinate.y !== y) {
      setMenuVisible(false);
    }
  }, [prevActionCoordinate.x, prevActionCoordinate.y])

  return (
    <div
      className="mi-map-cell"
      onContextMenu={onContextMenu}
      onClick={onClick}
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
        isDelivery && <div className={'cell-map-delivery'}/>
      }

      {
        players && players.map((player) => <Player {...player}/>)
      }
      {
        menuVisible && (
          <div className="mi-cell-user-menu">
            {
              players?.length > 1 && (
                <ul className="mi-cell-username-list">
                  {
                    players?.slice(0, 3).map((player) => {
                      return (
                        <li
                          key={player.id}
                          className={player.id === activePlayerId ? 'active' : ''}
                          onClick={(e) => {
                            setActivePlayerId(player.id);
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
              <li>
                <button className="mi-btn" onClick={(e) => exeAction(e, 'move')}>move</button>
              </li>
              <li>
                <button className="mi-btn" onClick={(e) => exeAction(e, 'attack')}>attack</button>
              </li>
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