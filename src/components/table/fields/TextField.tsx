import { TextRow } from '../table-types.model';

type TextFieldProps<TData> = {
    row: TData;
    rowConfig: TextRow<TData>;
};

export default function TextField<TData>({
    row,
    rowConfig,
}: TextFieldProps<TData>) {
    const rawValue = row[rowConfig.name];
    const parsed = rowConfig.parser
        ? rowConfig.parser(row[rowConfig.name], row)
        : String(rawValue);

    return <span className="px-2 py-1 rounded">{parsed}</span>;
}
