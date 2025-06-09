<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted, watch, nextTick, computed } from 'vue';
import { getLocalData, setLocalData } from '@/utils/localdata';
import { useI18n } from 'vue-i18n';
import axios from '@/plugins/axios.js';
import { useAlerts } from '@/store/alerts.js'
import Phone from '@/views/components/Phone.vue'
import phoneCode from '@/views/components/register/phoneCode.vue'
import { validateRecoverPass } from '@/utils/register';

const { locale } = useI18n();
const router = useRouter();
const loging = ref(false);
const emailPhoneError = ref('');
const passError = ref('');
const VUE_ASSETS_URL = process.env.VUE_APP_ASSETS_URL;
const APP_NAME = process.env.VUE_APP_NAME;
const lang = ref();

const phone = ref('');
const prefix = ref('');
const phoneCodeValue = ref('');
const password = ref('');
const confirmPass = ref('');
const step = ref(1);
const recovering = ref(false);

const sendingPhoneCode = ref(false);

onMounted(async () => {
  step.value = 1;
  lang.value = await getLocalData('lang')
});

const sendPhoneCode = () => {
  sendingPhoneCode.value = true;
  axios.post('/recoverpass/phone-step', {phone: phone.value, prefix: prefix.value, lang: lang.value})
    .then (async r => {
      sendingPhoneCode.value = false;
      await nextTick();
      if (r.status == 200) {
        step.value++;
      }
    }).catch(e => {
      sendingPhoneCode.value = false;
      useAlerts().alert = {visible: true, message: e.response?.data?.exception ? 'register.msg.error.general' : e.response?.data?.message, class: 'alert-error'}
      console.error(e)
    })
}

const sendNewPass = () => {
  let validation = validateRecoverPass(phoneCodeValue.value, password.value, confirmPass.value);
  if (validation.password === true && validation.confirmPass === true && validation.phoneCode === true){
    recoverPass();
  }else{
    useAlerts().alert = {visible: true, message: 'msg.form.error', class: 'alert-error'}
    if (!validation.password) passError.value = 'register.msg.error.form.pass';
    if (!validation.confirmPass) passError.value = 'register.msg.error.form.pass_confirm';
  }
}

const recoverPass = () => {
  passError.value = '';
  recovering.value = true;
  axios.post('/recoverpass/recover', {phone: phone.value, prefix: prefix.value, phoneCode: phoneCodeValue.value, password: password.value, confirmPass: confirmPass.value})
    .then (async r => {
      recovering.value = false;
      await nextTick();
      if (r.status == 200) {
        useAlerts().alert = {visible: true, message: 'recoverpass.success', class: 'alert-success'};
        router.push('/auth/login');
      } else {
        useAlerts().alert = {visible: true, message: r.data.message, class: 'alert-error'};
      }
    }).catch(e => {
      recovering.value = false;
      useAlerts().alert = {visible: true, message: e.response?.data?.message ? e.response?.data?.message : 'register.msg.error.general', class: 'alert-error'};
      console.error(e);
    })
}


