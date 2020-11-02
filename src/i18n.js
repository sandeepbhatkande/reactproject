import i18n from "i18next";
import { reactI18nextModule } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from './I18N/en/translation.json';//English
import translationDE from './I18N/de/translation.json';//German
import translationFR from './I18N/fr/translation.json';//French
import translationCN from './I18N/zh/translation.json';//Chinese
import translationBR from './I18N/pt/translation.json';//Portugese

// the translations
const resources = {
  en: {
    translation: translationEN
  },
  de: {
    translation: translationDE
  },
  fr: {
    translation: translationFR
  },
  zh: {
    translation: translationCN
  },
  pt: {
    translation: translationBR
  }
};

i18n
  .use(LanguageDetector) // detect user language
  .use(reactI18nextModule) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "en",
    fallbackLng: "en", // use en if detected lng is not available

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;