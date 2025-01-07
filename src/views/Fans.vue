<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import { getFans } from '@/utils/utils.js';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const VUE_ASSETS_URL = process.env.VUE_APP_ASSETS_URL;
const APP_NAME = process.env.VUE_APP_NAME;

const fans = ref([]);
const tooltipVisible = ref(null);
const viewFanModal = ref(false);
const fanToView = ref();

const fanData = ref({
    name: '',
    type: '',
    hint: ''
})

// Cargar datos al montar la página
onMounted(async () => {
  fans.value = await getFans();
});

// Alternar el tooltip al hacer clic
const toggleTooltip = (index) => {
  tooltipVisible.value = tooltipVisible.value === index ? null : index;
};

const viewFan = (fan) => {
  fanToView.value = fan;
  if (fanToView.value != null) fanData.value = fanToView.value;
  else fanData.value = {name: '',type: '',hint: ''}

  viewFanModal.value = true;
}
const onModalDidPresent = () => {
  
}
</script>

<template>
  <ion-page class="ion-padding">
    <div class="ion-text-center logo">
      <img :src="VUE_ASSETS_URL + 'logo.png'" :alt="APP_NAME" style="max-width: 140px; height: auto;">
    </div>
    <div class="box">
      <div class="ion-text-center">
        <ion-text class="s26">{{ $t('fans.title') }}</ion-text>
      </div>
      <div class="ion-text-center" style="margin-top: 15px;">
        <ion-grid class="grid" v-if="fans.length > 0">
          <ion-row>
            <ion-col
              size="6"
              class="flag-container"
              v-for="(fan, index) in fans"
              :key="index"
               @click="viewFan(fan)"
            >
                <!-- Ícono con tooltip -->
                <div class="icon-container" @click.stop="toggleTooltip(index)">
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
        <div v-else>
          <ion-text class="s16">{{ $t('fans.no') }}</ion-text>
        </div>
      </div>
    </div>


    <ion-modal
        :is-open="viewFanModal"
        css-class="rbsheet"
        :initial-breakpoint="0.4"
        :breakpoints="[0, 0.4]"
        handle-behavior="cycle"
        @didDismiss="viewFanModal=false"
        @didPresent="onModalDidPresent"
    >
        <ion-content class="ion-padding">
        <div class="column" style="align-items: flex-end;">
            <ion-icon @click="viewFanModal=false" icon="close-outline" style="font-size: 24px; color: var(--ion-color-primary);" />
        </div>

        <div class="ion-text-center" style="margin-top: 0px;">
            <ion-text class="m19">{{ $t('fans.hint.title') }}</ion-text>
        </div>

        <div style="margin-top: 30px;display:flex">
            <ion-text class="s16" style="margin-top:9px;margin-right:6px;">{{ $t('fans.field.type') }}</ion-text>
              <div class="chip selected-fan-type" v-if="fanData.type === 'SEX'">
                <ion-icon icon="flame-outline" class="icon-type" />
                <ion-text class="m12">{{ $t('fans.sex') }}</ion-text>
              </div>
              <div class="chip selected-fan-type" v-if="fanData.type === 'LOVE'">
                <ion-icon icon="heart-circle-outline" class="icon-type" />
                <ion-text class="m12">{{ $t('fans.love') }}</ion-text>
              </div>
        </div>
        <div style="margin-top: 15px;">
            <ion-text class="s16" style="margin-top:9px;margin-right:6px;">{{ $t('fans.field.hint') }}:</ion-text>
            <ion-text class="r16" style="display:block;margin-top:9px;">{{ fanData.hint }}</ion-text>
        </div>
        <div style="margin-top: 35px;display:flex;"> 
            <ion-button expand="block" style="width:100%" @click="viewFanModal=false">{{ $t('ok') }}</ion-button>
        </div>
      </ion-content>
    </ion-modal>
</ion-page>
</template>

<style scoped>
/* Estilo para el grid con líneas */
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
</style>