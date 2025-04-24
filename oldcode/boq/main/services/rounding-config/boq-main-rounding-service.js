(function(angular) {
	'use strict';

	let moduleName = 'boq.main';
	/** @ngdoc service
	 * @name boqMainRoundingService
	 * @function
	 * @description
	 * boqMainRoundingService does Rounding for boq items and related entities
	 */

	angular.module(moduleName).factory('boqMainRoundingService', ['_', '$injector',
		function (_,$injector) {

			let service = {
				getUiRoundingDigits: getUiRoundingDigits,
				doRounding: doRounding,
				doRoundingValue: doRoundingValue,
				doRoundingValues: doRoundingValues,
				roundBoqItemValues: roundBoqItemValues,
				roundInitialQuantities: roundInitialQuantities,
				roundInitialPrices: roundInitialPrices,
				roundInitialAmounts: roundInitialAmounts,
				roundInitialValues: roundInitialValues
			};

			let boqMainCommonService = $injector.get('boqMainCommonService');
			let boqMainRoundingMethod = $injector.get('boqMainRoundingMethod');
			let boqMainRoundTo = $injector.get('boqMainRoundTo');

			const initialPriceFields = [
				'Price',
				'PriceOc',
				'Pricegross',
				'PricegrossOc',
				'Cost',
				'CostOc',
				'Urb1',
				'Urb1Oc',
				'Urb2',
				'Urb2Oc',
				'Urb3',
				'Urb3Oc',
				'Urb4',
				'Urb4Oc',
				'Urb5',
				'Urb5Oc',
				'Urb6',
				'Urb6Oc',
				'UnitRateFrom',
				'UnitRateFromOc',
				'UnitRateTo',
				'UnitRateToOc',
				'DiscountPercent',
				'SurchargeFactor',
				'SurchargePercent',
				'BudgetPerUnit',
				'VobDirectCostPerUnit',
				'VobDirectCostPerUnitOc'
			];

			const initialAmountFields = [
				'LumpsumPrice',
				'LumpsumPriceOc',
				'Discount',
				'DiscountOc',
				'DiscountPercentIt'
			];

			const initialQuantitiesFields = [
				'Quantity',
				'QuantityAdj',
				'QuantityTarget',
				'ExSalesRejectedQuantity',
				'HoursUnit',
				'Hours',
				'QuantityMax'
			];

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

			function getUiRoundingDigits(columnDef,field, boqMainService) {
				let uiDisplayTo = null;
				let roundingConfigDetails = boqMainService.getRoundingConfigDetails();
				if (roundingConfigDetails && roundingConfigDetails.length > 0) {
					let boqRoundingConfig = boqMainService.getRoundingConfig();
					if(_.isObject(boqRoundingConfig) && _.isArray(boqRoundingConfig.RoundedColumns2DetailTypes)) {
						let roundedColumns2DetailTypes = boqRoundingConfig.RoundedColumns2DetailTypes;
						let boqRoundingColumnId = _.find(roundedColumns2DetailTypes, {Field: field});
						if(boqRoundingColumnId){
							let roundingConfigItem = _.find(roundingConfigDetails, {ColumnId: boqRoundingColumnId.Id});
							uiDisplayTo = roundingConfigItem.UiDisplayTo;
						}
						else{
							boqRoundingColumnId = _.find(roundedColumns2DetailTypes, {Field: columnDef.$field});
							if(boqRoundingColumnId){
								let roundingConfigItem = _.find(roundingConfigDetails, {ColumnId: boqRoundingColumnId.Id});
								uiDisplayTo = roundingConfigItem.UiDisplayTo;
							}
						}
					}
				}

				return uiDisplayTo;
			}

			// Round boqItem all columns
			function roundBoqItemValues(boqItem, boqMainService){
				let roundingConfigDetails = boqMainService.getRoundingConfigDetails();
				if (roundingConfigDetails && roundingConfigDetails.length > 0) {
					let boqRoundingConfig = boqMainService.getRoundingConfig();
					if (_.isObject(boqRoundingConfig) && _.isArray(boqRoundingConfig.RoundedColumns2DetailTypes)) {
						let roundedColumns2DetailTypes = boqRoundingConfig.RoundedColumns2DetailTypes;
						angular.forEach(roundedColumns2DetailTypes, function (boqRoundingColumnId) {
							let roundingColumnName = boqRoundingColumnId.Field;
							if (angular.isDefined(boqItem[roundingColumnName])) {
								let beforeRoundingValue = boqItem[roundingColumnName];
								let roundingConfigItem = _.find(roundingConfigDetails, {ColumnId: boqRoundingColumnId.Id});
								if (roundingConfigItem) {
									boqItem[roundingColumnName] = doRounding(beforeRoundingValue, roundingColumnName, roundingConfigItem);
								}
							}
						});
					}
				}
			}

			// Rounds particular passed field only, call from outside services
			function doRoundingValue(roundingField,beforeRoundingValue, boqMainService){
				if(beforeRoundingValue === 0){
					return beforeRoundingValue;
				}

				let afterRoundingValue = beforeRoundingValue;
				let roundingConfigDetails = boqMainService.getRoundingConfigDetails();
				if (roundingConfigDetails && roundingConfigDetails.length > 0) {
					let boqRoundingConfig = boqMainService.getRoundingConfig();
					if(_.isObject(boqRoundingConfig) && _.isArray(boqRoundingConfig.RoundedColumns2DetailTypes)) {
						let roundedColumns2DetailTypes = boqRoundingConfig.RoundedColumns2DetailTypes;
						let boqRoundingColumnId = _.find(roundedColumns2DetailTypes, {Field: roundingField});

						if (boqRoundingColumnId && angular.isDefined(boqRoundingColumnId)) {
							let roundingFieldId = boqRoundingColumnId.Id;

							if (!isNaN(beforeRoundingValue)) {
								let roundingConfigItem = _.find(roundingConfigDetails, {ColumnId: roundingFieldId});
								if (roundingConfigItem) {
									afterRoundingValue = doRounding(beforeRoundingValue, roundingField, roundingConfigItem);
								}
							}
						}
						else {
							console.error('boqMainRoundingService.doRoundingValues: the following property name is not mapped <' + roundingField + '>');
						}
					}
				}
				return afterRoundingValue;
			}

			// Internal common rounding function which does actual rounding
			function doRounding(beforeRoundingValue, roundingField, roundingConfigItem) {
				let afterRoundingValue = beforeRoundingValue;

				if (!roundingConfigItem || roundingConfigItem.IsWithoutRounding) { /*
					if (costTotalFields.indexOf(roundingField) >=1 ) {
						afterRoundingValue= beforeRoundingValue.toFixed(7) - 0;
					}
					else if(hoursTotalFields.indexOf(roundingField) >=1){
						afterRoundingValue = beforeRoundingValue.toFixed(6) - 0;
					} */
				}
				else {
					switch (roundingConfigItem.BasRoundToFk) {
						case boqMainRoundTo.digitsAfterDecimalPoint: {
							switch (roundingConfigItem.BasRoundingMethodFk) {
								case boqMainRoundingMethod.standard: {
									afterRoundingValue = digitsAfterDecimalRounding.round(beforeRoundingValue, roundingConfigItem.RoundTo);
								}
									break;
								case boqMainRoundingMethod.roundUp: {
									afterRoundingValue = digitsAfterDecimalRounding.ceil(beforeRoundingValue, roundingConfigItem.RoundTo);
								}
									break;
								case boqMainRoundingMethod.roundDown: {
									afterRoundingValue = digitsAfterDecimalRounding.floor(beforeRoundingValue, roundingConfigItem.RoundTo);
								}
									break;
							}
						}
					}
				}

				return afterRoundingValue;
			}

			function doRoundingValues(fields, item, boqMainService){
				if(!item || !fields || !fields.length){
					return;
				}
				let roundingConfigDetails = boqMainService.getRoundingConfigDetails();
				if (roundingConfigDetails && roundingConfigDetails.length <= 0) {
					return;
				}

				angular.forEach(fields, function(field){
					item[field] = doRoundingValue(field, item[field], boqMainService);
				});
			}

			function roundInitialFields(item, intitialFields, boqMainService){
				if(!item){
					return;
				}
				let roundingConfigDetails = boqMainService.getRoundingConfigDetails();
				if (roundingConfigDetails && roundingConfigDetails.length <= 0) {
					return;
				}

				angular.forEach(intitialFields, function(field){
					item[field] = doRoundingValue(field, item[field], boqMainService);
				});
			}

			function roundInitialQuantities(item, boqMainService){
				roundInitialFields(item, initialQuantitiesFields, boqMainService);
			}

			function roundInitialPrices(item, boqMainService){
				roundInitialFields(item, initialPriceFields, boqMainService);
			}

			function roundInitialAmounts(item, boqMainService){
				roundInitialFields(item, initialAmountFields, boqMainService);
			}

			function roundInitialValues(item, boqMainService) {

				if(boqMainCommonService.isItem(item)) {
					roundInitialQuantities(item, boqMainService);
					roundInitialPrices(item, boqMainService);
				}

				if(boqMainCommonService.isDivisionOrRoot(item)) {
					roundInitialAmounts(item, boqMainService);
				}
			}

			return service;
		}]);
})(angular);
