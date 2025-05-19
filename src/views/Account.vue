<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted, nextTick, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { removeLocalData, getLocalData, setLocalData } from '@/utils/localdata';
import { logout } from '@/utils/utils';
import Phone from '@/views/components/Phone.vue'
import axios from '@/plugins/axios.js';
import { useAlerts } from '@/store/alerts.js'
import phoneCode from '@/views/components/register/phoneCode.vue'
import { validatePassword } from '@/utils/register.js';

const { locale } = useI18n();

const router = useRouter();
const VUE_ASSETS_URL = process.env.VUE_APP_ASSETS_URL;
const APP_NAME = process.env.VUE_APP_NAME;
const viewAccountModal = ref(false);
const updating = ref(false);
const loaded = ref(false);
const confirmPassword = ref();
const newPhone = ref();
const newPrefix = ref();
const sendingPhoneCode = ref(false);
const checkingPhoneCode = ref(false);
const phoneCodeValue = ref();

const itemToEdit = ref({type: '', title: '', field: '', valueText: '', valueText2: ''});

const userData = ref({
    name: '',
    phone: '',
    email: '',
    prefix: '',
    newsletter: '',
})

// Cargar datos al montar la página
onMounted(async () => {
    resetItemToEdit();
    let data = await getLocalData('userData');
    userData.value = JSON.parse(data);
    loaded.value = true;
});

const resetItemToEdit = () => { itemToEdit.value = ref({type: '', title: '', field: '', valueText: '', valueText2: ''}); confirmPassword.value = ''; }
const closeModal = () => { 
    document.activeElement?.blur();
    viewAccountModal.value = false; 
    resetItemToEdit();
}

const toLogOut = async () => {
    let response = await logout();
    removeLocalData('authToken');
    removeLocalData('userData');
    router.push('/auth/login');
}

const editItem = (type, title, field, value, value2) => {
    document.activeElement?.blur();
    itemToEdit.value.type = type;
    itemToEdit.value.title = title;
    itemToEdit.value.field = field;
    itemToEdit.value.valueText = value;
    itemToEdit.value.valueText2 = value2 ?? '';
    viewAccountModal.value = true;
}

const saveData = () => {
    document.activeElement?.blur();
    updating.value = true;

    if (itemToEdit.value.type == 'password'){
        if (itemToEdit.value.valueText === '' || itemToEdit.value.valueText2 === '') {
            useAlerts().alert = {visible: true, message: 'account.msg.error.missing', class: 'alert-error'}
            updating.value = false;
            return;
        }
        if (itemToEdit.value.valueText !== confirmPassword.value) {
            useAlerts().alert = {visible: true, message: 'account.msg.error.password', class: 'alert-error'}
            updating.value = false;
            return;
        }
        if (!validatePassword(itemToEdit.value.valueText)) {
            useAlerts().alert = {visible: true, message: 'account.msg.error.password.novalid', class: 'alert-error'}
            updating.value = false;
            return;
        }

    }else{
        if (itemToEdit.value.valueText === '') {
            useAlerts().alert = {visible: true, message: 'account.msg.error.missing', class: 'alert-error'}
            updating.value = false;
            return;
        }
    }

    axios.post('/account/data', itemToEdit.value)
    .then (async r => {
      if (r.status == 200) {
        useAlerts().alert = {visible: true, message: 'account.msg.saved', class: 'alert-success'}
        if (itemToEdit.value.type != 'password' && itemToEdit.value.type != 'phone') {
            userData.value[itemToEdit.value.field] = itemToEdit.value.valueText;
            await setLocalData('userData', JSON.stringify(userData.value));
        }
        if (itemToEdit.value.type == 'phone') {
            newPhone.value = itemToEdit.value.valueText;
            newPrefix.value = itemToEdit.value.valueText2;
            itemToEdit.value.type = 'phonecode';
        }
      }else{
        useAlerts().alert = {visible: true, message: r.data.message, class: 'alert-error'}
      }
      updating.value = false;
    }).catch(e => {
        console.error(e)
        useAlerts().alert = {visible: true, message: e.response?.data?.message ?? 'ssmsg.form.error', class: 'alert-error'}
        updating.value = false;
    })
}

