<script setup>
import { ref, onMounted, defineProps } from 'vue';
import { useI18n } from 'vue-i18n';

// import { IonList, IonItem, IonSelect, IonSelectOption } from '@ionic/vue';
//   import { defineComponent } from 'vue';

//   export default defineComponent({
//     components: { IonList, IonItem, IonSelect, IonSelectOption },
//   })

const { t } = useI18n();

const props = defineProps({
  prefix: undefined,
  phone: undefined,
});

const phone = ref(props.phone);
const prefix = ref(props.prefix);

// Cargar datos al montar la página
onMounted(async () => {

});

const customModalOptions = {
  header: t('country'),
  breakpoints: [0, 0.5],
  initialBreakpoint: 0.5,
};

</script>

<template>
  <ion-item>
    <ion-select aria-label="Fruit" interface="modal" :placeholder="$t('country')" v-model="prefix" :interface-options="customModalOptions">
      <ion-select-option value="apples">Apples</ion-select-option>
      <ion-select-option value="oranges">Oranges</ion-select-option>
      <ion-select-option value="bananas">Bananas</ion-select-option>
    </ion-select>
    <ion-input type="tel" placeholder="888-888-8888"></ion-input>
  </ion-item>
</template>

<style scoped>
ion-item {
  --background: transparent !important;
  background: transparent !important;
}

ion-select {
  --placeholder-color: #971e49;
  --placeholder-opacity: 1;
  --background: transparent !important;
  --ion-background-color: transparent !important;
  background: transparent !important;
}
ion-select::part(text) {
  color: #545ca7;
}

ion-input {
  --background: transparent !important;
  --ion-background-color: transparent !important;
  background: transparent !important;
}
ion-item::part(native) {
  background: transparent !important;
}

ion-select::part(native) {
  background: transparent !important;
}

ion-input::part(native) {
  background: transparent !important;
}
</style>