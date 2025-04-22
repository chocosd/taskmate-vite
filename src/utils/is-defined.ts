export function isDefined<T = unknown>(value: T): boolean {
    return !(value === null || value === undefined || value === '');
}
