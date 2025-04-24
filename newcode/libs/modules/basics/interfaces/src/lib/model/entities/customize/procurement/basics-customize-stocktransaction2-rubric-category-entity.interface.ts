/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeStocktransaction2RubricCategoryEntity extends IEntityBase, IEntityIdentification {
	RubricCategoryFk: number;
	StockTransactionTypeFk: number;
	IsDefault: boolean;
}
