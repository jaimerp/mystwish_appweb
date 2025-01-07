<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted, toRaw, nextTick } from 'vue';
import { getNumMaxSecrets, getSecrets } from '@/utils/utils.js';
import { useI18n } from 'vue-i18n';
import { loadPhoneInput } from '@/utils/register.js';
import axios from '@/plugins/axios.js';
import { useAlerts } from '@/store/alerts.js'

const { t } = useI18n();
const router = useRouter();
const VUE_ASSETS_URL = process.env.VUE_APP_ASSETS_URL;
const APP_NAME = process.env.VUE_APP_NAME;
const { locale } = useI18n();

const numMaxSecrets = ref(null);
const restNumSecrets = ref(null);
const secrets = ref([]);
const tooltipVisible = ref(null);
const loading = ref(true);
const viewSecretModal = ref(false);
const secretToView = ref();
const phoneInput = ref();
const updating = ref(false);
const confirmVisible = ref(false);
const withHint = ref(false);
const withMessage = ref(false);

const secretData = ref({
    name: '',
    prefix: '',
    phone: '',
    type: '',
    hint: '',
    message: '',
    notify: false,
})
// Cargar datos al montar la página
onMounted(async () => {
    numMaxSecrets.value = await getNumMaxSecrets();
    await loadSecrets();
    loading.value = false;
});

const loadSecrets = async () => {
    secrets.value = await getSecrets();
    restNumSecrets.value = numMaxSecrets.value - (Array.isArray(toRaw(secrets.value)) ? toRaw(secrets.value).length : 0);
}

// Alternar el tooltip al hacer clic
const toggleTooltip = (index) => {
  tooltipVisible.value = tooltipVisible.value === index ? null : index;
};

const getInitials = (fullName) => {
  if (!fullName) return "?";
  const parts = fullName.split(" ");
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  } else {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
};

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
      secretData.value = {name: '',prefix: '',phone: '',type: '',hint: ''}
      withHint.value = false;
      withMessage.value = false;
    }
    viewSecretModal.value = true;
}
const onModalDidPresent = async() => {
    await nextTick();
    const input = document.querySelector("#phone");
    phoneInput.value = await loadPhoneInput(locale, input, secretToView.value != null);
}

