/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEstAssembly2WicItemEntity } from './est-assembly-2wic-item-entity.interface';
import { IEstAssemblyCatEntity } from '@libs/estimate/interfaces';
import { IEstLineItemEntity } from './est-line-item-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IEstLineItemEntityGenerated extends IEntityBase {

/*
 * AdvancedAllowance
 */
  AdvancedAllowance?: number | null;

/*
 * AdvancedAllowanceCostUnit
 */
  AdvancedAllowanceCostUnit?: number | null;

/*
 * AssemblyType
 */
  AssemblyType?: number | null;

/*
 * BasUomFk
 */
  BasUomFk?: number | null;

/*
 * BasUomTargetFk
 */
  BasUomTargetFk?: number | null;

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
 * Co2ProjectTotal
 */
  Co2ProjectTotal?: number | null;

/*
 * Co2SourceTotal
 */
  Co2SourceTotal?: number | null;

/*
 * Co2TotalVariance
 */
  Co2TotalVariance?: number | null;

/*
 * Code
 */
  Code?: string | null;

/*
 * CommentText
 */
  CommentText?: string | null;

/*
 * CosMatchtext
 */
  CosMatchtext?: string | null;

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
 * CostFactorDetail1
 */
  CostFactorDetail1?: string | null;

/*
 * CostFactorDetail2
 */
  CostFactorDetail2?: string | null;

/*
 * CostTotal
 */
  CostTotal?: number | null;

/*
 * CostUnit
 */
  CostUnit?: number | null;

/*
 * CostUnitTarget
 */
  CostUnitTarget?: number | null;

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
 * DirCostTotal
 */
  DirCostTotal?: number | null;

/*
 * DirCostUnit
 */
  DirCostUnit?: number | null;

/*
 * DirCostUnitTarget
 */
  DirCostUnitTarget?: number | null;

/*
 * DirHoursTotal
 */
  DirHoursTotal?: number | null;

/*
 * DirHoursUnit
 */
  DirHoursUnit?: number | null;

/*
 * DirHoursUnitTarget
 */
  DirHoursUnitTarget?: number | null;

/*
 * DruCostTotal
 */
  DruCostTotal?: number | null;

/*
 * DruCostUnit
 */
  DruCostUnit?: number | null;

/*
 * DruCostUnitTarget
 */
  DruCostUnitTarget?: number | null;

/*
 * DruHoursTotal
 */
  DruHoursTotal?: number | null;

/*
 * DruHoursUnit
 */
  DruHoursUnit?: number | null;

/*
 * DruHoursUnitTarget
 */
  DruHoursUnitTarget?: number | null;

/*
 * EntCostTotal
 */
  EntCostTotal?: number | null;

/*
 * EntCostUnit
 */
  EntCostUnit?: number | null;

/*
 * EntCostUnitTarget
 */
  EntCostUnitTarget?: number | null;

/*
 * EntHoursTotal
 */
  EntHoursTotal?: number | null;

/*
 * EntHoursUnit
 */
  EntHoursUnit?: number | null;

/*
 * EntHoursUnitTarget
 */
  EntHoursUnitTarget?: number | null;

/*
 * EscalationCostTotal
 */
  EscalationCostTotal?: number | null;

/*
 * EscalationCostUnit
 */
  EscalationCostUnit?: number | null;

/*
 * EstAssembly2wicItemEntities
 */
  EstAssembly2wicItemEntities?: IEstAssembly2WicItemEntity[] | null;

/*
 * EstAssemblyCatEntity
 */
  EstAssemblyCatEntity?: IEstAssemblyCatEntity | null;

/*
 * EstAssemblyCatFk
 */
  EstAssemblyCatFk?: number | null;

/*
 * EstAssemblyFk
 */
  EstAssemblyFk?: number | null;

/*
 * EstAssemblyTypeLogicFk
 */
  EstAssemblyTypeLogicFk?: number | null;

/*
 * EstCostRiskFk
 */
  EstCostRiskFk?: number | null;

/*
 * EstHeaderAssemblyFk
 */
  EstHeaderAssemblyFk?: number | null;

/*
 * EstHeaderFk
 */
  EstHeaderFk?: number | null;

/*
 * EstLineItemFk
 */
  EstLineItemFk?: number | null;

/*
 * EstLineItems
 */
  EstLineItems?: IEstLineItemEntity[] | null;

/*
 * EstQtyRelActFk
 */
  EstQtyRelActFk?: number | null;

/*
 * EstQtyRelBoqFk
 */
  EstQtyRelBoqFk?: number | null;

/*
 * EstQtyRelGtuFk
 */
  EstQtyRelGtuFk?: number | null;

/*
 * EstQtyTelAotFk
 */
  EstQtyTelAotFk?: number | null;

/*
 * ForeignBudget1
 */
  ForeignBudget1?: number | null;

/*
 * ForeignBudget2
 */
  ForeignBudget2?: number | null;

/*
 * Fromdate
 */
  Fromdate?: string | null;

