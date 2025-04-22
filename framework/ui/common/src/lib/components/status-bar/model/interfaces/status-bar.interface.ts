/* eslint-disable */
// TODO: Either remove this file, or re-enable ESLint and fix all errors
//       before it is included in a production version!

/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

export interface IStatusBarComponentInterface {
	fields: IFieldsInterface[];
	newFields: IFieldsInterface;
	changedFields: { id: string; value: number };
	field: IFieldsInterface;
}

export interface IFieldsInterface {
	align: string;
	cssClass: string;
	disabled: boolean;
	ellipsis: boolean;
	id: string;
	toolTip: string;
	type: string;
	value: number;
	iconClass?: string;
	visible: boolean;
	func?: Function;
	url?: string;
}
export interface IAppendSubListInterface {
	appendSubList(): void;
}
export interface IFieldsNewInterface {
	toolTip: Object;
}
