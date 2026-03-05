
<script setup lang="ts">
import { computed } from "vue";
import type { Side, CharacterState } from "../../../shared/types/game";
const props = defineProps<{
  side: Side;
  actor: CharacterState;
}>();

const gunStyle = computed(() => {
  if (props.side !== "player") {
    return {
      transform: "scaleX(-1)",
      right: "auto",
      left: "-10px"
    };
  }
  return {};
});
</script>

<template>
  <div class="character"
    :class="[
      side,
      actor.stats.hp <= 0 ? 'dead' : '',
    ]">
    <div class="gun" :style="gunStyle">
      <svg class="gun-svg" viewBox="0 0 576 512"><title>Gun SVG Icon</title><path fill="currentColor" d="M528 56c0-13.3-10.7-24-24-24s-24 10.7-24 24v8H32C14.3 64 0 78.3 0 96v112c0 17.7 14.3 32 32 32h10c20.8 0 36.1 19.6 31 39.8L33 440.2c-2.4 9.6-.2 19.7 5.8 27.5S54.1 480 64 480h96c14.7 0 27.5-10 31-24.2L217 352h104.4c23.7 0 44.8-14.9 52.7-37.2l26.8-74.8H432c8.5 0 16.6-3.4 22.6-9.4l22.7-22.6H544c17.7 0 32-14.3  32-32V96c0-17.7-14.3-32-32-32h-8V56zM128 432H64v-48h64v48zm96 0h-64v-48h64v48zm144-128c0 8.8-7.2 16-16 16H240v-96h144c8.8 0 16 7.2 16 16v64z"/></svg>
    </div>
  <div class="indicator">
    <GameIndicatorHp :actor="actor" />
  </div>
    <div class="body"></div>
    <div class="head"></div>
    <div class="gun" :style="gunStyle">
      <svg class="gun-svg" viewBox="0 0 576 512"><title>Gun SVG Icon</title><path fill="currentColor" d="M528 56c0-13.3-10.7-24-24-24s-24 10.7-24 24v8H32C14.3 64 0 78.3 0 96v112c0 17.7 14.3 32 32 32h10c20.8 0 36.1 19.6 31 39.8L33 440.2c-2.4 9.6-.2 19.7 5.8 27.5S54.1 480 64 480h96c14.7 0 27.5-10 31-24.2L217 352h104.4c23.7 0 44.8-14.9 52.7-37.2l26.8-74.8H432c8.5 0 16.6-3.4 22.6-9.4l22.7-22.6H544c17.7 0 32-14.3  32-32V96c0-17.7-14.3-32-32-32h-8V56zM128 432H64v-48h64v48zm96 0h-64v-48h64v48zm144-128c0 8.8-7.2 16-16 16H240v-96h144c8.8 0 16 7.2 16 16v64z"/></svg>
    </div>
    <div class="legs">
      <div class="leg"></div>
      <div class="leg"></div>
    </div>
  </div>
</template>

<style scoped>
.indicator {
  position: absolute;
  top: -50px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
}

.gun {
  position: absolute;
  top: 0;
  right: -10px;
  z-index: 2;
  color: white;
}

.gun-svg {
  width: 15px;
  height: 15px;
  transform: translateY(-10px);
}

.character {
  position: absolute;
  top: 0;
  left: 0;
  width: 50px;
  height: 30px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  transition: all 0.3s ease;
  pointer-events: none;
}
  .body {
    width: 40%;
    height: 40%;
    background-color: currentColor;
    border-radius: 10%;
    margin-bottom: -10%;
    z-index: 1;
  }

  .head {
    transform: translateY(-140%);
    width: 60%;
    height: 80%;
    background-color: currentColor;
    border-radius: 10%;
    z-index: 2;
  }

  .legs {
    position: absolute;
    bottom: 40%;
    width: 60%;
    height: 20%;
    display: flex;
    justify-content: space-between;
    padding: 0 10%;
  }

  .leg {
    width: 40%;
    height: 100%;
    background-color: currentColor;
    border-radius: 10%;
  }

  .character.player {
    color: #4caf50; /* Green */
  }

  .character.enemy {
    color: #f44336; /* Red */
  }

  .character.dead {
    opacity: 0.5;
    filter: grayscale(100%);
  }
</style>