/**
 * Centralized translation management
 * Supports English (en) and Arabic (ar)
 */

export const TRANSLATIONS = {
  en: {
    // ========================================================================
    // DASHBOARD & GREETING PHRASES
    // ========================================================================
    greetingPhrases: [
      '{name}, time to Rise! ⚔️',
      'Level up today, {name}! 🚀',
      'Stay focused, {name}. 🔥'
    ],

    // ========================================================================
    // SETTINGS MODAL
    // ========================================================================
    settings: 'Settings',
    displayName: 'Display Name',
    interfaceScale: 'Interface Scale',
    themeColor: 'Theme Color',
    language: 'Language',
    saveChanges: 'Save Changes',
    logOut: 'Log Out',
    resetApp: 'Reset App',

    // ========================================================================
    // UI SCALE OPTIONS
    // ========================================================================
    small: 'Small',
    medium: 'Medium',
    large: 'Large',

    // ========================================================================
    // LEVEL NAMES & DESCRIPTIONS
    // ========================================================================
    levels: {
      theBeast: 'The Beast',
      theLegend: 'The Legend',
      theFocus: 'The Focus',
      theFlame: 'The Flame'
    },

    // ========================================================================
    // GENERAL LABELS
    // ========================================================================
    customColor: 'Custom Color',
    enterYourName: 'Enter your name',
    english: 'English',
    arabic: 'العربية'
  },

  ar: {
    // ========================================================================
    // DASHBOARD & GREETING PHRASES (ARABIC)
    // ========================================================================
    greetingPhrases: [
      '!⚔️ حان وقت النهوض يا {name}',
      '!🚀 حان وقت الإنجاز يا {name}',
      '!🔥 ركز يا {name}'
    ],

    // ========================================================================
    // SETTINGS MODAL (ARABIC)
    // ========================================================================
    settings: 'الإعدادات',
    displayName: 'اسم العرض',
    interfaceScale: 'مقياس الواجهة',
    themeColor: 'لون المظهر',
    language: 'اللغة',
    saveChanges: 'حفظ التغييرات',
    logOut: 'تسجيل الخروج',
    resetApp: 'إعادة تعيين جميع الإعدادات',

    // ========================================================================
    // UI SCALE OPTIONS (ARABIC)
    // ========================================================================
    small: 'صغير',
    medium: 'متوسط',
    large: 'كبير',

    // ========================================================================
    // LEVEL NAMES & DESCRIPTIONS (ARABIC)
    // ========================================================================
    levels: {
      theBeast: 'الوحش',
      theLegend: 'الأسطورة',
      theFocus: 'التركيز',
      theFlame: 'اللهب'
    },

    // ========================================================================
    // GENERAL LABELS (ARABIC)
    // ========================================================================
    customColor: 'لون مخصص',
    enterYourName: 'أدخل اسمك',
    english: 'English',
    arabic: 'العربية'
  }
};

/**
 * Get translation string
 * @param {string} language - Language code ('en' or 'ar')
 * @param {string} key - Translation key
 * @returns {string|object} Translation value
 */
export const getTranslation = (language, key) => {
  const lang = TRANSLATIONS[language] || TRANSLATIONS.en;
  return lang[key] || TRANSLATIONS.en[key];
};

/**
 * Get greeting phrase with name substitution
 * @param {string} language - Language code
 * @param {string} displayName - User's display name
 * @returns {string} Greeting phrase with name
 */
export const getGreetingPhrase = (language, displayName) => {
  const phrases = getTranslation(language, 'greetingPhrases');
  const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
  return randomPhrase.replace('{name}', displayName);
};
