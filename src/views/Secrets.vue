<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted, toRaw, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAlerts } from '@/store/alerts.js'
import { getInitials } from '@/utils/utils.js';
import Information from '@/views/components/Information.vue';
import { useDataStore } from '@/store/data';
import Phone from '@/views/components/Phone.vue'
import axios from '@/plugins/axios.js';

const { t } = useI18n();
const VUE_ASSETS_URL = process.env.VUE_APP_ASSETS_URL;
const APP_NAME = process.env.VUE_APP_NAME;
const { locale } = useI18n();
const dataStore = useDataStore();

const restNumSecrets = ref(null);
const secrets = ref(dataStore.secrets);
const viewSecretModal = ref(false);
const secretToView = ref();
const updating = ref(false);
const confirmVisible = ref(false);
const withHint = ref(false);
const withMessage = ref(false);
const isNative = window.Capacitor?.isNativePlatform?.() ?? false;

const secretData = ref({
    name: '',
    prefix: '',
    phone: '',
    type: 'sex',
    hint: '',
    message: '',
    notify: true,
})
const errors = ref([]);

onMounted(() => {
  loadSecrets();
});

const loadSecrets = async () => {
    await dataStore.loadSecrets();
    secrets.value = dataStore.secrets;
    restNumSecrets.value = dataStore.numMaxSecrets - (Array.isArray(toRaw(secrets.value)) ? toRaw(secrets.value).length : 0);
}

const editSecret = async(secret) => {
    secretToView.value = secret;
    if (secretToView.value != null) {
      secretData.value = secretToView.value;
      if (!secretData.value.hint) withHint.value = false;
      else withHint.value = true;
      if (!secretData.value.message) withMessage.value = false;
      else withMessage.value = true;
    }
    else {
      secretData.value = {name: '',prefix: '',phone: '',type: 'SEX',hint: '', notify: true}
      withHint.value = false;
      withMessage.value = false;
    }
    viewSecretModal.value = true;
}

const updateSecret = () => {
  updating.value = true;
  if (!withHint.value) secretData.value.hint = '';
  if (!withMessage.value) secretData.value.message = '';
  
  axios.post('/secrets/secret', secretData.value)
    .then (async r => {
      if (r.status == 200) {
        if (r.data.match){
          window.location = "/app/secrets";
        }else{
          useAlerts().alert = {visible: true, message: r.data.message, class: 'alert-success'}
        }
        await loadSecrets();
        viewSecretModal.value = false;
      }else{
        useAlerts().alert = {visible: true, message: r.data.message, class: 'alert-error'}
      }
      updating.value = false;
    }).catch(e => {
      errors.value = [];
      if (e.response?.data?.errors){
        const { errors: formErrors } = e.response.data
        errors.value = Object.keys(formErrors).reduce((acc, key) => {
          acc[key] = formErrors[key][0]; // Tomar solo el primer mensaje del array
          return acc;
        }, {});
        useAlerts().alert = {visible: true, message: 'msg.form.error', class: 'alert-error'}
      }else{
        useAlerts().alert = {visible: true, message: e.response.data.message, class: 'alert-error'}
      }
      updating.value = false;
    })
}

const deleteSecret = () => {
  updating.value = true;

  axios.delete('/secrets/secret', {params: {id: secretData.value?.id}})
    .then (async r => {
      if (r.status == 200) {
        useAlerts().alert = {visible: true, message: r.data.message, class: 'alert-success'}
        await loadSecrets();
        viewSecretModal.value = false;
      }else{
        useAlerts().alert = {visible: true, message: r.data.message, class: 'alert-error'}
      }
      updating.value = false;
    }).catch(e => {
      useAlerts().alert = {visible: true, message: e.response.data.message, class: 'alert-error'}
      updating.value = false;
    })
} 

