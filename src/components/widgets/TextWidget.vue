<template>
  <div class="widget text-widget" :style="widgetStyle">
    <div v-html="renderedHtml" class="text-content"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, toRefs, computed } from 'vue';
import { soapService } from '@/services/soap';

const props = defineProps<{
  media: any; // Media data for this widget
}>();

const { media } = toRefs(props);
const renderedHtml = ref('<p>Loading content...</p>');

// Create a computed style object to dynamically apply styles from the media data
const widgetStyle = computed(() => {
  const style: { backgroundColor?: string } = {};
  // The 'options' object in the media data can contain styling information
  const options = media.value?.options;
  if (options?.backgroundColor) {
    style.backgroundColor = options.backgroundColor;
  }

  // Add more style properties from the options as needed
  // For example: if (options.color) { style.color = options.color; }

  return style;
});

onMounted(async () => {
  // Widgets that render HTML need to fetch their content
  if (media.value && media.value['@_render'] === 'html' && media.value['@_id']) {
    try {
      renderedHtml.value = await soapService.getResource(media.value['@_id']);
    } catch (error) {
      console.error('Failed to get resource for TextWidget:', error);
      renderedHtml.value = '<p>Error loading content.</p>';
    }
  } else if (media.value && media.value.raw) {
    // Fallback to raw for simple text widgets
    renderedHtml.value = media.value.raw;
  } else {
    renderedHtml.value = '<p>No content available.</p>';
  }
});
</script>

<style scoped>
.text-widget {
  /* background-color is now handled by widgetStyle */
  color: white; /* Default text color, can be overridden by CMS */
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}
.text-content {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
/* Basic styling for content that might come from raw HTML */
.text-content :deep(p),
.text-content :deep(span),
.text-content :deep(div) {
  margin: 0;
  padding: 0;
  color: inherit; /* Inherit color from widget */
}
</style>
