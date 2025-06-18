<script setup>
import { useRouter } from 'vue-router';
import { defineEmits } from 'vue';
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
              <ion-text class="s26 title" style="line-height: 100%;">{{ $t('fans.new.title') }}</ion-text>
            </div>
      
            <font-awesome-icon :icon="['fas', 'heart']" class="mt-5 icon-heart" />
      
            <div class="ion-text-center">
              <ion-text class="r16 mt-5 d-block text2">{{ $t('fans.new.subtitle') }}</ion-text>
            </div>
          </div>
        </div>
        <ion-img :src="VUE_ASSETS_URL + 'imgs/arrow.png'" class="arrow" />
      </div> 
    </div>
  </template>
  
  <style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100%;
  padding: 20px;
}

.modal {
  margin-top: auto;
  margin-bottom: auto;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.box {
  background-color: var(--ion-color-primary-back);
  overflow-y: auto;
  max-height: 80vh;
  margin: 0 auto;
  border-radius: 1.5rem;
}
  .box::-webkit-scrollbar {
    width: 0;
    height: 0;
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
    padding: 2rem 2.5rem;
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
    margin-left: -4%;
  }
  .icon-heart {
    font-size: 12rem; color: var(--ion-color-primary);
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