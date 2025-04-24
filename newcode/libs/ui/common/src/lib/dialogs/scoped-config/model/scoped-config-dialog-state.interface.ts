/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Dialog data type.
 */
export type IScopedConfigDialogState<T> = {
	[key: string]: Partial<T>;
};
