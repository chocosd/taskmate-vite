export function invokeIfFn<T = unknown>(value: T | (() => T)): T {
    return typeof value === 'function' ? (value as () => T)() : value;
}
