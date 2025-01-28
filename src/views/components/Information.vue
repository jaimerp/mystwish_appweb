<script setup>
import { ref, onMounted, defineProps } from 'vue';
import { useI18n } from 'vue-i18n';
import axios from '@/plugins/axios.js';
import { getLocalData, setLocalData } from '@/utils/localdata'

const { t } = useI18n();
const isVisible = ref(false);
const textInformation = ref(false);

const props = defineProps({
  typeInfo: undefined,
});

// Cargar datos al montar la página
onMounted(async () => {
  if (props.typeInfo){
    textInformation.value = '';
    if (props.typeInfo == 'FANS')
      textInformation.value = 'fans.information';
    else if (props.typeInfo == 'SECRETS')
      textInformation.value = 'secrets.information';
    else if (props.typeInfo == 'MATCHS')
      textInformation.value = 'match.information';
    
    isVisible.value = getLocalData('MW_Info_'+props.typeInfo) ? !getLocalData('MW_Info_'+props.typeInfo) : true ;
  }
});

const hideInformation = () => {
  setLocalData('MW_Info_'+props.typeInfo, true);
  isVisible.value = false;
}

</script>

<template>
  <div v-if="isVisible" class="information">
    <div class="close">
      <ion-icon @click="hideInformation" icon="close-outline" style="font-size: 24px; color: var(--ion-color-primary);" />
    </div>
    <ion-text>{{ $t(textInformation) }}</ion-text>
  </div>
</template>

<style scoped>
.information {
  margin-top: 10px;
  color: #121212;
  border: 1px solid #121212;
  border-radius: 10px; 
  padding: 10px;
  font-size: 0.8rem;
  font-weight: normal,
}
.information .close {
  float: right;
}
</style>