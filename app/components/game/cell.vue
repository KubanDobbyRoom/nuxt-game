<script setup lang="ts">
import { computed } from "vue";
import type {
  CharacterState,
  Direction,
  HitEffect,
  Position,
  ShootEffect,
  Side,
} from "../../../shared/types/game";

const props = defineProps<{
  side: Side;
  actor: CharacterState;
  position: Position;
  shootEffect: ShootEffect | null;
  hitEffect: HitEffect | null;
  canAct: boolean;
  isThinking: boolean;
  gameOver: boolean;
}>();

const emit = defineEmits<{
  move: [direction: Direction];
}>();

const directions: Record<string, Direction> = {
  "0,1": "down",
  "0,-1": "up",
  "1,0": "right",
  "-1,0": "left",
};

const isActorCell = computed(
  () =>
    props.actor.position.x === props.position.x &&
    props.actor.position.y === props.position.y
);

const moveDirection = computed<Direction | null>(() => {
  const dx = props.position.x - props.actor.position.x;
  const dy = props.position.y - props.actor.position.y;
  return directions[`${dx},${dy}`] ?? null;
});

const canMoveToCell = computed(
  () =>
    props.side === "player" &&
    props.canAct &&
    !props.isThinking &&
    !props.gameOver &&
    !isActorCell.value &&
    moveDirection.value !== null
);

const isShooting = computed(
  () => isActorCell.value && props.shootEffect?.side === props.side
);

const isHit = computed(
  () => isActorCell.value && props.hitEffect?.target === props.side
);

const cellClasses = computed(() => ({
  "cell--actor": isActorCell.value,
  "cell--move": canMoveToCell.value,
  "cell--shoot": isShooting.value,
  "cell--hit": isHit.value,
}));

const onMoveClick = () => {
  if (!canMoveToCell.value || !moveDirection.value) return;
  emit("move", moveDirection.value);
};
</script>

<template>
  <div
    class="cell"
    :class="cellClasses"
    :data-testid="`cell-${side}-${position.x}-${position.y}`"
  >
    <button
      v-if="canMoveToCell"
      class="move-indicator"
      :data-testid="`move-${side}-${position.x}-${position.y}`"
      :aria-label="`move-${moveDirection}`"
      @click="onMoveClick"
    >
      move
    </button>
    <span v-if="isShooting" class="shoot-indicator">{{ shootEffect?.dir }}</span>
  </div>
</template>

<style scoped>
.cell {
  width: 50px;
  height: 35px;
  border: 1px solid #273549;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0b1220;
  color: #e8f0ff;
  position: relative;
}

.cell--actor {
  background: #1b2538;
  font-weight: 700;
}

.unit {
  transform: translateY(-60px);
  opacity: 1.3;
  font-size: 0.8rem;
}

.move-indicator {
  width: 100%;
  height: 100%;
  border-radius: 4px;
  border: 0;
  background: #6df6af30;
  color: #021122;
  cursor: pointer;
  font-size: 0;
}

.move-indicator:hover {
  background: #6df6af50;
}

.cell--move {
  background: #12263d;
}

.cell--shoot {
  animation: pulse-shoot 0.28s ease-out;
}

.shoot-indicator {
  position: absolute;
  bottom: 2px;
  right: 4px;
  font-size: 0.65rem;
  text-transform: uppercase;
  color: #9be9ff;
}

@keyframes pulse-shoot {
  from {
    box-shadow: inset 0 0 0 2px #38bdf8;
  }
  to {
    box-shadow: none;
  }
}

@keyframes pulse-hit {
  from {
    background: #4c1d1d;
  }
  to {
    background: #0b1220;
  }
}
</style>
