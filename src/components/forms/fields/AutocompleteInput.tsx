import { useEffect, useState } from 'react';
import BaseInput, { FormInputProps } from './BaseInput';

export type AutocompleteOption = {
    label: string;
    value: string;
};

export type AutocompleteInputProps = FormInputProps & {
    value: AutocompleteOption | null;
    onChange: (option: AutocompleteOption | null) => void;
    loadOptions: (input: string) => Promise<AutocompleteOption[]>;
    placeholder?: string;
};

export default function AutocompleteInput({
    value,
    onChange,
    loadOptions,
    label,
    hint,
    error,
    disabled,
    placeholder = 'Search...',
}: AutocompleteInputProps) {
    const [input, setInput] = useState(value?.label || '');
    const [options, setOptions] = useState<AutocompleteOption[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);

    useEffect(() => {
        if (!input || disabled || !hasInteracted) {
            setOptions([]);
            setIsOpen(false);
            return;
        }

        const fetchOptions = async () => {
            setLoading(true);
            try {
                const results = await loadOptions(input);
                setOptions(results);
                setIsOpen(true);
            } finally {
                setLoading(false);
            }
        };

        const debounce = setTimeout(fetchOptions, 300);

        return () => clearTimeout(debounce);
    }, [input, loadOptions, disabled, hasInteracted]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest('.autocomplete-wrapper')) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener(
                'mousedown',
                handleClickOutside
            );
    }, []);

    const handleSelect = (option: AutocompleteOption) => {
        setInput(option.label);
        setIsOpen(false);
        onChange(option);
    };

    const handleAutoCompleteOnChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = e.target.value;

        if (!value) {
            setIsOpen(false);
            setOptions([]);
        }

        setInput(value);
    };

    return (
        <BaseInput
            label={label}
            hint={hint}
            error={error}
            disabled={disabled}
        >
            <div className="relative autocomplete-wrapper">
                <input
                    type="text"
                    disabled={disabled}
                    placeholder={placeholder}
                    value={input}
                    onChange={handleAutoCompleteOnChange}
                    onFocus={() => {
                        setHasInteracted(true);
                    }}
                    className="w-full px-4 py-2 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm"
                />
                {isOpen && (
                    <ul className="absolute top-full left-0 w-full bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded mt-1 shadow-lg z-10">
                        {loading ? (
                            <li className="px-4 py-2 text-center text-sm text-zinc-500">
                                Loading...
                            </li>
                        ) : options.length ? (
                            options.map((option) => (
                                <li
                                    key={option.value}
                                    className="px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer text-sm"
                                    onClick={() =>
                                        handleSelect(option)
                                    }
                                >
                                    {option.label}
                                </li>
                            ))
                        ) : (
                            <li className="px-4 py-2 text-center text-sm text-zinc-500">
                                No results found
                            </li>
                        )}
                    </ul>
                )}
            </div>
        </BaseInput>
    );
}
