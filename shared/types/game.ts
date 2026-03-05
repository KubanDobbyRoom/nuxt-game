export interface Position {
  x: number;
  y: number;
}

export type Side = "player" | "enemy";
export type Direction = "up" | "down" | "left" | "right";

export type Action =
  | { type: "move"; dir: Direction }
  | { type: "shoot" }
  | { type: "wait" };

export interface LogEntry {
  turn: number;
  playerAction: Action;
  botAction: Action;
  result?: string;
}

export interface ShootEffect {
  side: Side;
  dir: "up" | "down" | "left" | "right";
}

export interface HitEffect {
  target: Side;
}

export interface CharacterStats {
  hp: number;
  mana: number;
  extra?: Record<string, number>;
}

export interface CharacterStatus {
  alive: boolean;
  isThinking: boolean;
  effects: string[];
}

export interface CharacterState {
  id: string;
  position: Position;
  stats: CharacterStats;
  status: CharacterStatus;
}

export interface GameState {
  characters: Record<Side, CharacterState>;
  gameOver: boolean;
  winner: Side | "draw" | null;
  turn: number;
  log: LogEntry[];
  shootEffect: ShootEffect | null;
  hitEffect: HitEffect | null;
  score: { player: number; enemy: number };
  pendingPlayerAction: Action | null;
}

export interface GameConfig {
  maxHp: number;
  gridWidth: number;
  gridHeight: number;
  botDelayMin: number;
  botDelayMax: number;
  effectDuration: number;
  maxLogEntries: number;
}
