<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import { removeLocalData, getLocalData } from '@/utils/localdata';
import { logout } from '@/utils/utils';
import Phone from '@/views/components/Phone.vue'
const { locale } = useI18n();

const router = useRouter();
const VUE_ASSETS_URL = process.env.VUE_APP_ASSETS_URL;
const APP_NAME = process.env.VUE_APP_NAME;
const viewAccountModal = ref(false);
const updating = ref(false);
const loaded = ref(false);

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

const saveAccount = () => {
    updating.value = true;
    setTimeout(() => {
        updating.value = false;
        viewAccountModal.value = false;
    }, 2000);
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
                <ion-buttons slot="primary" style="float:right;margin-top:-8px">
                    <ion-button @click="viewAccountModal=true;"> 
                        <ion-icon slot="icon-only" icon="create-outline"></ion-icon>
                    </ion-button>
                </ion-buttons>
            </div>
            <div class="list mt-10" style="clear:right;">
                <ion-text class="r15" style="flex:1">{{ $t('name') }}</ion-text>
                <ion-text class="r13" style="color: var(--ion-color-dis);" >{{ userData.name }}</ion-text>
            </div>

            <div class="lines"></div>

            <div class="list">
                <ion-text class="r15" style="flex:1">{{ $t('email') }}</ion-text>
                <ion-text class="r13" style="color: var(--ion-color-dis);" >{{ userData.email }}</ion-text>
            </div>

            <div class="lines"></div>

            <div class="list">
                <ion-text class="r15" style="flex:1">{{ $t('password') }}</ion-text>
                <ion-text class="r13" style="color: var(--ion-color-dis);" >{{ $t('account.password.change') }}</ion-text>
            </div>

            <div class="lines"></div>

            <div class="list">
                <ion-text class="r15" style="flex:1">{{ $t('phone') }}</ion-text>
                <ion-text class="r13" style="color: var(--ion-color-dis);" >+{{ userData.prefix }} {{ userData.phone }}</ion-text>
            </div>

            <div class="lines"></div>

            <div class="list">
                <ion-text class="r15" style="flex:1">{{ $t('gender') }}</ion-text>
                <ion-text class="r13" style="color: var(--ion-color-dis);" >{{ $t(userData.gender) }}</ion-text>
            </div>

            <div class="lines"></div>

            <div class="list">
                <ion-text class="r15" style="flex:1">{{ $t('newsletter') }}</ion-text>
                <ion-text class="r13 d-block ml-7" style="color: var(--ion-color-dis);" >{{ userData.newsletter == 0 ? $t('no') : $t('yes') }}</ion-text>
            </div>

            <ion-button @click="toLogOut()" expand="block" class="mt-10">{{ $t('logout') }}</ion-button>

        </div>

        <ion-modal
            :is-open="viewAccountModal"
            css-class="rbsheet"
            fullscreen="true"
        >
            <ion-content class="ion-padding modal-scrollable">
                <ion-loading class="custom-loading" :message="$t('saving')" spinner="circles" :is-open="updating" ></ion-loading>

                <div class="column" style="align-items: flex-end;">
                    <ion-icon @click="viewAccountModal=false" icon="close-outline" style="font-size: 24px; color: var(--ion-color-primary);" />
                </div>

                <div class="ion-text-center" style="margin-top: 5px;padding-bottom:20px;">
                    <ion-text class="m19">{{ $t('account.title') }}</ion-text>
                </div>
                <div class="input" style="margin-top: 0px;padding-bottom:13px;"> 
                    <ion-input style="flex:1;" v-model="userData.name"
                        :label="$t('name')"
                        label-placement="floating"
                    />
                </div>
                <div class="input mt-5"> 
                    <Phone v-model:phone="userData.phone" v-model:prefix="userData.prefix" />
                </div>
                <div class="input mt-5" style="padding-bottom:13px;"> 
                    <ion-input style="flex:1;" v-model="userData.email"
                        :label="$t('email')"
                        label-placement="floating"
                    />
                </div>
                <div  class="list mt-10">
                    <ion-checkbox v-model="userData.newsletter"></ion-checkbox>
                    <ion-text class="r12" style="color: var(--ion-color-primary);margin-left: 10px;">{{ $t('newsletter') }}</ion-text>
                </div>
                <div style="margin-top: 45px;margin-bottom:3rem;"> 
                    <ion-button expand="block" style="width:100%" @click="saveAccount">{{ $t('save') }}</ion-button>
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