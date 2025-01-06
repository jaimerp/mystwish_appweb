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
    const messages = await import(`./locales/${locale}.json`);
    i18n.global.setLocaleMessage(locale, messages.default);
  } catch (error) {
    console.error(`Error al cargar el archivo de idioma '${locale}':`, error);
  }
};

export const changeLanguage = async (lang) => {
  // Cargar mensajes si aún no están disponibles
  if (!i18n.global.availableLocales.includes(lang)) {
    await loadLocaleMessages(lang);
  }
  // Cambiar el idioma actual
  i18n.global.locale = lang;
};