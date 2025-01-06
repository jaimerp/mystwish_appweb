import * as IonicVue from '@ionic/vue';

export default (app) => {
  // Registrar todos los componentes de Ionic globalmente
  Object.keys(IonicVue).forEach((key) => {
    if (key.startsWith('Ion')) {
      app.component(key, IonicVue[key]);
    }
  });
};