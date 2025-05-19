<script setup>
import { useAlerts } from '@/store/alerts.js'
import { useI18n } from 'vue-i18n';
import { getLocalData } from './utils/localdata';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { changeLanguage } from '@/plugins/i18n/index'

const router = useRouter();
const { locale } = useI18n();

onMounted(async () => {
  if (!await getLocalData('lang')) router.push({path: '/lang'});
  else {
    changeLanguage(await getLocalData('lang'))
  }
})

const destroyAlert = () => {
  useAlerts().alert.visible = false;
};
</script>
<template>
  <ion-app>
    <ion-router-outlet animated="false"></ion-router-outlet>
    <ion-toast
      :is-open="useAlerts().alert.visible"
      :class="useAlerts().alert.class"
      position="bottom"
      swipe-gesture="vertical"
      :message="useAlerts().alert.message ? $t(useAlerts().alert.message) : ''"
      :duration="3000"
      @didDismiss="destroyAlert()"
    />
</ion-app>
</template>

<style scoped>
  ion-toast.alert-success {
    --background: #017d2a;
    --box-shadow: 3px 3px 10px 0 rgba(0, 0, 0, 0.2);
    --color: #fff;
    text-align: center;
  }
  ion-toast.alert-error {
    --background: #a9071a;
    --box-shadow: 3px 3px 10px 0 rgba(0, 0, 0, 0.2);
    --color: #fff;
    text-align: center;
  }

</style>