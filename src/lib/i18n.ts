// Translation type definitions
export type TranslationKey = string;
export type TranslationValue = string;
export type Translations = Record<TranslationKey, TranslationValue>;
export type Locale = string;

// Interpolation parameters
export type InterpolationParams = Record<string, string | number>;

// Default locale
export const DEFAULT_LOCALE: Locale = 'es';

// Translation store
let currentTranslations: Translations = {};
let currentLocale: Locale = DEFAULT_LOCALE;

/**
 * Initialize the i18n system with translations for a specific locale
 */
export function initI18n(
    locale: Locale,
    translations: Translations
): void {
    currentLocale = locale;
    currentTranslations = translations;
}

/**
 * Get the current locale
 */
export function getCurrentLocale(): Locale {
    return currentLocale;
}

/**
 * Get a nested value from an object using dot notation
 */
function getNestedValue(
    obj: Record<string, unknown>,
    path: string
): unknown {
    return path.split('.').reduce((current: unknown, key: string) => {
        return current &&
            typeof current === 'object' &&
            current !== null &&
            key in current
            ? (current as Record<string, unknown>)[key]
            : undefined;
    }, obj);
}

/**
 * Get a translation by key with optional interpolation
 * Supports nested keys using dot notation (e.g., "TASK_VIEW.ORGANIZE_SCHEDULE")
 */
export function translate(
    key: TranslationKey,
    params?: InterpolationParams
): string {
    const translation = getNestedValue(currentTranslations, key);

    if (!translation || typeof translation !== 'string') {
        console.warn(`Translation key not found: ${key}`);
        return key; // Return the key as fallback
    }

    if (!params) {
        return translation;
    }

    // Replace interpolation parameters
    return translation.replace(
        /\{(\w+)\}/g,
        (match: string, paramName: string) => {
            const value = params[paramName];
            if (value === undefined) {
                console.warn(
                    `Interpolation parameter not found: ${paramName} for key: ${key}`
                );
                return match;
            }
            return String(value);
        }
    );
}

/**
 * Check if a translation key exists
 */
export function hasTranslation(key: TranslationKey): boolean {
    return getNestedValue(currentTranslations, key) !== undefined;
}

/**
 * Get all available translation keys
 */
export function getTranslationKeys(): TranslationKey[] {
    const keys: string[] = [];

    function extractKeys(
        obj: Record<string, unknown>,
        prefix: string = ''
    ): void {
        for (const key in obj) {
            const fullKey = prefix ? `${prefix}.${key}` : key;
            const value = obj[key];
            if (typeof value === 'object' && value !== null) {
                extractKeys(
                    value as Record<string, unknown>,
                    fullKey
                );
            } else {
                keys.push(fullKey);
            }
        }
    }

    extractKeys(currentTranslations);
    return keys;
}

/**
 * Detect the user's preferred locale from the HTML lang attribute or browser
 */
export function detectLocale(): Locale {
    // Check HTML lang attribute first
    const htmlLang = document.documentElement.lang;
    if (htmlLang) {
        return htmlLang;
    }

    // Fallback to browser language
    const browserLang = navigator.language;
    if (browserLang) {
        return browserLang.split('-')[0]; // Get primary language code
    }

    return DEFAULT_LOCALE;
}
