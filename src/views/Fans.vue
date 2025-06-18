<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import { getFans } from '@/utils/utils.js';
import { useDataStore } from '@/store/data';
import { useTabsStore } from '@/store/tabs';
import NewFan from '@/views/components/fans/NewFan.vue';
import axios from '@/plugins/axios.js';
import Information from '@/views/components/Information.vue';

const router = useRouter();
const VUE_ASSETS_URL = process.env.VUE_APP_ASSETS_URL;
const APP_NAME = process.env.VUE_APP_NAME;

const fans = ref([]);
const tooltipVisible = ref(null);
const viewFanModal = ref(false);
const fanToView = ref();
const fansLoaded = ref(false);
const newFanViewed = ref(false);
const tabsStore = useTabsStore();
const dataStore = useDataStore();

const fanData = ref({
    name: '',
    type: '',
    hint: ''
})

onMounted(async () => {
  fans.value = dataStore.fans;
  if (fans.value.find(fan => fan.new === 1)){
    tabsStore.hiddenTabs();
    newFanViewed.value = true;
  }
  fansLoaded.value = true;
});

const hideNewFanModal = () => {
  tabsStore.showTabs();
  newFanViewed.value = false;
  try{
    axios.post('/fans/no-newfan')
      .then (async r => {
      }).catch(e => {
        console.error(e)
      })
  } catch (error) {
    console.error(error)
  }
}

const divRef = ref();
const modalHeight = ref(0);
const viewFan = (fan) => {
  fanToView.value = fan;
  if (fanToView.value != null) fanData.value = fanToView.value;
  else fanData.value = {name: '',type: '',hint: ''}

  viewFanModal.value = true;
}
const onModalDidPresent = () => {
  modalHeight.value = (divRef.value.getBoundingClientRect().height/1000) +.20;
}
</script>

<template>
  <ion-page class="ion-padding" v-if="!newFanViewed">
    <ion-header>
      <ion-toolbar>
        <div class="ion-text-center logo">
          <img :src="VUE_ASSETS_URL + 'logo.png'" :alt="APP_NAME" style="max-width: 200px;">
        </div>
      </ion-toolbar>
    </ion-header>
    <div class="fans-box page-scrollable">
      <div class="mt-10" v-if="fans.length > 0">
        <div class="d-flex ion-justify-content-between">
          <ion-text class="s26 title">{{ $t('fans.title') }}</ion-text>
          <div class="d-flex flex-column">
            <ion-text class="info-text" v-if="fans.length == 1"> {{ $t('fans.info') }}</ion-text>
            <ion-text class="info-text" v-if="fans.length > 1"> {{ $t('fans.info2', {count: fans.length}) }}</ion-text>
          </div>
        </div>
        <Information typeInfo="FANS" />
      </div>

      <div v-if="!fansLoaded" class="spinner-inline loading">
        <ion-spinner name="crescent" color="primary"></ion-spinner>
        <ion-text class="s12">{{ $t('fans.loading') }}</ion-text>
      </div>        
      <div class="ion-text-center ion-page-grid" style="margin-top: 15px;" v-else>
        <ion-grid class="grid" v-if="fans.length > 0">
          <ion-row class="grid-row">
            <ion-col
              size="6"
              class="fan-container pointer"
              v-for="(fan, index) in fans"
              :key="index"
               @click="viewFan(fan)"
            >
                <!-- <div class="icon-container">
                    <ion-icon icon="heart-circle-outline" class="corner-icon" v-if="fan.type == 'LOVE'"></ion-icon>
                    <ion-icon icon="flame-outline" class="corner-icon" v-if="fan.type == 'SEX'"></ion-icon>
                    <div
                    v-if="tooltipVisible === index"
                    class="tooltip"
                    >
                        <span v-if="fan.type == 'LOVE'">{{ $t('fans.type.love') }}</span>
                        <span v-if="fan.type == 'SEX'">{{ $t('fans.type.sex') }}</span>
                    </div>
                </div> -->
                <div class="grid-item">
                    <!-- <div class="icon-user">
                        <div class="question-icon">?</div>
                    </div> -->
                    <div class="d-flex ion-justify-content-between">
                      <div class="heart-container">
                        <font-awesome-icon :icon="['fas', 'heart']" style="font-size: 1.5rem; color: var(--ion-color-primary-shade)" />
                      </div>
                      <div class="d-flex ion-align-items-end ml-5">
                        <span class="unknown-text">?????</span>
                      </div>
                      <!-- <div class="d-flex">
                        <ion-text class="s12" style="text-align:right;">Ver</ion-text>
                        <ion-button fill="outline" class="button-small" @click.stop="viewFan(fan)" style="display:block;margin-top:15px;">
                          {{ $t('fans.viewhint') }}
                        </ion-button>
                      </div> -->
                    </div>

                </div>
            </ion-col>
          </ion-row>
        </ion-grid>
        <div class="no-fans-content" v-else>
          <div class="no-fans-wrapper">
            <font-awesome-icon :icon="['fas', 'heart-circle-xmark']" class="icon-heart" />
            <ion-text class="text-fans-no-title ion-display-block mt-10">{{ $t('fans.no1') }}</ion-text>
            <ion-text class="text-fans-no-title ion-display-block mt-2">{{ $t('fans.no1.2') }}</ion-text>
            <ion-text class="text-fans-no-subtitle ion-display-block mt-8">{{ $t('fans.no2') }}</ion-text>
            <ion-text class="text-fans-no-subtitle ion-display-block mt-3">{{ $t('fans.no3') }}</ion-text>
          </div>
        </div>
      </div>
    </div>


    <ion-modal
      :is-open="viewFanModal"
      css-class="rbsheet"
      :initial-breakpoint="0.45"
      :breakpoints="[0, 0.45]"
      handle-behavior="cycle"
      @didDismiss="viewFanModal=false"
      @didPresent="onModalDidPresent"
    >
      <ion-content class="ion-padding modal-scrollable">
        <div ref="divRef" class="modal-container">
          <div class="top">
            <ion-icon @click="viewFanModal=false" icon="close-outline" style="font-size: 24px; color: var(--ion-color-primary);" />
          </div>

          <div class="middle">
            <div class="ion-text-center" style="margin-top: 0px;">
              <ion-text class="m19">{{ $t('fans.hint.title') }}</ion-text>
            </div>

            <div class="flex-grow" style="height:80%; align-content: center;">
              <div v-if="fanData.hint">
                <ion-text class="s16 mt-2 d-block">{{ $t('fans.field.hint') }}:</ion-text>
                <ion-text class="r15 d-block mt-2">{{ fanData.hint }}</ion-text>
              </div>
              <div class="flex-grow mt-4" v-else>
                <ion-text class="r16">{{ $t('fans.hint.no') }}</ion-text>
              </div>
            </div>
          </div>

          <div class="bottom">
            <ion-button expand="block" style="width:100%" @click="viewFanModal=false">{{ $t('ok') }}</ion-button>
          </div>
        </div>

      </ion-content>
    </ion-modal>
  </ion-page>
  <ion-page v-else>
    <ion-content class="new-fan-container">
      <NewFan @done="() => (hideNewFanModal())" />
    </ion-content>
  </ion-page>
