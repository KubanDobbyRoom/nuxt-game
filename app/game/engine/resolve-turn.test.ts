import { describe, expect, test } from "vitest";
import type { CharacterState, GameConfig, GameState } from "../../../shared/types/game";
import { resolveTurn } from "./resolve-turn";

const createCharacter = (
  id: string,
  x: number,
  y: number,
  hp: number,
  isThinking: boolean
): CharacterState => ({
  id,
  position: { x, y },
  stats: { hp, mana: 0 },
  status: { alive: hp > 0, isThinking, effects: [] },
});

const createState = (): GameState => ({
  characters: {
    player: createCharacter("player", 0, 0, 3, false),
    enemy: createCharacter("enemy", 0, 1, 3, true),
  },
  gameOver: false,
  winner: null,
  turn: 0,
  log: [],
  shootEffect: null,
  hitEffect: null,
  score: { player: 0, enemy: 0 },
  pendingPlayerAction: { type: "shoot" },
});

const config: GameConfig = {
  maxHp: 3,
  gridWidth: 5,
  gridHeight: 5,
  botDelayMin: 300,
  botDelayMax: 800,
  effectDuration: 400,
  maxLogEntries: 10,
};

describe("resolveTurn", () => {
  test("increments turn, appends log, resets thinking and pending action", () => {
    const state = createState();
    const { newState } = resolveTurn(state, { type: "wait" }, { type: "wait" }, config);

    expect(newState.turn).toBe(1);
    expect(newState.log).toHaveLength(1);
    expect(newState.log[0]).toEqual({
      turn: 1,
      playerAction: { type: "wait" },
      botAction: { type: "wait" },
    });
    expect(newState.characters.enemy.status.isThinking).toBe(false);
    expect(newState.pendingPlayerAction).toBeNull();
  });

  test("resolves movement before combat", () => {
    const state = createState();
    state.characters.enemy.position = { x: 0, y: 1 };
    state.characters.player.position = { x: 0, y: 0 };

    const { newState } = resolveTurn(
      state,
      { type: "shoot" },
      { type: "move", dir: "right" },
      config
    );

    expect(newState.characters.enemy.position).toEqual({ x: 1, y: 1 });
    expect(newState.characters.enemy.stats.hp).toBe(3);
  });
});
