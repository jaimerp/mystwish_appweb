<script setup>
import { useRouter } from 'vue-router';
import { defineEmits, onMounted } from 'vue';
import { getLocalData, setLocalData } from '@/utils/localdata';
import {languages} from '@/utils/languages';
import { changeLanguage } from '@/plugins/i18n/index'
import { useTabsStore } from '@/store/tabs';

const VUE_ASSETS_URL = process.env.VUE_APP_ASSETS_URL;
const APP_NAME = process.env.VUE_APP_NAME
const router = useRouter();
const tabsStore = useTabsStore();

const emit = defineEmits(["done"]);

const done = () => {
  emit("done", {});
};

</script>


  <template>
    <div class="container">
      <div class="logo">
        <ion-img :src="VUE_ASSETS_URL + 'logo2.png'" :alt="APP_NAME" class="logo-image" />
      </div>
  
      <div class="content">
        <div class="ion-text-center">
          <ion-text class="s26">{{ $t('match.title') }}</ion-text>
        </div>
  
        <div class="mt-2">
          <img :src="VUE_ASSETS_URL + 'imgs/icons/heart-alert.svg'" class="icon-image" />
        </div>

        <div class="ion-text-center">
          <ion-text class="r15 d-block">{{ $t('match.subtitle') }}</ion-text>
        </div>
      </div>
  
      <div class="footer">
        <ion-button @click="done()" expand="block">
          {{ $t('ok') }}
        </ion-button>
      </div>
    </div>
  </template>
  
  <style scoped>
  .container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100vh;
    padding: 20px;
  }
  
  .logo {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .logo-image {
    max-width: 200px;
    height: auto;
  }
  
  .content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
    text-align: center;
  }

  .icon-image {
    width: 90%;
    margin-top: 30px;
  }
  
  .footer {
    justify-content: center;
    align-items: center;
    margin-bottom: 1rem;
  }
  </style>