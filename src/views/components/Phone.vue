<script setup>
import { ref, defineProps, defineEmits, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { countryPrefixes } from '@/utils/prefix.js';

const { t } = useI18n();
const props = defineProps({
  prefix: String,
  phone: String,
});

const emit = defineEmits(['update:prefix', 'update:phone']); // Emitir eventos para el padre

const phone = ref(props.phone);
const prefix = ref(props.prefix);

// Emitir cambios cuando cambian los valores
const updatePrefix = (value) => {
  prefix.value = value;
  emit('update:prefix', value);
};

const updatePhone = (event) => {
  let value = event.target.value.replace(/\D/g, '').slice(0, 9);
  phone.value = value.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
  emit('update:phone', phone.value);
};

const customModalOptions = {
  header: t('country'),
  breakpoints: [0, 0.8],
  initialBreakpoint: 0.8,
  buttons: [
    {
      text: '',
      icon: 'close',
      role: 'cancel'
    }
  ]
};

onMounted(async () => {
  await geoIpLookup(
    (countryCode) => {
      const defaultPrefix = countryPrefixes.find((item) => item.code === countryCode)?.dialCode;
      updatePrefix(defaultPrefix);
    },
    () => {
      updatePrefix(countryPrefixes.find((item) => item.code === 'ES')?.dialCode);
    }
  );
});

const geoIpLookup = (success, failure) => {
  try {
    fetch("https://ipapi.co/json")
      .then((res) => res.json())
      .then((data) => success(data.country_code))
      .catch(() => failure());
  } catch (error) {
    console.error(`Error al cargar la geoIP:`, error);
  }
};
</script>

<template>
  <ion-item lines="full">
    <ion-select 
      aria-label="prefix" 
      interface="modal" 
      :placeholder="$t('country')" 
      v-model="prefix" 
      :interface-options="customModalOptions"
      :selectedText="prefix"
      class="phone-input"
    >
      <ion-select-option v-for="item in countryPrefixes" :key="item.dialCode" :value="item.dialCode">
        {{ item.dialCode }} - {{ item.name }}
      </ion-select-option>
    </ion-select>

    <ion-input 
      type="tel" 
      placeholder="600 000 000" 
      v-model="phone" 
      class="phone-input"
      @input="updatePhone"
    />
  </ion-item>
</template>

<style>
.phone-input {
  font-size: 1.2rem !important;
}
ion-item {
  --background: transparent !important;
  background: transparent !important;
}

ion-select {
  --placeholder-color: #333;
  --placeholder-opacity: 1;
  --background: transparent !important;
  --ion-background-color: transparent !important;
  background: transparent !important;
}
ion-select::part(text) {
  color: #545ca7;
}

ion-input {
  margin-left: 10px;
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

ion-select-modal {
  --background: #fff !important;
  background: #fff !important;
}

ion-select-modal ion-content {
  --background: #fff !important;
  background: #fff !important;
}
ion-list ion-item {
  --background: #fff !important;
  background: #fff !important;
  --color: #333 !important;
  color: #333 !important;
}

ion-item {
  --border-width: 0 !important;
  --inner-border-width: 0 !important;
}


ion-radio.sc-ion-select-modal-ios::after
{
  border: 0px;
}

ion-list {
  overflow-y: auto !important;
  max-height: 65vh !important;
}
</style>