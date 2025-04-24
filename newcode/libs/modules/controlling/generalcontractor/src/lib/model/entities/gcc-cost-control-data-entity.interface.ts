/*
 * Copyright(c) RIB Software GmbH
 */

import {IGccCostControlDataEntityGenerated} from './gcc-cost-control-data-entity-generated.interface';

export interface IGccCostControlDataEntity extends IGccCostControlDataEntityGenerated {

	PackageValueNet: number;
	OwnBudget: number;
	OwnBudgetShift: number;
	SubTotalBudget: number;
}
