/*
 * Copyright(c) RIB Software GmbH
 */

import { IModifiedData } from './compare-data-state.interface';

export interface ICompareModifiedState {
	hasModified: boolean;
	modifiedData?: IModifiedData;
	saveData?: {
		allQuoteIds: number[],
		ModifiedData: IModifiedData,
		[p: string]: unknown
	}
}