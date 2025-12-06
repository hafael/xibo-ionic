import { defineStore } from 'pinia';

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    cmsUrl: '',
    cmsKey: '',
    displayId: '',
  }),
  actions: {
    setSettings(payload: { cmsUrl: string; cmsKey: string; displayId: string }) {
      this.cmsUrl = payload.cmsUrl;
      this.cmsKey = payload.cmsKey;
      this.displayId = payload.displayId;
    },
  },
});
