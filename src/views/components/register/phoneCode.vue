<template>
  <div class="code-container">
    <ion-input
      v-for="(value, index) in code"
      :key="index"
      class="code-input"
      type="tel"
      inputmode="numeric"
      pattern="[0-9]*"
      maxlength="1"
      ref="inputRefs"
      v-model="code[index]"
      @input="onOtpChange(index, $event)"
      @keydown.backspace="onBackspace(index)"
      @paste="onPaste"
      autocomplete="one-time-code"
    />
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, defineEmits } from 'vue';

const codeConfig = { length: 4 }; // Número de dígitos del código
const code = ref(new Array(codeConfig.length).fill(''));
const inputRefs = ref([]); // Referencias a los inputs
const emit = defineEmits(["updateCode"]);

// Emitir el código actualizado
const updateCode = () => {
  emit("updateCode", code.value.join(''));
};

// Manejar el cambio en cada input
const onOtpChange = async (index, event) => {
  const value = event.target.value.replace(/\D/g, ''); // Solo números
  code.value[index] = value ? value[0] : ''; // Tomar solo el primer carácter

  // Mover foco al siguiente input si hay un valor
  if (value && index < codeConfig.length - 1) {
    await nextTick();
    inputRefs.value[index + 1]?.$el?.setFocus();
  }

  updateCode();
};

// Manejar la tecla "Backspace"
const onBackspace = async (index) => {
  if (code.value[index] === '' && index > 0) {
    await nextTick();
    inputRefs.value[index - 1]?.$el?.setFocus();
  }
  updateCode();
};

// Manejar eventos de pegar (paste)
const onPaste = async (event) => {
  event.preventDefault(); // Prevenir el comportamiento por defecto

  const pasteData = event.clipboardData.getData('text').replace(/\D/g, ''); // Solo números
  if (!pasteData) return;

  const values = pasteData.slice(0, codeConfig.length).split(''); // Separar cada número
  values.forEach((val, idx) => {
    if (idx < codeConfig.length) {
      code.value[idx] = val;
    }
  });

  await nextTick();
  inputRefs.value[Math.min(values.length, codeConfig.length) - 1]?.$el?.setFocus();
  updateCode();
};

// Enfocar el primer input al cargar
onMounted(async () => {
  await nextTick();
  inputRefs.value[0]?.$el?.setFocus();
});
</script>

<style scoped>
.code-container {
  justify-content: center;
  align-items: center;
  display: flex;
  gap: 10px;
}

.code-input {
    width: 40px;
    height: 50px;
    text-align: center;
    font-size: 18px;
    border: 1px solid #ccc;
    border-radius: 5px;
    outline: none;
    --padding-start: 0; /* Ionic padding reset */
    --padding-end: 0;   /* Ionic padding reset */
    --color: var(--ion-color-primary);
  }
</style>