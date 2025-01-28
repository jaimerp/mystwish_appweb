<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { removeLocalData } from '@/utils/localdata';
import { logout } from '@/utils/utils';

const router = useRouter();
const VUE_ASSETS_URL = process.env.VUE_APP_ASSETS_URL;
const APP_NAME = process.env.VUE_APP_NAME;
const viewAccountModal = ref(false);
const updating = ref(false);

const userData = ref({
    name: '',
    phone: '',
    email: '',
    prefix: '',
    newsletter: '',
})

// Cargar datos al montar la página
onMounted(async () => {
});

const toLogOut = async () => {
    let response = await logout();
    console.log(response);
    removeLocalData('authToken');
    removeLocalData('userData');
    router.push('/auth/login');
}

</script>

<template>
    <ion-page class="ion-padding">
        <div class="ion-text-center logo">
            <img :src="VUE_ASSETS_URL + 'logo.png'" :alt="APP_NAME" style="max-width: 180px; height: auto;">
        </div>
        <div class="box">

            <ion-toolbar style="margin-bottom: 25px;">
                <ion-title class="ion-text-center">
                    <ion-text class="s26">{{ $t('account.title') }}</ion-text>
                </ion-title>
                <ion-buttons slot="primary">
                <ion-button @click="viewAccountModal=true;"> 
                    <ion-icon slot="icon-only" icon="create-outline"></ion-icon>
                </ion-button>
                </ion-buttons>
            </ion-toolbar>

            <div class="list">
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
            <ion-text class="r13" style="color: var(--ion-color-dis);" >{{ userData.phone }}</ion-text>
            </div>

            <div class="lines"></div>

            <div class="list">
            <ion-text class="r15" style="flex:1">{{ $t('gender') }}</ion-text>
            <ion-text class="r13" style="color: var(--ion-color-dis);" >{{ userData.gender }}</ion-text>
            </div>

            <div class="lines"></div>

            <div class="list">
            <ion-text class="r15" style="flex:1">{{ $t('newsletter') }}</ion-text>
            <ion-text class="r13" style="color: var(--ion-color-dis);" >{{ userData.newsletter }}</ion-text>
            </div>

            <ion-button @click="toLogOut()" expand="block" style="margin-top: 20px;">{{ $t('logout') }}</ion-button>

        </div>

        <ion-modal
            :is-open="viewAccountModal"
            css-class="rbsheet"
            :initial-breakpoint="0.8"
            :breakpoints="[0, 0.8]"
            handle-behavior="cycle"
            fullscreen="true"
        >
            <ion-content class="ion-padding">
                <ion-loading class="custom-loading" :message="$t('saving')" spinner="circles" :is-open="updating" ></ion-loading>

                <div class="column" style="align-items: flex-end;">
                    <ion-icon @click="viewAccountModal=false" icon="close-outline" style="font-size: 24px; color: var(--ion-color-primary);" />
                </div>

                <div class="ion-text-center" style="margin-top: 5px;padding-bottom:20px;">
                    <ion-text class="m19">{{ $t('account.title') }}</ion-text>
                </div>
                <div class="input" style="margin-top: 0px;padding-bottom:13px;"> 
                    <ion-input style="flex:1;" v-model="userData.name"
                    :label="$t('secrets.field.name')"
                    />
                </div>
                <div class="input" style="margin-top: 45px;"> 
                    <input id="phone" type="tel" autocomplete="off" :placeholder="$t('secrets.field.phone')"  v-model="userData.phone" />
                </div>
                <div style="margin-top: 45px;display:flex;margin-bottom:10px;"> 
                    <ion-button shape="round" class="button-secondary button-delete" style="margin-right:10px" @click="confirmVisible=!confirmVisible" v-if="secretToView != null">
                        <ion-icon slot="icon-only" icon="trash-outline" style="margin:10px;"></ion-icon>
                    </ion-button>
                    <ion-button expand="block" style="width:100%" @click="updateSecret">{{ secretToView == null ? $t('secret.button.new') : $t('secret.button.update') }}</ion-button>
                </div>
            </ion-content>
        </ion-modal>
    </ion-page>
</template>

<style scoped>
.button-small {
    min-height: 1rem;
    height: 30px;
}
</style>