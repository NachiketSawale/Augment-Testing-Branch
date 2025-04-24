/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IPlantEurolistEntityGenerated extends IEntityBase {

/*
 * CatalogFk
 */
  CatalogFk?: number | null;

/*
 * CatalogRecordCode
 */
  CatalogRecordCode?: string | null;

/*
 * CatalogRecordDescription
 */
  CatalogRecordDescription?: string | null;

/*
 * CatalogRecordFk
 */
  CatalogRecordFk?: number | null;

/*
 * CatalogRecordLowerFk
 */
  CatalogRecordLowerFk?: number | null;

/*
 * CatalogRecordUpperFk
 */
  CatalogRecordUpperFk?: number | null;

/*
 * Code
 */
  Code: string;

/*
 * Depreciation
 */
  Depreciation?: number | null;

/*
 * DepreciationLowerFrom
 */
  DepreciationLowerFrom?: number | null;

/*
 * DepreciationLowerTo
 */
  DepreciationLowerTo?: number | null;

/*
 * DepreciationPercentFrom
 */
  DepreciationPercentFrom?: number | null;

/*
 * DepreciationPercentTo
 */
  DepreciationPercentTo?: number | null;

/*
 * DepreciationUpperFrom
 */
  DepreciationUpperFrom?: number | null;

/*
 * DepreciationUpperTo
 */
  DepreciationUpperTo?: number | null;

/*
 * Description
 */
  Description?: string | null;

/*
 * DeviceParameter1
 */
  DeviceParameter1?: number | null;

/*
 * DeviceParameter2
 */
  DeviceParameter2?: number | null;

/*
 * EquipmentPlantEntity
 */
  //EquipmentPlantEntity?: IEquipmentPlantEntity | null;

/*
 * Id
 */
  Id: number;

/*
 * IsExtrapolated
 */
  IsExtrapolated: boolean;

/*
 * IsInterpolated
 */
  IsInterpolated: boolean;

/*
 * IsManual
 */
  IsManual: boolean;

/*
 * IsTire
 */
  IsTire: boolean;

/*
 * LookupCode
 */
  LookupCode?: string | null;

/*
 * PlantEurolistFk
 */
  PlantEurolistFk?: number | null;

/*
 * PlantFk
 */
  PlantFk: number;

/*
 * PriceIndexCalc
 */
  PriceIndexCalc?: number | null;

/*
 * PriceIndexLower
 */
  PriceIndexLower?: number | null;

/*
 * PriceIndexUpper
 */
  PriceIndexUpper?: number | null;

/*
 * Quantity
 */
  Quantity: number;

/*
 * Reinstallment
 */
  Reinstallment: number;

/*
 * ReinstallmentCalculated
 */
  ReinstallmentCalculated?: number | null;

/*
 * ReinstallmentLower
 */
  ReinstallmentLower?: number | null;

/*
 * ReinstallmentUpper
 */
  ReinstallmentUpper?: number | null;

/*
 * ReinstallmentYear
 */
  ReinstallmentYear?: number | null;

/*
 * RepairCalculated
 */
  RepairCalculated?: number | null;

/*
 * RepairLower
 */
  RepairLower?: number | null;

/*
 * RepairPercent
 */
  RepairPercent?: number | null;

/*
 * RepairUpper
 */
  RepairUpper?: number | null;

/*
 * UomFk
 */
  UomFk?: number | null;
}
