/*
 * Copyright(c) RIB Software GmbH
 */

import { CompareDataSaveTypes } from '../enums/compare-data-save-types.enum';
import { ICompareDataSaveResult } from './compare-data-save-result.interface';

export interface ICompareDataManager {
	reload(): void;

	saveToQuote(
		type: CompareDataSaveTypes,
		qtnSourceTarget?: object,
		isFromNewVersion?: boolean,
		isSaveAll?: boolean
	): Promise<ICompareDataSaveResult>;
}