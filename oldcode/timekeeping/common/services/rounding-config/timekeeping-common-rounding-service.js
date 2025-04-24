(function(angular) {
	'use strict';

	let moduleName = 'timekeeping.common';
	/** @ngdoc service
	 * @name timekeepingCommonRoundingService
	 * @function
	 * @description
	 * timekeepingCommonRoundingService does Rounding for timekeeping items and related entities
	 */

	angular.module(moduleName).factory('timekeepingCommonRoundingService', ['_', '$injector',
		function (_,$injector) {

			let service = {
				getUiRoundingDigits: getUiRoundingDigits,
				doRounding: doRounding,
				doRoundingValue: doRoundingValue,
				doRoundingValues: doRoundingValues,
				roundItemValues: roundItemValues,
				roundInitialDurations: roundInitialDurations,
				roundInitialValues: roundInitialValues
			};

			let constantService = $injector.get('timekeepingCommonConstantValues');

			let roundingMethod = constantService.roundingMethod;
			let roundTo = constantService.roundTo;

			const initialFields = [
				'Duration'
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

			function getUiRoundingDigits(columnDef,field, commonRoundingDataService, entity) {
				let uiDisplayTo = null;
				if (entity && entity.RoundingConfigDetail){
					uiDisplayTo = entity.RoundingConfigDetail.UiDisplayTo;
				} else {
					let roundingConfigDetail = commonRoundingDataService.getRoundingConfigDetails();
					if (roundingConfigDetail) {
						uiDisplayTo = roundingConfigDetail.UiDisplayTo;
					}
				}
				return uiDisplayTo;
			}

			// Round item all columns
			function roundItemValues(item, commonRoundingDataService){
				let roundingConfigDetail = commonRoundingDataService.getRoundingConfigDetails();
				if (roundingConfigDetail) {
					let roundingColumnName = roundingConfigDetail.Field;
					if (angular.isDefined(item[roundingColumnName])) {
						let beforeRoundingValue = item[roundingColumnName];
						item[roundingColumnName] = doRounding(beforeRoundingValue, roundingColumnName, roundingConfigDetail);
					}
				}
			}

			// Rounds particular passed field only, call from outside services
			function doRoundingValue(roundingField,beforeRoundingValue, commonRoundingDataService){
				if(beforeRoundingValue === 0){
					return beforeRoundingValue;
				}

				let afterRoundingValue = beforeRoundingValue;
				let roundingConfigDetail = commonRoundingDataService.getRoundingConfigDetails();
				if (roundingConfigDetail) {
					if (!isNaN(beforeRoundingValue)) {
						afterRoundingValue = doRounding(beforeRoundingValue, roundingField, roundingConfigDetail);
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
						case roundTo.digitsAfterDecimalPoint: {
							switch (roundingConfigItem.BasRoundingMethodFk) {
								case roundingMethod.standard: {
									afterRoundingValue = digitsAfterDecimalRounding.round(beforeRoundingValue, roundingConfigItem.RoundTo);
								}
									break;
								case roundingMethod.roundUp: {
									afterRoundingValue = digitsAfterDecimalRounding.ceil(beforeRoundingValue, roundingConfigItem.RoundTo);
								}
									break;
								case roundingMethod.roundDown: {
									afterRoundingValue = digitsAfterDecimalRounding.floor(beforeRoundingValue, roundingConfigItem.RoundTo);
								}
									break;
							}
						}
					}
				}

				return afterRoundingValue;
			}

			function doRoundingValues(fields, item, commonRoundingDataService){
				if(!item || !fields || !fields.length){
					return;
				}
				let roundingConfigDetail = commonRoundingDataService.getRoundingConfigDetails();
				if (roundingConfigDetail) {
					return;
				}

				angular.forEach(fields, function(field){
					item[field] = doRoundingValue(field, item[field], commonRoundingDataService);
				});
			}

			function roundInitialFields(item, intitialFields, commonRoundingDataService){
				if(!item){
					return;
				}
				let roundingConfigDetail = commonRoundingDataService.getRoundingConfigDetails();
				if (roundingConfigDetail) {
					return;
				}

				angular.forEach(intitialFields, function(field){
					item[field] = doRoundingValue(field, item[field], commonRoundingDataService);
				});
			}

			function roundInitialDurations(item, commonRoundingDataService){
				roundInitialFields(item, initialFields, commonRoundingDataService);
			}

			function roundInitialValues(item, commonRoundingDataService) {

				if(item) {
					roundInitialDurations(item, commonRoundingDataService);
				}
			}

			return service;
		}]);
})(angular);
