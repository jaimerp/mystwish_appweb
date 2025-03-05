<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import { removeLocalData, getLocalData, setLocalData } from '@/utils/localdata';
import { logout } from '@/utils/utils';
import Phone from '@/views/components/Phone.vue'
import axios from '@/plugins/axios.js';
import { useAlerts } from '@/store/alerts.js'
const { locale } = useI18n();

const router = useRouter();
const VUE_ASSETS_URL = process.env.VUE_APP_ASSETS_URL;
const APP_NAME = process.env.VUE_APP_NAME;
const viewAccountModal = ref(false);
const updating = ref(false);
const loaded = ref(false);
const confirmPassword = ref();

const itemToEdit = ref({type: '', title: '', field: '', value: ''});

const userData = ref({
    name: '',
    phone: '',
    email: '',
    prefix: '',
    newsletter: '',
})

// Cargar datos al montar la página
onMounted(async () => {
    let data = await getLocalData('userData');
    userData.value = JSON.parse(data);
    loaded.value = true;
});

const toLogOut = async () => {
    let response = await logout();
    console.log(response);
    removeLocalData('authToken');
    removeLocalData('userData');
    router.push('/auth/login');
}

const editItem = (type, title, field, value) => {
    itemToEdit.value.type = type;
    itemToEdit.value.title = title;
    itemToEdit.value.field = field;
    itemToEdit.value.value = value;
    viewAccountModal.value = true;
}

