import { createApp } from 'vue';
import App from './App.vue';
import router from './plugins/router'
import pinia from './store';
import i18n from './plugins/i18n';
import { Ability } from '@casl/ability';
// eslint-disable-next-line no-unused-vars
import { createAbility } from '@casl/vue';
import registerIonicComponents from './plugins/registerIonicComponents';
import '@/theme/variables.scss';
import '@/theme/global.scss';
import '@/theme/fonts.scss';
// Ionic Framework
import { IonicVue } from '@ionic/vue';
// Importa la configuración de los iconos
import '@/plugins/ionicons';

const app = createApp(App);
const ability = new Ability();

app.use(router);
app.use(pinia);
app.use(i18n);
app.use(IonicVue);
app.provide('ability', ability);

// Registrar automáticamente todos los componentes de Ionic
registerIonicComponents(app);

app.mount('#app');
