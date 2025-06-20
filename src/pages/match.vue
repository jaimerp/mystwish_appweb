<script setup>
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { getLocalData, setLocalData } from '@/utils/localdata';
import {languages} from '@/utils/languages';
import { changeLanguage } from '@/plugins/i18n/index'

const VUE_ASSETS_URL = process.env.VUE_APP_ASSETS_URL;
const APP_NAME = process.env.VUE_APP_NAME
const router = useRouter();

</script>


<template>
  <ion-page>
    <ion-content :fullscreen="true" class="ion-padding" style="background-color: var(--ion-color-primary);" v-bind="$attrs">
      <div class="ion-text-center logo">
        <ion-img :src="VUE_ASSETS_URL+'logo.png'" :alt="APP_NAME" style="max-width: 100px; height: auto;" />
      </div>

      <div class="ion-text-center" style="margin-top: 50px;">
        <ion-text class="s26" >We create your training plan</ion-text>
      </div>

      <div class="column" style="align-items: center;margin-top: 20px;">
        <ion-img src="../../../../assets/image/a12.svg" style="height: 250px;width: 250px;"/>
      </div>

      <div class="ion-text-center" style="margin-top: 20px;">
        <ion-text class="r15" >We create a workout according to demographic profile, activity level and interests</ion-text>
      </div>

      <ion-button routerLink="/tabs" expand="block" style="margin: 30px 0;">Start Training</ion-button>

    </ion-content>
  </ion-page>
</template>
  
  <style scoped>
  .box{position:fixed; bottom: 0;right:15px;left:15px;}
  .logo {
    display: flex; justify-content: center; align-items: center; height: 55vh;
  }
  .flag-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .flag-image {
    width: 100%;
    max-width: 150px;
    border-radius: 50%; /* Hace las imágenes circulares */
  }
  .grid-item {display: flex;flex-direction: column;margin-bottom: 20px;}
  .grid-item .lang_selected {background-color: red;}
</style>