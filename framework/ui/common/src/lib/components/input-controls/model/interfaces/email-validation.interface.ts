/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

export interface IEmailValidation {
	attrs: IAttrs;
	scope: IScope;
}

export interface IAttrs {
	grid: string;
	config: string;
	entity: string;
}
export interface IScope {
	config: string | undefined;
}

export interface IAbstractControl {
	value: string;
}