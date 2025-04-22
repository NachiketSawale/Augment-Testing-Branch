/*
 * Copyright(c) RIB Software GmbH
 */

import { ICompareDataRequestBase } from '../compare-data-request-base.interface';

export interface ICompareDataBoqRequest extends ICompareDataRequestBase {
	RecalculateDisabled: boolean;
	IsCalculateAsPerAdjustedQuantity: boolean;
}