import { FormFieldType } from '@components/forms/form-field-types.enum';
import { FormField } from '@components/forms/form-types.model';
import FormModal from '@components/ui/FormModal';
import { CalendarOptions } from '@context/calendar-options/calendar-options.model';
import { useCalendarOptions } from '@context/calendar-options/useCalendarOptions';

export default function CalendarOptionsModal() {
    const { options, updateOptions, isOptionsOpen, closeOptions } =
        useCalendarOptions();

    const fields: FormField<CalendarOptions>[] = [
        {
            name: 'workStartHour',
            type: FormFieldType.NUMBER,
            label: 'Work Start Hour',
            config: {
                min: 0,
                max: 23,
                hint: 'Hour when your workday starts (0-23)',
            },
        },
        {
            name: 'workEndHour',
            type: FormFieldType.NUMBER,
            label: 'Work End Hour',
            config: {
                min: 0,
                max: 23,
                hint: 'Hour when your workday ends (0-23)',
            },
        },
        {
            name: 'maxTaskDuration',
            type: FormFieldType.NUMBER,
            label: 'Maximum Task Duration (minutes)',
            config: {
                min: 15,
                max: 480,
                hint: 'Maximum time AI can allocate to a single task (15-480 minutes)',
            },
        },
        {
            name: 'minTaskDuration',
            type: FormFieldType.NUMBER,
            label: 'Minimum Task Duration (minutes)',
            config: {
                min: 5,
                max: 60,
                hint: 'Minimum time AI can allocate to a single task (5-60 minutes)',
            },
        },
        {
            name: 'includeWeekends',
            type: FormFieldType.CHECKBOX,
            label: 'Include Weekends',
            config: {
                hint: 'Allow AI to schedule tasks on weekends',
            },
        },
        {
            name: 'bufferTime',
            type: FormFieldType.NUMBER,
            label: 'Buffer Time (minutes)',
            config: {
                min: 0,
                max: 60,
                hint: 'Time buffer between scheduled tasks (0-60 minutes)',
            },
        },
        {
            name: 'aiTemperature',
            type: FormFieldType.NUMBER,
            label: 'AI Creativity Level',
            config: {
                min: 0,
                max: 1,
                step: 0.1,
                hint: 'Higher values make AI more creative, lower values more conservative (0-1)',
            },
        },
        {
            name: 'aiModel',
            type: FormFieldType.SELECT,
            label: 'AI Model',
            config: {
                options: [
                    {
                        value: 'gpt-3.5-turbo',
                        label: 'GPT-3.5 Turbo (Fast)',
                    },
                    {
                        value: 'gpt-4',
                        label: 'GPT-4 (Better Quality)',
                    },
                ],
                hint: 'AI model to use for task scheduling',
            },
        },
    ];

    const handleSubmit = (data: CalendarOptions) => {
        updateOptions(data);
        closeOptions();
    };

    return (
        <FormModal
            isOpen={isOptionsOpen}
            onClose={closeOptions}
            title="Calendar Scheduling Options"
            submitLabel="Save Options"
            fields={fields}
            model={options}
            updateModel={(newOptions) => updateOptions(newOptions)}
            onSubmit={handleSubmit}
        />
    );
}
