export interface OrderDefinition<T> {
    readonly key?: KeyDefinition<T> | KeyDefinition<T>[];
    readonly desc?: boolean;
    readonly nulls?: NullHandling;
    readonly locales?: string | string[];
    readonly collator?: Intl.CollatorOptions;
}
export declare type KeyDefinition<T> = keyof T | string | number | KeySelector<T>;
export declare type KeySelector<T> = (element: T) => any | undefined;
export declare type NullHandling = 'first' | 'last' | 'min' | 'max';
export declare type Comparator<T> = (a: T, b: T) => number;
export default function comparing<T>(...orders: (OrderDefinition<T> | KeyDefinition<T>)[]): Comparator<any>;
