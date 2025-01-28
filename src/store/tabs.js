import { defineStore } from 'pinia';

export const useTabsStore = defineStore('tabs', {
  state: () => ({
    hideTabs: false,
  }),
  actions: {
    showTabs() {
      this.hideTabs = false;
    },
    hiddenTabs() {
      this.hideTabs = true;
    },
  },
});