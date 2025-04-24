/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * A union of all values arrays in the passed type.
 */
export type GenericTypeValueArrayUnion<T> = {
    [K in keyof T]: T[K][];
}[keyof T]

/**
 * A union of all values in the passed type.
 */
export type GenericTypeValueUnion<T> = {
    [K in keyof T]: T[K];
}[keyof T]