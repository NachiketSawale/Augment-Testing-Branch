/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEstCostRiskEntity } from './est-cost-risk-entity.interface';
import { IEstEscalationAmountEntity } from './est-escalation-amount-entity.interface';
import { IEstEscalationDailyFractionResultsEntity } from './est-escalation-daily-fraction-results-entity.interface';
import { IEstEscalationScurveResultsEntity } from './est-escalation-scurve-results-entity.interface';
import { IEstLineItemQuantityEntity } from './est-line-item-quantity-entity.interface';
import { IEstLineItem2MdlObjectEntity } from './est-line-item-2mdl-object-entity.interface';
import { IEstRiskevent2lineitemEntity } from './est-riskevent-2lineitem-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';
import { IEstLineItemEntity } from './estimate-line-item-base-entity.interface';
import { IEstResourceEntity } from './estimate-resource-base-entity.interface';
import { IEstHeaderEntity } from './est-header-base-entity.interface';

export interface IEstLineItem2BoqMappingEntityGenerated extends IEntityBase {

/*
 * AdditionalExpenses
 */
  AdditionalExpenses?: number | null;

/*
 * AdvancedAll
 */
  AdvancedAll?: number | null;

/*
 * AdvancedAllUnit
 */
  AdvancedAllUnit?: number | null;

/*
 * AdvancedAllUnitItem
 */
  AdvancedAllUnitItem?: number | null;

/*
 * AdvancedAllowance
 */
  AdvancedAllowance?: number | null;

/*
 * AdvancedAllowanceCostUnit
 */
  AdvancedAllowanceCostUnit?: number | null;

/*
 * Allowance
 */
  Allowance?: number | null;

/*
 * AllowanceUnit
 */
  AllowanceUnit?: number | null;

/*
 * AllowanceUnitItem
 */
  AllowanceUnitItem?: number | null;

/*
 * Am
 */
  Am?: number | null;

/*
 * AmUnit
 */
  AmUnit?: number | null;

/*
 * AmUnitItem
 */
  AmUnitItem?: number | null;

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
 * BoqHeaderFk
 */
  BoqHeaderFk?: number | null;

/*
 * BoqItemFk
 */
  BoqItemFk?: number | null;

/*
 * BoqSplitQuantityFk
 */
  BoqSplitQuantityFk?: number | null;

/*
 * BoqWicCatFk
 */
  BoqWicCatFk?: number | null;

/*
 * Budget
 */
  Budget?: number | null;

/*
 * BudgetDifference
 */
  BudgetDifference?: number | null;

/*
 * BudgetShift
 */
  BudgetShift?: number | null;

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
  Code: string;

/*
 * CombinedLineItems
 */
  CombinedLineItems?: IEstLineItemEntity[] | null;

/*
 * CombinedLineItemsSimple
 */
  CombinedLineItemsSimple?: IEstLineItemEntity[] | null;

/*
 * CommentText
 */
  CommentText?: string | null;

/*
 * CompareFlag
 */
  CompareFlag?: number | null;

/*
 * CosInsHeaderFk
 */
  CosInsHeaderFk?: number | null;

/*
 * CosInstanceCode
 */
  CosInstanceCode?: string | null;

/*
 * CosInstanceDescription
 */
  CosInstanceDescription?: IDescriptionInfo | null;

/*
 * CosInstanceFk
 */
  CosInstanceFk?: number | null;

/*
 * CosMasterHeaderCode
 */
  CosMasterHeaderCode?: string | null;

/*
 * CosMasterHeaderDescription
 */
  CosMasterHeaderDescription?: string | null;

/*
 * CosMasterHeaderId
 */
  CosMasterHeaderId?: number | null;

/*
 * CosMatchText
 */
  CosMatchText?: string | null;

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
 * DynamicQuantityColumns
 */
  // DynamicQuantityColumns?: IDynamicColumnItem[] | null;

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
 * EstAssemblyCatFk
 */
  EstAssemblyCatFk?: number | null;

/*
 * EstAssemblyDescriptionInfo
 */
  EstAssemblyDescriptionInfo?: IDescriptionInfo | null;

/*
 * EstAssemblyFk
 */
  EstAssemblyFk?: number | null;

/*
 * EstCostRiskFk
 */
  EstCostRiskFk?: number | null;

/*
 * EstCostriskEntity
 */
  EstCostriskEntity?: IEstCostRiskEntity | null;

/*
 * EstEscalationAmountEntities
 */
  EstEscalationAmountEntities?: IEstEscalationAmountEntity[] | null;

/*
 * EstEscalationDailyFractionEntities
 */
  EstEscalationDailyFractionEntities?: IEstEscalationDailyFractionResultsEntity[] | null;

/*
 * EstEscalationScurveResultsEntities
 */
  EstEscalationScurveResultsEntities?: IEstEscalationScurveResultsEntity[] | null;

/*
 * EstHeaderAssemblyFk
 */
  EstHeaderAssemblyFk?: number | null;

/*
 * EstHeaderEntity
 */
  EstHeaderEntity?: IEstHeaderEntity | null;

/*
 * EstHeaderFk
 */
  EstHeaderFk?: number | null;

/*
 * EstLineItemEntities_EstHeaderAssemblyFk_EstAssemblyFk
 */
  EstLineItemEntities_EstHeaderAssemblyFk_EstAssemblyFk?: IEstLineItemEntity[] | null;

/*
 * EstLineItemEntity_EstHeaderAssemblyFk_EstAssemblyFk
 */
  EstLineItemEntity_EstHeaderAssemblyFk_EstAssemblyFk?: IEstLineItemEntity | null;

/*
 * EstLineItemFk
 */
  EstLineItemFk?: number | null;

/*
 * EstLineItemQuantityEntities
 */
  EstLineItemQuantityEntities?: IEstLineItemQuantityEntity[] | null;

/*
 * EstLineItemStatusFk
 */
  EstLineItemStatusFk?: number | null;

/*
 * EstLineitem2mdlObjectEntities
 */
  EstLineitem2mdlObjectEntities?: IEstLineItem2MdlObjectEntity[] | null;

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
 * EstResourceEntities
 */
  EstResourceEntities?: IEstResourceEntity[] | null;

/*
 * EstResourceEntities_EstHeaderAssemblyFk_EstAssemblyFk
 */
  EstResourceEntities_EstHeaderAssemblyFk_EstAssemblyFk?: IEstResourceEntity[] | null;

/*
 * EstResources
 */
  EstResources?: IEstResourceEntity[] | null;

/*
 * EstRiskevent2lineitemEntities
 */
  EstRiskevent2lineitemEntities?: IEstRiskevent2lineitemEntity[] | null;

/*
 * EstRuleSourceFk
 */
  EstRuleSourceFk?: number | null;

/*
 * EstimationCode
 */
  EstimationCode?: string | null;

/*
 * EstimationDescription
 */
  EstimationDescription?: IDescriptionInfo | null;

/*
 * ExternalCode
 */
  ExternalCode?: string | null;

/*
 * Fm
 */
  Fm?: number | null;

/*
 * ForeignBudget1
 */
  ForeignBudget1?: number | null;

/*
 * ForeignBudget2
 */
  ForeignBudget2?: number | null;

/*
 * FormFk
 */
  FormFk?: number | null;

/*
 * FromDate
 */
  FromDate?: string | null;

/*
 * Ga
 */
  Ga?: number | null;

/*
 * GaUnit
 */
  GaUnit?: number | null;

/*
 * GaUnitItem
 */
  GaUnitItem?: number | null;

/*
 * Gc
 */
  Gc?: number | null;

/*
 * GcUnit
 */
  GcUnit?: number | null;

/*
 * GcUnitItem
 */
  GcUnitItem?: number | null;

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
 * HasSplitQuantities
 */
  HasSplitQuantities?: boolean | null;

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
  Id: number;

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
 * IsCheckAi
 */
  IsCheckAi?: boolean | null;

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
 * IsFixedBudgetUnit
 */
  IsFixedBudgetUnit?: boolean | null;

/*
 * IsFixedPrice
 */
  IsFixedPrice?: boolean | null;

/*
 * IsGc
 */
  IsGc?: boolean | null;

/*
 * IsGenerated
 */
  IsGenerated?: boolean | null;

/*
 * IsIncluded
 */
  IsIncluded?: boolean | null;

/*
 * IsLumpsum
 */
  IsLumpsum?: boolean | null;

/*
 * IsMNA
 */
  IsMNA?: boolean | null;

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
 * IsOptionalIT
 */
  IsOptionalIT?: boolean | null;

/*
 * IsTemp
 */
  IsTemp?: boolean | null;

/*
 * LgmJobFk
 */
  LgmJobFk?: number | null;

/*
 * LineItem2Objects
 */
  LineItem2Objects?: IEstLineItem2MdlObjectEntity[] | null;

/*
 * LineItemType
 */
  LineItemType?: number | null;

/*
 * ManualMarkup
 */
  ManualMarkup?: number | null;

/*
 * ManualMarkupUnit
 */
  ManualMarkupUnit?: number | null;

/*
 * ManualMarkupUnitItem
 */
  ManualMarkupUnitItem?: number | null;

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
 * MatchedBoqFks
 */
  MatchedBoqFks?: number[] | null;

/*
 * MdcAssetMasterFk
 */
  MdcAssetMasterFk?: number | null;

/*
 * MdcControllingUnitFk
 */
  MdcControllingUnitFk?: number | null;

/*
 * MdcCostCodeFk
 */
  MdcCostCodeFk?: number | null;

/*
 * MdcMaterialFk
 */
  MdcMaterialFk?: number | null;

/*
 * MdcWorkCategoryFk
 */
  MdcWorkCategoryFk?: number | null;

/*
 * NoLeadQuantity
 */
  NoLeadQuantity?: boolean | null;

/*
 * OrdHeaderFk
 */
  OrdHeaderFk?: number | null;

/*
 * OrderChangeFk
 */
  OrderChangeFk?: number | null;

/*
 * OrigBoqItemFk
 */
  OrigBoqItemFk?: number | null;

/*
 * PackageAssignments
 */
  PackageAssignments?: string | null;

/*
 * PermissionObjectInfo
 */
  PermissionObjectInfo?: string | null;

/*
 * PlantAssemblyTypeFk
 */
  PlantAssemblyTypeFk?: number | null;

/*
 * PrcStructureFk
 */
  PrcStructureFk?: number | null;

/*
 * PrjChangeFk
 */
  PrjChangeFk?: number | null;

/*
 * PrjLocationFk
 */
  PrjLocationFk?: number | null;

/*
 * ProductivityFactor
 */
  ProductivityFactor?: number | null;

/*
 * ProductivityFactorDetail
 */
  ProductivityFactorDetail?: string | null;

/*
 * ProjectFk
 */
  ProjectFk?: number | null;

/*
 * ProjectName
 */
  ProjectName?: string | null;

/*
 * ProjectNo
 */
  ProjectNo?: string | null;

/*
 * PsdActivityFk
 */
  PsdActivityFk?: number | null;

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
 * ResultCompletes
 */
  //ResultCompletes?: PrjEstRuleResultComplete[] | null;

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
 * Rp
 */
  Rp?: number | null;

/*
 * RpUnit
 */
  RpUnit?: number | null;

/*
 * RpUnitItem
 */
  RpUnitItem?: number | null;

/*
 * ScheduleFk
 */
  ScheduleFk?: number | null;

/*
 * SortCode01Fk
 */
  SortCode01Fk?: number | null;

/*
 * SortCode02Fk
 */
  SortCode02Fk?: number | null;

/*
 * SortCode03Fk
 */
  SortCode03Fk?: number | null;

/*
 * SortCode04Fk
 */
  SortCode04Fk?: number | null;

/*
 * SortCode05Fk
 */
  SortCode05Fk?: number | null;

/*
 * SortCode06Fk
 */
  SortCode06Fk?: number | null;

/*
 * SortCode07Fk
 */
  SortCode07Fk?: number | null;

/*
 * SortCode08Fk
 */
  SortCode08Fk?: number | null;

/*
 * SortCode09Fk
 */
  SortCode09Fk?: number | null;

/*
 * SortCode10Fk
 */
  SortCode10Fk?: number | null;

/*
 * SortDesc01Fk
 */
  SortDesc01Fk?: number | null;

/*
 * SortDesc02Fk
 */
  SortDesc02Fk?: number | null;

/*
 * SortDesc03Fk
 */
  SortDesc03Fk?: number | null;

/*
 * SortDesc04Fk
 */
  SortDesc04Fk?: number | null;

/*
 * SortDesc05Fk
 */
  SortDesc05Fk?: number | null;

/*
 * SortDesc06Fk
 */
  SortDesc06Fk?: number | null;

/*
 * SortDesc07Fk
 */
  SortDesc07Fk?: number | null;

/*
 * SortDesc08Fk
 */
  SortDesc08Fk?: number | null;

/*
 * SortDesc09Fk
 */
  SortDesc09Fk?: number | null;

/*
 * SortDesc10Fk
 */
  SortDesc10Fk?: number | null;

/*
 * StatusOfLineItemAssignedToPackage
 */
  StatusOfLineItemAssignedToPackage?: number | null;

/*
 * ToDate
 */
  ToDate?: string | null;

/*
 * URD
 */
  URD?: number | null;

/*
 * URDUnitItem
 */
  URDUnitItem?: number | null;

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
 * UserDefinedPriceColVal
 */
 // UserDefinedPriceColVal?: IUserDefinedcolValEntity | null;

/*
 * WicBoqHeaderFk
 */
  WicBoqHeaderFk?: number | null;

/*
 * WicBoqItemFk
 */
  WicBoqItemFk?: number | null;

/*
 * WqQuantityTarget
 */
  WqQuantityTarget?: number | null;

/*
 * WqQuantityTargetDetail
 */
  WqQuantityTargetDetail?: string | null;
}