/*
 * GrandCostUnit
 */
  GrandCostUnit?: number | null;

/*
 * GrandCostUnitTarget
 */
  GrandCostUnitTarget?: number | null;

/*
 * GrandTotal
 */
  GrandTotal?: number | null;

/*
 * Hint
 */
  Hint?: string | null;

/*
 * HoursTotal
 */
  HoursTotal?: number | null;

/*
 * HoursUnit
 */
  HoursUnit?: number | null;

/*
 * HoursUnitTarget
 */
  HoursUnitTarget?: number | null;

/*
 * Id
 */
  Id?: number | null;

/*
 * IndCostTotal
 */
  IndCostTotal?: number | null;

/*
 * IndCostUnit
 */
  IndCostUnit?: number | null;

/*
 * IndCostUnitTarget
 */
  IndCostUnitTarget?: number | null;

/*
 * IndHoursTotal
 */
  IndHoursTotal?: number | null;

/*
 * IndHoursUnit
 */
  IndHoursUnit?: number | null;

/*
 * IndHoursUnitTarget
 */
  IndHoursUnitTarget?: number | null;

/*
 * IsChecked
 */
  IsChecked?: boolean | null;

/*
 * IsDisabled
 */
  IsDisabled?: boolean | null;

/*
 * IsDissolvable
 */
  IsDissolvable?: boolean | null;

/*
 * IsFixedBudget
 */
  IsFixedBudget?: boolean | null;

/*
 * IsFixedPrice
 */
  IsFixedPrice?: boolean | null;

/*
 * IsGc
 */
  IsGc?: boolean | null;

/*
 * IsIncluded
 */
  IsIncluded?: boolean | null;

/*
 * IsLumpsum
 */
  IsLumpsum?: boolean | null;

/*
 * IsNoEscalation
 */
  IsNoEscalation?: boolean | null;

/*
 * IsNoMarkup
 */
  IsNoMarkup?: boolean | null;

/*
 * IsOptional
 */
  IsOptional?: boolean | null;

/*
 * IsProject
 */
  IsProject?: boolean | null;

/*
 * IsTemp
 */
  IsTemp?: boolean | null;

/*
 * LgmJobFk
 */
  LgmJobFk?: number | null;

/*
 * LineItemType
 */
  LineItemType?: number | null;

/*
 * Margin1
 */
  Margin1?: number | null;

/*
 * Margin2
 */
  Margin2?: number | null;

/*
 * MarkupCostTotal
 */
  MarkupCostTotal?: number | null;

/*
 * MarkupCostUnit
 */
  MarkupCostUnit?: number | null;

/*
 * MarkupCostUnitTarget
 */
  MarkupCostUnitTarget?: number | null;

/*
 * MdcAssetMasterFk
 */
  MdcAssetMasterFk?: number | null;

/*
 * MdcCostCodeFk
 */
  MdcCostCodeFk?: number | null;

/*
 * MdcMaterialFk
 */
  MdcMaterialFk?: number | null;

/*
 * MdcWicFk
 */
  MdcWicFk?: number | null;

/*
 * MdcWorkCategoryFk
 */
  MdcWorkCategoryFk?: number | null;

/*
 * NoLeadQuantity
 */
  NoLeadQuantity?: boolean | null;

/*
 * PlantAssemblyTypeFk
 */
  PlantAssemblyTypeFk?: number | null;

/*
 * PlantFk
 */
  PlantFk?: number | null;

/*
 * PlantGroupFk
 */
  PlantGroupFk?: number | null;

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
 * QuantityFactorDetail1
 */
  QuantityFactorDetail1?: string | null;

/*
 * QuantityFactorDetail2
 */
  QuantityFactorDetail2?: string | null;

/*
 * QuantityTarget
 */
  QuantityTarget?: number | null;

/*
 * QuantityTargetDetail
 */
  QuantityTargetDetail?: string | null;

/*
 * QuantityTotal
 */
  QuantityTotal?: number | null;

/*
 * QuantityUnitTarget
 */
  QuantityUnitTarget?: number | null;

/*
 * Revenue
 */
  Revenue?: number | null;

/*
 * RevenueUnit
 */
  RevenueUnit?: number | null;

/*
 * RiskCostTotal
 */
  RiskCostTotal?: number | null;

/*
 * RiskCostUnit
 */
  RiskCostUnit?: number | null;

/*
 * Todate
 */
  Todate?: string | null;

/*
 * UserDefined1
 */
  UserDefined1?: string | null;

/*
 * UserDefined2
 */
  UserDefined2?: string | null;

/*
 * UserDefined3
 */
  UserDefined3?: string | null;

/*
 * UserDefined4
 */
  UserDefined4?: string | null;

/*
 * UserDefined5
 */
  UserDefined5?: string | null;

/*
 * WqQuantityTarget
 */
  WqQuantityTarget?: number | null;

/*
 * WqQuantityTargetDetail
 */
  WqQuantityTargetDetail?: string | null;
}