const confirmButtons = [
  {
    text: t('cancel'),
    role: 'cancel',
    handler: () => {
      confirmVisible.value = false;
    },
  },
  {
    text: t('ok'),
    role: 'confirm',
    handler: () => {
      confirmVisible.value = false;
      deleteSecret();
    },
  },
];

</script>

<template>
  <ion-page class="ion-padding">
    <ion-header id="header">
        <ion-toolbar :class="{'toolbar-native': isNative}">
          <div class="ion-text-center logo">
            <img :src="VUE_ASSETS_URL + 'logo.png'" :alt="APP_NAME" style="max-width: 200px;">
          </div>
        </ion-toolbar>
      </ion-header>
    <div class="secrets-box page-scrollable">
      <div class="mt-10">
        <div class="d-flex ion-justify-content-between">
          <ion-text class="s26 title">{{ $t('secrets.title') }}</ion-text>
          <div class="d-flex flex-column">
            <ion-text class="info-text">{{ secrets.length }} {{ $t('secrets.info') }}</ion-text>
            <ion-text class="info-text2">{{ restNumSecrets }} {{ $t('secrets.info2') }}</ion-text>          
          </div>
        </div>
        <Information typeInfo="SECRETS" />
      </div>
      <div class="ion-text-center mt-4 ion-page-grid">
        <ion-grid class="grid">
          <ion-row class="grid-row">
            <ion-col
              class="secret-container pointer"
              v-for="(secret, index) in secrets"
              :key="'secret-' + index"
              @click="editSecret(secret)"
            >
              <!-- <div class="icon-container">
                <ion-icon icon="heart-circle-outline" class="corner-icon" v-if="secret.type == 'LOVE'"></ion-icon>
                <ion-icon icon="flame-outline" class="corner-icon" v-if="secret.type == 'SEX'"></ion-icon>
              </div> -->
              <div class="grid-item">
                <div class="icon-user d-flex flex-row">
                  <!-- <div class="question-icon">{{ getInitials(secret.name) }}</div> -->
                  <div class="key-container">
                    <font-awesome-icon :icon="['fas', 'key']" style="font-size: 1.5rem; color: var(--ion-color-primary-shade)" />
                  </div>
                   <div class="d-flex flex-column">
                    <ion-text class="s12">{{ secret.name.slice(0, 7) }} {{ secret.name.length > 7 ? '...' : '' }}</ion-text>
                    <ion-text class="r12">{{ secret.phone }}</ion-text>
                  </div>
                </div>
              </div>
            </ion-col>

            <ion-col
              class="secret-container pointer"
              v-for="index in restNumSecrets"
              :key="'empty-' + index"
              @click="editSecret(null)"
              style="background-color: #2e3233 !important;"
            >
              <div class="grid-item">
                <div class="icon-user">
                  <font-awesome-icon :icon="['fas', 'plus']" style="font-size: 1.5rem; color: var(--ion-color-primary-shade)" />
                </div>
              </div>
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>
    </div>

    <ion-modal
        :is-open="viewSecretModal"
        css-class="rbsheet safe-modal"
        @didDismiss="viewSecretModal=false"
    >
        <ion-content class="ion-padding modal-scrollable">
          <ion-loading class="custom-loading" :message="$t('saving')" spinner="circles" :is-open="updating" ></ion-loading>
          <div class="safe-area-top<"></div>
          <div class="column ion-align-items-end">
              <ion-icon @click="viewSecretModal=false" icon="close-outline" style="font-size: 24px; color: var(--ion-color-primary);" />
          </div>

          <div class="ion-text-center mt-1 pb-5">
              <ion-text class="m19">{{ secretToView == null ? $t('secrets.title.new') : $t('secrets.title.edit') }}</ion-text>
          </div>
          <div class="input mt-0 pb-3"> 
            <ion-input style="flex:1;" v-model="secretData.name"
              :label="$t('secrets.field.name')"
              label-placement="floating"
            />
          </div>
          <ion-text class="r12 mt-2 d-block" style="line-height: 16px !important;">{{ $t('secrets.field.name.hint') }}</ion-text>
          <ion-text class="r12 error ml-2" v-if="errors?.name">{{ $t(errors.name) }}</ion-text>
          <div class="input mt-5"> 
            <Phone v-model:phone="secretData.phone" v-model:prefix="secretData.prefix" />
          </div>
          <ion-text class="r12 error ml-2" v-if="errors?.phone">{{ $t(errors.phone) }}</ion-text>
          <ion-text class="r13 mt-2 d-block" style="color:red;line-height: 16px !important;" v-if="secretToView!=null">{{ $t('secrets.field.phone.update.hint') }}</ion-text>
          <!-- <div class="mt-6">
              <div class="scroll list">
                  <div class="chip pointer" :class="{ 'selected-secret-type': secretData.type === 'SEX' }" @click="secretData.type='SEX'">
                  <ion-text class="m12">{{ $t('secret.sex') }}</ion-text>
                  </div>
                  <div class="chip pointer" :class="{ 'selected-secret-type': secretData.type === 'LOVE' }" @click="secretData.type='LOVE'">
                      <ion-text class="m12">{{ $t('secret.love') }}</ion-text>
                  </div>
              </div>
              <ion-text class="r12 error ml-2" v-if="errors?.type">{{ $t(errors.type) }}</ion-text>
            </div> -->
          <!-- <div class="mt-10">
              <ion-text class="s16 d-block mb-2">{{ $t('secrets.field.notify.title') }}</ion-text>
              <div class="scroll list mt-2">
                  <div class="chip pointer" :class="{ 'selected-secret-type': secretData.notify }" @click="secretData.notify=true">
                  <ion-text class="m12">{{ $t('secrets.field.notify.yes') }}</ion-text>
                  </div>
                  <div class="chip pointer" :class="{ 'selected-secret-type': !secretData.notify }" @click="secretData.notify=false">
                      <ion-text class="m12">{{ $t('secrets.field.notify.no') }}</ion-text>
                  </div>
              </div>
              <ion-text class="r12 mt-2 d-block" style="line-height: 16px !important;">{{ $t('secrets.field.notify.hint') }}</ion-text>
          </div> -->

          <div class="mt-6" v-if="secretData.notify">
              <ion-text class="s16 d-block mb-2">{{ $t('secrets.field.hint.title') }}</ion-text>
              <div class="scroll list mt-2">
                  <div class="chip pointer" :class="{ 'selected-secret-type': withHint }" @click="withHint=true">
                  <ion-text class="m12">{{ $t('secrets.field.hint.yes') }}</ion-text>
                  </div>
                  <div class="chip pointer" :class="{ 'selected-secret-type': !withHint }" @click="withHint=false">
                      <ion-text class="m12">{{ $t('secrets.field.hint.no') }}</ion-text>
                  </div>
              </div>
              <ion-text class="r12 mt-2 d-block" style="line-height: 16px !important;" v-if="!withHint">{{ $t('secrets.field.hint.hint') }}</ion-text>
          </div>
          <div class="input mt-4 pt-0" style="height:115px;padding-bottom: 10px;padding-top: 10px;" v-if="withHint && secretData.notify"> 
              <ion-textarea v-model="secretData.hint"
                :counter="true"
                maxlength="200"
                :label="$t('secrets.field.hint')"
                label-placement="floating"
                style=" font-size: 0.8rem !important;"
              />
          </div>

          <div class="mt-6">
              <ion-text class="s16 d-block mb-2">{{ $t('secrets.field.message.title') }}</ion-text>
              <div class="scroll list mt-2">
                  <div class="chip pointer" :class="{ 'selected-secret-type': withMessage }" @click="withMessage=true">
                  <ion-text class="m12">{{ $t('secrets.field.message.yes') }}</ion-text>
                  </div>
                  <div class="chip pointer" :class="{ 'selected-secret-type': !withMessage }" @click="withMessage=false">
                      <ion-text class="m12">{{ $t('secrets.field.message.no') }}</ion-text>
                  </div>
              </div>
              <ion-text class="r12 mt-2 d-block" style="line-height: 16px !important;" v-if="!withMessage">{{ $t('secrets.field.message.hint') }}</ion-text>
          </div>
          <div class="input mt-4 pt-0" style="height:115px;padding-bottom: 10px;padding-top: 10px;" v-if="withMessage"> 
              <ion-textarea v-model="secretData.message"
                :counter="true"
                maxlength="200"
                :label="$t('secrets.field.message')"
                label-placement="floating"
                style=" font-size: 0.8rem !important;"
              />
          </div>

          <div class="mt-10 d-flex pb-4"> 
              <ion-button shape="round" class="button-previous button-secondary mr-2" @click="viewSecretModal=false" style="padding-bottom:2px !important;">
                <ion-icon slot="icon-only" icon="arrow-back" style="margin:25px;width: 75px;"/>
              </ion-button>
              <ion-button shape="round" class="button-secondary button-delete mr-2" @click="confirmVisible=!confirmVisible" v-if="secretToView != null">
                <ion-icon slot="icon-only" icon="trash-outline" class="m-2" style="width:1.8rem;"></ion-icon>
              </ion-button>
              <ion-button expand="block" style="width:100%" @click="updateSecret">{{ secretToView == null ? $t('secret.button.new') : $t('secret.button.update') }}</ion-button>
          </div>
        </ion-content>
    </ion-modal>

    <ion-alert
      :is-open="confirmVisible"
      :header="$t('secrets.confirm.delete.header')"
      :buttons="confirmButtons"
      css-class="custom-alert"
    ></ion-alert>    
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
.safe-modal {
  --offset-top: env(safe-area-inset-top);
  margin-top: var(--offset-top);
}

