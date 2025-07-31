import { useContext } from 'react';
import { CalendarOptionsContext } from './calendar-options.context';

export function useCalendarOptions() {
    const context = useContext(CalendarOptionsContext);
    if (!context) {
        throw new Error(
            'useCalendarOptions must be used within a CalendarOptionsProvider'
        );
    }
    return context;
}
