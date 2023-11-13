import React, { useContext, useEffect, useRef, useState } from 'react';
import { Stage, Container, Sprite } from '@pixi/react';
import * as PIXI from 'pixi.js';
import MAP_CFG, { MapConfig } from '@/config/map';
import PIXIMap from '@/components/PIXIMap';
import Chests from '@/components/Chests';
import { TreasureChestMockData } from '@/mock/data';
import Delivery from '@/components/Delivery';
import PreviewPaths from '@/components/PreviewPaths';
import PIXIFog from '@/components/PIXIFog';
import PIXIPlayers from '@/components/PIXIPlayers';
import { IPlayer } from '@/components/PIXIPlayers/Player';
import GameContext from '@/context';
import { ICoordinate } from '@/components/MapCell';
import { CellType } from '@/constants';
import { bfs, isMovable, triggerOffsetUpdate } from '@/utils/map';
import { createPathInterpolator, getPlayersCache, isSamePosition, updatePlayerPosition } from '@/utils/player';

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
const { cellSize, spriteCellSize, visualWidth, visualHeight } = MapConfig;

interface IProps {
  chests: [];
}

const PIXIAPP = (props: IProps) => {

  const { chests = [] } = props;
  const { openingBox, simpleMapData, players, curAddr, showUserInfo } = useContext(GameContext);
  const [previewPaths, setPreviewPaths] = useState([]);
  const [offset, setOffset] = useState({ x: 0, y: 0});

  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({
    left: 0,
    top: 0
  });
  const [clickedPlayers, setClickedPlayers] = useState([]);
  const [activePlayerId, setActivePlayerId] = useState('');

  const [renderPlayers, setRenderPlayers] = useState<IPlayer[]>([]);
  const curPlayer = renderPlayers.find(item => item.addr === curAddr)
  const moveTasks = useRef([]);
  const clickedCoordinate = useRef({ x: -1, y : -1})

  const playersCache = getPlayersCache(players);
  useEffect(() => {
    let renderPlayersArr = [...renderPlayers];
    players.forEach((player) => {
      const renderPlayer = renderPlayers.find((rPlayer) => rPlayer.addr === player.addr);
      if (renderPlayer) {
        // update
        if (isSamePosition(player, renderPlayer)) {
          // Maybe other fields changed
          Object.assign(renderPlayer, player);
        } else {
          if (!renderPlayer.moving) {
            moveTasks.current.push({
              player: renderPlayer,
              target: {
                x: player.x,
                y: player.y
              }
            })
          }
          Object.assign(renderPlayer, { ...player, x: renderPlayer.x, y: renderPlayer.y});
        }
      } else {
        renderPlayersArr.push({ ...player });
        console.log(`load player ${player.name}`)
      }
    });
    // filter non-existent player
    renderPlayersArr = renderPlayersArr.filter((player) => players.find((p) => p.addr === player.addr));
    setRenderPlayers(renderPlayersArr);
    exeMoveTasks();
  }, [playersCache]);

  const exeMoveTasks = () => {
    moveTasks.current.forEach((task) => {
      const { player, target } = task;
      // Avoid anomalies caused by dirty data
      if (isMovable(MAP_CFG[player.y][player.x]) && isMovable(MAP_CFG[target.y][target.x])) {
        const movePaths = bfs(simpleMapData, player, target);
        animateMove(player, movePaths)
      }
    });
    moveTasks.current = [];
  }

  const animateMove = (player, paths) => {
    console.log(player, paths, 'animate move');
    let index = 0;
    const linePath = createPathInterpolator(paths);
    const interval = setInterval(() => {
      const movingPlayer = renderPlayers.find(item => item.addr === player.addr);
      if (!movingPlayer) {
        clearInterval(interval);
        return;
      }
      if (movingPlayer.addr === curPlayer?.addr) {
        setOffset(triggerOffsetUpdate(linePath[index], movingPlayer, simpleMapData, offset));
      }
      updatePlayerPosition(movingPlayer, linePath[index]);
      movingPlayer.action = 'run';
      movingPlayer.moving = true;
      setRenderPlayers([...renderPlayers]);
      index++;
      if (index >= linePath.length) {
        movingPlayer.action = 'idle';
        movingPlayer.moving = false;
        setRenderPlayers([...renderPlayers]);
        clearInterval(interval);
      }
    }, 16)

  }


  const stageRef = useRef();

  useEffect(() => {
    const handleRightClick = (event) => {
      event.preventDefault();
    };

    const canvas = stageRef.current.app.view;
    canvas.addEventListener('contextmenu', handleRightClick);

    return () => {
      canvas.removeEventListener('contextmenu', handleRightClick);
    };
  }, []);

  const createPreviewPath = (coordinate: ICoordinate) => {
    const { x, y } = coordinate;
    if (!curPlayer || (x === curPlayer.x && y === curPlayer.y) || curPlayer.moving) {
      return;
    }

    const path = bfs(simpleMapData, curPlayer, { x, y }).slice(1);
    if (!curPlayer.waiting) {
      path.slice(0, Number(curPlayer.speed)).forEach(item => item.movable = true);
    }
    setPreviewPaths(path);
  }

  const onClickPlayers = (players, coordinate: ICoordinate, e) => {
    if (players.length === 0) {
      return;
    }
  }
  
  const moveCurPlayer = (coordinate: ICoordinate) => {
    const { x, y, speed } = curPlayer;
    const paths = bfs(simpleMapData, { x, y }, coordinate).slice(0, Number(speed) + 1);
    animateMove(curPlayer, paths);
  }

  const emitEvent = (action: string, coordinate: ICoordinate, e) => {
    const type = MAP_CFG[coordinate.y][coordinate.x];
    if (!curPlayer) {
      return;
    }
    switch (action) {
      case 'hover':
        if (type === CellType.blank) {
          createPreviewPath(coordinate);
        }
        break;
      case 'rightClick':
        if (type === CellType.blank) {
          moveCurPlayer(coordinate)
          // onPlayerMove(paths, formatMovePath(paths));
        }
        break;
      case 'click':
        clickedCoordinate.current = coordinate;
        // eslint-disable-next-line no-case-declarations
        const players = renderPlayers.filter(player => player.x === coordinate.x && player.y === coordinate.y);
        if (players.length > 0) {
          setMenuVisible(true);
          setMenuPosition({
            left: (coordinate.x + 0.5) * cellSize + offset.x,
            top: (coordinate.y + 0.5) * cellSize + offset.y,
          })
          setClickedPlayers(players);
          setActivePlayerId(players[0].addr)
        } else {
          setMenuVisible(false);
        }
        break;
    }
  }

  const fogPosition = curPlayer ? [curPlayer.x, curPlayer.y] : [4, 5]

  return (
    <div style={{ position: 'relative' }}>
      <Stage
        width={cellSize * visualWidth}
        height={cellSize * visualHeight}
        options={{ resolution: 1 }}
        ref={stageRef}
      >
        <PIXIMap emitEvent={emitEvent} offset={offset}/>
        <Container position={[offset.x, offset.y]}>
          <Delivery/>
          <PreviewPaths data={previewPaths} />
          <Chests data={chests}/>
          <PIXIPlayers data={renderPlayers}/>
          <PIXIFog position={fogPosition}/>
        </Container>
      </Stage>

      {
        menuVisible && (
          <div className="mi-cell-user-menu" style={menuPosition}>
            {
              clickedPlayers.length > 1 && (
                <ul className="mi-cell-username-list">
                  {
                    clickedPlayers.slice(0, 3).map((player) => {
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
                    <button
                      className="mi-btn"
                      onClick={() => {
                        setMenuVisible(false);
                        moveCurPlayer(clickedCoordinate.current)
                      }}
                    >move</button>
                  </li>
                )
              }
              {
                activePlayerId !== curAddr && (
                  <li>
                    <button className="mi-btn" onClick={(e) => {}}>attack</button>
                  </li>
                )
              }
              <li>
                <button
                  className="mi-btn"
                  onClick={(e) => {
                    setMenuVisible(false);
                    const activePlayer = clickedPlayers.find((item) => item.addr === activePlayerId);
                    showUserInfo(activePlayer);
                  }}
                >info</button>
              </li>
            </ul>
          </div>
        )
      }
    </div>
  );
};

export default PIXIAPP;