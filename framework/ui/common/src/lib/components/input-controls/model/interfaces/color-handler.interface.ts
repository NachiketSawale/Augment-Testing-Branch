/* eslint-disable */
// TODO: Either remove this file, or re-enable ESLint and fix all errors
//       before it is included in a production version!

/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

export interface IColorHandler {
	attrs: IAttrs;
	scope: Object;
	entity: string;
	ngModel: string;
	clearColor(): void;
	showOverlay(): boolean;
	isDeleteBtnDisabled(): boolean;
	isEmpty(value: string): boolean;
}
export interface IScope {
	[x: string]: { __rt$data: { field: string; readonly: boolean } };
}

export interface IAttrs {
	entity?: string;
	domain?: string;
	config?: string;
	grid?: string;
}
export interface IAttr {
	entity: string;
	domain: string;
	config: string;
	grid: string;
}
export interface IAttrsD {
	entity?: string;
	domain: string;
	config?: string;
	grid?: string;
}
