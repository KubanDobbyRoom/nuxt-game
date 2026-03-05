import { describe, expect, test } from "vitest";
import type { CharacterState, GameState } from "../../../../shared/types/game";
import { winSystem } from "./win";

const createCharacter = (id: string, hp: number): CharacterState => ({
  id,
  position: { x: 0, y: 0 },
  stats: { hp, mana: 0 },
  status: { alive: hp > 0, isThinking: false, effects: [] },
});

const createState = (playerHp: number, enemyHp: number): GameState => ({
  characters: {
    player: createCharacter("player", playerHp),
    enemy: createCharacter("enemy", enemyHp),
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

describe("winSystem", () => {
  test("sets player winner when enemy hp is depleted", () => {
    const nextState = winSystem(createState(2, 0), 3);

    expect(nextState.gameOver).toBe(true);
    expect(nextState.winner).toBe("player");
    expect(nextState.characters.enemy.status.alive).toBe(false);
  });

  test("sets enemy winner when player hp is depleted", () => {
    const nextState = winSystem(createState(0, 2), 3);

    expect(nextState.gameOver).toBe(true);
    expect(nextState.winner).toBe("enemy");
    expect(nextState.characters.player.status.alive).toBe(false);
  });

  test("sets draw when both hp values are depleted", () => {
    const nextState = winSystem(createState(0, 0), 3);

    expect(nextState.gameOver).toBe(true);
    expect(nextState.winner).toBe("draw");
  });

  test("clamps hp values to max hp", () => {
    const nextState = winSystem(createState(10, 8), 3);

    expect(nextState.characters.player.stats.hp).toBe(3);
    expect(nextState.characters.enemy.stats.hp).toBe(3);
  });
});
