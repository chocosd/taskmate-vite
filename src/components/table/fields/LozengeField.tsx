import { LozengeRow } from '../table-types.model';

export type FieldRecord = Record<string, unknown>;

type LozengeFieldProps<TData = Record<string, unknown>> = {
    row: TData;
    rowConfig: LozengeRow<TData>;
};

export default function LozengeField<TData = FieldRecord>({
    row,
    rowConfig,
}: LozengeFieldProps<TData>) {
    const rawValue = row[rowConfig.name] as string;
    const parsed = rowConfig.parser
        ? rowConfig.parser(rawValue, row)
        : { value: rawValue, styles: {} };

    return (
        <span className="px-2 py-1 rounded" style={parsed.styles}>
            {parsed.value}
        </span>
    );
}
