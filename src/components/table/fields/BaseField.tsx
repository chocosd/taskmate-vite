import React from 'react';

type ParserFn<T> = (value: T) => {
    value: string;
    styles?: React.CSSProperties;
};

interface BaseFieldProps<T> {
    value: T;
    parser?: ParserFn<T>;
}

export default function BaseField<T>({
    value,
    parser,
}: BaseFieldProps<T>) {
    const parsed = parser ? parser(value) : { value: String(value) };
    return <span style={parsed.styles}>{parsed.value}</span>;
}
