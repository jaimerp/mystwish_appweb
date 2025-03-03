<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted, watch, nextTick } from 'vue';
import { getLocalData, setLocalData } from '@/utils/localdata';
import { validateRegisterData } from '@/utils/register.js';
import { useI18n } from 'vue-i18n';
import axios from '@/plugins/axios.js';
import { useAlerts } from '@/store/alerts.js'
import phoneCode from '@/views/components/register/phoneCode.vue'
import Phone from '@/views/components/Phone.vue'

const { locale } = useI18n();
const router = useRouter();
const APP_NAME = process.env.VUE_APP_NAME;
const VUE_ASSETS_URL = process.env.VUE_APP_ASSETS_URL;
const step = ref(1);
const sendingPhoneCode = ref(false);
const checkingPhoneCode = ref(false);
const registering = ref(false);
const phoneCodeValue = ref('');
const nameError = ref('');
const emailError = ref('');
const passError = ref('');
const policyError = ref('');
const lang = ref();

const userData = ref({
  gender: '',
  prefix: '',
  phone: '',
  name: '',
  email: '',
  pass: '',
  pass_confirm: '',
  policy: 0,
  newsletter: 0,
});

onMounted(async() => {
  setLocalData('intro', 'true');
  lang.value = await getLocalData('lang')
  let dataTemp = await getLocalData('registerData');
  if (dataTemp){
    userData.value = JSON.parse(dataTemp);
    userData.value.name = '';
    userData.value.email = '';
    userData.value.pass = '';
    userData.value.pass_confirm = '';
    userData.value.policy = 0;
  }
});

const saveDataTemp = () => {
  // if (phoneInput.value) userData.value.prefix = phoneInput.value.getSelectedCountryData().dialCode;
  // setLocalData('registerData', JSON.stringify(userData.value));
}

const registerPhone = () => {
  userData.value.lang = lang.value;
  setLocalData('prefix', userData.value.prefix);
  sendingPhoneCode.value = true;
  axios.post('/register/phone-step', userData.value)
    .then (async r => {
      sendingPhoneCode.value = false;
      await nextTick();
      if (r.status == 200) {
        step.value++;
      }
    }).catch(e => {
      sendingPhoneCode.value = false;
      useAlerts().alert = {visible: true, message: e.response.data.exception ? 'register.msg.error.general' : e.response.data.message, class: 'alert-error'}
      console.error(e)
    })
}
const resendCode = () => {
  sendingPhoneCode.value = true;
  userData.value.lang = lang.value;
  axios.post('/register/resend-code', userData.value)
    .then (async r => {
      sendingPhoneCode.value = false;
      await nextTick();
      if (r.status == 200) {
        useAlerts().alert = {visible: true, message: 'register.phonecode.resend.msg', class: 'alert-success'}
      }
    }).catch(e => {
      sendingPhoneCode.value = false;
      useAlerts().alert = {visible: true, message: e.response.data.exception ? 'register.msg.error.general' : e.response.data.message, class: 'alert-error'}
      console.error(e)
    })
}

const checkPhoneCode = () => {
  checkingPhoneCode.value = true;
  let data = {prefix: userData.value.prefix, phone: userData.value.phone, code: phoneCodeValue.value, lang: lang.value};
  axios.post('/register/check-code', data)
    .then (async r => {
      checkingPhoneCode.value = false;
      await nextTick();
      if (r.status == 200) {
        useAlerts().alert = {visible: true, message: 'register.phonecode.ok', class: 'alert-success'}
        step.value++;
      }
    }).catch(e => {
      checkingPhoneCode.value = false;
      useAlerts().alert = {visible: true, message: e.response.data.exception ? 'register.msg.error.general' : e.response.data.message, class: 'alert-error'}
      console.error(e)
    })
}

const registerUser = () => {
  let validation = validateRegisterData(userData.value);
  if (validation.name === true && validation.email === true && validation.pass === true && validation.pass_confirm === true && validation.policy === true){
    save();
//
  }else{
    useAlerts().alert = {visible: true, message: 'msg.form.error', class: 'alert-error'}
    if (!validation.name) nameError.value = 'msg.form.field.required';
    if (!validation.email) emailError.value = 'register.msg.error.form.email';
    if (!validation.pass) passError.value = 'register.msg.error.form.pass';
    if (!validation.pass_confirm) passError.value = 'register.msg.error.form.pass_confirm';
    if (!validation.policy) policyError.value = 'register.msg.error.form.policy';
  }
}

