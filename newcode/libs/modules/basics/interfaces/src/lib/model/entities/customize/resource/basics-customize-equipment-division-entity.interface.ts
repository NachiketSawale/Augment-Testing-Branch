/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeEquipmentDivisionEntity extends IEntityBase, IEntityIdentification {
	PlantContextFk: number;
	Description: string;
	IsDefault: boolean;
	Sorting: number;
	UomFk: number;
	LogisticContextFk: number;
	CurrencyFk: number;
	IsCalculationBasedOnThirtyDays: boolean;
	IsCalcBasedOnWorkdays: boolean;
	IsChargingNegativQuantity: boolean;
	TimesheetContextFk: number;
	IsAggregatedByUom: boolean;
}
