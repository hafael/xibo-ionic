<template>
  <div class="widget image-widget" :style="widgetStyle">
    <img v-if="imageSrc" :src="imageSrc" alt="Xibo Image" class="widget-image" :style="imageStyle" />
    <p v-else>Loading Image...</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, toRefs, computed } from 'vue';
import { dbService } from '@/services/db';

const props = defineProps<{
  media: any; // Media data for this widget
}>();

const { media } = toRefs(props);
const imageSrc = ref<string | null>(null);

const widgetStyle = computed(() => {
  const style: { backgroundColor?: string } = {};
  const options = media.value?.options;
  if (options?.backgroundColor) {
    style.backgroundColor = options.backgroundColor;
  }
  return style;
});

const imageStyle = computed(() => {
  const style: { objectFit?: 'contain' | 'cover' | 'fill' | 'none' } = {};
  const scaleType = media.value?.options?.scaleType?.toLowerCase();

  switch (scaleType) {
    case 'stretch':
      style.objectFit = 'fill'; // Stretches to fill the container, ignoring aspect ratio
      break;
    case 'fill':
      style.objectFit = 'cover'; // Fills the container, preserving aspect ratio (cropping if necessary)
      break;
    case 'center':
    case 'region':
    default:
      style.objectFit = 'contain'; // Fits inside the container, preserving aspect ratio
      break;
  }

  return style;
});

onMounted(async () => {
  if (media.value && media.value.options && media.value.options.uri) {
    const filename = media.value.options.uri;
    try {
      const imageBlob = await dbService.getFile(filename);
      if (imageBlob) {
        imageSrc.value = URL.createObjectURL(imageBlob);
      } else {
        console.warn(`Image file ${filename} not found in IndexedDB.`);
        imageSrc.value = null; // Indicate loading failure
      }
    } catch (error) {
      console.error(`Error loading image ${filename} from IndexedDB:`, error);
      imageSrc.value = null; // Indicate loading failure
    }
  } else {
    console.warn('ImageWidget: Media URI not found in props.');
  }
});
</script>

<style scoped>
.image-widget {
  /* background-color is now handled by widgetStyle */
  color: white;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden; /* Ensure image doesn't overflow */
}
.widget-image {
  width: 100%; /* Take full width of the container for object-fit to work correctly */
  height: 100%; /* Take full height of the container */
  /* object-fit is now handled by imageStyle */
}
</style>
