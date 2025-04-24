/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
export const estimateMainRoundingConstants = {
	roundTo: {
		digitsBeforeDecimalPoint:1,
		digitsAfterDecimalPoint:2,
		significantPlaces: 3
	},
	roundingMethod: {
		standard: 1,
		roundUp: 2,
		roundDown: 3
	},
	estRoundingConfigColumnIds: {
		WqQuantityTarget : 1,
		QuantityTarget : 2,
		Quantity : 3,
		QuantityFactors : 4,
		CostFactors : 5,
		CostUnit : 6,
		CostTotal : 7,
		PriceUnitItem : 8,
		ItemPriceTotal : 9
	}
};

export const initialCostsFields = [
	'CostFactorCc',
	'CostFactor1',
	'CostFactor2',
	'CostUnit',
	'CostUnitOriginal',
	'HourFactor',
	'HoursUnit',
	'DayWorkRateUnit',
	'MarkupCostUnit',
	'RevenueUnit',
	'URDUnitItem',
	'AdvancedAllUnit',
	'ManualMarkupUnit',
	'RiskCostUnit',
	'EscalationCostUnit',
	'Ga',
	'Gc',
	'Am',
	'Rp',
	'Gar',
	'Fm'
];

export const initialQuantitiesFields = [
	'Quantity',
	'WqQuantityTarget',
	'QuantityTarget',
	'QuantityFactor1',
	'QuantityFactor2',
	'QuantityFactor3',
	'QuantityFactor4',
	'QuantityFactorCc',
	'EfficiencyFactor1',
	'EfficiencyFactor2',
	'ProductivityFactor'];