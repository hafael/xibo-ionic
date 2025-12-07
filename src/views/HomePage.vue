<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div id="player-container">
        <LayoutRenderer 
          v-if="currentLayout" 
          :layout="currentLayout" 
          :window-width="windowWidth"
          :window-height="windowHeight"
        />
        <div v-else class="waiting-message">
          <p>Waiting for layout from CMS...</p>
          <p>(Ensure player is registered and authorized)</p>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { IonContent, IonPage } from '@ionic/vue';
import { storeToRefs } from 'pinia';
import { useLayoutStore } from '@/stores/layout';
import LayoutRenderer from '@/components/LayoutRenderer.vue';

// Get the layout data from the store
const layoutStore = useLayoutStore();
const { currentLayout } = storeToRefs(layoutStore);

// --- Window Size Detection ---
const windowWidth = ref(window.innerWidth);
const windowHeight = ref(window.innerHeight);

const handleResize = () => {
  windowWidth.value = window.innerWidth;
  windowHeight.value = window.innerHeight;
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
// ---------------------------
</script>
