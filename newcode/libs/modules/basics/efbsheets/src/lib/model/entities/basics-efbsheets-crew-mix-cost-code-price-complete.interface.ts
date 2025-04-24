/*
 * Copyright(c) RIB Software GmbH
 */

import { ICostCodeEntity } from '@libs/basics/costcodes';
import { CompleteIdentification } from '@libs/platform/common';

export interface IBasicsEfbsheetsCrewMixCostCodePriceComplete extends CompleteIdentification<ICostCodeEntity> {
	/*
	 * MainItemId
	 */
	MainItemId: number | null;
	/*
	 * CostcodePriceList
	 */
	CostcodePriceList: ICostCodeEntity[] | null;
	/*
	 * EntitiesCount
	 */
	EntitiesCount: number | null;
}
