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
        <ion-img :src="VUE_ASSETS_URL + 'logo.png'" :alt="APP_NAME" class="logo-image" />
      </div>
  
      <div class="d-flex flex-column modal">
        <div class="box d-flex flex-column">
          <div class="top">
            <ion-icon @click="done()" icon="close-outline" style="font-size: 24px; color: var(--ion-color-primary);" />
          </div>
          <div class="content">
            <div class="ion-text-center">
              <ion-text class="s26 title" style="line-height: 100%;">{{ $t('match.title') }}</ion-text>
            </div>
      
            <font-awesome-icon :icon="['fas', 'fire-flame-curved']" class="mt-5 icon-heart" />
      
            <div class="ion-text-center">
              <ion-text class="r16 mt-5 d-block text2">{{ $t('match.subtitle') }}</ion-text>
            </div>
            <div class="ion-text-center mt-4">
              <ion-button @click="done()" expand="block">
                {{ $t('ok') }}
              </ion-button>
            </div>
          </div>
        </div>
      </div> 
    </div>
  </template>
  
  <style scoped>
  .box {
    background-color: var(--ion-color-primary-back);
  }
  .container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 95vh;
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
    text-align: center;
    padding: 1rem 1.5rem;
  }
  .top {
    flex-shrink: 0;
    align-items: flex-end;
    display: flex;
    justify-content: flex-end;
  }

  .icon-image {
    height: 40%;
    margin-top: 30px;
  }
  
  .footer {
    justify-content: center;
    align-items: center;
    margin-bottom: 1rem;
  }
  .arrow {
    width: 120px;
    margin-top:-1px;
    margin-left: -3%;
  }
  .icon-heart {
    font-size: 12rem; color: var(--ion-color-primary);
  }
  .modal {
    flex-grow: 1;
    display: flex;
    align-items: center; /* centrado vertical */
    justify-content: center; /* centrado horizontal */
  }

  @media (max-height: 700px) {
    .icon-heart {
      font-size: 6.5rem;
    }
    .text2 {
      font-size: 0.9rem;
    }
    .title {
      font-size: 1.5rem;
    }
  }
  </style>