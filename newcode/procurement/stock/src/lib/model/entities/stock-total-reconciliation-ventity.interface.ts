/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ITranslated } from '@libs/platform/common';

export interface IStockTotalReconciliationVEntity {
	Id: number;
	Type?: ITranslated;
	Receipt?: number | null;
	Consumed?: number | null;
	Difference: number | null;
}
