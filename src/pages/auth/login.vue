<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted, watch, nextTick, computed } from 'vue';
import { getLocalData, setLocalData } from '@/utils/localdata';
import { useI18n } from 'vue-i18n';
import axios from '@/plugins/axios.js';
import { useAlerts } from '@/store/alerts.js'
import Phone from '@/views/components/Phone.vue'

const { locale } = useI18n();
const router = useRouter();
const loging = ref(false);
const emailPhoneError = ref('');
const passError = ref('');
const VUE_ASSETS_URL = process.env.VUE_APP_ASSETS_URL;
const APP_NAME = process.env.VUE_APP_NAME;
const lang = ref();

const userData = ref({
  loginWith: 'phone',
  email: process.env.VUE_APP_EMAIL_DEV,
  phone: process.env.VUE_APP_PHONE_DEV,
  password: process.env.VUE_APP_PASS_DEV,
  rememberme: false,
  prefix:undefined
});

const loginWith = computed(() => userData.value.loginWith);

onMounted(async () => {
  setLocalData('intro', 'true');
  lang.value = await getLocalData('lang')
});

const login = () => {
  loging.value = true;
  setLocalData('prefix', userData.value.prefix);
  axios.post('/auth/login', {loginWith: userData.value.loginWith, email: userData.value.email, phone: userData.value.prefix+userData.value.phone, password: userData.value.password, lang: lang.value})
    .then (async r => {
      loging.value = false;
      await nextTick();
      if (r.status == 200) {
        setLocalData('authToken', JSON.stringify(r.data.accessToken));
        setLocalData('userData', JSON.stringify(r.data.userData));
        window.location = "/";
      }else{
        useAlerts().alert = {visible: true, message: r.data.message, class: 'alert-error'}
      }
    }).catch(e => {
      loging.value = false;
      // Manejar errores específicos
      if (e.response && e.response.status === 401) {
        useAlerts().alert = { 
          visible: true, 
          message: 'login.user.incorrect', 
          class: 'alert-error' 
        };
      } else {
        useAlerts().alert = { 
          visible: true, 
          message: e.response && e.response.data.exception 
            ? e.response?.data?.message 
            : (e.response?.data?.message || 'register.msg.error.general '), 
          class: 'alert-error' 
        };
      }
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
          <ion-text class="s26">{{ $t('login.title') }}</ion-text>
        </div>

        <div class="column" style="align-items: center;margin-top: 40px;">
          <ion-text class="s12" style="display:block; text-align:center;margin-bottom:5px;">{{ $t('login.select') }}</ion-text>
          <div class="chip list" style="height: 39px;border-width: 0;background-color: #F1F4F8;padding: 0 10px;">
            <div style="margin: 0 20px;" :class="{'chip chip-selected': userData.loginWith == 'phone'}" @click="userData.loginWith = 'phone'">
              <ion-text :class="{'b13': userData.loginWith == 'phone', 'r13 chip-selected-text': userData.loginWith == 'email'}">{{ $t('phone') }}</ion-text>
            </div>
            <div style="margin: 0 20px;" :class="{'chip chip-selected': userData.loginWith == 'email'}" @click="userData.loginWith = 'email'">
              <ion-text :class="{'b13': userData.loginWith == 'email', 'r13 chip-selected-text': userData.loginWith == 'phone'}">{{ $t('email') }}</ion-text>
            </div>
         </div>
        </div>

        <div v-if="userData.loginWith == 'phone'">
          
          <div class="input" style="margin-top: 35px;"> 
            <Phone v-model:phone="userData.phone"  v-model:prefix="userData.prefix" />
          </div>
        </div>

        <div v-if="userData.loginWith == 'email'">
          <div class="input" style="margin-top: 35px;padding-bottom:13px;"> 
            <ion-input style="flex:1;" v-model="userData.email" @keydown="emailPhoneError = ''"
              :label="$t('email')"
              label-placement="floating"
            />
          </div>
        </div>
        <ion-text class="r12 txt_error" v-if="emailPhoneError != ''">{{ $t(emailPhoneError) }}</ion-text>

        <div class="input" style="margin-top: 35px;"> 
          <ion-input type="password" style="flex:1;" v-model="userData.password" @keydown="passError = ''"
            :label="$t('password')"
          >
            <ion-input-password-toggle slot="end"></ion-input-password-toggle>
          </ion-input>
        </div>
        <ion-text class="r12 txt_error" v-if="passError != ''">{{ $t(passError) }}</ion-text>

        <div  class="list" style="margin-top: 25px;margin-bottom: 10px; margin-left:10px;">
          <ion-checkbox v-model="userData.rememberme"></ion-checkbox>
          <ion-text class="r12" style="color: var(--ion-color-primary);margin-left: 10px;">{{ $t('login.rememberme') }}</ion-text>
        </div>

        <ion-text routerLink="/register" class="m13" style="display:block;text-align:center;margin-top:30px; color: var(--ion-color-primary); margin-left: 5px;">{{ $t('login.forgot_password') }}</ion-text>

        <ion-loading class="custom-loading" :message="$t('login.loging')" spinner="circles" :is-open="loging" ></ion-loading>
      </div>
    </ion-content>

    <ion-footer :translucent="false" style="box-shadow: none; background-color: var(--ion-color-bg);">
      <ion-toolbar color="bg" style="--border-width: 0 0;padding-bottom:10px;">
        <div class="d-flex pb-1" style="justify-content: center;">
          <ion-text class="r13" style="color: var(--ion-color-primary);padding-bottom:0px !important">{{ $t('hasnot.account') }}</ion-text>
          <ion-text routerLink="/auth/register" class="m13" style="color: var(--ion-color-primary); margin-left: 5px;padding-bottom:10px !important">{{ $t('register') }}</ion-text>
        </div>
        <div>
          <ion-button expand="block" :disabled="userData.emailphone == '' || userData.pass == ''" @click="login();">{{ $t('login') }}</ion-button>
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
</style>