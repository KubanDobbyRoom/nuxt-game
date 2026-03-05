<script setup lang="ts">
import { computed } from "vue";
import type { CharacterState } from "../../../../shared/types/game";
import { useGameStore } from "../../../stores/game-store";

const props = defineProps<{
  actor: CharacterState;
}>();

const gameState = useGameStore();

const hpPercentage = computed(() => {
  return (props.actor.stats.hp / gameState.config.maxHp) * 100;
});
</script>

<template>
  <div class="hp-indicator">
    <div class="hp-bar" :style="{ width: hpPercentage + '%' }"></div>
  </div>
</template>

<style scoped>  
.hp-indicator {
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 5px;
  background-color: rgba(255, 0, 0, 0.202);
  border-radius: 2px;
}

.hp-bar {
  height: 100%;
  background-color: #f87171;
  border-radius: 2px;
  transition: width 0.3s ease;
}
</style>