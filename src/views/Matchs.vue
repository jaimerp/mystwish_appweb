<script setup>
import { ref, onMounted } from 'vue';
import { useDataStore } from '@/store/data';
import { getInitials } from '@/utils/utils.js';
import Information from '@/views/components/Information.vue';

const VUE_ASSETS_URL = process.env.VUE_APP_ASSETS_URL;
const APP_NAME = process.env.VUE_APP_NAME;

const dataStore = useDataStore();
const matchs = ref(dataStore.matchs);
const matchsLoaded = ref(true);
const matchToView = ref(null);
const viewMatchModal = ref(false);
const isNative = window.Capacitor?.isNativePlatform?.() ?? false;

const matchData = ref({
    name: '',
    type: '',
    phone: '',
    hint: '',
    message: ''
})

const viewMatch = (fan) => {
  matchToView.value = fan;
  if (matchToView.value != null) matchData.value = matchToView.value;
  else matchData.value = {name: '',type: '',hint: ''}

  viewMatchModal.value = true;
}

onMounted(async () => {
  matchs.value = dataStore.matchs;
  matchsLoaded.value = true;
});

</script>

<template>
  <ion-page class="ion-padding">
    <ion-header>
        <ion-toolbar :class="{'toolbar-native': isNative}">
          <div class="ion-text-center logo">
            <img :src="VUE_ASSETS_URL + 'logo.png'" :alt="APP_NAME" style="max-width: 200px;">
          </div>
        </ion-toolbar>
      </ion-header>
      <div class="match-box">
      <div class="mt-10" v-if="matchs.length > 0">
        <div class="d-flex ion-justify-content-between">
          <ion-text class="s26 title">{{ $t('matchs.page.title') }}</ion-text>
          <div class="d-flex flex-column">
            <ion-text class="info-text" v-if="matchs.length == 1"> {{ $t('matchs.info') }}</ion-text>
            <ion-text class="info-text" v-if="matchs.length > 1"> {{ $t('matchs.info2', {count: matchs.length}) }}</ion-text>
          </div>
        </div>
        <Information typeInfo="MATCHS" />
      </div>

      <div v-if="!matchsLoaded" class="spinner-inline loading">
        <ion-spinner name="crescent" color="primary"></ion-spinner>
        <ion-text class="s12">{{ $t('matchs.page.loading') }}</ion-text>
      </div>        
      <div class="ion-text-center" style="margin-top: 15px;" v-else>
        <ion-grid class="grid" v-if="matchs.length > 0">
          <ion-row>
            <ion-col
              size="6"
              class="match-container pointer"
              v-for="(match, index) in matchs"
              :key="index"
              @click="viewMatch(match)"
            >
                <div class="grid-item">
                  <div class="d-flex flex-row">
                    <div class="icon-container">
                      <font-awesome-icon :icon="['fas', 'fire-flame-curved']" style="font-size: 1.7rem; color: white" />
                    </div>
                    <div class="d-flex flex-column ml-3" style="justify-content: flex-end">
                      <ion-text class="s12 d-block white">{{ match.name.slice(0, 7) }} {{ match.name.length > 7 ? '...' : '' }}</ion-text>
                      <ion-text class="r12 d-block white">{{ match.phone }}</ion-text>
                    </div>
                  </div>
                </div>
            </ion-col>
          </ion-row>
        </ion-grid>

      <!-- <div class="match-box">
        <div class="mt-10" v-if="matchs.length > 0">
          <div class="d-flex ion-justify-content-between">
            <ion-text class="s26 title">{{ $t('matchs.page.title') }}</ion-text>
            <div class="d-flex flex-column">
              <ion-text class="info-text" v-if="matchs.length == 1"> {{ $t('fans.info') }}</ion-text>
              <ion-text class="info-text" v-if="matchs.length > 1"> {{ $t('fans.info2', {count: fans.length}) }}</ion-text>
            </div>
          </div>
          <Information typeInfo="MATCHS" />
        </div>
        <div v-if="!fansLoaded" class="spinner-inline loading">
          <ion-spinner name="crescent" color="primary"></ion-spinner>
          <ion-text class="s12">{{ $t('matchs.page.loading') }}</ion-text>
        </div>        
      <div class="ion-text-center" style="margin-top: 15px;" v-else>
        <ion-grid class="grid" v-if="matchs.length > 0">
          <ion-row>
            <ion-col
              size="6"
              class="flag-container pointer"
              v-for="(match, index) in matchs"
              :key="index"
               @click="viewMatch(match)"
            >
                <div class="icon-container">
                    <ion-icon icon="heart-circle-outline" class="corner-icon" v-if="match.type == 'LOVE'"></ion-icon>
                    <ion-icon icon="flame-outline" class="corner-icon" v-if="match.type == 'SEX'"></ion-icon>
                </div>
                <div class="grid-item">
                    <div class="icon-user">
                      <div class="question-icon">{{ getInitials(match.name) }}</div>
                    </div>
                    <ion-text class="s12 d-block">{{ match.name }}</ion-text>
                    <ion-text class="r12 d-block">{{ match.phone }}</ion-text>
                </div>
            </ion-col>
          </ion-row>
        </ion-grid> -->
        <div class="no-match-content" v-else>
          <div class="no-match-wrapper">
            <font-awesome-icon :icon="['fas', 'fa-fire-extinguisher']" class="icon-heart" />
            <ion-text class="text-match-no-title ion-display-block mt-10">{{ $t('match.no1') }}</ion-text>
            <ion-text class="text-match-no-title ion-display-block mt-2">{{ $t('match.no1.2') }}</ion-text>
            <ion-text class="text-match-no-subtitle ion-display-block mt-8">{{ $t('match.no2') }}</ion-text>
            <ion-text class="text-match-no-subtitle ion-display-block mt-3">{{ $t('match.no3') }}</ion-text>
          </div>
        </div>
      </div>
    </div>


    <ion-modal
      :is-open="viewMatchModal"
      css-class="rbsheet"
      :initial-breakpoint="0.55"
      :breakpoints="[0, 0.55]"
      handle-behavior="cycle"
      @didDismiss="viewMatchModal=false"
    >
      <ion-content class="ion-padding modal-scrollable">
        <div style="overflow-y: auto;  max-height: 60vh;">
          <div class="column" style="align-items: flex-end;">
            <ion-icon @click="viewMatchModal=false" icon="close-outline" style="font-size: 24px; color: var(--ion-color-primary);" />
          </div>

          <div class="ion-text-center" style="margin-top: 0px;">
            <ion-text class="m19">{{ $t('matchs.page.modal.title') }}</ion-text>
          </div>

          <div class="flex-grow">
            <!-- <div class="mt-8 d-flex">
              <div class="chip selected-match-type" v-if="matchData.type === 'SEX'">
                <ion-text class="m12">{{ $t('matchs.page.sex') }}</ion-text>
              </div>
              <div class="chip selected-match-type" v-if="matchData.type === 'LOVE'">
                <ion-text class="m12">{{ $t('matchs.page.love') }}</ion-text>
              </div>
            </div> -->
            <div class="mt-4">
              <ion-text class="s16 mt-2 d-block">{{ $t('matchs.page.data.title') }}:</ion-text>
              <ion-text class="r16 d-block">{{ matchData.name }}</ion-text>
              <ion-text class="r16 d-block">+{{ matchData.prefix }} {{ matchData.phone }}</ion-text>
            </div>
            <div class="mt-8">
              <ion-text class="s16 mt-2 d-block">{{ $t('matchs.page.field.hint') }}:</ion-text>
              <ion-text class="r16 d-block mt-2">{{ matchData.hint }}</ion-text>
            </div>
            <div class="mt-8" v-if="matchData.message != ''">
              <ion-text class="s16 mt-2 d-block">{{ $t('matchs.page.field.message') }}:</ion-text>
              <ion-text class="r16 d-block mt-2">{{ matchData.message }}</ion-text>
            </div>
          </div>

          <div class="mt-8 d-flex" style="margin-bottom:4rem"> 
            <ion-button expand="block" style="width:100%" @click="viewMatchModal=false">{{ $t('ok') }}</ion-button>
          </div>
        </div>
      </ion-content>
    </ion-modal>
  </ion-page>
