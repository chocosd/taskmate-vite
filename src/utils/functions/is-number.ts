export const isNumber = (val: unknown): val is number =>
    typeof val === 'number';
