import { IDescriptionInfo, IDictionary } from '@libs/platform/common';

export interface IEstCostTotalEntity {
	Id?: number | null;

	Code?: string | null;

	DescriptionInfo?: IDescriptionInfo | null;

	Currency?: string | null;

	UoM?: string | null;

	Type?: string | null;

	QuantityTotal?: number | null;

	HoursTotal?: number | null;

	CostTotal?: number | null;

	StructureAssigned?: boolean;

	StructureQty?: number | null;

	StructureUom?: number | null;

	WQCostTotal?: number | null;

	AQCostTotal?: number | null;

	WQMargin?: number | null;

	AQMargin?: number | null;

	WQBudget?: number | null;

	AQBudget?: number | null;

	WQRevenue?: number | null;

	AQRevenue?: number | null;

	DayWorkRateTotal?: number | null;

	RiskCostTotal?: number | null;

	EscalationCostTotal?: number | null;

	GrandTotal?: number | null;

	ColValTotals?: IDictionary<string, number> | null;

	DirectTotalStatistics?: number | null;

	GrandTotalStatistics?: number | null;

	LineType?: number | null;

	IsIndirectCost?: boolean;

	AQDayWorkRateTotal?: number | null;

	WQDayWorkRateTotal?: number | null;

	Gc?: number | null;

	Ga?: number | null;

	Am?: number | null;

	Rp?: number | null;

	Fm?: number | null;

	ManualMarkup?: number | null;

	URD?: number | null;

	AdvancedAll?: number | null;

	ExtraGa?: number | null;

	CO2SourceTotal?: number | null;

	CO2ProjectTotal?: number | null;

	Currency1Fk?: number | null;

	Currency2Fk?: number | null;

	Quantity?: number | null;

	ForeignBudget1?: number | null;

	ForeignBudget2?: number | null;

	Total?: number | null;

	CostExchangeRate1?: number | null;

	CostExchangeRate2?: number | null;

	FromDJC?: number | null;

	FromTJC?: number | null;
}