const updateSecret = () => {
  updating.value = true;
  if (!withHint.value) secretData.value.hint = '';
  if (!withMessage.value) secretData.value.message = '';
  
  secretData.value.prefix = phoneInput.value.getSelectedCountryData().dialCode;

  axios.post('/secrets/secret', secretData.value)
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
    <div class="ion-text-center logo">
      <img :src="VUE_ASSETS_URL + 'logo.png'" :alt="APP_NAME" style="max-width: 140px; height: auto;">
    </div>
    <div class="box">
      <div class="ion-text-center">
        <ion-text class="s26">{{ $t('secrets.title') }}</ion-text>
      </div>
      <div class="ion-text-center" style="margin-top: 15px;">
        <div v-if="loading" class="spinner-inline loading">
          <ion-spinner name="crescent" color="primary"></ion-spinner>
          <ion-text class="s12">{{ $t('secrets.loading') }}</ion-text>
        </div>        
        <ion-grid class="grid" v-else>
            <ion-text class="s14">{{ $t('secrets.added') }}</ion-text>
            <ion-row>
                <ion-col
                size="6"
                class="secret-container"
                v-for="(secret, index) in secrets"
                :key="index"
                @click="editSecret(secret)"
                >
                    <!-- Ícono con tooltip -->
                    <div class="icon-container" @click.stop="toggleTooltip(index)">
                        <ion-icon icon="heart-circle-outline" class="corner-icon" v-if="secret.type == 'LOVE'"></ion-icon>
                        <ion-icon icon="flame-outline" class="corner-icon" v-if="secret.type == 'SEX'"></ion-icon>
                        <!-- <div
                        v-if="tooltipVisible === index"
                        class="tooltip"
                        >
                            <span v-if="secret.type == 'LOVE'">{{ $t('secrets.type.love') }}</span>
                            <span v-if="secret.type == 'SEX'">{{ $t('secrets.type.sex') }}</span>
                        </div> -->
                    </div>
                    <div class="grid-item">
                        <div class="icon-user">
                            <div class="question-icon">{{ getInitials(secret.name) }}</div>
                            <ion-text class="s12">{{ secret.name }}</ion-text>
                            <ion-text class="r12">{{ secret.phone }}</ion-text>
                            
                            <ion-button fill="outline" class="button-small">
                                <ion-icon slot="icon-only" icon="create-outline" class="button-small"></ion-icon>
                            </ion-button>
                        </div>
                    </div>
                </ion-col>
            </ion-row>
            <ion-text class="s14" style="display:block;margin-top:10px;">{{ $t('secrets.free') }}</ion-text>
            <ion-row>
                <ion-col
                size="6"
                class="secret-container"
                v-for="index in restNumSecrets"
                :key="index"
                @click="editSecret(null)"
                >
                    <div class="grid-item">
                        <div class="icon-user">
                            <div class="question-icon">+</div>
                        </div>
                    </div>
                </ion-col>
          </ion-row>
        </ion-grid>
      </div>
    </div>

    <ion-modal
        :is-open="viewSecretModal"
        css-class="rbsheet"
        :initial-breakpoint="0.85"
        :breakpoints="[0, 0.85]"
        handle-behavior="cycle"
        @didDismiss="viewSecretModal=false"
        @didPresent="onModalDidPresent"
    >
        <ion-content class="ion-padding modal-content">
          <ion-loading class="custom-loading" :message="$t('saving')" spinner="circles" :is-open="updating" ></ion-loading>

          <div class="column" style="align-items: flex-end;">
              <ion-icon @click="viewSecretModal=false" icon="close-outline" style="font-size: 24px; color: var(--ion-color-primary);" />
          </div>

          <div class="ion-text-center" style="margin-top: 5px;padding-bottom:20px;">
              <ion-text class="m19">{{ secretToView == null ? $t('secrets.title.new') : $t('secrets.title.edit') }}</ion-text>
          </div>

          <div class="scrollable-content">
            <div class="input" style="margin-top: 0px;padding-bottom:13px;"> 
              <ion-input style="flex:1;" v-model="secretData.name"
                :label="$t('secrets.field.name')"
                label-placement="floating"
              />
            </div>
            <div class="input" style="margin-top: 25px;"> 
                <input id="phone" type="tel" autocomplete="off" :placeholder="$t('secrets.field.phone')"  v-model="secretData.phone" />
            </div>
            <ion-text class="r13" style="color:red;margin-top:10px;display:block;line-height: 16px !important;" v-if="secretToView!=null">{{ $t('secrets.field.phone.update.hint') }}</ion-text>
            <div style="margin-top: 25px;">
                <ion-text class="s16" style="display:block;margin-bottom:10px">{{ $t('secrets.field.type') }}</ion-text>
                <div class="scroll list">
                    <div class="chip" :class="{ 'selected-secret-type': secretData.type === 'SEX' }" @click="secretData.type='SEX'">
                    <ion-text class="m12">{{ $t('secret.sex') }}</ion-text>
                    </div>
                    <div class="chip" :class="{ 'selected-secret-type': secretData.type === 'LOVE' }" @click="secretData.type='LOVE'">
                        <ion-text class="m12">{{ $t('secret.love') }}</ion-text>
                    </div>
                </div>
            </div>
            <div style="margin-top: 25px;">
                <ion-text class="s16" style="display:block;margin-bottom:10px">{{ $t('secrets.field.notify.title') }}</ion-text>
                <div class="scroll list" style="margin-top:10px;">
                    <div class="chip" :class="{ 'selected-secret-type': secretData.notify }" @click="secretData.notify=true">
                    <ion-text class="m12">{{ $t('secrets.field.notify.yes') }}</ion-text>
                    </div>
                    <div class="chip" :class="{ 'selected-secret-type': !secretData.notify }" @click="secretData.notify=false">
                        <ion-text class="m12">{{ $t('secrets.field.notify.no') }}</ion-text>
                    </div>
                </div>
                <ion-text class="r12" style="margin-top:10px;display:block;line-height: 16px !important;">{{ $t('secrets.field.notify.hint') }}</ion-text>
            </div>

            <div style="margin-top: 25px;" v-if="secretData.notify">
                <ion-text class="s16" style="display:block;margin-bottom:10px">{{ $t('secrets.field.hint.title') }}</ion-text>
                <div class="scroll list" style="margin-top:10px;">
                    <div class="chip" :class="{ 'selected-secret-type': withHint }" @click="withHint=true">
                    <ion-text class="m12">{{ $t('secrets.field.hint.yes') }}</ion-text>
                    </div>
                    <div class="chip" :class="{ 'selected-secret-type': !withHint }" @click="withHint=false">
                        <ion-text class="m12">{{ $t('secrets.field.hint.no') }}</ion-text>
                    </div>
                </div>
                <ion-text class="r12" style="margin-top:10px;display:block;line-height: 16px !important;" v-if="!withHint">{{ $t('secrets.field.hint.hint') }}</ion-text>
            </div>
            <div class="input" style="margin-top: 25px;padding-top:0px;height:100px;" v-if="withHint && secretData.notify"> 
                <ion-textarea v-model="secretData.hint"
                :counter="true"
                maxlength="200"
                :label="$t('secrets.field.hint')"
                label-placement="floating"
                />
            </div>

            <div style="margin-top: 25px;">
                <ion-text class="s16" style="display:block;margin-bottom:10px">{{ $t('secrets.field.message.title') }}</ion-text>
                <div class="scroll list" style="margin-top:10px;">
                    <div class="chip" :class="{ 'selected-secret-type': withMessage }" @click="withMessage=true">
                    <ion-text class="m12">{{ $t('secrets.field.message.yes') }}</ion-text>
                    </div>
                    <div class="chip" :class="{ 'selected-secret-type': !withMessage }" @click="withMessage=false">
                        <ion-text class="m12">{{ $t('secrets.field.message.no') }}</ion-text>
                    </div>
                </div>
                <ion-text class="r12" style="margin-top:10px;display:block;line-height: 16px !important;" v-if="!withMessage">{{ $t('secrets.field.message.hint') }}</ion-text>
            </div>
            <div class="input" style="margin-top: 25px;padding-top:0px;height:100px;" v-if="withMessage"> 
                <ion-textarea v-model="secretData.message"
                :counter="true"
                maxlength="200"
                :label="$t('secrets.field.message')"
                label-placement="floating"
                />
            </div>

            <div style="margin-top: 35px;display:flex;"> 
                <ion-button shape="round" class="button-secondary button-delete" style="margin-right:10px" @click="confirmVisible=!confirmVisible" v-if="secretToView != null">
                  <ion-icon slot="icon-only" icon="trash-outline" style="margin:10px;"></ion-icon>
                </ion-button>
                <ion-button expand="block" style="width:100%" @click="updateSecret">{{ secretToView == null ? $t('secret.button.new') : $t('secret.button.update') }}</ion-button>
            </div>
          </div>
        </ion-content>
    </ion-modal>

    <ion-alert
      :is-open="confirmVisible"
      :header="$t('secrets.confirm.delete.header')"
      :buttons="confirmButtons"
    ></ion-alert>    
  </ion-page>
</template>

<style>
.modal-content {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.scrollable-content {
    flex: 1;
    overflow-y: auto;
    max-height: calc(100vh - 275px);
    padding: 10px;
}

.grid {
  border-collapse: collapse;
}

.secret-container {
  border: 1px solid #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
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

#phone {color: var(--ion-color-primary) !important; border: none !important; background: transparent;outline: none; font-weight: normal;}
.iti__selected-dial-code {font-size: 16px;}
.selected-secret-type {background-color: var(--ion-color-primary);}
    .selected-secret-type ion-text {color:#fff;}
    .chip ion-text{font-size: 14px;;}
    .chip {margin-right: 5px;}


    button.alert-button {
    color: #fff !important;
  }
</style>