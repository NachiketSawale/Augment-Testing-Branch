/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * A generic type having key as string and value as object of key-value pair.
 */
export type ClientActionRows <T = Record<string, TValue>> = {
	[key: string]: T |TValue;
};

/**A common union type to be used within workflow scope. */
export type TValue = string | number | boolean | string[] | Date | object;

/**
 * Custom type for edit option feature.
 */
export type CustomEditorOption = { [key: string]: TValue | undefined; };