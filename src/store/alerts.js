import { ref } from 'vue';
import { defineStore } from "pinia";

export const useAlerts = defineStore("alert", {
  state: () => {
    return {
        alert: ref({
            visible: false,
            message: '',
            class: ''
        }),
    };
  }
});
