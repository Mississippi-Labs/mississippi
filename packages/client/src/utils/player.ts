import { IPlayer } from '@/components/PIXIPlayers/Player';

export const updatePlayerPosition = (player: IPlayer, next: IPlayer) => {
  const updateX = player.x - next.x;
  const toward = updateX === 0 ? undefined : (
    updateX < 0 ? 'Right' : 'Left'
  );
  Object.assign(player, next);
  if (toward) {
    player.toward = toward;
  }
}

export const getPlayersCache = (players: IPlayer[] = []) => {
  return players.map(player => `${player.addr}-${player.x}-${player.y}`).join('*');
}

export const isSamePosition = (p1, p2) => {
  return p1.x === p2.x && p1.y === p2.y;
}

export const createPathInterpolator = (path, steps = 24) => {
  const interpolatedPoints = [];
  for (let step = 0; step <= steps; step++) {
    let t = step / steps;
    t = t > 1 ? 1 : t; // 确保t不超过1

    const p = t * (path.length - 1);
    const i = Math.floor(p);

    const start = path[i];
    const end = path[i + 1] || path[i];

    const ratio = p - i;

    interpolatedPoints.push({
      x: start.x + (end.x - start.x) * ratio,
      y: start.y + (end.y - start.y) * ratio
    });
  }
  return interpolatedPoints;
}

export const isValidPlayer = (player: IPlayer) => {
  return player.state === 2 || player.state === 3;
}