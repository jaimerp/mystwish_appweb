<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import { getLocalData, setLocalData } from '@/utils/localdata';
import {languages} from '@/utils/languages';
import { changeLanguage } from '@/plugins/i18n/index'

const VUE_ASSETS_URL = process.env.VUE_APP_ASSETS_URL;
const APP_NAME = process.env.VUE_APP_NAME
const router = useRouter();
const currentLang = ref();

const toNext = async(lang) => {
  setLocalData('lang', lang);
  changeLanguage(lang);
  let intro = await getLocalData('intro');
  if (intro) router.push({path: '/auth/login'});
  else router.push({path: '/auth/intro'});
}

onMounted(async() => {
  currentLang.value = await getLocalData('lang');
})
</script>


<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <div class="ion-text-center logo">
          <ion-img :src="VUE_ASSETS_URL+'logo.png'" :alt="APP_NAME" style="max-width: 200px; height: auto;" />
        </div>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding" style="background-color: var(--ion-color-primary);" v-bind="$attrs">
      <div class="box" style="margin-bottom: 20px;">
        <div class="ion-text-center">
            <ion-text class="s26">{{ $t('language.title') }}</ion-text>
          </div>
          <div class="ion-text-center" style="margin-top: 15px;">
            <ion-grid>
              <ion-row>
                <ion-col size="6" class="flag-container" v-for="lang in languages" :key="lang">
                  <div class="grid-item" :class="{lang_selected: lang.id == currentLang }">
                    <ion-img :src="VUE_ASSETS_URL+'imgs/langs/'+lang.id+'.gif'" :alt="lang.title" class="flag-image" style="height: 77px;" @click="toNext(lang.id)"></ion-img>
                    <ion-text class="r12">{{ lang.title }}</ion-text>
                  </div>
                </ion-col>
              </ion-row>
            </ion-grid>
          </div>
      </div>
    </ion-content>
  </ion-page>
</template>
  
  <style scoped>
  ion-header ion-toolbar {--background: var(--ion-color-primary) !important;background: var(--ion-color-primary) !important;}
  ion-header ion-toolbar .ios {padding-top: 30px;}
  .box{position:fixed; bottom: 0;right:15px;left:15px;}
  .logo {
    display: flex; justify-content: center; align-items: center;
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