import { createI18n } from 'vue-i18n';
import es from './locales/es.json'; // Carga el idioma por defecto

const i18n = createI18n({
  locale: 'es', // Idioma inicial
  fallbackLocale: 'es', // Idioma de respaldo
  messages: { es }, // Mensajes iniciales
});

export default i18n;

const loadLocaleMessages = async (locale) => {
  try {
    const messagesModule = await import(`./locales/${locale}.json`);
    const messages = messagesModule.default; // ✅ Asegurar que obtenemos el objeto real
    i18n.global.setLocaleMessage(locale, messages);
  } catch (error) {
    console.error(`Error al cargar el archivo de idioma '${locale}':`, error);
  }
};

export const changeLanguage = async (lang) => {
  if (!Object.keys(i18n.global.getLocaleMessage(lang)).length) {
    await loadLocaleMessages(lang);
  }

  i18n.global.locale = lang;
};