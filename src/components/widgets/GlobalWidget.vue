<template>
  <div class="widget global-widget">
    <p>Global Widget</p>
    <p>Media ID: {{ media['@_id'] }}</p>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue';

const props = defineProps<{
  media: any; // Media data for this widget
}>();

const { media } = toRefs(props);
</script>

<style scoped>
.global-widget {
  background-color: rgba(128, 0, 128, 0.5); /* Purple for global widgets */
  color: white;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
