import ImageField from './fields/ImageField';
import LozengeField from './fields/LozengeField';
import TextField from './fields/TextField';
import { RowType, TableBuilderConfig } from './table-types.model';

type TableBuilderProps<TData> = {
    config: TableBuilderConfig<TData>;
    data: TData[];
};

export default function TableBuilder<TData>({
    data,
    config,
}: TableBuilderProps<TData>) {
    return (
        <div className="border border-zinc-700 rounded-lg overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] bg-zinc-800 text-left text-sm font-semibold text-zinc-300 uppercase px-4 py-2">
                {config.rows.map((row) => (
                    <div
                        key={row.header}
                        className="flex-auto py-2 px-2"
                    >
                        {row.header}
                    </div>
                ))}
                {config.actions?.length ? (
                    <div className="py-2 px-2 flex-none">Actions</div>
                ) : null}
            </div>

            {/* Rows */}
            {data.map((row, rowIndex) => (
                <div
                    key={rowIndex}
                    className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] items-center text-left text-sm text-zinc-100 border-t border-zinc-700 hover:bg-zinc-800 transition-colors px-4 py-2"
                >
                    {config.rows.map((rowConfig, colIndex) => {
                        switch (rowConfig.rowType) {
                            case RowType.Text:
                                return (
                                    <TextField
                                        key={colIndex}
                                        row={row}
                                        rowConfig={rowConfig}
                                    />
                                );
                            case RowType.Lozenge:
                                return (
                                    <LozengeField
                                        key={colIndex}
                                        row={row}
                                        rowConfig={rowConfig}
                                    />
                                );
                            case RowType.Image:
                                return (
                                    <ImageField
                                        key={colIndex}
                                        row={row}
                                        rowConfig={rowConfig}
                                    />
                                );
                            default:
                                return null;
                        }
                    })}

                    {config.actions && (
                        <div className="flex gap-2 flex-none justify-start">
                            {config.actions.map(
                                (action, actionIndex) =>
                                    action.hide?.(row) ? null : (
                                        <button
                                            key={actionIndex}
                                            onClick={() =>
                                                action.action(row)
                                            }
                                            className={`p-1 rounded hover:bg-zinc-700 transition-colors ${action.modifierClasses}`}
                                        >
                                            {action.icon}
                                        </button>
                                    )
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
