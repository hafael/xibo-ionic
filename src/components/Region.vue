<template>
  <div class="region" :style="regionStyle">
    <!-- If the media is a timeline (array), delegate to the orchestrator -->
    <TimelineOrchestrator v-if="isTimeline" :media-items="region.media" />
    
    <!-- Otherwise, render the single media item -->
    <template v-else-if="region.media">
      <component :is="widgetComponent" :media="region.media" />
    </template>

    <!-- If there is no media at all -->
    <div v-else class="placeholder-content">
      <p>Region {{ region['@_id'] }} (No Media)</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, toRefs, defineAsyncComponent } from 'vue';
import TimelineOrchestrator from './TimelineOrchestrator.vue';

// --- Widget Imports and Map ---
const ImageWidget = defineAsyncComponent(() => import('@/components/widgets/ImageWidget.vue'));
const VideoWidget = defineAsyncComponent(() => import('@/components/widgets/VideoWidget.vue'));
const TextWidget = defineAsyncComponent(() => import('@/components/widgets/TextWidget.vue'));
const ClockWidget = defineAsyncComponent(() => import('@/components/widgets/ClockWidget.vue'));
const GlobalWidget = defineAsyncComponent(() => import('@/components/widgets/GlobalWidget.vue'));

const widgetComponentsMap: { [key: string]: any } = {
  'image': ImageWidget,
  'video': VideoWidget,
  'text': TextWidget,
  'clock-digital': ClockWidget,
  'global': GlobalWidget,
};
// -----------------------------

// --- Props ---
const props = defineProps<{
  region: any;
}>();

const { region } = toRefs(props);

// --- Computed Properties ---
const isTimeline = computed(() => Array.isArray(region.value.media));

// Computed property to select the widget for a SINGLE media item
const widgetComponent = computed(() => {
  if (isTimeline.value || !region.value.media) {
    return null; // Handled by TimelineOrchestrator or the v-else block
  }
  const mediaType = region.value.media['@_type'];
  return mediaType ? widgetComponentsMap[mediaType] : null;
});

// Compute the style for the region container
const regionStyle = computed(() => {
  if (!region.value) {
    return {};
  }
  return {
    width: `${region.value['@_width']}px`,
    height: `${region.value['@_height']}px`,
    top: `${region.value['@_top']}px`,
    left: `${region.value['@_left']}px`,
    zIndex: region.value['@_zindex'] || 1, // Default z-index if not provided
    position: 'absolute',
  };
});
</script>

<style scoped>
.region {
  border: 2px dashed rgba(255, 255, 255, 0.5);
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
}
.placeholder-content {
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.2);
}
</style>
