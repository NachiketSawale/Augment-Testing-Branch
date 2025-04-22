/*
 * Copyright(c) RIB Software GmbH
 */

export interface ICompareExportRowChunk<T> {
	status: boolean;
	rows: T[];
}