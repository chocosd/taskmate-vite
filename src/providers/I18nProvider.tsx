import { DEFAULT_LOCALE, detectLocale, initI18n } from '@lib/i18n';
import { useEffect, useState } from 'react';

interface I18nProviderProps {
    children: React.ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const initializeI18n = async () => {
            try {
                // Detect the user's preferred locale
                const locale = detectLocale();

                // Try to load translations for the detected locale
                let translations;
                try {
                    const module = await import(
                        `../locales/${locale}.json`
                    );
                    translations = module.default;
                } catch {
                    console.warn(
                        `Translations for locale '${locale}' not found, falling back to '${DEFAULT_LOCALE}'`
                    );
                    // Fallback to default locale
                    const defaultModule = await import(
                        `../locales/${DEFAULT_LOCALE}.json`
                    );
                    translations = defaultModule.default;
                }

                // Initialize the i18n system
                initI18n(locale, translations);
                setIsInitialized(true);
            } catch (error) {
                console.error('Failed to initialize i18n:', error);
                // Initialize with empty translations as fallback
                initI18n(DEFAULT_LOCALE, {});
                setIsInitialized(true);
            }
        };

        initializeI18n();
    }, []);

    if (!isInitialized) {
        // You could show a loading spinner here if needed
        return null;
    }

    return <>{children}</>;
}
