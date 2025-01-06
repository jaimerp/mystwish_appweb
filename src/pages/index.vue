<script setup>
import { ref, onMounted } from 'vue';

const APP_NAME = process.env.VUE_APP_NAME;
const VUE_ASSETS_URL = process.env.VUE_APP_ASSETS_URL;
const selectTab = ref('fans');

onMounted(() => {
});
</script>

<template>
    <ion-page>
        <ion-tabs>
            <ion-router-outlet></ion-router-outlet>
            <ion-tab-bar slot="bottom">
            <ion-tab-button tab="fans" href="/app/fans">
                <ion-icon icon="heart-half-outline" size="10" />
                {{ $t('tabs.fans') }}
            </ion-tab-button>
            <ion-tab-button tab="secrets" href="/app/secrets">
                <ion-icon icon="heart-outline" size="10" />
                {{ $t('tabs.secrets') }}
            </ion-tab-button>
            <ion-tab-button tab="account" href="/app/account">
                <ion-icon icon="person-circle-outline" size="10" />
                {{ $t('tabs.account') }}
            </ion-tab-button>
            </ion-tab-bar>
        </ion-tabs>
    </ion-page>
</template>

<style scoped>
.box {
  position: fixed;
  bottom: 15px;
  right: 15px;
  left: 15px;
}
.logo {
  display: flex;
  justify-content: center;
  align-items: start;
  height: 100%;
  margin-top: 30px;
}
</style>