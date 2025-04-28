import {
    RowType,
    TableBuilderConfig,
} from '@components/table/table-types.model';
import {
    ConnectionsUser,
    Status,
} from '@context/supabase-tasks/supabase-tasks-context.model';
import { Trash2 } from 'lucide-react';

export default function initConnectionsTable() {
    const connections: Partial<ConnectionsUser>[] = [
        {
            connection_email: 'hello@stevendix.co.uk',
            status: Status.Accepted,
        },
        {
            connection_email: 'masters@stevendix.co.uk',
            status: Status.Pending,
        },
    ];

    const config: TableBuilderConfig<Partial<ConnectionsUser>> = {
        rows: [
            {
                name: 'connection_email',
                header: 'Email',
                rowType: RowType.Text,
            },
            {
                name: 'status',
                header: 'Status',
                rowType: RowType.Lozenge,
            },
        ],
        actions: [
            {
                name: 'Approve',
                modifierClasses: 'bg-green-500 text-white',
                action: (row) => console.log('Approved', row),
                // hide: (row) => row.status === 'Accepted',
                icon: <Trash2 />,
            },
        ],
    };

    return {
        config,
        data: connections,
    };
}
