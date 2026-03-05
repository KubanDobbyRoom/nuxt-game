import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useGameStore } from "./game-store";

describe("game store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.useFakeTimers();
    vi.spyOn(Math, "random").mockReturnValue(0);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  test("locks player actions while enemy is thinking", () => {
    const store = useGameStore();

    store.handlePlayerAction({ type: "shoot" });
    expect(store.state.characters.enemy.status.isThinking).toBe(true);

    const firstAction = store.state.pendingPlayerAction;
    store.handlePlayerAction({ type: "wait" });
    expect(store.state.pendingPlayerAction).toEqual(firstAction);

    vi.advanceTimersByTime(store.config.botDelayMin + 1);
    expect(store.state.characters.enemy.status.isThinking).toBe(false);
    expect(store.state.pendingPlayerAction).toBeNull();
  });

  test("restart clears pending turn timer and resets state", () => {
    const store = useGameStore();
    store.handlePlayerAction({ type: "shoot" });

    store.restart();

    expect(store.state.turn).toBe(0);
    expect(store.state.pendingPlayerAction).toBeNull();
    expect(store.state.characters.enemy.status.isThinking).toBe(false);

    vi.runAllTimers();
    expect(store.state.turn).toBe(0);
  });

  test("starts characters on separate cells on standard grid", () => {
    const store = useGameStore();
    const player = store.state.characters.player.position;
    const enemy = store.state.characters.enemy.position;

    expect(player).not.toEqual(enemy);
  });

  test("clears transient effects synchronously before resolving next turn", () => {
    const store = useGameStore();
    store.state.shootEffect = { side: "player", dir: "up" };
    store.state.hitEffect = { target: "enemy" };

    store.handlePlayerAction({ type: "wait" });

    expect(store.state.shootEffect).toBeNull();
    expect(store.state.hitEffect).toBeNull();
  });
});
