/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityIdentification, IEntityBase } from '@libs/platform/common';

export interface IEquipmentGroupEurolistEntityGenerated extends IEntityIdentification, IEntityBase {
	 PlantGroupFk?: number;
	 CatalogFk?: number;
	 CatalogRecordFk?: number;
	 Quantity: number;
	 UoMFk?: number;
	 IsTire: boolean;
	 IsInterpolated: boolean;
	 IsManual: boolean;
	 Lookupcode?: string;
	 Reinstallment: number;
	 Reinstallmentyear?: number;
	 Deviceparameter1?: number;
	 Deviceparameter2?: number;
	 Description?: string;
	 CatalogRecordLowerFk?: number;
	 CatalogRecordUpperFk?: number;
	 DepreciationLowerFrom?: number;
	 DepreciationLowerTo?: number;
	 DepreciationUpperFrom?: number;
	 DepreciationUpperTo?: number;
	 DepreciationPercentFrom?: number;
	 DepreciationPercentTo?: number;
	 Depreciation?: number;
	 RepairUpper?: number;
	 RepairLower?: number;
	 RepairPercent?: number;
	 RepairCalculated?: number;
	 ReinstallmentLower?: number;
	 ReinstallmentUpper?: number;
	 ReinstallmentCalculated?: number;
	 PriceIndexCalc?: number;
	 PriceIndexLower?: number;
	 PriceIndexUpper?: number;
	 IsExtrapolated: boolean;
	 Code: string;
	 GroupEurolistFk?: number;
}