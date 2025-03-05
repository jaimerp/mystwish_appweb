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
        <ion-toolbar>
          <div class="ion-text-center logo">
            <img :src="VUE_ASSETS_URL + 'logo.png'" :alt="APP_NAME" style="max-width: 200px;">
          </div>
        </ion-toolbar>
      </ion-header>
    <div class="box">
      <div class="ion-text-center">
        <ion-text class="s26">{{ $t('matchs.page.title') }}</ion-text>
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
        </ion-grid>
        <div v-else class="ion-text-center">
          <ion-icon slot="icon-only" icon="sad-outline" class="ion-align-self-center ion-display-block icon-nothing"></ion-icon>
          <ion-text class="s16 ion-display-block">{{ $t('matchs.page.no') }}</ion-text>
        </div>
      </div>
    </div>


    <ion-modal
      :is-open="viewMatchModal"
      css-class="rbsheet"
      :initial-breakpoint="0.50"
      :breakpoints="[0, 0.50]"
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
            <div class="mt-8 d-flex">
              <div class="chip selected-match-type" v-if="matchData.type === 'SEX'">
                <ion-text class="m12">{{ $t('matchs.page.sex') }}</ion-text>
              </div>
              <div class="chip selected-match-type" v-if="matchData.type === 'LOVE'">
                <ion-text class="m12">{{ $t('matchs.page.love') }}</ion-text>
              </div>
            </div>
            <div class="mt-4">
              <ion-text class="s16 mt-2 d-block">{{ $t('matchs.page.data.title') }}:</ion-text>
              <ion-text class="r16 d-block">{{ matchData.name }}</ion-text>
              <ion-text class="r16 d-block">{{ matchData.phone }}</ion-text>
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

          <div class="mt-8 mb-3 d-flex"> 
            <ion-button expand="block" style="width:100%" @click="viewMatchModal=false">{{ $t('ok') }}</ion-button>
          </div>
        </div>
      </ion-content>
    </ion-modal>
  </ion-page>
</template>

<style scoped>
ion-toolbar { --background: var(--ion-color-primary);}
.ios ion-header ion-toolbar {padding-top: 30px !important;}
.ios ion-footer ion-toolbar .ios {padding-bottom: 30px !important;}
.ion-toolbar {display:flex;align-items: center;}


.modal-scrollable { overflow-y: auto; --overflow: auto;}
ion-modal .ion-page { height: 50% !important;}

.grid {
  border-collapse: collapse;
}

.flag-container {
  border: 1px solid #ccc; /* Bordes de las celdas */
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

.icon-container {
  position: absolute;
  top: 2px;
  right: 2px;
  z-index: 10;
  cursor: pointer;
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

</style>