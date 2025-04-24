/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo, IEntityIdentification } from '@libs/platform/common';

/**
 * interface for LineItem and Assembly
 */
export interface IEstLineItemEntity extends IEntityBase, IEntityIdentification {

	/**
	 * Info
	 */
	Info?: string | null;

	/**
	 * ItemInfo
	 */
	ItemInfo?: string | null;

	/**
	 * Currency1Fk
	 */
	Currency1Fk?: number | null;

	/**
	 * Currency2Fk
	 */
	Currency2Fk?: number | null;

	/**
	 * PrjChangeStatusFk
	 */
	PrjChangeStatusFk?: number | null;

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
	AdvancedAllUnit: number;

	/*
	 * AdvancedAllUnitItem
	 */
	AdvancedAllUnitItem?: number | null;

	/*
	 * AdvancedAllowance
	 */
	AdvancedAllowance: number;

	/*
	 * AdvancedAllowanceCostUnit
	 */
	AdvancedAllowanceCostUnit: number;

	/*
	 * Allowance
	 */
	Allowance: number;

	/*
	 * AllowanceUnit
	 */
	AllowanceUnit: number;

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
	Budget: number;

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
	BudgetUnit: number;

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
	 * CommentText
	 */
	CommentText?: string | null;

	/*
	 * originCommentText
	 */
	originCommentText?: string | null;

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
	CostFactor1: number;

	/*
	 * CostFactor2
	 */
	CostFactor2: number;

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
	CostTotal: number;

	/*
	 * CostUnit
	 */
	CostUnit: number;

	/*
	 * CostUnitTarget
	 */
	CostUnitTarget: number;

	/*
	 * DayWorkRateTotal
	 */
	DayWorkRateTotal: number;

	/*
	 * DayWorkRateUnit
	 */
	DayWorkRateUnit: number;

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
	DruCostUnit: number;

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
	DruHoursUnit: number;

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
	EntCostUnit: number;

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
	EntHoursUnit: number;

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
	EscalationCostUnit: number;

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
	 * EstHeaderAssemblyFk
	 */
	EstHeaderAssemblyFk?: number | null;

	/*
	 * EstHeaderFk
	 */
	EstHeaderFk: number;

	/*
	 * EstLineItemFk
	 */
	EstLineItemFk: number | null;

	/*
	 * EstLineItemStatusFk
	 */
	EstLineItemStatusFk?: number | null;

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
	Gc: number;

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
	GrandCostUnit: number;

	/*
	 * GrandCostUnitTarget
	 */
	GrandCostUnitTarget: number;

	/*
	 * GrandTotal
	 */
	GrandTotal: number;

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
	HoursUnit: number;

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
	IndCostUnit: number;

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
	IndHoursUnit: number;

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
	IsDisabled: boolean;

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
	IsFixedPrice: boolean;

	/*
	 * IsGc
	 */
	IsGc: boolean;

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
	IsOptional: boolean;

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
	ManualMarkupUnit: number;

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
	MarkupCostTotal: number;

	/*
	 * MarkupCostUnit
	 */
	MarkupCostUnit: number;

	/*
	 * MarkupCostUnitTarget
	 */
	MarkupCostUnitTarget?: number | null;

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
	ProductivityFactor: number;

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
	Quantity: number;

	/*
	 * QuantityDetail
	 */
	QuantityDetail?: string | null;

	/*
	 * QuantityFactor1
	 */
	QuantityFactor1: number;

	/*
	 * QuantityFactor2
	 */
	QuantityFactor2: number;

	/*
	 * QuantityFactor3
	 */
	QuantityFactor3: number;

	/*
	 * QuantityFactor4
	 */
	QuantityFactor4: number;

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
	QuantityTarget: number;

	/*
	 * QuantityTargetDetail
	 */
	QuantityTargetDetail?: string | null;

	/*
	 * QuantityTotal
	 */
	QuantityTotal: number;

	/*
	 * QuantityUnitTarget
	 */
	QuantityUnitTarget: number;

	/*
	 * Revenue
	 */
	Revenue: number;

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
	WqQuantityTarget: number;

	/*
	 * WqQuantityTargetDetail
	 */
	WqQuantityTargetDetail?: string | null;

	/*
	 * IsReadonlyStatus
	 */
	IsReadonlyStatus?: boolean | null;

	/*
	 * StandardGrandCostUnit
	 */
	StandardGrandCostUnit?: number;

	/*
	 * StandardGrandCostUnitTarget
	 */
	StandardGrandCostUnitTarget?: number;

	/*
	 * StandardGrandTotal
	 */
	StandardGrandTotal?: number;

	/*
	 * QuantityTotalBudget
	 */
	QuantityTotalBudget?: number;

	/*
	 * originalAdvancedAllUnit
	 */
	originalAdvancedAllUnit?: number;

	/*
	 * originalManualMarkupUnit
	 */
	originalManualMarkupUnit?: number;

	/*
 * ExchangeRate1
 */
	ExchangeRate1?: number | null;

	/*
	 * ExchangeRate2
	 */
	ExchangeRate2?: number | null;

	/*
	 * EstAssemblyFkPrjProjectAssemblyFk
	 */
	EstAssemblyFkPrjProjectAssemblyFk?: number|null;

	/*
	 * forceBudgetCalc
	 */
	forceBudgetCalc?: boolean;

	/*
	 * OldBoqHeaderFk
	 */
	OldBoqHeaderFk?: number|null;

	/*
	 * parentJobFk
	 */
	parentJobFk?: number | null;

	/*
	 * readOnlyByJob
	 */
	readOnlyByJob?: boolean | null;

	/*
	 * EstAssemblyTypeLogicFk
	 */
	EstAssemblyTypeLogicFk?: number | null;
}
