/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEstCosttypeEntity } from './est-costtype-entity.interface';
import { IEstEscalationAmountEntity } from './est-escalation-amount-entity.interface';
import { IEstResource2infoVEntity } from './est-resource-2info-ventity.interface';
import { IEstResourceTypeEntity } from './est-resource-type-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';
import { IEstLineItemEntity } from './estimate-line-item-base-entity.interface';
import { IEstResourceEntity } from './estimate-resource-base-entity.interface';

export interface IEstResourceEntityGenerated extends IEntityBase {

/*
 * Am
 */
  Am?: number | null;

/*
 * BasCurrencyFk
 */
  BasCurrencyFk?: number | null;

/*
 * BasUomFk
 */
  BasUomFk?: number | null;

/*
 * BaseCostTotal
 */
  BaseCostTotal?: number | null;

/*
 * BaseCostUnit
 */
  BaseCostUnit?: number | null;

/*
 * Budget
 */
  Budget?: number | null;

/*
 * BudgetDifference
 */
  BudgetDifference?: number | null;

/*
 * BudgetUnit
 */
  BudgetUnit?: number | null;

/*
 * CharacteristicSectionId
 */
  CharacteristicSectionId?: number | null;

/*
 * Co2Project
 */
  Co2Project?: number | null;

/*
 * Co2ProjectTotal
 */
  Co2ProjectTotal?: number | null;

/*
 * Co2Source
 */
  Co2Source?: number | null;

/*
 * Co2SourceTotal
 */
  Co2SourceTotal?: number | null;

/*
 * Code
 */
  Code: string;

/*
 * ColumnId
 */
  ColumnId?: number | null;

/*
 * CommentText
 */
  CommentText?: string | null;

/*
 * ConHeaderFk
 */
  ConHeaderFk?: number | null;

/*
 * CostExchangeRate1
 */
  CostExchangeRate1?: number | null;

/*
 * CostExchangeRate2
 */
  CostExchangeRate2?: number | null;

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
 * CostFactorDetail1
 */
  CostFactorDetail1?: string | null;

/*
 * CostFactorDetail2
 */
  CostFactorDetail2?: string | null;

/*
 * CostInternal
 */
  CostInternal?: number | null;

/*
 * CostReal
 */
  CostReal?: number | null;

/*
 * CostTotal
 */
  CostTotal?: number | null;

/*
 * CostTotalCurrency
 */
  CostTotalCurrency?: number | null;

/*
 * CostTotalOc
 */
  CostTotalOc?: number | null;

/*
 * CostUnit
 */
  CostUnit?: number | null;

/*
 * CostUnitLineItem
 */
  CostUnitLineItem?: number | null;

/*
 * CostUnitOriginal
 */
  CostUnitOriginal?: number | null;

/*
 * CostUnitSubItem
 */
  CostUnitSubItem?: number | null;

/*
 * CostUnitTarget
 */
  CostUnitTarget?: number | null;

/*
 * CostUom
 */
  CostUom?: number | null;

/*
 * DayWorkRateTotal
 */
  DayWorkRateTotal?: number | null;

/*
 * DayWorkRateUnit
 */
  DayWorkRateUnit?: number | null;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * DescriptionInfo1
 */
  DescriptionInfo1?: IDescriptionInfo | null;

/*
 * EfficiencyFactor1
 */
  EfficiencyFactor1?: number | null;

/*
 * EfficiencyFactor2
 */
  EfficiencyFactor2?: number | null;

/*
 * EfficiencyFactorDetail1
 */
  EfficiencyFactorDetail1?: string | null;

/*
 * EfficiencyFactorDetail2
 */
  EfficiencyFactorDetail2?: string | null;

/*
 * ElementCode
 */
  ElementCode?: string | null;

/*
 * ElementDescription
 */
  ElementDescription?: string | null;

/*
 * EscResourceCostTotal
 */
  EscResourceCostTotal?: number | null;

/*
 * EscResourceCostUnit
 */
  EscResourceCostUnit?: number | null;

/*
 * EstAssemblyFk
 */
  EstAssemblyFk?: number | null;

/*
 * EstAssemblyTypeFk
 */
  EstAssemblyTypeFk?: number | null;

/*
 * EstCostTypeFk
 */
  EstCostTypeFk?: number | null;

/*
 * EstCostportionsFk
 */
  EstCostportionsFk?: number | null;

/*
 * EstCosttypeEntity
 */
  EstCosttypeEntity?: IEstCosttypeEntity | null;

/*
 * EstEscalationAmountEntities
 */
  EstEscalationAmountEntities?: IEstEscalationAmountEntity[] | null;

/*
 * EstHeaderAssemblyFk
 */
  EstHeaderAssemblyFk?: number | null;

/*
 * EstHeaderFk
 */
  EstHeaderFk?: number | null;

/*
 * EstLineItemEntity
 */
  EstLineItemEntity?: IEstLineItemEntity | null;

/*
 * EstLineItemFk
 */
  EstLineItemFk?: number | null;

/*
 * EstResource2infoVEntity
 */
  EstResource2infoVEntity?: IEstResource2infoVEntity | null;

/*
 * EstResourceFk
 */
  EstResourceFk?: number | null;

/*
 * EstResourceFlagFk
 */
  EstResourceFlagFk?: number | null;

/*
 * EstResourceRuleFk
 */
  EstResourceRuleFk?: number | null;

/*
 * EstResourceTypeEntity
 */
  EstResourceTypeEntity?: IEstResourceTypeEntity | null;

/*
 * EstResourceTypeFk
 */
  EstResourceTypeFk?: number | null;

/*
 * EstResourceTypeShortKey
 */
  EstResourceTypeShortKey?: string | null;

/*
 * EstResources
 */
  EstResources?: IEstResourceEntity[] | null;

/*
 * EstRuleSourceFk
 */
  EstRuleSourceFk?: number | null;

/*
 * EstTypeFk
 */
  EstTypeFk?: number | null;

/*
 * EvalSequenceFk
 */
  EvalSequenceFk?: number | null;

/*
 * ExchangeRate
 */
  ExchangeRate?: number | null;

/*
 * Ga
 */
  Ga?: number | null;

/*
 * Gc
 */
  Gc?: number | null;

/*
 * HasChildren
 */
  HasChildren?: boolean | null;

/*
 * HourFactor
 */
  HourFactor?: number | null;

/*
 * HoursTotal
 */
  HoursTotal?: number | null;

/*
 * HoursUnit
 */
  HoursUnit?: number | null;

/*
 * HoursUnitLineItem
 */
  HoursUnitLineItem?: number | null;

/*
 * HoursUnitSubItem
 */
  HoursUnitSubItem?: number | null;

/*
 * HoursUnitTarget
 */
  HoursUnitTarget?: number | null;

/*
 * Id
 */
  Id: number;

/*
 * IsBudget
 */
  IsBudget?: boolean | null;

/*
 * IsCost
 */
  IsCost?: boolean | null;

/*
 * IsDisabled
 */
  IsDisabled?: boolean | null;

/*
 * IsDisabledDirect
 */
  IsDisabledDirect?: boolean | null;

/*
 * IsDisabledPrc
 */
  IsDisabledPrc?: boolean | null;

/*
 * IsEditable
 */
  IsEditable?: boolean | null;

/*
 * IsEstimateCostCode
 */
  IsEstimateCostCode?: boolean | null;

/*
 * IsFixedBudget
 */
  IsFixedBudget?: boolean | null;

/*
 * IsFixedBudgetUnit
 */
  IsFixedBudgetUnit?: boolean | null;

/*
 * IsGeneratedPrc
 */
  IsGeneratedPrc?: boolean | null;

/*
 * IsIndirectCost
 */
  IsIndirectCost?: boolean | null;

/*
 * IsInformation
 */
  IsInformation?: boolean | null;

/*
 * IsLumpsum
 */
  IsLumpsum?: boolean | null;

/*
 * IsManual
 */
  IsManual?: boolean | null;

/*
 * IsRate
 */
  IsRate?: boolean | null;

/*
 * IsReadOnlyByPrcPackage
 */
  IsReadOnlyByPrcPackage?: boolean | null;

/*
 * IsRuleMarkupCostCode
 */
  IsRuleMarkupCostCode?: boolean | null;

/*
 * LgmJobFk
 */
  LgmJobFk?: number | null;

/*
 * MaterialPriceListFk
 */
  MaterialPriceListFk?: number | null;

/*
 * MdcCostCodeFk
 */
  MdcCostCodeFk?: number | null;

/*
 * MdcMaterialFk
 */
  MdcMaterialFk?: number | null;

/*
 * PackageAssignments
 */
  PackageAssignments?: string | null;

/*
 * PlantAssemblyTypeFk
 */
  PlantAssemblyTypeFk?: number | null;

/*
 * PrcPackageStatusFk
 */
  PrcPackageStatusFk?: number | null;

/*
 * PrcStructureFk
 */
  PrcStructureFk?: number | null;

/*
 * ProductivityFactor
 */
  ProductivityFactor?: number | null;

/*
 * ProductivityFactorDetail
 */
  ProductivityFactorDetail?: string | null;

/*
 * ProjectCostCodeFk
 */
  ProjectCostCodeFk?: number | null;

/*
 * QtnHeaderFk
 */
  QtnHeaderFk?: number | null;

/*
 * Quantity
 */
  Quantity?: number | null;

/*
 * QuantityDetail
 */
  QuantityDetail?: string | null;

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
 * QuantityFactorDetail1
 */
  QuantityFactorDetail1?: string | null;

/*
 * QuantityFactorDetail2
 */
  QuantityFactorDetail2?: string | null;

/*
 * QuantityInternal
 */
  QuantityInternal?: number | null;

/*
 * QuantityOriginal
 */
  QuantityOriginal?: number | null;

/*
 * QuantityReal
 */
  QuantityReal?: number | null;

/*
 * QuantityTotal
 */
  QuantityTotal?: number | null;

/*
 * QuantityUnitTarget
 */
  QuantityUnitTarget?: number | null;

/*
 * RequisitionFk
 */
  RequisitionFk?: number | null;

/*
 * ResResourceFk
 */
  ResResourceFk?: number | null;

/*
 * ResourceChildren
 */
  ResourceChildren?: IEstResourceEntity[] | null;

/*
 * ResourceParent
 */
  ResourceParent?: IEstResourceEntity | null;

/*
 * RiskCostTotal
 */
  RiskCostTotal?: number | null;

/*
 * RiskCostUnit
 */
  RiskCostUnit?: number | null;

/*
 * Rp
 */
  Rp?: number | null;

/*
 * RuleCode
 */
  RuleCode?: string | null;

/*
 * RuleDescription
 */
  RuleDescription?: string | null;

/*
 * RuleType
 */
  RuleType?: string | null;

/*
 * Sorting
 */
  Sorting?: number | null;

/*
 * WorkOperationTypeFk
 */
  WorkOperationTypeFk?: number | null;
}
