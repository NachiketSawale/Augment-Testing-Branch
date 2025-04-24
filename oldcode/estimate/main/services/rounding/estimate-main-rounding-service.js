/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	'use strict';

	let moduleName = 'estimate.main';
	/** @ngdoc service
	 * @name estimateMainRoundingService
	 * @function
	 * @description
	 * estimateMainRoundingService does Rounding for Estimate LineItems and Resources columns
	 */

	angular.module(moduleName).factory('estimateMainRoundingService', ['_','estimateMainRoundingDataService','estimateMainRoundingConstants',
		function (_,estimateMainRoundingDataService,estimateMainRoundingConstants) {

			let service = {
				getUiRoundingDigits: getUiRoundingDigits,
				roundLineItemAndResources: roundLineItemAndResources,
				doRoundingValue: doRoundingValue,
				doRoundingValues: doRoundingValues,
				roundResourceValues: roundResourceValues,
				roundLineItemValues: roundLineItemValues,
				roundInitialQuantities: roundInitialQuantities,
				roundInitialCosts: roundInitialCosts,
				getRoundingDigits:getRoundingDigits
			};

			/* const costTotalFields = [
				'EntCostTotal',
				'DruCostTotal',
				'IndCostTotal',
				'DirCostTotal',
				'DirHoursTotal',
				'CostTotal',
				'MarkupCostTotal',
				'GrandTotal',
				'DayWorkRateTotal']; */

			/* const hoursTotalFields = [
				'EntHoursTotal',
				'DruHoursTotal',
				'IndHoursTotal',
				'DirHoursTotal',
				'HoursTotal']; */

			const initialCostsFields = [
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

			const initialQuantitiesFields = [
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

			// Rounding logic for Digits after decimal point
			let digitsAfterDecimalRounding = (function() {
				if (Math.trunc === undefined) {
					Math.trunc = function(v) {
						return v < 0 ? Math.ceil(v) : Math.floor(v);
					};
				}
				let decimalAdjust = function myself(type, num, decimalPlaces) {
					if (type === 'round' && num < 0){
						return -myself(type, -num, decimalPlaces);
					}
					let shift = function(value, exponent) {
						value = (value + 'e').split('e');
						return +(value[0] + 'e' + (+value[1] + (exponent || 0)));
					};
					let n = shift(num, +decimalPlaces);
					return shift(Math[type](n), -decimalPlaces);
				};
				return {
					// Standard Decimal round (half away from zero)
					round: function(num, decimalPlaces) {
						return decimalAdjust('round', num, decimalPlaces);
					},
					// Decimal ceil
					ceil: function(num, decimalPlaces) {
						return decimalAdjust('ceil', num, decimalPlaces);
					},
					// Decimal floor
					floor: function(num, decimalPlaces) {
						return decimalAdjust('floor', num, decimalPlaces);
					},
				};
			})();

			// get UI display rounding digits
			function getUiRoundingDigits(columnDef,field) {
				let estRoundingConfigData = estimateMainRoundingDataService.getEstRoundingConfig();
				if (estRoundingConfigData && estRoundingConfigData.length > 0) {
					let esRoundingColumnIds= estimateMainRoundingDataService.getRoundingColumnIds();
					let esRoundingLineItemColumnId = _.find(esRoundingColumnIds, {Field: field});
					if(esRoundingLineItemColumnId){
						let roundingConfigItem = _.find(estRoundingConfigData, {ColumnId: esRoundingLineItemColumnId.Id});
						return roundingConfigItem.UiDisplayTo;
					}
					else{
						esRoundingLineItemColumnId = _.find(esRoundingColumnIds, {Field: columnDef.$field});
						if(esRoundingLineItemColumnId){
							let roundingConfigItem = _.find(estRoundingConfigData, {ColumnId: esRoundingLineItemColumnId.Id});
							return roundingConfigItem.UiDisplayTo;
						}
					}
				}
			}

			// get rounding digits
			function getRoundingDigits(field) {
				let estRoundingConfigData = estimateMainRoundingDataService.getEstRoundingConfig();
				if (estRoundingConfigData && estRoundingConfigData.length > 0) {
					let esRoundingColumnIds= estimateMainRoundingDataService.getRoundingColumnIds();
					let esRoundingLineItemColumnId = _.find(esRoundingColumnIds, {Field: field});
					if(esRoundingLineItemColumnId){
						let roundingConfigItem = _.find(estRoundingConfigData, {ColumnId: esRoundingLineItemColumnId.Id});
						return roundingConfigItem.RoundTo;
					}else{
						// Todo: change to based on field type like quantity, cost totals..like domain type
						return 6;
					}
				}
			}

			function roundLineItemAndResources(lineItem, resources){
				/* validate lineItem is not null */
				if (!lineItem) {
					return;
				}

				roundLineItemValues(lineItem);

				/* validate lineItem is not null */
				if (!resources || resources.length <= 0) {
					return;
				}

				if (resources.length > 0) {
					roundResourceValues(resources);
				}
			}

			// Round LineItem all columns
			function roundLineItemValues(lineItem){
				let estRoundingConfigData = estimateMainRoundingDataService.getEstRoundingConfig();
				if (estRoundingConfigData && estRoundingConfigData.length > 0) {
					let roundingColumnIds= estimateMainRoundingDataService.getRoundingColumnIds();
					angular.forEach(roundingColumnIds, function (estRoundingColumnId) {
						let roundingColumnName = estRoundingColumnId.Field;
						if(angular.isDefined(lineItem[roundingColumnName])){
							let beforeRoundingValue = lineItem[roundingColumnName];
							let roundingConfigItem = _.find(estRoundingConfigData, {ColumnId: estRoundingColumnId.Id});
							if (roundingConfigItem) {
								lineItem[roundingColumnName] = doRounding(beforeRoundingValue, roundingColumnName,roundingConfigItem);
							}
						}
					});
				}
			}

			// Rounding all resources columns
			function roundResourceValues(resources){
				if(!resources || !resources.length){
					return;
				}
				let estRoundingConfigData = estimateMainRoundingDataService.getEstRoundingConfig();
				if (estRoundingConfigData && estRoundingConfigData.length > 0) {
					angular.forEach(resources, function (resource) {
						if(resource){
							let roundingColumnIds= estimateMainRoundingDataService.getRoundingColumnIds();
							angular.forEach(roundingColumnIds, function (estRoundingColumnId) {
								let roundingColumnName = estRoundingColumnId.Field;
								if(angular.isDefined(resource[roundingColumnName])) {
									let beforeRoundingValue = resource[roundingColumnName];
									let roundingConfigItem = _.find(estRoundingConfigData, {ColumnId: estRoundingColumnId.Id});
									if (roundingConfigItem) {
										resource[roundingColumnName] = doRounding(beforeRoundingValue,roundingColumnName, roundingConfigItem);
									}
								}
							});
						}
					});
				}
			}

			// Rounds particular passed field only, call from outside services
			function doRoundingValue(roundingField,beforeRoundingValue){
				if(beforeRoundingValue === 0){
					return beforeRoundingValue;
				}

				let afterRoundingValue = beforeRoundingValue;
				let estRoundingConfigData = estimateMainRoundingDataService.getEstRoundingConfig();
				if (estRoundingConfigData && estRoundingConfigData.length > 0) {
					let roundingColumnIds = estimateMainRoundingDataService.getRoundingColumnIds();
					let estRoundingColumnId = _.find(roundingColumnIds, {Field: roundingField});
					if(estRoundingColumnId && angular.isDefined(estRoundingColumnId)) {
						let roundingFieldId = estRoundingColumnId.Id;

						if(!isNaN(beforeRoundingValue)) {
							let roundingConfigItem = _.find(estRoundingConfigData, {ColumnId: roundingFieldId});
							if (roundingConfigItem.IsWithoutRounding) {
								afterRoundingValue = doWithOutRounding(beforeRoundingValue,roundingFieldId );
							}else{
								afterRoundingValue = doRounding(beforeRoundingValue, roundingField,roundingConfigItem);
							}
						}
					}
				}
				return afterRoundingValue;
			}

			// Internal common rounding function which does actual rounding
			function doRounding(beforeRoundingValue,roundingField,roundingConfigItem) {
				let afterRoundingValue= beforeRoundingValue;

				switch (roundingConfigItem.RoundToFk) {
					case estimateMainRoundingConstants.roundTo.digitsAfterDecimalPoint: {
						switch (roundingConfigItem.RoundingMethodFk) {
							case estimateMainRoundingConstants.roundingMethod.standard: {
								afterRoundingValue = digitsAfterDecimalRounding.round(beforeRoundingValue, roundingConfigItem.RoundTo);
							}
								break;
							case estimateMainRoundingConstants.roundingMethod.roundUp: {
								afterRoundingValue = digitsAfterDecimalRounding.ceil(beforeRoundingValue, roundingConfigItem.RoundTo);
							}
								break;
							case estimateMainRoundingConstants.roundingMethod.roundDown: {
								afterRoundingValue = digitsAfterDecimalRounding.floor(beforeRoundingValue, roundingConfigItem.RoundTo);
							}
								break;
						}
					}
				}

				return afterRoundingValue;
			}

			// If Without Rounding is true.then cut the values to  6 or 7
			function doWithOutRounding(beforeRoundingValue,roundingConfigColumnId) {
				let afterRoundingValue= beforeRoundingValue;

				if (roundingConfigColumnId === estimateMainRoundingConstants.estRoundingConfigColumnIds.WqQuantityTarget ||
					roundingConfigColumnId === estimateMainRoundingConstants.estRoundingConfigColumnIds.QuantityTarget ||
					roundingConfigColumnId === estimateMainRoundingConstants.estRoundingConfigColumnIds.Quantity ||
					roundingConfigColumnId === estimateMainRoundingConstants.estRoundingConfigColumnIds.QuantityFactors ||
					roundingConfigColumnId === estimateMainRoundingConstants.estRoundingConfigColumnIds.CostFactors)
				{
					afterRoundingValue = digitsAfterDecimalRounding.round(beforeRoundingValue, 6);
				}else if (roundingConfigColumnId === estimateMainRoundingConstants.estRoundingConfigColumnIds.CostUnit ||
					roundingConfigColumnId === estimateMainRoundingConstants.estRoundingConfigColumnIds.CostTotal ||
					roundingConfigColumnId === estimateMainRoundingConstants.estRoundingConfigColumnIds.PriceUnitItem ||
					roundingConfigColumnId === estimateMainRoundingConstants.estRoundingConfigColumnIds.ItemPriceTotal)
				{
					afterRoundingValue = digitsAfterDecimalRounding.round(beforeRoundingValue, 7);
				}

				return afterRoundingValue;
			}

			function doRoundingValues(fields, item){
				if(!item || !fields || !fields.length){
					return;
				}
				let estRoundingConfigData = estimateMainRoundingDataService.getEstRoundingConfig();
				if (estRoundingConfigData && estRoundingConfigData.length <= 0) {
					return;
				}

				angular.forEach(fields, function(field){
					item[field] = doRoundingValue(field, item[field]);
				});
			}

			function roundInitialQuantities(item){
				if(!item){
					return;
				}
				let estRoundingConfigData = estimateMainRoundingDataService.getEstRoundingConfig();
				if (estRoundingConfigData && estRoundingConfigData.length <= 0) {
					return;
				}

				angular.forEach(initialQuantitiesFields, function(field){
					item[field] = doRoundingValue(field, item[field]);
				});
			}

			function roundInitialCosts(item){
				if(!item){
					return;
				}
				let estRoundingConfigData = estimateMainRoundingDataService.getEstRoundingConfig();
				if (estRoundingConfigData && estRoundingConfigData.length <= 0) {
					return;
				}

				angular.forEach(initialCostsFields, function(field){
					item[field] = doRoundingValue(field, item[field]);
				});
			}

			return service;
		}]);
})(angular);
