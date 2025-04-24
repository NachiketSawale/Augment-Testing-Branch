/*
 * Copyright(c) RIB Software GmbH
 */

export interface IComparePrintPageInfo {
	headRows: string[];
	bodyRows: string[];
}

export interface IComparePrintView {
	coverSheet: string;
	header: string;
	footer: string;
	pages: IComparePrintPageInfo[];
}