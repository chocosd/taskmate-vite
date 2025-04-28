import TableBuilder from '@components/table/TableBuilder';
import { ReactNode, useEffect } from 'react';
import initConnectionsTable from './connections-table.service';

export default function ConnectionsTable(): ReactNode {
    const { config, data } = initConnectionsTable();

    useEffect(() => {}, []);

    return (
        <>
            <TableBuilder data={data} config={config} />
        </>
    );
}
