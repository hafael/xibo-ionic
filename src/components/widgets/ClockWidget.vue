<template>
  <div class="widget clock-widget" :style="widgetStyle">
    <span class="clock-text">{{ currentTime }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, toRefs, computed } from 'vue';

const props = defineProps<{
  media: any; // Media data for this widget
}>();

const { media } = toRefs(props);
const currentTime = ref('');
let intervalId: number | null = null;

const widgetStyle = computed(() => {
  const style: { 
    backgroundColor?: string;
    color?: string;
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
  } = {};
  const options = media.value?.options;

  if (options?.backgroundColor) {
    style.backgroundColor = options.backgroundColor;
  }
  if (options?.fontColor) {
    style.color = options.fontColor;
  }
  if (options?.fontSize) {
    // Assuming fontSize is a number that needs 'px' or is a valid string like '5rem'
    style.fontSize = !isNaN(parseFloat(options.fontSize)) ? `${options.fontSize}px` : options.fontSize;
  }
   if (options?.font) {
    style.fontFamily = options.font;
   }
   if (options?.fontWeight) {
    style.fontWeight = options.fontWeight;
   }

  return style;
});

const padZero = (num: number): string => num.toString().padStart(2, '0');

/**
 * Formats a date according to a format string.
 * Supports: YYYY, MM, DD, hh, mm, ss
 */
const formatDate = (date: Date, format: string): string => {
  const map: { [key: string]: string } = {
    YYYY: date.getFullYear().toString(),
    MM: padZero(date.getMonth() + 1),
    DD: padZero(date.getDate()),
    hh: padZero(date.getHours()),
    mm: padZero(date.getMinutes()),
    ss: padZero(date.getSeconds()),
  };

  return format.replace(/YYYY|MM|DD|hh|mm|ss/g, (matched) => map[matched]);
};

const updateTime = () => {
  const now = new Date();
  const dateFormat = media.value?.options?.dateFormat || 'hh:mm:ss';
  currentTime.value = formatDate(now, dateFormat);
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
  /* Styles are now mostly dynamic */
  color: white; /* Default color if not provided */
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Arial', sans-serif; /* Default font */
  font-size: 5rem; /* Default size */
  font-weight: bold; /* Default weight */
}
</style>