</template>

<style scoped>
ion-toolbar { --background: var(--ion-color-primary);}
/* .ios ion-header ion-toolbar {padding-top: 30px !important;} */
.ios ion-footer ion-toolbar .ios {padding-bottom: 30px !important;}
.ion-toolbar {display:flex;align-items: center;}

.toolbar-native {
  padding-top: env(safe-area-inset-top, 30px) !important;
}

.modal-scrollable { overflow-y: auto; --overflow: auto;}

.grid {
  border-collapse: collapse;
}

.flag-container {
  border: 1px solid #ccc; /* Bordes de las celdas */
  display: flex;
  justify-content: center;
  align-items: center;
}
.icon-container{
  width: 45px;
  height: 45px;
  background-color: #97969b;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.grid-item {
  position: relative;
  text-align: center;
  padding: 10px;
}

.flag-image {
  display: block;
  margin: 0 auto;
}

.corner-icon {
  font-size: 30px;
  color: var(--ion-color-primary);
}

.tooltip {
  position: absolute;
  top: 30px;
  right: 0;
  background-color: #333;
  color: #fff;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 11;
}
.icon-user {
  display: flex;
  gap: 20px;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.question-icon {
  width: 100px;
  height: 100px;
  background-color: var(--ion-color-primary);
  color: white;
  border-radius: 50%;
  font-size: 50px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
}
.button-small {
    min-height: 1rem;
    height: 30px;
}
.selected-match-type {background-color: var(--ion-color-primary);}
    .selected-match-type ion-text {color:#fff;}
    .chip ion-text{font-size: 14px;;}
    .chip {margin-right: 5px;}

.icon-type {--color: #white; margin-right: 15px;;}

.icon-nothing {
  color:var(--ion-color-primary);
  width:100%;
  height: 175px;
}
.loading{
    align-items: center;
    justify-items: center;
    display: flex;
    flex-direction: column;
}
.pointer {cursor:pointer;}

.match-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--ion-color-primary-back2, #8b8a8f);
  border-radius: 17px;
  flex: 0 0 calc(50% - 8px);
  max-width: calc(50% - 8px);
  height: 4.5rem;
}

.no-match-content {
  --background: var(--ion-color-primary-back);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 75vh;
}

.no-match-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 75%;
}
.no-match-wrapper ion-text {
  color: var(--ion-color-text-white, #FFFFFF);
}
.text-match-no-title {
  font-size: 2.2rem;
  line-height: 100%;;
  font-weight: bold;
}
.text-match-no-subtitle {
  font-size: 1.1rem;
  font-weight: lighter;
}
.icon-heart {
  font-size: 12rem; color: var(--ion-color-primary-tint2, #2f3130);
}

@media (max-height: 700px) {
  .icon-heart {
    font-size: 7rem;
  }
  .text-match-no-subtitle {
    font-size: 0.9rem;
  }
  .text-match-no-title {
    font-size: 1.5rem;
  }
}
.title {
  font-size: 22px;
  font-weight: bold;
  color: var(--ion-color-primary-contrast);
}
.info-text {
  font-size: 0.8rem;
  color: var(--ion-color-primary-shade, #848484);
  margin-top: 10px;
}
.unknown-text {
  font-size: 0.9rem;
  color: var(--ion-color-primary);
  font-weight: bold;

}
.white {
  color: #fff !important;
}
</style>