import { IPlayer } from '@/components/Player';

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