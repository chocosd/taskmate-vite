import { RowType, TableRow } from '../table-types.model';

export function isLozengeField<T>(
    field: TableRow<T>
): field is TableRow<T> & { rowType: RowType.Lozenge } {
    return field.rowType === RowType.Lozenge;
}

export function isTextField<T>(
    field: TableRow<T>
): field is TableRow<T> & { rowType: RowType.Text } {
    return field.rowType === RowType.Text;
}

export function isImageField<T>(
    field: TableRow<T>
): field is TableRow<T> & { rowType: RowType.Image } {
    return field.rowType === RowType.Image;
}
