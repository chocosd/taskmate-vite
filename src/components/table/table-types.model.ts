import { ReactNode } from 'react';

export enum RowType {
    Text = 'text',
    Lozenge = 'lozenge',
    Image = 'image',
}

export type TableAction<TData> = {
    name: string;
    action: (row: TData) => void;
    modifierClasses?: string;
    icon: ReactNode;
    hide?: (row: TData) => boolean;
};

export type TableBuilderConfig<TData> = {
    rows: TableRow<TData>[];
    actions?: TableAction<TData>[];
    onSubmit?: (data: TData[]) => void;
};

export type BaseTableRow<TData> = {
    name: keyof TData;
    header: string;
};

export type TextRow<TData> = BaseTableRow<TData> & {
    rowType: RowType.Text;
    parser?: (value: TData[keyof TData], row: TData) => string;
};

export type LozengeRow<TData> = BaseTableRow<TData> & {
    rowType: RowType.Lozenge;
    parser?: (
        value: string,
        row: TData
    ) => {
        value: string;
        styles: React.CSSProperties;
    };
};

export type ImageRow<TData> = BaseTableRow<TData> & {
    rowType: RowType.Image;
    size?: number;
    alt?: string;
};

export type TableRow<TData> =
    | TextRow<TData>
    | LozengeRow<TData>
    | ImageRow<TData>;
