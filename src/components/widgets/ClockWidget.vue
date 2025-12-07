<template>
  <div class="widget clock-widget">
    <span class="clock-text">{{ currentTime }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps<{
  media: any; // Media data for this widget
}>();

const currentTime = ref('');
let intervalId: number | null = null;

/**
 * Formats a number to be two digits, padding with a leading zero if needed.
 */
const padZero = (num: number): string => num.toString().padStart(2, '0');

/**
 * Updates the currentTime ref with the current formatted time.
 */
const updateTime = () => {
  const now = new Date();
  // TODO: Use date format from media.options if available
  const hours = padZero(now.getHours());
  const minutes = padZero(now.getMinutes());
  const seconds = padZero(now.getSeconds());
  currentTime.value = `${hours}:${minutes}:${seconds}`;
};

onMounted(() => {
  updateTime(); // Initial update
  intervalId = window.setInterval(updateTime, 1000); // Update every second
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});
</script>

<style scoped>
.clock-widget {
  background-color: transparent; /* Clock shouldn't have a background unless specified */
  color: white; /* Default text color, can be overridden by options */
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Arial', sans-serif;
  font-size: 5rem; /* A default large font size */
  font-weight: bold;
}
.clock-text {
  /* This could be styled further based on media.options */
}
</style>
