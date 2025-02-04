<script setup>
import { ref, onMounted } from 'vue';
import { useTabsStore } from '@/store/tabs';
import { useDataStore } from '@/store/data';
import NewMatch from '@/views/components/secrets/NewMatch.vue';
import axios from '@/plugins/axios.js';

const VUE_ASSETS_URL = process.env.VUE_APP_ASSETS_URL;
const APP_NAME = process.env.VUE_APP_NAME;
const tabsStore = useTabsStore();
const dataStore = useDataStore();
const matchView = ref(false);
const loading = ref(true);

onMounted(async() => {
  await dataStore.loadData()

  if (dataStore.matchs?.find(match => match.new === true)){
    tabsStore.hiddenTabs();
    matchView.value = true;
  }
  loading.value = false;
});

const hideMatchModal = () => {
  tabsStore.showTabs();
  matchView.value = false;
  try{
    axios.post('/secrets/no-newmatch')
      .then (async r => {
        console.log(r)
      }).catch(e => {
        console.error(e)
      })
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <div>
    <ion-page class="ion-padding" v-if="!matchView && loading">
      <div class="ion-text-center logo">
        <img :src="VUE_ASSETS_URL + 'logo.png'" :alt="APP_NAME" style="max-width: 180px;">
      </div>
      <div class="box">
        <div class="spinner-inline loading">
          <ion-spinner name="crescent" color="primary"></ion-spinner>
          <ion-text class="s18 mt-3">{{ $t('loading') }}</ion-text>
        </div>
      </div>
    </ion-page>
    <ion-page v-if="!matchView && !loading">
      <ion-header><ion-toolbar></ion-toolbar></ion-header>
      <ion-content>
        <ion-tabs :class="{ 'hide-tabs': tabsStore.hideTabs }">
          <ion-router-outlet></ion-router-outlet>
          <ion-tab-bar slot="bottom">
            <ion-tab-button tab="fans" href="/app/fans">
                <ion-icon icon="heart-half-outline" size="10" />
                {{ $t('tabs.fans') }}
                <ion-badge v-if="dataStore.fans?.length > 0">{{ dataStore.fans?.length }}</ion-badge>
            </ion-tab-button>
            <ion-tab-button tab="secrets" href="/app/secrets">
                <ion-icon icon="heart-outline" size="10" />
                {{ $t('tabs.secrets') }}
                <ion-badge v-if="dataStore.secrets?.length > 0">{{ dataStore.secrets?.length }}</ion-badge>
            </ion-tab-button>
            <ion-tab-button tab="matchs" href="/app/matchs">
                <ion-icon icon="heart-half-outline" size="10" />
                {{ $t('tabs.matchs') }}
                <ion-badge v-if="dataStore.matchs?.length > 0">{{ dataStore.matchs?.length }}</ion-badge>
            </ion-tab-button>
            <ion-tab-button tab="account" href="/app/account">
                <ion-icon icon="person-circle-outline" size="10" />
                {{ $t('tabs.account') }}
            </ion-tab-button>
          </ion-tab-bar>
        </ion-tabs>
      </ion-content>
    </ion-page>
    <ion-page v-if="matchView && !loading">
      <ion-content class="ion-padding new-match-container">
        <NewMatch @done="() => (hideMatchModal())" />
      </ion-content>
    </ion-page>
  </div>
</template>

<style scoped>
.new-match-container {--background: var(--ion-color-bg)}
.ios ion-toolbar { --background: var(--ion-color-primary);}
.box {
  position: absolute;
  top: 40%;
  bottom: 45%;
  left: 10%;
  right: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.logo {
  display: flex;
  justify-content: center;
  align-items: start;
  height: 100%;
  margin-top: 30px;
}
.hide-tabs ion-tab-bar {
  display: none;
}

ion-tabs{
    background: #121212;
}

ion-tab-bar  {
    background: #121212;
    width: 98% !important;
    border-radius: 20px;
    margin: 5px 0px 5px 1% !important;
    max-height: 56px;
    height: 65px;
    max-height: 65px;
    border: unset;
}

.tab-selected ion-icon{
    color: #121212;
}

ion-tab-button {
    background: white;
    -webkit-box-shadow: 5px 5px 15px -15px  rgba(0,0,0,0.4);
    -moz-box-shadow: 5px 5px 15px -15px  rgba(0,0,0,0.4);
    box-shadow: 5px 5px 15px -15px  rgba(0,0,0,0.4);
    --border: none;
}

ion-tab-button:hover {
    ion-icon, ion-label {
        color: #121212 !important;
        --ion-color-base: #121212 !important;
    }
}

ion-badge {
    --background: #121212;
    --color: white;
    width: 23px;
    height: 21px;
    font-size: 0.8rem;
    margin-top: -8px;
    padding-top: 4px;
}

ion-tab-button > ion-icon:after {
    background: none repeat scroll 0 0 transparent;
    bottom: 0;
    content: "";
    display: block;
    height: 7px;
    position: absolute;
    transition: width 0.4s ease 0s, background-color .4s ease;
    width: 0;
    border-radius: 5px;
}

/* ion-tab-button.tab-selected > ion-icon:after {
    width: 24px;
    background: #121212;
} */

.loading{
    align-items: center;
    justify-items: center;
    display: flex;
    flex-direction: column;
}
</style>