import { ImageRow } from '../table-types.model';

export type FieldRecord = Record<string, unknown>;

type ImageFieldProps<TData = Record<string, unknown>> = {
    row: TData;
    rowConfig: ImageRow<TData>;
};

export default function ImageField<TData = FieldRecord>({
    row,
    rowConfig,
}: ImageFieldProps<TData>) {
    const rawValue = row[rowConfig.name] as string;

    return (
        <img
            src={rawValue}
            alt={rowConfig.alt}
            className="rounded-full"
            style={{ width: rowConfig.size, height: rowConfig.size }}
        />
    );
}
