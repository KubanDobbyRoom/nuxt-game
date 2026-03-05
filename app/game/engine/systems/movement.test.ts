import { describe, expect, test } from "vitest";
import type { Action, CharacterState, GameState } from "../../../../shared/types/game";
import { movementSystem } from "./movement";

const createCharacter = (id: string, x: number, y: number): CharacterState => ({
  id,
  position: { x, y },
  stats: { hp: 3, mana: 0 },
  status: { alive: true, isThinking: false, effects: [] },
});

const createState = (): GameState => ({
  characters: {
    player: createCharacter("player", 2, 2),
    enemy: createCharacter("enemy", 1, 1),
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

const waitAction: Action = { type: "wait" };

describe("movementSystem", () => {
  test("moves player in all directions", () => {
    const config = { gridWidth: 5, gridHeight: 5 };
    const state = createState();

    expect(
      movementSystem(state, { type: "move", dir: "up" }, waitAction, config).characters.player
        .position
    ).toEqual({ x: 2, y: 1 });
    expect(
      movementSystem(state, { type: "move", dir: "down" }, waitAction, config).characters.player
        .position
    ).toEqual({ x: 2, y: 3 });
    expect(
      movementSystem(state, { type: "move", dir: "left" }, waitAction, config).characters.player
        .position
    ).toEqual({ x: 1, y: 2 });
    expect(
      movementSystem(state, { type: "move", dir: "right" }, waitAction, config).characters.player
        .position
    ).toEqual({ x: 3, y: 2 });
  });

  test("does not move outside grid bounds", () => {
    const config = { gridWidth: 3, gridHeight: 3 };
    const state = createState();
    state.characters.player.position = { x: 0, y: 0 };

    const movedUp = movementSystem(state, { type: "move", dir: "up" }, waitAction, config);
    const movedLeft = movementSystem(state, { type: "move", dir: "left" }, waitAction, config);

    expect(movedUp.characters.player.position).toEqual({ x: 0, y: 0 });
    expect(movedLeft.characters.player.position).toEqual({ x: 0, y: 0 });
  });

  test("keeps positions unchanged on wait actions", () => {
    const config = { gridWidth: 5, gridHeight: 5 };
    const state = createState();

    const nextState = movementSystem(state, waitAction, waitAction, config);

    expect(nextState.characters.player.position).toEqual(state.characters.player.position);
    expect(nextState.characters.enemy.position).toEqual(state.characters.enemy.position);
  });
});
