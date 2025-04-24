/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * The name and value to the form element.
 */
export interface IUserFormDataItem {
	name: string;
	value: unknown;
	paramCode?: string;
	columnName?: string;
}