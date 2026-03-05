import type { GameConfig } from "../../shared/types/game";


export const DEFAULT_CONFIG: GameConfig = {
  maxHp: 3,
  gridWidth: 3,
  gridHeight: 3,
  botDelayMin: 300,
  botDelayMax: 800,
  effectDuration: 400,
  maxLogEntries: 10,
} as const;
