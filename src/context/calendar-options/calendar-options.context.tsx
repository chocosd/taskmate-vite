import { createContext, ReactNode, useState } from 'react';
import { CalendarOptions } from './calendar-options.model';

interface CalendarOptionsContextType {
    options: CalendarOptions;
    updateOptions: (newOptions: Partial<CalendarOptions>) => void;
    openOptions: () => void;
    closeOptions: () => void;
    isOptionsOpen: boolean;
}

export const CalendarOptionsContext = createContext<
    CalendarOptionsContextType | undefined
>(undefined);

interface CalendarOptionsProviderProps {
    children: ReactNode;
}

export function CalendarOptionsProvider({
    children,
}: CalendarOptionsProviderProps) {
    const [options, setOptions] = useState<CalendarOptions>({
        workStartHour: 9,
        workEndHour: 17,
        maxTaskDuration: 240, // 4 hours in minutes
        minTaskDuration: 15, // 15 minutes
        includeWeekends: false,
        bufferTime: 15, // 15 minutes buffer between tasks
        aiTemperature: 0.3,
        aiModel: 'gpt-3.5-turbo',
    });

    const [isOptionsOpen, setIsOptionsOpen] = useState(false);

    const updateOptions = (newOptions: Partial<CalendarOptions>) => {
        setOptions((prev) => ({ ...prev, ...newOptions }));
    };

    const openOptions = () => setIsOptionsOpen(true);
    const closeOptions = () => setIsOptionsOpen(false);

    return (
        <CalendarOptionsContext.Provider
            value={{
                options,
                updateOptions,
                openOptions,
                closeOptions,
                isOptionsOpen,
            }}
        >
            {children}
        </CalendarOptionsContext.Provider>
    );
}
