import React, { useContext, useEffect, useRef, useState } from 'react';
import { Stage, Container } from '@pixi/react';
import * as PIXI from 'pixi.js';
import MAP_CFG, { MapConfig } from '@/config/map';
import PIXIMap from '@/components/PIXIMap';
import Chests from '@/components/Chests';
import Delivery from '@/components/Delivery';
import PreviewPaths from '@/components/PreviewPaths';
import PIXIFog from '@/components/PIXIFog';
import PIXIPlayers from '@/components/PIXIPlayers';
import { IPlayer } from '@/components/PIXIPlayers/Player';
import GameContext from '@/context';
import { ICoordinate } from '@/components/PIXIMap';
import { CellType } from '@/constants';
import { bfs, calculateMoveTime, calculateOffset, getDistance, isDelivery, isMovable } from '@/utils/map';
import {
  createPathInterpolator,
  getPlayersCache,
  isSamePosition,
  isValidPlayer,
  updatePlayerPosition
} from '@/utils/player';
import PIXIMsg from '@/components/PIXIMsg';


PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
const { cellSize, visualWidth, visualHeight } = MapConfig;


const PIXIAPP = () => {

  const { openingBox, simpleMapData, players, curAddr, showUserInfo, openTreasureChest, treasureChest, isMovablePlayer,
    onMoveToDelivery, onPlayerMove, setStartBattle, blockTime = 1500, msgMap } = useContext(GameContext);
  const [previewPaths, setPreviewPaths] = useState([]);
  const [offset, setOffset] = useState({ x: 0, y: 0});

  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({
    left: 0,
    top: 0
  });
  const [clickedPlayers, setClickedPlayers] = useState([]);
  const [activePlayerId, setActivePlayerId] = useState('');
  const [huntingPlayerId, setHuntingActivePlayerId] = useState('');

  const renderPlayersRef = useRef<IPlayer[]>([]);
  const [playerUpdateTime, setPlayerUpdateTime] = useState(0);
  const renderPlayers = renderPlayersRef.current;
  const curPlayer = renderPlayers.find(item => item.addr === curAddr)

  const moveTasks = useRef([]);
  const clickedCoordinate = useRef({ x: -1, y : -1})
  const playersCache = getPlayersCache(players);
  useEffect(() => {
    const validPlayer = players.filter((player) => isValidPlayer(player));
    validPlayer.forEach((player) => {
      const renderPlayer = renderPlayers.find((rPlayer) => rPlayer.addr === player.addr);
      if (renderPlayer) {
        // update
        if (isSamePosition(player, renderPlayer)) {
          // Maybe other fields changed
          Object.assign(renderPlayer, player);
        } else {
          if (!renderPlayer.moving && !renderPlayer.waiting && getDistance(renderPlayer, player) <= MapConfig.maxAnimateDistance) {
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
        renderPlayers.push({ ...player });
        if (player.addr === curAddr) {
          setOffset(calculateOffset(player));
        }
        console.log(`load player ${player.name}`)
      }
    });
    // filter non-existent player
    renderPlayersRef.current = renderPlayers.filter((player) => {
      const hasFound = validPlayer.find((p) => p.addr === player.addr);
      if (!hasFound) {
        console.log(`removed player ${player.name}`)
      }
      return hasFound;
    });
    setPlayerUpdateTime(Date.now());
    exeMoveTasks();
  }, [playersCache]);

  const exeMoveTasks = () => {
    moveTasks.current.forEach((task) => {
      const { player, target } = task;
      // Avoid anomalies caused by dirty data
      if (isMovable(MAP_CFG[player.y][player.x]) && isMovable(MAP_CFG[target.y][target.x])) {
        const movePaths = bfs(simpleMapData, player, target);
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        animateMove(player, movePaths, () => {})
      }
    });
    moveTasks.current = [];
  }

  const animateMove = (player, paths, onFinish) => {
    let index = 0;
    const moveTime = calculateMoveTime(paths, blockTime);
    const linePath = createPathInterpolator(paths, ~~(moveTime / 16));
    const interval = setInterval(() => {
      const movingPlayer = renderPlayers.find(item => item.addr === player.addr);
      if (!movingPlayer) {
        clearInterval(interval);
        return;
      }
      if (movingPlayer.addr === curPlayer?.addr) {
        setOffset(calculateOffset(linePath[index]));
      }
      updatePlayerPosition(movingPlayer, linePath[index]);
      movingPlayer.action = 'run';
      movingPlayer.moving = true;
      setPlayerUpdateTime(Date.now());
      index++;
      if (index >= linePath.length) {
        movingPlayer.action = 'idle';
        movingPlayer.moving = false;
        setPlayerUpdateTime(Date.now());
        clearInterval(interval);
        onFinish?.()
      }
    }, 16)

  }


  const stageRef = useRef();

  useEffect(() => {
    document.body.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      return false;
    })
  }, []);

  const createPreviewPath = (coordinate: ICoordinate) => {
    const { x, y } = coordinate;
    if (!curPlayer || (x === curPlayer.x && y === curPlayer.y) || curPlayer.moving || curPlayer.x % 1 !== 0 || curPlayer.y % 1 !== 0) {
      return;
    }

    const path = bfs(simpleMapData, curPlayer, { x, y }).slice(1);
    if (!curPlayer.waiting) {
      path.slice(0, Number(curPlayer.speed)).forEach(item => item.movable = true);
    }
    return path;
  }


  const moveCurPlayer = (coordinate: ICoordinate) => {
    if (!isMovablePlayer(curPlayer)) {
      return;
    }
    const { x, y, speed } = curPlayer;
    const paths = bfs(simpleMapData, { x, y }, coordinate).slice(0, Number(speed) + 1);
    animateMove(curPlayer, paths, () => {
      if (curPlayer.waiting) {
        setPreviewPaths([]);
      }
    });
    curPlayer.waiting = true;
    onPlayerMove(paths, () => {
      curPlayer.waiting = false;
      setPreviewPaths((prevPath) => {
        if (prevPath?.length > 0) {
          const lastPreviewPath = prevPath[prevPath.length - 1]
          return createPreviewPath(lastPreviewPath);
        }
        return [];
      })
      if (isDelivery(paths[paths.length - 1])) {
        onMoveToDelivery();
      } else {
        tryHunt();
      }
      setPlayerUpdateTime(Date.now());
    });

  }

  const emitEvent = (action: string, coordinate: ICoordinate) => {
    const type = MAP_CFG[coordinate.y][coordinate.x];
    if (!curPlayer) {
      return;
    }
    let targetChests;
    let players;
    switch (action) {
      case 'hover':
        if (type === CellType.blank) {
          setPreviewPaths(createPreviewPath(coordinate));
        }
        break;
      case 'rightClick':
        if (type === CellType.blank) {
          moveCurPlayer(coordinate)
        }
        setMenuVisible(false);
        break;
      case 'click':
        // it will ignore the event when click delivery
        if (isDelivery(coordinate)) {
          return;
        }
        targetChests = treasureChest.filter(item => item.x === coordinate.x && item.y === coordinate.y);
        if (targetChests.length > 0 && getDistance(curPlayer, coordinate) < 2) {
          openTreasureChest(targetChests[0].id);
          return;
        }
        clickedCoordinate.current = coordinate;
        players = renderPlayers.filter(player => player.x === coordinate.x && player.y === coordinate.y);
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

  const tryHunt = () => {
    const huntedPlayer = renderPlayers.find(player => player.addr === huntingPlayerId);
    if (!huntedPlayer || getDistance(curPlayer, huntedPlayer) > curPlayer.attackRange) {
      return;
    }
    setStartBattle(huntedPlayer);
  }

  const exeAction = (action) => {
    setMenuVisible(false);
    const activePlayer = clickedPlayers.find((item) => item.addr === activePlayerId);
    switch (action) {
      case 'move':
        moveCurPlayer(clickedCoordinate.current)
        break;
      case 'attack':
        setStartBattle(activePlayer);
        setHuntingActivePlayerId('');
        break;
      case 'info':
        showUserInfo(activePlayer);
        break;
      case 'hunt':
        if (getDistance(curPlayer, activePlayer) <= curPlayer.attackRange) {
          exeAction('attack')
        }
        setHuntingActivePlayerId(activePlayerId);
        setTimeout(() => {
          tryHunt()
        })
        break;
    }
  }

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
          <Chests
            data={treasureChest}
            openingBox={openingBox}
          />
          <PIXIPlayers
            data={renderPlayers}
            huntingPlayerId={huntingPlayerId}
            playerUpdateTime={playerUpdateTime}
            msgMap={msgMap}
          />
          <PIXIMsg players={renderPlayers} msgMap={msgMap}/>
          <PIXIFog position={curPlayer ? [curPlayer.x, curPlayer.y] : [4, 5]}/>
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
                  <>
                    <li>
                      <button
                        className="mi-btn"
                        onClick={() => exeAction('move')}
                      >move</button>
                    </li>
                    <li>
                      <button
                        className="mi-btn"
                        onClick={() => exeAction('attack')}
                      >attack</button>
                    </li>
                    <li>
                      <button
                        className="mi-btn"
                        onClick={() => exeAction('hunt')}
                      >hunt</button>
                    </li>
                  </>
                )
              }
              <li>
                <button
                  className="mi-btn"
                  onClick={() => exeAction('info')}
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