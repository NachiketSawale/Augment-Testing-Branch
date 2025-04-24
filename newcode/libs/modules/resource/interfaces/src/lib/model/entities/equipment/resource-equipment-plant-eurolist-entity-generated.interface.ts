/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IResourceEquipmentPlantEurolistEntityGenerated extends IEntityIdentification, IEntityBase {
	 PlantFk?: number | null;
	 CatalogFk?: number | null;
	 LookupCode?: string | null;
	 CatalogRecordFk?: number | null;
	 Quantity: number;
	 UomFk?: number | null;
	 IsTire: boolean;
	 IsInterpolated: boolean;
	 IsManual: boolean;
	 Reinstallment: number;
	 ReinstallmentYear?: number | null;
	 DeviceParameter1?: number | null;
	 DeviceParameter2?: number | null;
	 Description?: string | null;
	 CatalogRecordLowerFk?: number | null;
	 CatalogRecordUpperFk?: number | null;
	 DepreciationLowerFrom?: number | null;
	 DepreciationLowerTo?: number | null;
	 DepreciationUpperFrom?: number | null;
	 DepreciationUpperTo?: number | null;
	 DepreciationPercentFrom?: number | null;
	 DepreciationPercentTo?: number | null;
	 Depreciation?: number | null;
	 RepairUpper?: number | null;
	 RepairLower?: number | null;
	 RepairPercent?: number | null;
	 RepairCalculated?: number | null;
	 ReinstallmentLower?: number | null;
	 ReinstallmentUpper?: number | null;
	 ReinstallmentCalculated?: number | null;
	 PriceIndexCalc?: number | null;
	 PriceIndexLower?: number | null;
	 PriceIndexUpper?: number | null;
	 IsExtrapolated: boolean;
	 Code: string | null;
	 PlantEurolistFk?: number | null;
}