import type { Action, GameState, Position, ShootEffect } from "../../../../shared/types/game";

export function combatSystem(
  state: GameState,
  playerAction: Action,
  botAction: Action
): GameState {
  const clone: GameState = {
    ...state,
    characters: {
      player: {
        ...state.characters.player,
        stats: { ...state.characters.player.stats },
      },
      enemy: {
        ...state.characters.enemy,
        stats: { ...state.characters.enemy.stats },
      },
    },
  };

  const isHit = (attacker: Position, target: Position) => attacker.y === target.y;

  const getShotDirection = (attacker: Position, target: Position): ShootEffect["dir"] => {
    const deltaX = target.x - attacker.x;
    // const deltaY = target.y - attacker.y;

    if (deltaX !== 0) return deltaX > 0 ? "right" : "left";
    // if (deltaY !== 0) return deltaY > 0 ? "down" : "up";
    return "right";
  };

  // Player shoots
  if (
    playerAction.type === "shoot" &&
    isHit(clone.characters.player.position, clone.characters.enemy.position)
  ) {
    clone.characters.enemy.stats.hp -= 1;
    clone.shootEffect = {
      side: "player",
      dir: getShotDirection(clone.characters.player.position, clone.characters.enemy.position),
    };
    clone.hitEffect = { target: "enemy" };
  }

  // Bot shoots
  if (
    botAction.type === "shoot" &&
    isHit(clone.characters.enemy.position, clone.characters.player.position)
  ) {
    clone.characters.player.stats.hp -= 1;
    clone.shootEffect = {
      side: "enemy",
      dir: getShotDirection(clone.characters.enemy.position, clone.characters.player.position),
    };
    clone.hitEffect = { target: "player" };
  }

  return clone;
}