.safe-area-top {
  height: env(safe-area-inset-top);
  width: 100%;
}
.modal-scrollable { overflow-y:auto; --overflow: auto;}
.modal-scrollable::-webkit-scrollbar {
  width: 0;
  height: 0;
}

ion-modal .ion-page { height: 100vh; height: 100%;}

.page-scrollable { overflow-y:auto; --overflow: auto;}
.ion-page-grid { height: 100vh; height: 100%;}

.page-scrollable::-webkit-scrollbar {
  width: 0;
  height: 0;
}


.grid {
  border-collapse: collapse;
}
.error { color: red;}
.grid-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.secret-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--ion-color-primary-back, #eeeeed);
  border-radius: 17px;
  flex: 0 0 calc(50% - 8px);
  max-width: calc(50% - 8px);
  height: 4.5rem;
}
.grid-item {
  position: relative;
  text-align: center;
  padding: 10px;
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
  flex-direction: column;
  gap: 5px;
  justify-content: center;
  align-items: center;
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

.loading{
    align-items: center;
    justify-items: center;
    display: flex;
    flex-direction: column;
}

.button-small {
    min-height: 1rem;
    height: 30px;
}
.selected-secret-type {background-color: var(--ion-color-primary);}
  .selected-secret-type ion-text {color:#fff;}
  .chip ion-text{font-size: 14px;;}
  .chip {margin-right: 5px;}

  button.alert-button {
  color: #fff !important;
}


.custom-alert .alert-button {
  --color: white;
}
ion-alert::part(button) {
  color: white !important;
}
.pointer {cursor:pointer;}


.title {
  font-size: 22px;
  font-weight: bold;
  color: var(--ion-color-primary-contrast);
}
.info-text {
  font-size: 0.8rem;
  color: var(--ion-color-primary-shade, #848484);
  margin-top: 2px;
}
.info-text2 {
  font-size: 0.65rem;
  color: var(--ion-color-primary-shade, #848484);
  margin-top: 0px;
  text-align: right;
}

.key-container {
  width: 45px;
  height: 45px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>