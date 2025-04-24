/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo } from '@libs/platform/common';

export interface IEstResourcesSummaryEntityGenerated {

/*
 * AdjCostSummary
 */
  AdjCostSummary?: number | null;

/*
 * AdjQuantitySummary
 */
  AdjQuantitySummary?: number | null;

/*
 * AdjustCostUnit
 */
  AdjustCostUnit?: number | null;

/*
 * AssemblyCode
 */
  AssemblyCode?: string | null;

/*
 * AssemblyDescriptionInfo
 */
  AssemblyDescriptionInfo?: IDescriptionInfo | null;

/*
 * BasCurrencyFk
 */
  BasCurrencyFk?: number | null;

/*
 * BaseLineItemId
 */
  BaseLineItemId?: number | null;

/*
 * BoqItemFk
 */
  BoqItemFk?: number | null;

/*
 * Budget
 */
  Budget?: number | null;

/*
 * Code
 */
  Code: string;

/*
 * CostCodePortionsFk
 */
  CostCodePortionsFk?: number | null;

/*
 * CostCodeTypeFk
 */
  CostCodeTypeFk?: number | null;

/*
 * CostFactor1
 */
  CostFactor1?: number | null;

/*
 * CostFactor2
 */
  CostFactor2?: number | null;

/*
 * CostFactorCc
 */
  CostFactorCc?: number | null;

/*
 * CostSummary
 */
  CostSummary?: number | null;

/*
 * CostSummaryDifference
 */
  CostSummaryDifference?: number | null;

/*
 * CostSummaryOriginal
 */
  CostSummaryOriginal?: number | null;

/*
 * CostSummaryOriginalDifference
 */
  CostSummaryOriginalDifference?: number | null;

/*
 * CostTotal
 */
  CostTotal?: number | null;

/*
 * CostUnitDifference
 */
  CostUnitDifference?: number | null;

/*
 * CostUnitOriginal
 */
  CostUnitOriginal?: number | null;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * DetailsStack
 */
  DetailsStack?: number | null;

/*
 * EfficiencyFactor1
 */
  EfficiencyFactor1?: number | null;

/*
 * EfficiencyFactor2
 */
  EfficiencyFactor2?: number | null;

/*
 * EstCostTypeFk
 */
  EstCostTypeFk?: number | null;

/*
 * EstResourceFlagFk
 */
  EstResourceFlagFk?: number | null;

/*
 * EstResourceTypeFk
 */
  EstResourceTypeFk?: number | null;

/*
 * EstimateCostUnit
 */
  EstimateCostUnit?: number | null;

/*
 * ExternalCode
 */
  ExternalCode?: string | null;

/*
 * GroupInSameCurrency
 */
  GroupInSameCurrency?: boolean | null;

/*
 * Id
 */
  Id: number;

/*
 * IsContainsAll
 */
  IsContainsAll?: boolean | null;

/*
 * IsFixed
 */
  IsFixed?: boolean | null;

/*
 * IsGeneratedPrc
 */
  IsGeneratedPrc?: boolean | null;

/*
 * IsIncludeBasCurrencyFk
 */
  IsIncludeBasCurrencyFk?: boolean | null;

/*
 * IsIncludeCostFactor1
 */
  IsIncludeCostFactor1?: boolean | null;

/*
 * IsIncludeCostFactor2
 */
  IsIncludeCostFactor2?: boolean | null;

/*
 * IsIncludeCostUnitOriginal
 */
  IsIncludeCostUnitOriginal?: boolean | null;

/*
 * IsIncludeIsGeneratedPrc
 */
  IsIncludeIsGeneratedPrc?: boolean | null;

/*
 * IsIncludeIsIndirectCost
 */
  IsIncludeIsIndirectCost?: boolean | null;

/*
 * IsIncludeIsLumpsum
 */
  IsIncludeIsLumpsum?: boolean | null;

/*
 * IsIncludeLgmJobFk
 */
  IsIncludeLgmJobFk?: boolean | null;

/*
 * IsIndirectCost
 */
  IsIndirectCost?: boolean | null;

/*
 * IsLumpsum
 */
  IsLumpsum?: boolean | null;

/*
 * LgmJobFk
 */
  LgmJobFk?: number | null;

/*
 * LineItemCode
 */
  LineItemCode?: string | null;

/*
 * LineItemDescriptionInfo
 */
  // LineItemDescriptionInfo?: IDescriptionTranslateType | null;

/*
 * LineItemIds
 */
  LineItemIds?: number[] | null;

/*
 * LineItemResourceIds
 */
  // LineItemResourceIds?: IInt32[] | null;

/*
 * MdcCostCodeFk
 */
  MdcCostCodeFk?: number | null;

/*
 * MdcMaterialFk
 */
  MdcMaterialFk?: number | null;

/*
 * OverrideFactor
 */
  OverrideFactor?: number | null;

/*
 * PackageAssignments
 */
  PackageAssignments?: string | null;

/*
 * PrcPackage2HeaderFk
 */
  PrcPackage2HeaderFk?: number | null;

/*
 * PrcPackageFk
 */
  PrcPackageFk?: number | null;

/*
 * PrcStructureFk
 */
  PrcStructureFk?: number | null;

/*
 * ProcurementSubPackage
 */
  ProcurementSubPackage?: string | null;

/*
 * ProductivityFactor
 */
  ProductivityFactor?: number | null;

/*
 * QuantityFactor1
 */
  QuantityFactor1?: number | null;

/*
 * QuantityFactor2
 */
  QuantityFactor2?: number | null;

/*
 * QuantityFactor3
 */
  QuantityFactor3?: number | null;

/*
 * QuantityFactor4
 */
  QuantityFactor4?: number | null;

/*
 * QuantityFactorCc
 */
  QuantityFactorCc?: number | null;

/*
 * QuantitySummary
 */
  QuantitySummary?: number | null;

/*
 * QuantityTotal
 */
  QuantityTotal?: number | null;

/*
 * ResourceIds
 */
  ResourceIds?: number[] | null;

/*
 * RuleGenerated
 */
  RuleGenerated?: boolean | null;

/*
 * UomFk
 */
  UomFk?: number | null;
}
