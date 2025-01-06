<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { removeLocalData } from '@/utils/localdata';
import { logout } from '@/utils/utils';

const router = useRouter();
const VUE_ASSETS_URL = process.env.VUE_APP_ASSETS_URL;
const APP_NAME = process.env.VUE_APP_NAME;

const userData = ref({
    name: '',
    phone: '',
    email: ''
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
            <img :src="VUE_ASSETS_URL + 'logo.png'" :alt="APP_NAME" style="max-width: 140px; height: auto;">
        </div>
        <div class="box">
            <div class="ion-text-center" style="margin-bottom:25px;">
                <ion-text class="s26">{{ $t('account.title') }}</ion-text>
            </div>
            <!-- <ion-img src="../../../../assets/image/a20.svg" style="height: 77px;margin-bottom:35px;"></ion-img> -->

            <div class="list">
            <ion-text class="r15" style="flex:1">{{ $t('name') }}</ion-text>
            <ion-text class="r13" style="color: var(--ion-color-dis);" >Anabel Suarez</ion-text>
            <ion-icon name="chevron-forward" color="arrow" style="font-size: 20px;margin-left: 5px;"></ion-icon>
            </div>

            <div class="lines"></div>

            <div class="list">
            <ion-text class="r15" style="flex:1">{{ $t('email') }}</ion-text>
            <ion-text class="r13" style="color: var(--ion-color-dis);" >anabel.suarez&commat;email.com</ion-text>
            <ion-icon name="chevron-forward" color="arrow" style="font-size: 20px;margin-left: 5px;"></ion-icon>
            </div>

            <div class="lines"></div>

            <div class="list">
            <ion-text class="r15" style="flex:1">{{ $t('password') }}</ion-text>
            <ion-text class="r13" style="color: var(--ion-color-dis);" >{{ $t('account.password.change') }}</ion-text>
            <ion-icon name="chevron-forward" color="arrow" style="font-size: 20px;margin-left: 5px;"></ion-icon>
            </div>

            <div class="lines"></div>

            <div class="list">
            <ion-text class="r15" style="flex:1">{{ $t('phone') }}</ion-text>
            <ion-text class="r13" style="color: var(--ion-color-dis);" >+34 600 00 00 00</ion-text>
            </div>

            <div class="lines"></div>

            <div class="list">
            <ion-text class="r15" style="flex:1">{{ $t('gender') }}</ion-text>
            <ion-text class="r13" style="color: var(--ion-color-dis);" >Mujer</ion-text>
            </div>

            <div class="lines"></div>

            <div class="list">
            <ion-text class="r15" style="flex:1">{{ $t('newsletter') }}</ion-text>
            <ion-text class="r13" style="color: var(--ion-color-dis);" >Si</ion-text>
            </div>

            <ion-button @click="toLogOut()" expand="block" style="margin-top: 20px;">{{ $t('logout') }}</ion-button>

        </div>


    </ion-page>
</template>

<style scoped>
.button-small {
    min-height: 1rem;
    height: 30px;
}
</style>