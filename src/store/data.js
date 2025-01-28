import { defineStore } from 'pinia';
import { getFans, getNumMaxSecrets, getSecrets, getMatchs } from '@/utils/utils.js';
import axios from '@/plugins/axios.js';

export const useDataStore = defineStore('data', {
  state: () => ({
    matchDone: false,
    matchs: [],
    fans: [],
    secrets: [],
    numMaxSecrets: 0,
  }),
  actions: {
    async loadData() {
      try{
        this.fans = await getFans();
        this.numMaxSecrets = await getNumMaxSecrets();
        this.secrets = await getSecrets();
        this.matchs = await getMatchs();
      } catch (error) {
        console.error(error)
      }
    },
    async loadSecrets() {
      try{
        this.secrets = await getSecrets();
      } catch (error) {
        console.error(error)
      }
    },
  },
});