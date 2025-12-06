<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { onMounted } from 'vue';
import { useSettingsStore } from '@/stores/settings';
import { soapService } from '@/services/soap';

const settingsStore = useSettingsStore();

// This is the main heartbeat function
const heartbeat = async () => {
  // For now, the hardware key is generated on each beat.
  // Ideally, it should be generated once and stored.
  const hardwareKey = soapService.generateHardwareKey();
  const displayName = 'Ionic Player'; // Or some other identifier

  try {
    console.log('Attempting to register display...');
    const result = await soapService.registerDisplay(displayName, hardwareKey);
    console.log('Display registered successfully:', result);
    console.log('Current settings:', settingsStore.$state);
  } catch (error) {
    console.error('Failed to register display:', error);
  }
};

onMounted(() => {
  // --- Temporary Hardcoded Settings for Development ---
  // In a real app, this would come from a settings page.
  // IMPORTANT: Replace with your actual CMS URL and Key.
  settingsStore.setSettings({
    cmsUrl: 'http://localhost:8100/api', // Example: 'http://your-cms.com'
    cmsKey: 'odv8sNGD', // Your CMS Server Key
    displayId: '', // This will be filled by the registration process
  });
  // ----------------------------------------------------

  // Initial heartbeat call
  heartbeat();

  // Set up the recurring heartbeat every 60 seconds
  setInterval(heartbeat, 60000);
});
</script>
