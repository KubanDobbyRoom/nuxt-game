import { describe, expect, test } from "vitest";
import type { CharacterState, GameState, Position } from "../../../../shared/types/game";
import { combatSystem } from "./combat";

const createCharacter = (id: string, position: Position): CharacterState => ({
  id,
  position: { ...position },
  stats: { hp: 3, mana: 0 },
  status: { alive: true, isThinking: false, effects: [] },
});

const createState = (
  playerPosition: Position = { x: 1, y: 1 },
  enemyPosition: Position = { x: 1, y: 3 }
): GameState => ({
  characters: {
    player: createCharacter("player", playerPosition),
    enemy: createCharacter("enemy", enemyPosition),
  },
  gameOver: false,
  winner: null,
  turn: 0,
  log: [],
  shootEffect: null,
  hitEffect: null,
  score: { player: 0, enemy: 0 },
  pendingPlayerAction: null,
});

describe("combatSystem", () => {
  test("deals damage on aligned row or column hits", () => {
    const state = createState({ x: 1, y: 1 }, { x: 1, y: 3 });
    const nextState = combatSystem(state, { type: "shoot" }, { type: "wait" });

    expect(nextState.characters.enemy.stats.hp).toBe(2);
    expect(nextState.shootEffect).toEqual({ side: "player", dir: "down" });
    expect(nextState.hitEffect).toEqual({ target: "enemy" });
  });

  test("does not deal damage when target is not aligned", () => {
    const state = createState({ x: 1, y: 1 }, { x: 2, y: 3 });
    const nextState = combatSystem(state, { type: "shoot" }, { type: "wait" });

    expect(nextState.characters.enemy.stats.hp).toBe(3);
    expect(nextState.shootEffect).toBeNull();
    expect(nextState.hitEffect).toBeNull();
  });

  test("applies both hits when both sides shoot and are aligned", () => {
    const state = createState({ x: 1, y: 1 }, { x: 3, y: 1 });
    const nextState = combatSystem(state, { type: "shoot" }, { type: "shoot" });

    expect(nextState.characters.player.stats.hp).toBe(2);
    expect(nextState.characters.enemy.stats.hp).toBe(2);
  });
});
