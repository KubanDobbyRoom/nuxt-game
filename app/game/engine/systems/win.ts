import type { GameState } from "../../../../shared/types/game";

export function winSystem(state: GameState, maxHp: number): GameState {
  const clone: GameState = {
    ...state,
    characters: {
      player: {
        ...state.characters.player,
        stats: { ...state.characters.player.stats },
        status: { ...state.characters.player.status },
      },
      enemy: {
        ...state.characters.enemy,
        stats: { ...state.characters.enemy.stats },
        status: { ...state.characters.enemy.status },
      },
    },
  };

  const playerHp = clone.characters.player.stats.hp;
  const enemyHp = clone.characters.enemy.stats.hp;

  if (playerHp <= 0 && enemyHp <= 0) {
    clone.gameOver = true;
    clone.winner = "draw";
  } else if (playerHp <= 0) {
    clone.gameOver = true;
    clone.winner = "enemy";
  } else if (enemyHp <= 0) {
    clone.gameOver = true;
    clone.winner = "player";
  }

  if (clone.characters.player.stats.hp > maxHp) {
    clone.characters.player.stats.hp = maxHp;
  }

  if (clone.characters.enemy.stats.hp > maxHp) {
    clone.characters.enemy.stats.hp = maxHp;
  }

  clone.characters.player.status.alive = clone.characters.player.stats.hp > 0;
  clone.characters.enemy.status.alive = clone.characters.enemy.stats.hp > 0;

  return clone;
}