const save = () => {
  registering.value = true;
  userData.value.lang = lang.value;
  axios.post('/register/register', userData.value)
    .then (async r => {
      registering.value = false;
      await nextTick();
      if (r.status == 200) {
        // useAlerts().alert = {visible: true, message: 'register.register.ok', class: 'alert-success'}
        step.value++;
      }
    }).catch(e => {
      registering.value = false;
      useAlerts().alert = {visible: true, message: e.response.data.exception ? 'register.msg.error.general' : e.response.data.message, class: 'alert-error'}
      console.error(e)
    })
}
</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <div class="ion-text-center logo">
          <img :src="VUE_ASSETS_URL + 'logo2.png'" :alt="APP_NAME" style="max-width: 200px;">
        </div>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding" v-bind="$attrs" style="--background: var(--ion-color-bg)">
      <div v-if="step == 1" class="vertical-center">
        <div class="ion-text-center">
          <ion-text class="s26">{{ $t('register.gender.choose') }}</ion-text>
        </div>

        <div class="obox list" style="margin-top: 20px;" :class="{ 'selectedGender': userData.gender === 'woman' }" @click="userData.gender='woman'">
          <ion-text class="m17" style="margin-left: 15px;flex: 1;">{{ $t('register.gender.woman') }}</ion-text>
        </div>

        <div class="obox list" style="margin-top: 20px;" :class="{ 'selectedGender': userData.gender === 'man' }" @click="userData.gender='man'">
          <ion-text class="m17" style="margin-left: 15px;flex: 1;">{{ $t('register.gender.man') }}</ion-text>
        </div>

        <div class="obox list" style="margin-top: 20px;" :class="{ 'selectedGender': userData.gender === 'neutral' }" @click="userData.gender='neutral'">
          <ion-text class="m17" style="margin-left: 15px;flex: 1;">{{ $t('register.gender.neutral') }}</ion-text>
        </div>
      </div>
      <div v-if="step == 2" class="vertical-center">
        <div class="ion-text-center">
          <ion-text class="s26">{{ $t('register.phone.title') }}</ion-text>
        </div>

        <div class="input" style="margin-top: 25px;">
          <Phone v-model:phone="userData.phone"  v-model:prefix="userData.prefix" />
          <ion-loading class="custom-loading" :message="$t('register.phone.sending')" spinner="circles" :is-open="sendingPhoneCode" ></ion-loading>
        </div>
      </div>
      <div v-if="step == 3" class="vertical-center">
        <div class="ion-text-center">
          <ion-text class="s26">{{ $t('register.phonecode.title') }}</ion-text>
        </div>
        <div class="ion-text-center" style="margin-top: 10px;">
          <ion-text class="r15" >{{ $t('register.phonecode.subtitle') }} {{ userData.prefix }} {{ userData.phone }}</ion-text>
        </div>
        <div style="margin-top: 35px;">
          <phoneCode @updateCode="(value) => (phoneCodeValue = value)" />
          <ion-loading class="custom-loading" :message="$t('register.phone.sending')" spinner="circles" :is-open="sendingPhoneCode" ></ion-loading>
          <ion-loading class="custom-loading" :message="$t('register.phonecode.checking')" spinner="circles" :is-open="checkingPhoneCode" ></ion-loading>
        </div>
        <div class="ion-text-center" style="margin-top: 30px;">
          <ion-text class="r15" @click="resendCode">{{ $t('register.phonecode.resend.hint') }} {{ $t('register.phonecode.resend') }}</ion-text>
        </div>
      </div>

      <div v-if="step == 4">
        <div class="ion-text-center" style="margin-top: 0px;">
          <ion-text class="s26">{{ $t('register.laststep.title') }}</ion-text>
        </div>

        <div class="input" style="margin-top: 20px;padding-bottom:13px;"> 
          <ion-input type="text" style="flex:1;" v-model="userData.name" @keydown="nameError = ''"
            :label="$t('register.field.name')"
            label-placement="floating"
          />
        </div>
        <ion-text class="r12 txt_error" v-if="nameError != ''">{{ $t(nameError) }}</ion-text>

        <div class="input" style="margin-top: 25px;padding-bottom:13px;"> 
          <ion-input type="email" style="flex:1;" v-model="userData.email" @keydown="emailError = ''"
            :label="$t('email')"
            label-placement="floating"
          />
        </div>
        <ion-text class="r12 txt_error" v-if="emailError != ''">{{ $t(emailError) }}</ion-text>

        <div class="input" style="margin-top: 25px;padding-bottom:8px;"> 
          <ion-input
            style="flex:1;"
            v-model="userData.pass"
            @keydown="passError = ''"
            :label="$t('password')"
            label-placement="floating"
            type="password"
          >
            <ion-input-password-toggle slot="end"></ion-input-password-toggle>
          </ion-input>
        </div>
        <ion-text class="r12 txt_error" v-if="passError != ''">{{ $t(passError) }}</ion-text>

        <div class="input" style="margin-top: 25px;padding-bottom:8px;"> 
          <ion-input type="password" style="flex:1;" v-model="userData.pass_confirm" @keydown="passError = ''"
            :label="$t('register.password.confirm')"
            label-placement="floating"
          >
            <ion-input-password-toggle slot="end"></ion-input-password-toggle>
          </ion-input>
        </div>
        <ion-loading class="custom-loading" :message="$t('register.registering')" spinner="circles" :is-open="registering" ></ion-loading>

        <div  class="list" style="margin-top: 25px;margin-bottom: 10px;">
          <ion-checkbox v-model="userData.policy" @click="policyError = ''"></ion-checkbox>
          <ion-text class="r12" style="color: var(--ion-color-primary);margin-left: 10px;">{{ $t('register.policy') }}</ion-text>
        </div>
        <ion-text class="r12 txt_error" v-if="policyError != ''">{{ $t(policyError) }}</ion-text>
        <div  class="list" style="margin-top: 25px;margin-bottom: 10px;">
          <ion-checkbox v-model="userData.newsletter" @click="policyError = ''"></ion-checkbox>
          <ion-text class="r12" style="color: var(--ion-color-primary);margin-left: 10px;">{{ $t('register.newsletter') }} {{ APP_NAME }}</ion-text>
        </div>
      </div>
      <div v-if="step == 5">
        <div class="ion-text-center" style="margin-top: 150px;">
          <ion-text class="s26">{{ $t('register.registered.title') }}</ion-text>
        </div>
        <div class="ion-text-center" style="margin-top: 40px;">
          <ion-text class="r15" >{{ $t('register.registered.subtitle') }}</ion-text>
        </div>
      </div>
    </ion-content>

    <ion-footer :translucent="false" style="box-shadow: none; background-color: var(--ion-color-bg);">      
      <div class="list" style="justify-content: center;" v-if="step < 5">
        <ion-text class="r13" style="color: var(--ion-color-dis);">{{ $t('already.account') }}</ion-text>
        <ion-text routerLink="/auth/login" class="m13" style="color: var(--ion-color-primary); margin-left: 5px;">{{ $t('login') }}</ion-text>
      </div>
      <ion-toolbar color="bg" style="padding: 10px 15px;--border-width: 0 0;">
        <div class="ion-toolbar">
          <ion-button shape="round" class="button-previous button-secondary" @click="step--" v-if="step > 1 && step < 4" style="padding-bottom:2px !important;">
            <ion-icon slot="icon-only" icon="arrow-back" style="margin:20px;"></ion-icon>
          </ion-button>

          <ion-button class="button-next" v-if="step == 1" expand="block" :disabled="userData.gender == ''" @click="saveDataTemp();step++">{{ $t('continue') }}</ion-button>
          <ion-button class="button-next" v-if="step == 2" expand="block" :disabled="userData.phone == '' || userData.phone.length < 3 || sendingPhoneCode" @click="saveDataTemp();registerPhone()">{{ $t('continue') }}</ion-button>
          <ion-button class="button-next" v-if="step == 3" expand="block" :disabled="phoneCodeValue.length < 4" @click="checkPhoneCode()">{{ $t('continue') }}</ion-button>
          <ion-button class="button-next" v-if="step == 4" expand="block" :disabled="false" @click="registerUser()">{{ $t('register') }}</ion-button>
          <ion-button class="button-next" v-if="step == 5" expand="block" routerLink="/auth/login">{{ $t('login') }}</ion-button>
        </div>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<style scoped>
  .ios ion-header ion-toolbar {padding-top: 30px !important;}
  .ios ion-footer ion-toolbar .ios {padding-bottom: 30px !important;}
  .ion-toolbar {display:flex;align-items: center;}

  *::-webkit-scrollbar {
    display: none !important;
  }

  .modal-scrollable { 
    overflow-y:auto; 
    --overflow: auto;
  }

  .selectedGender {border-color: var(--ion-color-primary);} 
  #phone {color: var(--ion-color-primary) !important; font-size: 20px; border: none !important; background: transparent;outline: none; font-weight: normal;}

  .button-next {flex-grow: 1}
  .button-previous {flex-shrink: 0;margin-right: 10px;;}

  ion-checkbox {
    --size: 22px;
    --checkbox-background-checked: var(--ion-color-primary);
    --checkbox-background:#FFFFFF;
  }
  ion-checkbox::part(container) {
    border-radius: 60px;
    border: 1px solid  var(--ion-color-primary);    
  }

  .vertical-center 
  {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
  }
</style>