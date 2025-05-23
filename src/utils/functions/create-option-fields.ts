import { AutocompleteOption } from '@components/forms/fields/AutocompleteInput';
import { FormFieldType } from '@components/forms/form-field-types.enum';
import { FormField } from '@components/forms/form-types.model';
import { ConnectionsUser } from '@context/supabase-tasks/supabase-tasks-context.model';

export const createOptionFields = (
    connections: ConnectionsUser[]
): FormField[] => [
    {
        type: FormFieldType.AUTOCOMPLETE,
        name: 'assignee',
        label: 'Assign To',
        config: {
            loadOptions: (search: string) =>
                Promise.resolve(
                    connections
                        .filter((conn) =>
                            conn.connection_email
                                ?.toLowerCase()
                                .includes(search.toLowerCase())
                        )
                        .map(
                            ({ connection_email, connection_id }) =>
                                ({
                                    label: connection_email,
                                    value: connection_id,
                                }) as AutocompleteOption
                        )
                ),
        },
    },
    {
        type: FormFieldType.DATETIME,
        name: 'due_date',
        label: 'Due Date',
    },
    {
        type: FormFieldType.RADIO,
        name: 'priority',
        label: 'Priority',
        options: [
            { label: 'Low', value: 'low' },
            { label: 'Medium', value: 'medium' },
            { label: 'High', value: 'high' },
        ],
    },
];
