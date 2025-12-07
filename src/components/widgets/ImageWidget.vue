<template>
  <div class="widget image-widget">
    <img v-if="imageSrc" :src="imageSrc" alt="Xibo Image" class="widget-image" />
    <p v-else>Loading Image...</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, toRefs } from 'vue';
import { dbService } from '@/services/db';

const props = defineProps<{
  media: any; // Media data for this widget
}>();

const { media } = toRefs(props);
const imageSrc = ref<string | null>(null);

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
  background-color: rgba(255, 0, 0, 0.5); /* Red for image widgets */
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
  max-width: 100%;
  max-height: 100%;
  object-fit: contain; /* or 'cover' depending on desired behavior */
}
</style>
