<template>
  <div class="widget video-widget">
    <video v-if="videoSrc" :src="videoSrc" autoplay muted playsinline class="widget-video"></video>
    <p v-else>Loading Video...</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, toRefs } from 'vue';
import { dbService } from '@/services/db';

const props = defineProps<{
  media: any; // Media data for this widget
}>();

const { media } = toRefs(props);
const videoSrc = ref<string | null>(null);

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
  background-color: rgba(0, 0, 255, 0.5); /* Blue for video widgets */
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
  object-fit: cover; /* or 'contain' */
}
</style>
