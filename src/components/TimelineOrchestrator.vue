<template>
  <div class="timeline-orchestrator">
    <!-- Render the currently active widget in the timeline -->
    <!-- The :key is crucial to ensure Vue creates a new component when the media changes -->
    <component
      v-if="currentMedia"
      :is="widgetComponent"
      :media="currentMedia"
      :key="currentMedia['@_id']"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, toRefs, watch, onUnmounted, defineAsyncComponent } from 'vue';

// --- Widget Imports and Map (same as in Region.vue) ---
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
// ---------------------------------------------------------

// --- Props ---
const props = defineProps<{
  mediaItems: any[]; // The array of media items for this timeline
}>();

const { mediaItems } = toRefs(props);

// --- Timeline Logic ---
const currentIndex = ref(0);
let timeoutId: number | null = null;

const currentMedia = computed(() => {
  if (!mediaItems.value || mediaItems.value.length === 0) {
    return null;
  }
  return mediaItems.value[currentIndex.value];
});

const widgetComponent = computed(() => {
  const mediaType = currentMedia.value?.['@_type'];
  return mediaType ? widgetComponentsMap[mediaType] : null;
});

const scheduleNext = () => {
  // Clear any existing timer
  if (timeoutId) {
    clearTimeout(timeoutId);
  }

  if (!currentMedia.value) return;

  // Get duration in milliseconds (default to 5s if not specified)
  const duration = (parseInt(currentMedia.value['@_duration'], 10) || 5) * 1000;

  timeoutId = window.setTimeout(() => {
    // Move to the next item, or loop back to the start
    currentIndex.value = (currentIndex.value + 1) % mediaItems.value.length;
  }, duration);
};

// Watch for changes in the current media item to schedule the next transition
watch(currentMedia, () => {
  scheduleNext();
}, { immediate: true }); // immediate: true runs the watcher when the component mounts

// Clean up the timer when the component is unmounted
onUnmounted(() => {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
});
</script>

<style scoped>
.timeline-orchestrator {
  width: 100%;
  height: 100%;
}
</style>
