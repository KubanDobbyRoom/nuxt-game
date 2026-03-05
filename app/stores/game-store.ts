import { acceptHMRUpdate, defineStore } from "pinia";
import { ref, toRaw } from "vue";
import { useNuxtApp } from "#app";
import type {
  Action,
  CharacterState,
  GameConfig,
  GameState,
  Position,
} from "../../shared/types/game";
import { DEFAULT_CONFIG } from "../config/game";
import { randomBotAction } from "../game/engine/ai";
import { resolveTurn } from "../game/engine/resolve-turn";
import { useAuthStore } from "./auth-store";

const createInitialState = (config: GameConfig): GameState => {
  const playerX = config.gridWidth > 2 ? config.gridWidth - 2 : 1;
  const enemyX = config.gridWidth > 2 ? config.gridWidth - 2 : 1;
  const centerY = Math.floor(config.gridHeight / 2);

  const createCharacter = (position: Position): CharacterState => ({
    id: crypto.randomUUID(),
    position,
    stats: {
      hp: config.maxHp,
      mana: 0,
    },
    status: {
      alive: true,
      isThinking: false,
      effects: [],
    },
  });

  return {
    characters: {
      player: createCharacter({ x: playerX, y: centerY }),
      enemy: createCharacter({ x: enemyX, y: centerY }),
    },
    gameOver: false,
    winner: null,
    turn: 0,
    log: [],
    shootEffect: null,
    hitEffect: null,
    score: { player: 0, enemy: 0 },
    pendingPlayerAction: null,
  };
};

export const useGameStore = defineStore("game", () => {
  const config = ref<GameConfig>(DEFAULT_CONFIG);
  const state = ref<GameState>(createInitialState(config.value));
  let turnTimer: ReturnType<typeof setTimeout> | null = null;
  let effectTimer: ReturnType<typeof setTimeout> | null = null;

  const resetEffects = () => {
    if (effectTimer) {
      clearTimeout(effectTimer);
      effectTimer = null;
    }
    state.value.shootEffect = null;
    state.value.hitEffect = null;
  };

  const scheduleEffectsCleanup = () => {
    if (effectTimer) clearTimeout(effectTimer);

    effectTimer = setTimeout(() => {
      state.value.shootEffect = null;
      state.value.hitEffect = null;
      effectTimer = null;
    }, config.value.effectDuration);
  };

  const loadRemoteState = async () => {
    const authStore = useAuthStore();
    const raw = authStore.initDataRaw;

    if (!raw) return;

    const { $fetch } = useNuxtApp() as unknown as { $fetch: (input: string, init?: { method?: string; headers?: Record<string, string>; body?: unknown }) => Promise<unknown> };

    try {
      const data = (await $fetch("/api/game/state", {
        method: "GET",
        headers: {
          Authorization: `tma ${raw}`,
        },
      })) as { state: GameState | null };

      if (data?.state) {
        state.value = data.state;
      }
    } catch {
      // ignore load errors on client
    }
  };

  const saveRemoteState = async () => {
    const authStore = useAuthStore();
    const raw = authStore.initDataRaw;

    if (!raw) return;

    const { $fetch } = useNuxtApp() as unknown as { $fetch: (input: string, init?: { method?: string; headers?: Record<string, string>; body?: unknown }) => Promise<unknown> };

    try {
      await $fetch("/api/game/save", {
        method: "POST",
        headers: {
          Authorization: `tma ${raw}`,
        },
        body: JSON.stringify({
          state: state.value,
        }),
      });
    } catch {
      // ignore save errors on client
    }
  };

  const handlePlayerAction = (playerAction: Action) => {
    if (state.value.gameOver || state.value.characters.enemy.status.isThinking || turnTimer) {
      return;
    }

    resetEffects();
    const capturedState = structuredClone(toRaw(state.value));

    state.value = {
      ...state.value,
      characters: {
        ...state.value.characters,
        enemy: {
          ...state.value.characters.enemy,
          status: {
            ...state.value.characters.enemy.status,
            isThinking: true,
          },
        },
      },
      pendingPlayerAction: playerAction,
    };

    const delay =
      Math.random() * (config.value.botDelayMax - config.value.botDelayMin) +
      config.value.botDelayMin;

    turnTimer = setTimeout(() => {
      turnTimer = null;
      const botAction = randomBotAction();
      const { newState, hasEffects } = resolveTurn(
        capturedState,
        playerAction,
        botAction,
        config.value
      );

      state.value = newState;
      if (hasEffects) scheduleEffectsCleanup();
      void saveRemoteState();
    }, delay);
  };

  const restart = () => {
    if (turnTimer) clearTimeout(turnTimer);
    turnTimer = null;
    resetEffects();
    state.value = createInitialState(config.value);
    void saveRemoteState();
  };

  return { state, config, handlePlayerAction, restart, loadRemoteState };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGameStore, import.meta.hot));
}
