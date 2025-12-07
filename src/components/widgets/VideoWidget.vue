<template>
  <div class="widget video-widget" :style="widgetStyle">
    <video
      v-if="videoSrc"
      :src="videoSrc"
      :muted="isMuted"
      :loop="shouldLoop"
      autoplay
      playsinline
      class="widget-video"
      :style="videoStyle"
    ></video>
    <p v-else>Loading Video...</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, toRefs, computed } from 'vue';
import { dbService } from '@/services/db';

const props = defineProps<{
  media: any; // Media data for this widget
}>();

const { media } = toRefs(props);
const videoSrc = ref<string | null>(null);

const widgetStyle = computed(() => {
  const style: { backgroundColor?: string } = {};
  const options = media.value?.options;
  if (options?.backgroundColor) {
    style.backgroundColor = options.backgroundColor;
  }
  return style;
});

const videoStyle = computed(() => {
  const style: { objectFit?: 'contain' | 'cover' | 'fill' | 'none' } = {};
  const scaleType = media.value?.options?.scaleType?.toLowerCase();

  switch (scaleType) {
    case 'stretch':
      style.objectFit = 'fill';
      break;
    case 'fill':
      style.objectFit = 'cover';
      break;
    case 'center':
    case 'region':
    default:
      style.objectFit = 'contain';
      break;
  }
  return style;
});

// CMS often uses 1 or 0 for boolean values. Default to muted.
const isMuted = computed(() => {
  const muteOption = media.value?.options?.mute;
  return muteOption === '1' || muteOption === 1 || muteOption === true;
});

const shouldLoop = computed(() => {
    const loopOption = media.value?.options?.loop;
    return loopOption === '1' || loopOption === 1 || loopOption === true;
});

onMounted(async () => {
  if (media.value && media.value.options && media.value.options.uri) {
    const filename = media.value.options.uri;
    try {
      const videoBlob = await dbService.getFile(filename);
      if (videoBlob) {
        videoSrc.value = URL.createObjectURL(videoBlob);
      } else {
        console.warn(`Video file ${filename} not found in IndexedDB.`);
        videoSrc.value = null; // Indicate loading failure
      }
    } catch (error) {
      console.error(`Error loading video ${filename} from IndexedDB:`, error);
      videoSrc.value = null; // Indicate loading failure
    }
  } else {
    console.warn('VideoWidget: Media URI not found in props.');
  }
});
</script>

<style scoped>
.video-widget {
  /* background-color is now handled by widgetStyle */
  color: white;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
.widget-video {
  width: 100%;
  height: 100%;
  /* object-fit is now handled by videoStyle */
}
</style>
