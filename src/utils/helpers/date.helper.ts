import { DateTime, DurationUnit } from 'luxon';

export default function DateHelper(date?: string | Date | DateTime) {
    if (!date) {
        return {
            now: () => DateTime.now().toISO(),
        };
    }

    const dateTime = formatDatesToDateTime(date);

    return {
        add: (value: number, unit: DurationUnit = 'days') =>
            dateTime.plus({ [unit]: value }).toISO(),
        subtract: (value: number, unit: DurationUnit = 'days') =>
            dateTime.minus({ [unit]: value }).toISO(),
        format: (formatString: string = 'yyyy-MM-dd') =>
            dateTime.toFormat(formatString),
        toISO: () => dateTime.toISO(),
        raw: () => dateTime,
    };
}

function formatDatesToDateTime(
    date?: string | Date | DateTime
): DateTime<boolean> {
    if (!date) {
        return DateTime.now();
    }
    if (date instanceof DateTime) {
        return date;
    }
    if (date instanceof Date) {
        return DateTime.fromJSDate(date);
    }
    if (typeof date === 'string') {
        return DateTime.fromISO(date);
    }

    throw new Error('Invalid date format');
}
