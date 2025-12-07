<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { onMounted } from 'vue';
import { useSettingsStore } from '@/stores/settings';
import { useDownloadStore } from '@/stores/download';
import { useLayoutStore } from '@/stores/layout';
import { soapService } from '@/services/soap';
import { storageService } from '@/services/storage';

const settingsStore = useSettingsStore();
const downloadStore = useDownloadStore();
const layoutStore = useLayoutStore();

// This is the main heartbeat function
const heartbeat = async () => {
  const hardwareKey = soapService.generateHardwareKey();
  const displayName = 'Ionic Player';

  try {
    console.log('Attempting to register display...');
    const result = await soapService.registerDisplay(displayName, hardwareKey);
    console.log('Display registered successfully:', result);
    console.log('Current settings:', settingsStore.$state);

    // If registration is successful, get the list of required files
    if (result.code === 'READY') {
      try {
        console.log('Fetching required files...');
        const requiredFiles = await soapService.getRequiredFiles(hardwareKey);
        downloadStore.addFilesToQueue(requiredFiles);
        console.log('Download queue updated:', downloadStore.queue);
        
        // Start processing the queue and wait for its completion
        await downloadStore.processQueue();
        console.log('All files processed.');

        // After all files are processed, find and parse the layout file
        const layoutFile = downloadStore.completed.find(file => file['@_type'] === 'layout');
        if (layoutFile) {
          try {
            console.log(`Parsing layout file: ${layoutFile['@_saveAs']}`);
            const parsedLayout = await storageService.getParsedLayout(layoutFile['@_saveAs']);
            
            // Store the layout data
            if (parsedLayout.layout) {
              layoutStore.setLayout(parsedLayout.layout);
              console.log('Layout data stored successfully.', layoutStore.currentLayout);
            } else {
              throw new Error('Parsed layout does not contain a "layout" property.');
            }

          } catch (parseError) {
            console.error(`Failed to parse layout file ${layoutFile['@_saveAs']}:`, parseError);
          }
        } else {
          console.warn('No layout file found in completed downloads.');
        }

      } catch (fileError) {
        console.error('Failed to get required files or process queue:', fileError);
      }
    }else if(result.code === 'WAITING') {
      console.log('Display is in WAITING state. No further action taken.');
    }else if(result.code === 'ADDED' || result.code === 'SUCCESS') {
      console.log(`Display registration returned code: ${result.code}. No further action taken.`);
    }
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
    cmsKey: 'EisH62oF', // Your CMS Server Key
    displayId: '', // This will be filled by the registration process
  });
  // ----------------------------------------------------

  // Initial heartbeat call
  heartbeat();

  // Set up the recurring heartbeat every 60 seconds
  setInterval(heartbeat, 60000);
});
</script>
