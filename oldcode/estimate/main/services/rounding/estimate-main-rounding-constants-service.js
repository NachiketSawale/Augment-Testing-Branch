/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';

	let moduleName = 'estimate.main';
	angular.module(moduleName).value('estimateMainRoundingConstants', {
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
	});
})(angular);