const checkPhoneCode = async() => {
  checkingPhoneCode.value = true;
  let lang = await getLocalData('lang')
  let data = {newprefix: newPrefix.value, newphone: newPhone.value, code: phoneCodeValue.value, prefix: userData.value.prefix, phone: userData.value.phone, lang: lang};
  axios.post('/account/check-code', data)
    .then (async r => {
      checkingPhoneCode.value = false;
      await nextTick();
      if (r.status == 200) {
        useAlerts().alert = {visible: true, message: 'register.phonecode.ok', class: 'alert-success'}
        userData.value['phone'] = newPhone.value;
        userData.value['prefix'] = newPrefix.value;
        await setLocalData('userData', JSON.stringify(userData.value));
        closeModal();
      }
    }).catch(e => {
      checkingPhoneCode.value = false;
      useAlerts().alert = {visible: true, message: e.response.data.exception ? 'register.msg.error.general' : e.response.data.message, class: 'alert-error'}
      console.error(e)
    })
}

const handleModalPresented = () => {
  nextTick(() => {
    document.activeElement?.blur();
  });
}

const modalBreakpoint = computed(() => {
    if (itemToEdit.value.type === 'text' || itemToEdit.value.type === 'boolean') return 0.4;
    else if (itemToEdit.value.type === 'password') return 0.6;
    else return 0.45;
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
        <div class="account-box ion-padding modal-scrollable" v-if="loaded">
            <div class="mt-6">
                <ion-text class="title-page">{{ $t('account.title') }}</ion-text>
            </div>
            <div class="list mt-5" style="clear:right;" @click="editItem('text', 'name', 'name', userData.name)">
                <ion-text class="label">{{ $t('name') }}</ion-text>
                <ion-text class="value" style="color: var(--ion-color-dis);" >{{ userData.name }}</ion-text>
            </div>

            <div class="lines"></div>

            <div class="list" @click="editItem('password', 'account.password.new', 'password', '')">
                <ion-text class="label">{{ $t('password') }}</ion-text>
                <ion-text class="value" style="color: var(--ion-color-dis);" >{{ $t('account.password.change') }}</ion-text>
            </div>

            <div class="lines"></div>

            <!-- <div class="list" @click="editItem('text', 'email', 'email', userData.email)">
                <ion-text class="label">{{ $t('email') }}</ion-text>
                <ion-text class="value" style="color: var(--ion-color-dis);" >{{ userData.email.slice(0, 20) }} {{ userData.email.length > 20 ? '...' : '' }}</ion-text>
            </div>

            <div class="lines"></div> -->

            <div class="list" @click="editItem('phone', 'phone', 'phone', userData.phone, userData.prefix)">
                <ion-text class="label">{{ $t('phone') }}</ion-text>
                <ion-text class="value" style="color: var(--ion-color-dis);" >{{ userData.prefix }} {{ userData.phone }}</ion-text>
            </div>

            <div class="lines"></div>

            <div class="list">
                <ion-text class="label">{{ $t('gender') }}</ion-text>
                <ion-text class="value" style="color: var(--ion-color-dis);" >{{ $t(userData.gender) }}</ion-text>
            </div>

            <div class="lines"></div>

            <div class="list" @click="editItem('boolean', 'newsletter', 'newsletter', userData.newsletter)">
                <ion-text class="label">{{ $t('newsletter') }}</ion-text>
                <ion-text class="value ml-7" style="color: var(--ion-color-dis);" >{{ userData.newsletter == 0 ? $t('no') : $t('yes') }}</ion-text>
            </div>

            <ion-button @click="toLogOut()" expand="block" class="button-secondary mt-10">{{ $t('logout') }}</ion-button>

        </div>

        <ion-modal
            :is-open="viewAccountModal"
            css-class="rbsheet"
            :fullscreen="true"
            :initial-breakpoint="modalBreakpoint"
            :breakpoints="[0, modalBreakpoint]"
            @didPresent="handleModalPresented"
            @didDismiss="viewAccountModal = false"
        >
            <ion-content class="ion-padding">
                <ion-loading class="custom-loading" :message="$t('saving')" spinner="circles" :is-open="updating" ></ion-loading>

                <div class="column" style="align-items: flex-end;">
                    <ion-icon @click="closeModal" icon="close-outline" style="font-size: 24px; color: var(--ion-color-primary);" />
                </div>

                <div v-if="itemToEdit.type == 'text'">
                    <div class="ion-text-center mb-3 mt-3">
                        <ion-text class="m19">{{ $t(itemToEdit.title) }}</ion-text>
                    </div>
                    <div class="input" style="margin-top: 0px;padding-bottom:13px;"> 
                        <ion-input style="flex:1;" v-model="itemToEdit.valueText"
                            :label="$t(itemToEdit.title)"
                            label-placement="floating"
                        />
                    </div>
                </div>

                <div v-if="itemToEdit.type == 'password'">
                    <div class="ion-text-center mb-3 mt-3">
                        <ion-text class="m19">{{ $t(itemToEdit.title) }}</ion-text>
                    </div>
                    <div class="input mt-8"> 
                        <ion-input type="password" style="flex:1;" v-model="itemToEdit.valueText2"
                            :label="$t('account.password.actual')"
                            label-placement="floating"
                            :placeholder="$t('account.password.actual')"
                            tabindex="1"
                        >
                            <ion-input-password-toggle slot="end"></ion-input-password-toggle>
                        </ion-input>
                    </div>
                    <div class="input mt-4"> 
                        <ion-input type="password" style="flex:1;" v-model="itemToEdit.valueText"
                            :label="$t(itemToEdit.title)"
                            label-placement="floating"
                            :placeholder="$t(itemToEdit.title)"
                            tabindex="2"
                            >
                            <ion-input-password-toggle slot="end"></ion-input-password-toggle>
                        </ion-input>
                    </div>
                    <div class="input mt-4"> 
                        <ion-input type="password" style="flex:1;" v-model="confirmPassword"
                            :label="$t('account.password.new.confirm')"
                            label-placement="floating"
                            :placeholder="$t('account.password.new.confirm')"
                            tabindex="3"
                        >
                            <ion-input-password-toggle slot="end"></ion-input-password-toggle>
                        </ion-input>
                    </div>
                </div>

                <div v-if="itemToEdit.type == 'phone'">
                    <div class="ion-text-center mb-3 mt-3">
                        <ion-text class="m19">{{ $t(itemToEdit.title) }}</ion-text>
                    </div>
                    <div class="input"> 
                        <Phone v-model:phone="itemToEdit.valueText" v-model:prefix="itemToEdit.valueText2" />
                    </div>
                </div>
                <div v-if="itemToEdit.type == 'phonecode'">
                    <div class="ion-text-center mb-3 mt-3">
                        <ion-text class="m19">{{ $t(itemToEdit.title) }}</ion-text>
                    </div>
                    <phoneCode @updateCode="(value) => (phoneCodeValue = value)" />
                    <ion-text class="r12" style="line-height: 100%;">{{ $t('account.phonecode.hint') }}</ion-text>
                    <ion-loading class="custom-loading" :message="$t('register.phone.sending')" spinner="circles" :is-open="sendingPhoneCode" ></ion-loading>
                    <ion-loading class="custom-loading" :message="$t('register.phonecode.checking')" spinner="circles" :is-open="checkingPhoneCode" ></ion-loading>

                </div>
                <div v-if="itemToEdit.type == 'boolean'">
                    <div  class="list mt-10">
                        <ion-checkbox v-model="itemToEdit.valueText" ></ion-checkbox>
                        <ion-text class="r12" style="color: var(--ion-color-primary);margin-left: 10px;">{{ $t('newsletter') }}</ion-text>
                    </div>
                </div>
                <div style="margin-top: 25px;margin-bottom:3rem;"> 
                    <div v-if="userData[itemToEdit.field] == itemToEdit.valueText">
                        <ion-button expand="block" style="width:100%" @click="closeModal">{{ $t('ok') }}</ion-button>    
                    </div>
                    <div v-else>
                        <ion-button expand="block" :loading="sendingPhoneCode" style="width:100%" @click="saveData()" v-if="itemToEdit.type=='phone'">{{ $t('save') }}</ion-button>
                        <ion-button expand="block" :loading="checkingPhoneCode" style="width:100%" @click="checkPhoneCode()" v-if="itemToEdit.type=='phonecode'">{{ $t('continue') }}</ion-button>
                        <ion-button expand="block" style="width:100%" @click="saveData()" v-if="itemToEdit.type=='password' || itemToEdit.type=='text' || itemToEdit.type=='boolean'">{{ $t('save') }}</ion-button>
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

.modal-scrollable { overflow-y:auto; --overflow: auto;}
ion-modal .ion-page { height: 70vh; height: 70%;}

.button-small {
    min-height: 1rem;
    height: 30px;
}
#phone {color: var(--ion-color-primary) !important; border: none !important; background: transparent;outline: none; font-weight: normal;}
.iti__selected-dial-code {font-size: 16px;}

.account-box ion-text {
    color: var(--ion-color-primary-contrast);
}

.label {
    font-size: 1rem !important;
    color: var(--ion-color-primary);
    flex: 1;
    display: block !important;
    margin-right: 10px;
}

.value {
    font-size: 0.9rem;
    color: var(--ion-color-primary-contrast);

}   
.title-page {
    font-size: 2rem !important;
    color: var(--ion-color-primary);
    font-weight: bold;
}

@media (max-height: 700px) {
    .label {
        font-size: 0.9rem !important;
    }
    .value {
        font-size: 0.8rem;
    }   
    .title-page {
        font-size: 1.5rem !important;
    }
}

</style>