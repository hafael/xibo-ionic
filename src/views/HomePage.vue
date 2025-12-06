<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Xibo Player Test</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div id="container">
        <strong>SOAP Service Test</strong>
        <p>Click the button to attempt to register this display with the CMS.</p>
        <ion-button @click="handleRegister">Register Display</ion-button>
        <pre>{{ result }}</pre>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton
} from '@ionic/vue';
import { useSettingsStore } from '@/stores/settings';
import { soapService } from '@/services/soap';

const settingsStore = useSettingsStore();
const result = ref('');

onMounted(() => {
  // --- Temporary Settings for Testing ---
  // In a real app, this would come from a settings page.
  // The CMS Key is found in the Xibo CMS under Administration -> Settings -> General.
  settingsStore.setSettings({
    cmsUrl: 'http://localhost/api', // As per documentation
    cmsKey: 'odv8sNGD', // As per documentation - CHANGE THIS
    displayId: '',
  });
  // ----------------------------------------
});

async function handleRegister() {
  try {
    result.value = 'Registering...';
    // For a real player, the hardware key should be generated once and stored.
    const hardwareKey = soapService.generateHardwareKey();
    const response = await soapService.registerDisplay('Ionic Player Test', hardwareKey);
    result.value = `SUCCESS!\n\nHardware Key: ${hardwareKey}\n\nResponse:\n${response}`;
  } catch (error: any) {
    result.value = `ERROR:\n${error.message}\n\nCheck console for more details.`;
    console.error(error);
  }
}
</script>

<style scoped>
#container {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  padding: 16px;
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  color: #8c8c8c;
  margin: 12px 0;
}

#container a {
  text-decoration: none;
}

pre {
  background-color: #f4f4f4;
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
