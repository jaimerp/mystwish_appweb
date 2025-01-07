<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted, watch, nextTick, computed } from 'vue';
import { getLocalData, setLocalData } from '@/utils/localdata';
import { useI18n } from 'vue-i18n';
import axios from '@/plugins/axios.js';
import { useAlerts } from '@/store/alerts.js'
import { loadPhoneInput } from '@/utils/register.js';

setLocalData('intro', true);

const { locale } = useI18n();
const router = useRouter();
const loging = ref(false);
const emailPhoneError = ref('');
const passError = ref('');
const refPhoneInput = ref(null);
const phoneInput = ref();

const userData = ref({
  loginWith: 'phone',
  email: process.env.VUE_APP_EMAIL_DEV,
  phone: process.env.VUE_APP_PHONE_DEV,
  password: process.env.VUE_APP_PASS_DEV,
  rememberme: false
});

const loginWith = computed(() => userData.value.loginWith);

onMounted(() => {
  toPhoneInput();
  watch(loginWith, async (newValue) => {
    if (newValue === 'phone') {
      await toPhoneInput();
    }
  });
});

const toPhoneInput = async () => {
  await nextTick();
  phoneInput.value = await loadPhoneInput(locale, refPhoneInput.value);
}

const login = () => {
  loging.value = true;
  let prefix = phoneInput.value.getSelectedCountryData().dialCode;
  setLocalData('prefix', prefix);

  axios.post('/auth/login', {loginWith: userData.value.loginWith, email: userData.value.email, phone: prefix+userData.value.phone, password: userData.value.password})
    .then (async r => {
      loging.value = false;
      await nextTick();
      if (r.status == 200) {
        setLocalData('authToken', JSON.stringify(r.data.accessToken));
        setLocalData('userData', JSON.stringify(r.data.userData));
        router.push('/');
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
            ? 'register.msg.error.general' 
            : (e.response?.data?.message || 'register.msg.error.general '), 
          class: 'alert-error' 
        };
      }
    })
}

</script>

<template>
  <ion-page>
    <ion-content class="ion-padding" v-bind="$attrs">
      <div>
        <div class="ion-text-center" style="margin-top: 110px;">
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
            <input id="phone" ref="refPhoneInput" :placeholder="$t('phone')" type="tel" autocomplete="off" v-model="userData.phone" @keydown="emailPhoneError = ''" />
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

        <ion-text routerLink="/register" class="m13" style="display:block;text-align:center;margin-top:40px; color: var(--ion-color-primary); margin-left: 5px;">{{ $t('login.forgot_password') }}</ion-text>

        <div class="list" style="justify-content: center; margin-top: 40px; margin-bottom: 20px;">
          <ion-text class="r13" style="color: var(--ion-color-primary);">{{ $t('hasnot.account') }}</ion-text>
          <ion-text routerLink="/auth/register" class="m13" style="color: var(--ion-color-primary); margin-left: 5px;">{{ $t('register') }}</ion-text>
        </div>

        <ion-loading class="custom-loading" :message="$t('login.loging')" spinner="circles" :is-open="loging" ></ion-loading>
      </div>
    </ion-content>

    <ion-footer :translucent="false" style="box-shadow: none; background-color: var(--ion-color-bg);">
      <ion-toolbar color="bg" style="padding: 10px 15px;--border-width: 0 0;">
        <div class="ion-toolbar">
          <ion-button expand="block" :disabled="userData.emailphone == '' || userData.pass == ''" @click="login();">{{ $t('login') }}</ion-button>
        </div>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<style scoped>
  #phone {color: var(--ion-color-primary) !important; font-size: 20px; border: none !important; background: transparent;outline: none; font-weight: normal;}
  ion-footer {position: fixed;bottom: 20px;}
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
</style>