</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar class="safe-header">
        <div class="ion-text-center logo">
          <img :src="VUE_ASSETS_URL + 'logo2.png'" :alt="APP_NAME" style="max-width: 200px;">
        </div>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding" v-bind="$attrs" style="--background: var(--ion-color-bg)">
      <div class="vertical-center">
        <div class="ion-text-center">
          <ion-text class="s26">{{ $t('recoverpass.title') }}</ion-text>
        </div>

        <div v-if="step==1" class="d-flex flex-column justify-content-center">
          <ion-text class="r16 mt-6">{{ $t('recoverpass.subtitle1') }}</ion-text>
          <div class="input" style="margin-top: 35px;"> 
            <Phone v-model:phone="phone"  v-model:prefix="prefix" />
            <ion-loading class="custom-loading" :message="$t('register.phone.sending')" spinner="circles" :is-open="sendingPhoneCode" ></ion-loading>
          </div>
        </div>

        <div v-if="step==2" class="d-flex flex-column justify-content-center">
          <div style="margin-top: 25px;">
            <ion-text class="r14 mb-3 d-block">{{ $t('recoverpass.phonecode') }}</ion-text>
            <phoneCode @updateCode="(value) => (phoneCodeValue = value)" />
          </div>

          <div class="input" style="margin-top: 25px;padding-bottom:8px;"> 
            <ion-input
              style="flex:1;"
              v-model="password"
              @keydown="passError = ''"
              :label="$t('password')"
              label-placement="floating"
              type="password"
              :placeholder="$t('password')"
            >
              <ion-input-password-toggle slot="end"></ion-input-password-toggle>
            </ion-input>
          </div>
          <ion-text class="r12 txt_error" v-if="passError != ''">{{ $t(passError) }}</ion-text>

          <div class="input" style="margin-top: 25px;padding-bottom:8px;"> 
            <ion-input type="password" style="flex:1;" v-model="confirmPass" @keydown="passError = ''"
              :label="$t('register.password.confirm')"
              label-placement="floating"
              :placeholder="$t('register.password.confirm')"
            >
              <ion-input-password-toggle slot="end"></ion-input-password-toggle>
            </ion-input>
          </div>
          <ion-loading class="custom-loading" :message="$t('register.recovering')" spinner="circles" :is-open="recovering" ></ion-loading>
        </div>
      </div>
    </ion-content>

    <ion-footer :translucent="false" style="box-shadow: none; background-color: var(--ion-color-bg);">
      <ion-toolbar color="bg" style="--border-width: 0 0;padding-bottom:10px;">
        <div class="d-flex pb-1" style="justify-content: center;">
          <ion-text class="r13" style="color: var(--ion-color-primary);padding-bottom:0px !important">{{ $t('hasnot.account') }}</ion-text>
          <ion-text routerLink="/auth/register" class="m13" style="color: var(--ion-color-primary); margin-left: 5px;padding-bottom:10px !important">{{ $t('register') }}</ion-text>
        </div>
        <div class="d-flex pb-1" style="justify-content: center;">
          <ion-text class="r13" style="color: var(--ion-color-primary);padding-bottom:0px !important">{{ $t('or') }}</ion-text>
          <ion-text routerLink="/auth/login" class="m13" style="color: var(--ion-color-primary); margin-left: 5px;padding-bottom:10px !important">{{ $t('login') }}</ion-text>
        </div>
        <div>
          <ion-button expand="block" v-if="step==1" :disabled="phone == '' || prefix == ''" @click="sendPhoneCode">{{ $t('continue') }}</ion-button>
          <ion-button expand="block" v-if="step==2" :loading="recovering" :disabled="password == '' || confirmPass == '' || phoneCodeValue.length < 4" @click="sendNewPass">{{ $t('continue') }}</ion-button>
        </div>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<style scoped>
  ion-header ion-toolbar {padding-top: 30px !important;}
  ion-footer ion-toolbar .ios {padding-bottom: 30px !important;}
  .ion-toolbar {display:flex;align-items: center;}
  ion-header {
    padding-top: env(safe-area-inset-top);
  }
  .safe-header {
    padding-top: env(safe-area-inset-top); /* Respeta el notch y la Dynamic Island */
  }
  .modal-scrollable { overflow-y:auto; --overflow: auto;}

  ion-input {text-align:center;}
  ion-checkbox {
    --size: 22px;
    --checkbox-background-checked: var(--ion-color-primary);
    --checkbox-background:#FFFFFF;
  }
  ion-checkbox::part(container) {
    border-radius: 60px;
    border: 1px solid  var(--ion-color-primary);
  }

  .chip-selected {border-width: 0;background-color: #fff;margin: 8px 0;height: 30px;}
  .chip-noselected-text {color: #404B52;}
  .vertical-center 
  {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
  }
  ion-input-password-toggle {margin-top: -15px;}
  .txt_error {margin-top:5px; margin-left: 5px;}

</style>