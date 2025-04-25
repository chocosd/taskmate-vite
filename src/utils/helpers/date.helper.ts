import { DateTime, DurationUnit } from 'luxon';

export default function DateHelper(date: string | Date | DateTime) {
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
        formatRelativeDueDate: () => {
            const now = DateTime.now();

            if (dateTime < now) {
                return `Overdue: ${dateTime.toRelative({ base: now })}`;
            }

            return `Due: ${dateTime.toRelative({ base: now })}`;
        },
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