const saveData = () => {
    updating.value = true;

    if ((itemToEdit.value.type == 'text' || itemToEdit.value.type == 'password') && itemToEdit.value.value === '') {
        useAlerts().alert = {visible: true, message: 'account.msg.error.missing', class: 'alert-error'}
        updating.value = false;
        return;
    }
    if (itemToEdit.value.type == 'password' && (itemToEdit.value.value !== confirmPassword.value)) {
        useAlerts().alert = {visible: true, message: 'account.msg.error.password', class: 'alert-error'}
        updating.value = false;
        return;
    }


    axios.post('/account/data', itemToEdit.value)
    .then (async r => {
      if (r.status == 200) {
        useAlerts().alert = {visible: true, message: 'account.msg.saved', class: 'alert-success'}
        userData.value[itemToEdit.value.field] = itemToEdit.value.value;
        await setLocalData('userData', JSON.stringify(userData.value));
        let data = await getLocalData('userData');
        viewAccountModal.value = false;
      }else{
        useAlerts().alert = {visible: true, message: r.data.message, class: 'alert-error'}
      }
      updating.value = false;
    }).catch(e => {
        useAlerts().alert = {visible: true, message: 'msg.form.error', class: 'alert-error'}
        updating.value = false;
    })
}

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
        <div class="box" v-if="loaded">
            <div class="ion-text-center">
                <ion-text class="s26">{{ $t('account.title') }}</ion-text>
                <!-- <ion-buttons slot="primary" style="float:right;margin-top:-8px">
                    <ion-button @click="viewAccountModal=true;"> 
                        <ion-icon slot="icon-only" icon="create-outline"></ion-icon>
                    </ion-button>
                </ion-buttons> -->
            </div>
            <div class="list mt-10" style="clear:right;" @click="editItem('text', 'name', 'name', userData.name)">
                <ion-text class="r15" style="flex:1">{{ $t('name') }}</ion-text>
                <ion-text class="r13" style="color: var(--ion-color-dis);" >{{ userData.name }}</ion-text>
            </div>

            <div class="lines"></div>

            <div class="list" @click="editItem('text', 'email', 'email', userData.email)">
                <ion-text class="r15" style="flex:1">{{ $t('email') }}</ion-text>
                <ion-text class="r13" style="color: var(--ion-color-dis);" >{{ userData.email }}</ion-text>
            </div>

            <div class="lines"></div>

            <div class="list" @click="editItem('password', 'password', 'password', '')">
                <ion-text class="r15" style="flex:1">{{ $t('password') }}</ion-text>
                <ion-text class="r13" style="color: var(--ion-color-dis);" >{{ $t('account.password.change') }}</ion-text>
            </div>

            <div class="lines"></div>

            <div class="list" @click="editItem('phone', 'phone', 'phone', userData.phone)">
                <ion-text class="r15" style="flex:1">{{ $t('phone') }}</ion-text>
                <ion-text class="r13" style="color: var(--ion-color-dis);" >{{ userData.prefix }} {{ userData.phone }}</ion-text>
            </div>

            <div class="lines"></div>

            <div class="list">
                <ion-text class="r15" style="flex:1">{{ $t('gender') }}</ion-text>
                <ion-text class="r13" style="color: var(--ion-color-dis);" >{{ $t(userData.gender) }}</ion-text>
            </div>

            <div class="lines"></div>

            <div class="list" @click="editItem('boolean', 'newsletter', 'newsletter', userData.newsletter)">
                <ion-text class="r15" style="flex:1">{{ $t('newsletter') }}</ion-text>
                <ion-text class="r13 d-block ml-7" style="color: var(--ion-color-dis);" >{{ userData.newsletter == 0 ? $t('no') : $t('yes') }}</ion-text>
            </div>

            <ion-button @click="toLogOut()" expand="block" class="mt-10">{{ $t('logout') }}</ion-button>

        </div>

        <ion-modal
            :is-open="viewAccountModal"
            css-class="rbsheet"
            :fullscreen="true"
            :initial-breakpoint="(itemToEdit.type == 'text' || itemToEdit.type == 'boolean') ? 0.35 : 0.43"
            :breakpoints="[0, (itemToEdit.type == 'text' || itemToEdit.type == 'boolean') ? 0.35 : 0.43]"
        >
            <ion-content class="ion-padding">
                <ion-loading class="custom-loading" :message="$t('saving')" spinner="circles" :is-open="updating" ></ion-loading>

                <div class="column" style="align-items: flex-end;">
                    <ion-icon @click="viewAccountModal=false" icon="close-outline" style="font-size: 24px; color: var(--ion-color-primary);" />
                </div>

                <div v-if="itemToEdit.type == 'text'">
                    <div class="ion-text-center" style="margin-top: 5px;">
                        <ion-text class="m19">{{ $t(itemToEdit.title) }}</ion-text>
                    </div>
                    <div class="input" style="margin-top: 0px;padding-bottom:13px;"> 
                        <ion-input style="flex:1;" v-model="itemToEdit.value"
                            :label="$t(itemToEdit.title)"
                            label-placement="floating"
                        />
                    </div>
                </div>

                <div v-if="itemToEdit.type == 'password'">
                    <div class="ion-text-center" style="margin-top: 5px;">
                        <ion-text class="m19">{{ $t(itemToEdit.title) }}</ion-text>
                    </div>
                    <div class="input"> 
                        <ion-input type="password" style="flex:1;" v-model="itemToEdit.value"
                            :label="$t(itemToEdit.title)"
                            label-placement="floating"
                        >
                            <ion-input-password-toggle slot="end"></ion-input-password-toggle>
                        </ion-input>
                    </div>
                    <div class="input" style="margin-top: 20px;"> 
                        <ion-input type="password" style="flex:1;" v-model="confirmPassword"
                            :label="$t('register.password.confirm')"
                            label-placement="floating"
                        >
                            <ion-input-password-toggle slot="end"></ion-input-password-toggle>
                        </ion-input>
                    </div>
                </div>

                <div v-if="itemToEdit.type == 'phone'">
                    <div class="ion-text-center" style="margin-top: 5px;">
                        <ion-text class="m19">{{ $t(itemToEdit.title) }}</ion-text>
                    </div>
                    <div class="input"> 
                        <Phone v-model:phone="userData.phone" v-model:prefix="userData.prefix" />
                    </div>
                </div>
                <div v-if="itemToEdit.type == 'boolean'">
                    <div  class="list mt-10">
                        <ion-checkbox v-model="itemToEdit.value" ></ion-checkbox>
                        <ion-text class="r12" style="color: var(--ion-color-primary);margin-left: 10px;">{{ $t('newsletter') }}</ion-text>
                    </div>
                </div>
                <div style="margin-top: 25px;margin-bottom:3rem;"> 
                    <ion-button expand="block" style="width:100%" @click="saveDataPhone()" v-if="itemToEdit.type=='phone'">{{ $t('save') }}</ion-button>
                    <ion-button expand="block" style="width:100%" @click="saveData()" v-else>{{ $t('save') }}</ion-button>
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

</style>