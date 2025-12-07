<template>
  <div class="widget global-widget" :style="widgetStyle">
    <p>Global Widget</p>
    <p>Media ID: {{ media['@_id'] }}</p>
  </div>
</template>

<script setup lang="ts">
import { toRefs, computed } from 'vue';

const props = defineProps<{
  media: any; // Media data for this widget
}>();

const { media } = toRefs(props);

const widgetStyle = computed(() => {
  const style: { backgroundColor?: string } = {};
  const options = media.value?.options;
  if (options?.backgroundColor) {
    style.backgroundColor = options.backgroundColor;
  }
  return style;
});
</script>

<style scoped>
.global-widget {
  /* background-color is now handled by widgetStyle */
  color: white;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
