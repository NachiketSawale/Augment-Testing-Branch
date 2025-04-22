/*
 * Copyright(c) RIB Software GmbH
 */

import { CompareDataSaveTypes } from '../enums/compare-data-save-types.enum';
import { ICompareDataUpdateResult } from './compare-data-update-result.interface';
import { CompareModifiedStateBase } from '../classes/compare-modified-state-base.class';

export interface ICompareDataSaveResult {
	status: boolean,
	type: CompareDataSaveTypes,
	result?: ICompareDataUpdateResult,
	state: CompareModifiedStateBase,
	qtnSourceTarget?: object | null,
	isFromNewVersion?: boolean,
	isSaveAll?: boolean,
	hasCommonChanged: boolean
}