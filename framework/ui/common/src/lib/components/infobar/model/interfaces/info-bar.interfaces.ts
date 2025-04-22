/*
 * Copyright(c) RIB Software GmbH
 */

export interface IInfoBarHeader {
	id: number;
	description: string;
	subEntity?: IInfoBarSub[];
}

export interface IInfoBarSub {
	id: number;
	description: string;
	subEntity?: IInfoBarSub[];
}

export interface IInfoBarOutput {
	id?: number;
	description: string;
	level: number;
}