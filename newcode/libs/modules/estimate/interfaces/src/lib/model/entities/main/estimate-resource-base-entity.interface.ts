import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';

/**
 * interface for resource entity
 */

export interface IEstResourceEntity extends IEntityBase {

	/**
	 * BusinessPartner
	 */
	BusinessPartner?: number | null;

	/**
	 * BusinessPartner
	 */
	ItemInfo?: string | null;

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
	Budget: number;

	/*
	 * BudgetDifference
	 */
	BudgetDifference?: number | null;

	/*
	 * BudgetUnit
	 */
	BudgetUnit: number;

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
	 * originCommentText
	 */
	originCommentText?: string | null;

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
	CostFactor1: number;

	/*
	 * CostFactor2
	 */
	CostFactor2: number;

	/*
	 * CostFactorCc
	 */
	CostFactorCc: number;

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
	CostTotal: number;

	/*
	 * CostTotalCurrency
	 */
	CostTotalCurrency?: number | null;

	/*
	 * CostTotalOc
	 */
	CostTotalOc: number;

	/*
	 * CostUnit
	 */
	CostUnit: number;

	/*
	 * CostUnitLineItem
	 */
	CostUnitLineItem: number;

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
	 * DescriptionInfo1
	 */
	DescriptionInfo1?: IDescriptionInfo | null;

	/*
	 * EfficiencyFactor1
	 */
	EfficiencyFactor1: number;

	/*
	 * EfficiencyFactor2
	 */
	EfficiencyFactor2: number;

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
	EscResourceCostUnit: number;

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
	EstLineItemFk: number;

	/*
	 * EstResourceFk
	 */
	EstResourceFk: number | null;

	/*
	 * EstResourceFlagFk
	 */
	EstResourceFlagFk?: number | null;

	/*
	 * EstResourceRuleFk
	 */
	EstResourceRuleFk?: number | null;

	/*
	 * EstResourceTypeFk
	 */
	EstResourceTypeFk: number;

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
	ExchangeRate: number;

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
	HourFactor: number;

	/*
	 * HoursTotal
	 */
	HoursTotal?: number | null;

	/*
	 * HoursUnit
	 */
	HoursUnit: number;

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
	IsDisabled: boolean;

	/*
	 * IsDisabledDirect
	 */
	IsDisabledDirect?: boolean | null;

	/*
	 * IsDisabledPrc
	 */
	IsDisabledPrc: boolean;

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
	IsGeneratedPrc: boolean;

	/*
	 * IsIndirectCost
	 */
	IsIndirectCost: boolean;

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
	IsRate: boolean;

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
	ProductivityFactor: number;

	/*
	 * ProductivityFactorDetail
	 */
	ProductivityFactorDetail?: string | null;

	/*
	 * ProjectCostCodeFk
	 */
	ProjectCostCodeFk: number | null;

	/*
	 * QtnHeaderFk
	 */
	QtnHeaderFk?: number | null;

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
	 * QuantityFactorCc
	 */
	QuantityFactorCc: number;

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
	QuantityInternal: number;

	/*
	 * QuantityOriginal
	 */
	QuantityOriginal?: number | null;

	/*
	 * QuantityReal
	 */
	QuantityReal: number;

	/*
	 * QuantityTotal
	 */
	QuantityTotal: number;

	/*
	 * QuantityUnitTarget
	 */
	QuantityUnitTarget: number;

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
	// ResourceParent?: IEstResourceEntity | null;

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
	Sorting: number;

	/*
	 * WorkOperationTypeFk
	 */
	WorkOperationTypeFk?: number | null;

	/*
	 * AdvancedAllowanceCostUnit
	 */
	AdvancedAllowanceCostUnit?: number;

	/*
	 * AdvancedAllowanceCostUnitSubItem
	 */
	AdvancedAllowanceCostUnitSubItem?:number;

	/*
	 * AdvancedAllowanceCostUnitLineItem
	 */
	AdvancedAllowanceCostUnitLineItem?:number;

	/*
	 * CostTotalInternal
	 */
	CostTotalInternal?: number;

	/*
	 * CostUnitLineItemInternal
	 */
	CostUnitLineItemInternal?: number;

	/*
	 * QuantityTotalBudget
	 */
	QuantityTotalBudget?: number;

	/*
	 * IsParentDisabled
	 */
	IsParentDisabled?: boolean;

	/*
	 * Currency1Fk
	 */
	Currency1Fk?: number | null;

	/*
	 * Currency2Fk
	 */
	Currency2Fk?: number | null;

	/*
	 * parentJobFk
	 */
	parentJobFk?: number | null;

	/*
	 * ForeignBudget1
	 */
	ForeignBudget1?: number | null;

	/*
	 * ForeignBudget2
	 */
	ForeignBudget2?: number | null;

	/*
	 * image
	 */
	image?: string;

	/*
	 * PackageAssignmentsBak
	 */
	PackageAssignmentsBak?: string | null;

	/*
	 * MarkupCostUnit
	 */
	MarkupCostUnit?: number | null;

	/*
	 * MarkupCostUnitLineItem
	 */
	MarkupCostUnitLineItem?: number | null;

	/*
	 * cssClass
	 */
	cssClass?: string | null;

	/*
	 * EstResourceTypeFkExtend
	 */
	EstResourceTypeFkExtend?: number | null;

	/*
	 * IsReadonlyStatus
	 */
	IsReadonlyStatus?: boolean | null;

	/*
	 * IsLabour
	 */
	IsLabour?: boolean | null;

	/*
	 * nodeInfo
	 */
	nodeInfo?: {
		level: number,
		collapsed: boolean,
		lastElement?: boolean,
		children?: boolean|null
	} | null;
}