import {
    InterpolationParams,
    translate,
    TranslationKey,
} from '@lib/i18n';
import { useCallback } from 'react';

/**
 * React hook for translations
 * Provides a convenient way to use translations in components
 */
export function useTranslation() {
    const translateFunction = useCallback(
        (
            key: TranslationKey,
            params?: InterpolationParams
        ): string => {
            return translate(key, params);
        },
        []
    );

    return { translate: translateFunction };
}

/**
 * Type-safe translation hook with predefined keys
 * This provides better TypeScript support and autocomplete
 */
export function useTypedTranslation() {
    const translateFunction = useCallback(
        (
            key: TranslationKey,
            params?: InterpolationParams
        ): string => {
            return translate(key, params);
        },
        []
    );

    return { translate: translateFunction };
}
