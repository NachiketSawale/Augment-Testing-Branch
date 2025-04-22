/*
 * Copyright(c) RIB Software GmbH
 */

export const CommonModifiedData: ICommonModifiedData = {
	PrcGeneralsToSave: [],
	modifiedData: {}
};

export interface IModifiedData {
	[p: string]: unknown
}

export interface ICommonModifiedData {
	PrcGeneralsToSave: Array<{
		QuoteHeaderId: number
	}>;
	modifiedData: IModifiedData;
}