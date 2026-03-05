import type { Action, Direction, GameConfig, GameState, Position } from "../../../../shared/types/game";

export function movementSystem(
  state: GameState,
  playerAction: Action,
  botAction: Action,
  config: Pick<GameConfig, "gridWidth" | "gridHeight">
): GameState {
  const clone: GameState = {
    ...state,
    characters: {
      player: {
        ...state.characters.player,
        position: { ...state.characters.player.position },
      },
      enemy: {
        ...state.characters.enemy,
        position: { ...state.characters.enemy.position },
      },
    },
  };

  const move = (pos: Position, dir: Direction): Position => {

    const delta = { x: 0, y: 0 };
    if (dir === "up") delta.y = -1;
    if (dir === "down") delta.y = 1;
    if (dir === "left") delta.x = -1;
    if (dir === "right") delta.x = 1;

    return {
      x: Math.max(0, Math.min(config.gridWidth - 1, pos.x + delta.x)),
      y: Math.max(0, Math.min(config.gridHeight - 1, pos.y + delta.y)),
    };
  };

  if (playerAction.type === "move") {
    if (clone.characters.player.stats.hp <= 0) return clone;
    clone.characters.player.position = move(clone.characters.player.position, playerAction.dir);
  }

  if (botAction.type === "move") {
    if (clone.characters.enemy.stats.hp <= 0) return clone;
    clone.characters.enemy.position = move(clone.characters.enemy.position, botAction.dir);
  }

  return clone;
}
