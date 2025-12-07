<template>
  <div class="layout-scaler" :style="scalerStyle">
    <div v-if="layout" class="layout" :style="layoutStyle">
      <Region 
        v-for="region in layout.region" 
        :key="region['@_id']" 
        :region="region" 
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue';
import type { LayoutData } from '@/stores/layout';
import Region from './Region.vue';

// Define props
const props = defineProps<{
  layout: LayoutData | null;
  windowWidth: number;
  windowHeight: number;
}>();

const { layout, windowWidth, windowHeight } = toRefs(props);

// Compute the style for the inner layout container (base dimensions)
const layoutStyle = computed(() => {
  if (!layout.value) {
    return {};
  }
  return {
    width: `${layout.value['@_width']}px`,
    height: `${layout.value['@_height']}px`,
    backgroundColor: layout.value['@_bgcolor'],
    position: 'relative',
  };
});

// Compute the style for the outer scaling container
const scalerStyle = computed(() => {
  if (!layout.value || !windowWidth.value || !windowHeight.value) {
    return {};
  }

  const layoutWidth = layout.value['@_width'];
  const layoutHeight = layout.value['@_height'];

  // Calculate the scale ratio, maintaining aspect ratio
  const scaleRatio = Math.min(
    windowWidth.value / layoutWidth,
    windowHeight.value / layoutHeight
  );

  return {
    transform: `scale(${scaleRatio})`,
    transformOrigin: 'top left', // Or 'center center' depending on centering strategy
    // We apply width/height here as well so the scaler has dimensions before transform
    width: `${layoutWidth}px`,
    height: `${layoutHeight}px`,
  };
});
</script>

<style scoped>
.layout-scaler {
  /* This container will be scaled down */
}
.layout {
  border: 1px solid white; /* For visualization */
  overflow: hidden; /* Re-enabling this now that scaling should work */
}
</style>