</template>

<style scoped>
ion-toolbar { --background: var(--ion-color-primary);}
.ios ion-header ion-toolbar {padding-top: 30px !important;}
.ios ion-footer ion-toolbar .ios {padding-bottom: 30px !important;}
.ion-toolbar {display:flex;align-items: center;}

.modal-scrollable { overflow-y: auto; --overflow: auto;}
ion-modal .ion-page { height: 55% !important; --height: 55hv;}
.page-scrollable { overflow-y:auto; --overflow: auto;}
.ion-page-grid { height: 60vh; height: 60%;}
.page-scrollable::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.grid {
  border-collapse: collapse;
}
.grid-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.fan-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--ion-color-primary-back);
  border-radius: 17px;
  flex: 0 0 calc(50% - 8px) !important;
  max-width: calc(50% - 8px) !important;
  height: 4.5rem;
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
.selected-fan-type {background-color: var(--ion-color-primary);}
    .selected-fan-type ion-text {color:#fff;}
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
    background-color: var(--ion-color-primary-back);
}
.pointer {cursor:pointer;}
.heart-container {
  width: 45px;
  height: 45px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.title {
  font-size: 22px;
  font-weight: bold;
  color: var(--ion-color-primary-contrast);
}
.info-text {
  font-size: 0.8rem;
  color: var(--ion-color-primary-shade);
  margin-top: 10px;
}
.unknown-text {
  font-size: 0.9rem;
  color: var(--ion-color-primary);
  font-weight: bold;

}
.modal-container {
  display: flex;
  flex-direction: column;
  height: 45%;
}

.modal-container .top {
  flex-shrink: 0;
  align-items: flex-end;
  display: flex;
  justify-content: flex-end;
}

.modal-container .middle {
  flex-grow: 1;
  overflow-y: auto;
  padding: 10px 0;
}

.modal-container .bottom {
  flex-shrink: 0;
  margin-bottom: 20px;
}
.no-fans-content {
  --background: var(--ion-color-primary-back);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 75vh;
}

.no-fans-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 75%;
}
.no-fans-wrapper ion-text {
  color: var(--ion-color-text-white);
}
.text-fans-no-title {
  font-size: 2.2rem;
  line-height: 100%;;
  font-weight: bold;
}
.text-fans-no-subtitle {
  font-size: 1.1rem;
  font-weight: lighter;
}
.icon-heart {
  font-size: 12rem; color: var(--ion-color-primary-tint2)
}

@media (max-height: 700px) {
  .icon-heart {
    font-size: 7rem;
  }
  .text-fans-no-subtitle {
    font-size: 0.9rem;
  }
  .text-fans-no-title {
    font-size: 1.5rem;
  }
}

</style>