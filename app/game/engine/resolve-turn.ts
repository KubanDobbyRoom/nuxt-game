import type { Action, GameConfig, GameState } from "../../../shared/types/game";
import { movementSystem } from "./systems/movement";
import { combatSystem } from "./systems/combat";
import { winSystem } from "./systems/win";

export function resolveTurn(
  state: GameState,
  playerAction: Action,
  botAction: Action,
  config: GameConfig
): { newState: GameState; hasEffects: boolean } {
  const playerHp = state.characters.player.stats.hp;
  const enemyHp = state.characters.enemy.stats.hp;

  if (state.gameOver || playerHp <= 0 || enemyHp <= 0) {
    return { newState: state, hasEffects: false };
  }

  let newState = movementSystem(state, playerAction, botAction, config);
  newState = combatSystem(newState, playerAction, botAction);
  newState = winSystem(newState, config.maxHp);

  const hasEffects = !!newState.shootEffect || !!newState.hitEffect;

  newState.log = [
    { turn: newState.turn + 1, playerAction, botAction },
    ...newState.log.slice(0, config.maxLogEntries - 1),
  ];

  newState.turn += 1;
  newState.characters.enemy.status.isThinking = false;
  newState.pendingPlayerAction = null;

  return { newState, hasEffects };
}
