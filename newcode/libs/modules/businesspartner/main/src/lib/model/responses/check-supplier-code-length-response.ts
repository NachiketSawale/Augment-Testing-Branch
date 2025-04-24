/*
 * Copyright(c) RIB Software GmbH
 */

export interface ICheckSupplierCodeLengthResponse {
	checkLength: boolean;
	isCurrentContext: boolean;
	minLength: number;
	maxLength: number;
}
