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
    <div class="ion-text-center logo">
      <img :src="VUE_ASSETS_URL + 'logo.png'" :alt="APP_NAME" style="max-width: 180px;">
    </div>
    <div class="box">
      <div class="ion-text-center">
        <ion-text class="s26">{{ $t('fans.title') }}</ion-text>
        <Information typeInfo="FANS" />
      </div>
      <div v-if="!fansLoaded" class="spinner-inline loading">
        <ion-spinner name="crescent" color="primary"></ion-spinner>
        <ion-text class="s12">{{ $t('fans.loading') }}</ion-text>
      </div>        
      <div class="ion-text-center" style="margin-top: 15px;" v-else>
        <ion-grid class="grid" v-if="fans.length > 0">
          <ion-row>
            <ion-col
              size="6"
              class="flag-container pointer"
              v-for="(fan, index) in fans"
              :key="index"
               @click="viewFan(fan)"
            >
                <div class="icon-container">
                    <ion-icon icon="heart-circle-outline" class="corner-icon" v-if="fan.type == 'LOVE'"></ion-icon>
                    <ion-icon icon="flame-outline" class="corner-icon" v-if="fan.type == 'SEX'"></ion-icon>
                    <!-- <div
                    v-if="tooltipVisible === index"
                    class="tooltip"
                    >
                        <span v-if="fan.type == 'LOVE'">{{ $t('fans.type.love') }}</span>
                        <span v-if="fan.type == 'SEX'">{{ $t('fans.type.sex') }}</span>
                    </div> -->
                </div>
                <div class="grid-item">
                    <div class="icon-user">
                        <div class="question-icon">?</div>
                    </div>
                    <ion-button fill="outline" class="button-small" @click.stop="viewFan(fan)" style="display:block;margin-top:15px;">
                      {{ $t('fans.viewhint') }}
                    </ion-button>
                </div>
            </ion-col>
          </ion-row>
        </ion-grid>
        <div v-else class="ion-text-center">
          <ion-icon slot="icon-only" icon="sad-outline" class="ion-align-self-center ion-display-block icon-nothing"></ion-icon>
          <ion-text class="s16 ion-display-block">{{ $t('fans.no') }}</ion-text>
        </div>
      </div>
    </div>


    <ion-modal
      :is-open="viewFanModal"
      css-class="rbsheet"
      :initial-breakpoint="0.55"
      :breakpoints="[0, 0.55]"
      handle-behavior="cycle"
      @didDismiss="viewFanModal=false"
      @didPresent="onModalDidPresent"
    >
      <ion-content class="ion-padding">
        <div ref="divRef">
          <div class="column" style="align-items: flex-end;">
            <ion-icon @click="viewFanModal=false" icon="close-outline" style="font-size: 24px; color: var(--ion-color-primary);" />
          </div>

          <div class="ion-text-center" style="margin-top: 0px;">
            <ion-text class="m19">{{ $t('fans.hint.title') }}</ion-text>
          </div>

          <div class="flex-grow">
            <div class="mt-8 d-flex">
              <ion-text class="s16 mt-2 mr-2">{{ $t('fans.field.type') }}</ion-text>
              <div class="chip selected-fan-type" v-if="fanData.type === 'SEX'">
                <ion-text class="m12">{{ $t('fans.sex') }}</ion-text>
              </div>
              <div class="chip selected-fan-type" v-if="fanData.type === 'LOVE'">
                <ion-text class="m12">{{ $t('fans.love') }}</ion-text>
              </div>
            </div>
            <div class="mt-8">
              <ion-text class="s16 mt-2 d-block">{{ $t('fans.field.hint') }}:</ion-text>
              <ion-text class="r16 d-block mt-2">{{ fanData.hint }}</ion-text>
            </div>
          </div>

          <div class="mt-8 mb-3 d-flex"> 
            <ion-button expand="block" style="width:100%" @click="viewFanModal=false">{{ $t('ok') }}</ion-button>
          </div>
        </div>
      </ion-content>
    </ion-modal>
  </ion-page>
  <ion-page v-else>
    <ion-content class="ion-padding new-fan-container">
      <NewFan @done="() => (hideNewFanModal())" />
    </ion-content>
  </ion-page>
</template>

<style scoped>
.new-fan-container {--background: var(--ion-color-bg)}
ion-modal.auto-height {
    --height: auto;
}
ion-modal.auto-height .ion-page {
    position: relative;
    display: block;
    contain: content;
}
ion-modal.auto-height .ion-page .inner-content {
    max-height: 80vh;
    overflow: auto;
}

ion-content {
  display: block;
  max-height: 100%;
  overflow-y: auto !important;
}
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
}
.pointer {cursor:pointer;}

</style>