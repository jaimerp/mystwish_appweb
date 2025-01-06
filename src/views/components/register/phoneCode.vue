<template>
    <div class="code-container">
      <ion-input
        v-for="(value, index) in code"
        :key="index"
        class="code-input"
        type="text"
        maxlength="1"
        v-model="code[index]"
        @input="onOtpChange(index, $event.target.value)"
        @keydown.backspace="onBackspace(index)"
        @paste="onPaste($event)"
        autocomplete="off"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, nextTick, onMounted, defineEmits } from 'vue';
  
  const codeConfig = {
    length: 4, // Número de dígitos
  };
  
  const code = ref(new Array(codeConfig.length).fill(''));
  
  const emit = defineEmits(["updateCode"]);
  
  function updateCode(value) {
    emit("updateCode", value);
  }
  
  // Manejar cambios en el OTP
  const onOtpChange = async (index, value) => {
    if (value.length > 1) {
      code.value[index] = value[0];
    } else {
      code.value[index] = value;
    }
  
    // Mover foco al siguiente input
    if (value && index < codeConfig.length - 1) {
      await nextTick();
      const nextInput = document.querySelectorAll('.code-input')[index + 1];
      nextInput?.setFocus();
    }
  
    updateCode(code.value.join(''));
  };
  
  // Manejar la tecla "Backspace"
  const onBackspace = async (index) => {
    if (code.value[index] === '' && index > 0) {
      await nextTick();
      const prevInput = document.querySelectorAll('.code-input')[index - 1];
      prevInput?.setFocus();
    }
    updateCode(code.value.join(''));
  };
  
  // Manejar eventos de pegar (paste)
  const onPaste = async (event) => {
    event.preventDefault(); // Prevenir el comportamiento por defecto
    const pasteData = event.clipboardData.getData('text'); // Obtener los datos del portapapeles
  
    if (pasteData) {
      const values = pasteData.slice(0, codeConfig.length).split(''); // Dividir los datos
      values.forEach((val, idx) => {
        if (idx < codeConfig.length) {
          code.value[idx] = val;
        }
      });
  
      await nextTick();
      const lastFilledIndex = Math.min(values.length, codeConfig.length) - 1;
      const nextInput = document.querySelectorAll('.code-input')[lastFilledIndex];
      nextInput?.setFocus(); // Mover foco al último input completado
    }
    updateCode(code.value.join(''));
  };
  
  // Enfocar el primer input al cargar
  onMounted(async () => {
    await nextTick(); // Asegurarse de que los elementos estén en el DOM
    const firstInput = document.querySelector('.code-input');
    firstInput?.setFocus(); // Enfocar el primer input
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