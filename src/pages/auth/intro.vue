<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const VUE_ASSETS_URL = process.env.VUE_APP_ASSETS_URL;
const APP_NAME = process.env.VUE_APP_NAME
const swiperRef = ref();
const router = useRouter();

const toRegister = () => {
    router.push({path: '/auth/register'});
}
</script>


<template>
  <ion-page>
    <ion-content :fullscreen="true" class="ion-padding" style="background-color: var(--ion-color-primary);" v-bind="$attrs">
      <div class="ion-text-center logo">
        <img :src="VUE_ASSETS_URL+'logo.png'" :alt="APP_NAME" style="max-width: 200px; height: auto;">
      </div>
      <swiper
        ref="swiperRef"
        :modules="[Navigation, Pagination]"
        class="mySwiper"
      >
        <swiper-slide>
          <div class="box">
            <div class="ion-text-center">
              <ion-text class="s26">{{ $t('intro1.title') }}</ion-text>
            </div>
            <div class="ion-text-center" style="margin-top: 5px;">
              <ion-text class="r15" style="color: #404B52;">{{ $t('intro1.subtitle') }}</ion-text>
            </div>

            <div class="list" style="justify-content: center;margin-top: 10px;">
              <div style="height: 8px;width: 8px;border-radius: 10px;background-color: #1F1F1F;"></div>
              <div style="height: 8px;width: 8px;border-radius: 10px;background-color: #DAE0E8;margin-left: 5px;"></div>
              <div style="height: 8px;width: 8px;border-radius: 10px;background-color: #DAE0E8;margin-left: 5px;"></div>
              <div style="height: 8px;width: 8px;border-radius: 10px;background-color: #DAE0E8;margin-left: 5px;"></div>
            </div>

            <ion-button @click="swiperRef?.$el?.swiper?.slideNext()" expand="block" style="margin-top: 20px;">{{ $t('next') }}</ion-button>

          </div>
        </swiper-slide>
  
        <swiper-slide>
          <div class="box">
            <div class="ion-text-center">
              <ion-text class="s26">{{ $t('intro2.title') }}</ion-text>
            </div>
            <div class="ion-text-center" style="margin-top: 5px;">
              <ion-text class="r15" style="color: #404B52;">{{ $t('intro2.subtitle') }}</ion-text>
            </div>

            <div class="list" style="justify-content: center;margin-top: 10px;">
              <div style="height: 8px;width: 8px;border-radius: 10px;background-color: #DAE0E8;"></div>
              <div style="height: 8px;width: 8px;border-radius: 10px;background-color: #1F1F1F;margin-left: 5px;"></div>
              <div style="height: 8px;width: 8px;border-radius: 10px;background-color: #DAE0E8;margin-left: 5px;"></div>
              <div style="height: 8px;width: 8px;border-radius: 10px;background-color: #DAE0E8;margin-left: 5px;"></div>
            </div>

            <ion-button @click="swiperRef?.$el?.swiper?.slideNext()" expand="block" style="margin-top: 20px;">{{ $t('next') }}</ion-button>

          </div>
        </swiper-slide>

        <swiper-slide>
          <div class="box">
            <div class="ion-text-center">
              <ion-text class="s26">{{ $t('intro3.title') }}</ion-text>
            </div>
            <div class="ion-text-center" style="margin-top: 5px;">
              <ion-text class="r15" style="color: #404B52;">{{ $t('intro3.subtitle') }}</ion-text>
            </div>

            <div class="list" style="justify-content: center;margin-top: 10px;">
              <div style="height: 8px;width: 8px;border-radius: 10px;background-color: #DAE0E8;"></div>
              <div style="height: 8px;width: 8px;border-radius: 10px;background-color: #DAE0E8;margin-left: 5px;"></div>
              <div style="height: 8px;width: 8px;border-radius: 10px;background-color: #1F1F1F;margin-left: 5px;"></div>
              <div style="height: 8px;width: 8px;border-radius: 10px;background-color: #DAE0E8;margin-left: 5px;"></div>
            </div>

            <ion-button @click="swiperRef?.$el?.swiper?.slideNext()" expand="block" style="margin-top: 20px;">{{ $t('next') }}</ion-button>

          </div>
        </swiper-slide>

        <swiper-slide>
          <div class="box">
            <div class="ion-text-center">
              <ion-text class="s26">{{ $t('intro4.title') }}</ion-text>
            </div>
            <div class="ion-text-center" style="margin-top: 5px;">
              <ion-text class="r15" style="color: #404B52;">{{ $t('intro4.subtitle') }}</ion-text>
            </div>

            <div class="list" style="justify-content: center;margin-top: 10px;">
              <div style="height: 8px;width: 8px;border-radius: 10px;background-color: #DAE0E8;"></div>
              <div style="height: 8px;width: 8px;border-radius: 10px;background-color: #DAE0E8;margin-left: 5px;"></div>
              <div style="height: 8px;width: 8px;border-radius: 10px;background-color: #DAE0E8;margin-left: 5px;"></div>
              <div style="height: 8px;width: 8px;border-radius: 10px;background-color: #1F1F1F;margin-left: 5px;"></div>
            </div>

            <ion-button @click="toRegister()" expand="block" style="margin-top: 20px;">{{ $t('register') }}</ion-button>

          </div>
        </swiper-slide>
      </swiper>
    </ion-content>
  </ion-page>
</template>
  
  <style scoped>
  .slide-content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .mySwiper {
    position:fixed;top: 0;bottom:0;left:0;right:0;
    padding-bottom: 50px;;
  }
  .box{position:fixed; bottom: 0;right:15px;left:15px;}
  .logo {
    display: flex; justify-content: center; align-items: center; height: 55vh;
  }
  </style>