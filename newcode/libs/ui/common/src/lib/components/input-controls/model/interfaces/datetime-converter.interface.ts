/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDomain } from './domain-list.interface';

export interface IDateTime {
	utcMode: boolean;
	utcModel: boolean;
	viewValue: Date | string | number;
	domainData: IDomain | IDOmainData;
	inGrid: boolean;
	attrs: IAttrs;
}

export interface IDOmainData {
	datatype: string;
	format: string;
}

export interface IAttrs {
	grid: string;
	domain: string;
	utcMode: string;
}

export interface IEvent {
	target: {
		value: string | Date | number;
	};
}