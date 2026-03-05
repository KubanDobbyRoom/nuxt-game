<script setup lang="ts">
import { computed } from "vue";
import type {
  Action,
  CharacterState,
  GameConfig,
  HitEffect,
  ShootEffect,
  Side,
  Direction,
} from "../../../shared/types/game";

const props = defineProps<{
  side: Side;
  playerState: CharacterState;
  enemyState: CharacterState;
  config: Pick<GameConfig, "gridWidth" | "gridHeight">;
  shootEffect: ShootEffect | null;
  hitEffect: HitEffect | null;
  canAct: boolean;
  isThinking: boolean;
  gameOver: boolean;
}>();

const emit = defineEmits<{
  action: [action: Action];
}>();

const gridSize = computed(() => ({
  width: props.config.gridWidth,
  height: props.config.gridHeight,
}));

const actorState = computed(() =>
  props.side === "player" ? props.playerState : props.enemyState
);

const onMove = (direction: Direction) => {
  emit("action", { type: "move", dir: direction });
};
</script>

<template>
  <div class="grid" :data-testid="`grid-${side}`">
    <div v-for="y in gridSize.height" :key="`row-${side}-${y}`" class="grid-row">
      <GameCell
        v-for="x in gridSize.width"
        :key="`cell-${side}-${x}-${y}`"
        :side="side"
        :actor="actorState"
        :position="{ x: x - 1, y: y - 1 }"
        :shoot-effect="shootEffect"
        :hit-effect="hitEffect"
        :can-act="canAct"
        :is-thinking="isThinking"
        :game-over="gameOver"
        @move="onMove"
      />
    </div>
    <GameCharacter :side="side" :actor="actorState" :style="`transform: translate(${actorState.position.x * 50}px, ${actorState.position.y * 35}px)`" />
  </div>
</template>

<style scoped>
.grid {
  position: relative;
  display: inline-block;
  border: 1px solid #263041;
  background: #111827;
}

.grid-row {
  display: flex;
}
</style>
