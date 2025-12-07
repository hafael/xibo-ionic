import { defineStore } from 'pinia';

// Define a basic structure for the layout data
// We can expand this with more detailed types later
export interface LayoutData {
  [key: string]: any;
}

interface LayoutState {
  currentLayout: LayoutData | null;
}

export const useLayoutStore = defineStore('layout', {
  state: (): LayoutState => ({
    currentLayout: null,
  }),

  actions: {
    /**
     * Sets the current layout data.
     * @param layout - The parsed layout object from the XLF file.
     */
    setLayout(layout: LayoutData) {
      this.currentLayout = layout;
    },

    /**
     * Clears the current layout.
     */
    clearLayout() {
      this.currentLayout = null;
    },
  },
});
