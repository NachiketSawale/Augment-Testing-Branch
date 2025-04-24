/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */


import { IEntityBase } from '@libs/platform/common';

export interface IStockEvaluationRule4CompEntity extends IEntityBase {
	CompanyFk?: number | null;
	Id?: number | null;
	StockValuationRuleFk?: number | null;
}
