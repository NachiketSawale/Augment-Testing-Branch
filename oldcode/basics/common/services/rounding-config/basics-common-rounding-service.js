(function (angular) {
	'use strict';
	/* global globals, $ */
	let moduleName = 'basics.common';
	/** @ngdoc service
	 * @name basicsCommonRoundingService
	 * @function
	 * @description
	 *
	 */

	angular.module(moduleName).factory('basicsCommonRoundingService', ['_', '$injector', 'basicsLookupdataLookupDescriptorService', '$http', '$q',
		function (_, $injector, descriptorService, $http, $q) {
			const serviceCache = [];

			function createService(_moduleName, _configId) {

				let service = {
					doRounding: doRounding,
					loadRounding: loadRounding,
					getDecimalPlaces: getDecimalPlaces,
					getDecimalPlacesByColumnId: getDecimalPlacesByColumnId,
					uiRoundingConfig: uiRoundingConfig,
					gridRoundingConfig: gridRoundingConfig,
					lookUpRoundingConfig: lookUpRoundingConfig,
					getFieldsRoundType: getFieldsRoundType,
					getBasRoundType: getBasRoundType
				};
				let roundingConfigDetails = {};
				let fieldsRoundType = {};
				let basRoundType = {};
				let defaultRoundDecimalPlaces = 2;


				let constantService = $injector.get('basicsCommonConstantValues');

				let roundingMethod = constantService.roundingMethod;

				let roundTo = constantService.roundTo;

				// Rounding logic for Digits after decimal point
				let digitsAfterDecimalRounding = (function () {
					if (Math.trunc === undefined) {
						Math.trunc = function (v) {
							return v < 0 ? Math.ceil(v) : Math.floor(v);
						};
					}
					let decimalAdjust = function myself(type, num, decimalPlaces) {
						if (type === 'round' && num < 0) {
							return -myself(type, -num, decimalPlaces);
						}
						let shift = function (value, exponent) {
							value = (value + 'e').split('e');
							return +(value[0] + 'e' + (+value[1] + (exponent || 0)));
						};
						let n = shift(num, +decimalPlaces);
						return shift(Math[type](n), -decimalPlaces);
					};
					return {
						// Standard Decimal round (half away from zero)
						round: function (num, decimalPlaces) {
							return decimalAdjust('round', num, decimalPlaces);
						}, // Decimal ceil
						ceil: function (num, decimalPlaces) {
							return decimalAdjust('ceil', num, decimalPlaces);
						}, // Decimal floor
						floor: function (num, decimalPlaces) {
							return decimalAdjust('floor', num, decimalPlaces);
						},
					};
				})();

				function loadRounding() {
					let async = $q.defer();
					let details = getRoundingConfigDetails();
					if (_.isEmpty(details)) {
						const request = {
							ModuleName: _moduleName,
							ConfigId: _configId
						};
						let url = globals.webApiBaseUrl + 'basics/common/rounding/getconfig';// basics.material
						$http.post(url, request).then(function (response) {
							if (response && response.data) {
								_.assign(roundingConfigDetails, response.data.configDetail);
								_.assign(fieldsRoundType, response.data.roundingType);
								_.assign(basRoundType, response.data.basRoundingType);
							}
							async.resolve(true);
						});
					} else {
						async.resolve(true);
					}
					return async.promise;
				}

				function getRoundingConfigDetails() {
					return roundingConfigDetails;
				}

				function getFieldsRoundType() {
					return fieldsRoundType;
				}

				function getBasRoundType() {
					return basRoundType;
				}

				function getConfigItem(roundingField) {
					let configItem = null;
					let roundingConfigDetail = getRoundingConfigDetails();
					if (roundingConfigDetail) {
						configItem = _.find(roundingConfigDetail, {ColumnId: roundingField});
					}
					return configItem;
				}

				function getUiRoundingDigits(roundingField) {
					let configItem = getConfigItem(roundingField);
					return configItem ? configItem.UiDisplayTo : null;
				}

				// Rounds particular passed field only, call from outside services
				function doRounding(roundingField, beforeRoundingValue) {
					if (beforeRoundingValue === 0) {
						return beforeRoundingValue;
					}

					let afterRoundingValue = beforeRoundingValue;
					let configItem = getConfigItem(roundingField);
					return configItem ? doRound(beforeRoundingValue, roundingField, configItem) : afterRoundingValue;
				}

				// Internal common rounding function which does actual rounding
				function doRound(beforeRoundingValue, roundingField, roundingConfigItem) {
					let afterRoundingValue = beforeRoundingValue;

					if (!roundingConfigItem || roundingConfigItem.IsWithoutRounding) { /*
					if (costTotalFields.indexOf(roundingField) >=1 ) {
						afterRoundingValue= beforeRoundingValue.toFixed(7) - 0;
					}
					else if(hoursTotalFields.indexOf(roundingField) >=1){
						afterRoundingValue = beforeRoundingValue.toFixed(6) - 0;
					} */
					} else {
						let roundToFk = roundingConfigItem.BasRoundToFk || roundingConfigItem.RoundToFk;
						let roundingMethodFk = roundingConfigItem.BasRoundingMethodFk || roundingConfigItem.RoundingMethodFk;
						switch (roundToFk) {
							case roundTo.digitsAfterDecimalPoint:
							case roundTo.digitsBeforeDecimalPoint:
							case roundTo.significantPlaces: {
								switch (roundingMethodFk) {
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

				function uiRoundingConfig(layout, excludeFields, specialConfig) {
					let providedFields = getRelatedFields(layout);
					let roundingFieldsKeys = _.keys(getFieldsRoundType());
					let needRoundingFields = _.intersectionWith(roundingFieldsKeys, providedFields, function (providedField, roundingField) {
						return (providedField.toLocaleLowerCase() === roundingField.toLocaleLowerCase());
					});
					if (excludeFields && excludeFields.length) {
						needRoundingFields = _.differenceWith(needRoundingFields, excludeFields, function (needRoundingField, excludeField) {
							return (needRoundingField.toLocaleLowerCase() === excludeField.toLocaleLowerCase());
						});
					}
					if (layout.overloads) {
						_.forEach(needRoundingFields, function (f) {
							let overload = layout.overloads[f] || layout.overloads[f.toLocaleLowerCase()] || null;
							let decimalPlacesObj = {};
							if (specialConfig && specialConfig.overloads) {
								let commonPlacesObj = {
									detail: {
										roundingField: _.get(overload, 'roundingField') || f
									},
									grid: {
										roundingField: _.get(overload, 'roundingField') || f
									}
								};
								decimalPlacesObj = $.extend(true, commonPlacesObj, specialConfig.overloads);
							} else {
								let decimalPlaces = getRoundingDigits(overload, f);
								decimalPlacesObj = {
									detail: {
										options: {decimalPlaces: decimalPlaces}
									},
									grid: {
										editorOptions: {decimalPlaces: decimalPlaces},
										formatterOptions: {decimalPlaces: decimalPlaces}
									}
								};
							}
							if (overload) {
								$.extend(true, overload, decimalPlacesObj);
							} else {
								layout.overloads[f.toLocaleLowerCase()] = decimalPlacesObj;
							}
						});
					}
					if (layout.addition) {
						let _grid = layout.addition.grid;
						let _detail = layout.addition.detail;
						_.forEach(needRoundingFields, function (f) {
							const a_grid = _.find(_grid, ['field', f]);
							if (a_grid) {
								if (specialConfig && specialConfig.addition && specialConfig.addition.grid) {
									let decimalPlacesObj = {
										roundingField: _.get(a_grid, 'roundingField') || f
									};
									$.extend(true, a_grid, decimalPlacesObj, specialConfig.addition.grid);
								} else {
									let decimalPlaces = getRoundingDigits(a_grid, f);
									$.extend(true, a_grid, {
										editorOptions: {decimalPlaces: decimalPlaces},
										formatterOptions: {decimalPlaces: decimalPlaces}
									});
								}
							}

							const a_detail = _.find(_detail, ['model', f]);
							if (a_detail) {
								if (specialConfig && specialConfig.addition && specialConfig.addition.detail) {
									let decimalPlacesObj = {
										roundingField: _.get(a_detail, 'roundingField') || f
									};
									$.extend(true, a_detail, decimalPlacesObj,specialConfig.addition.detail);
								} else {
									let decimalPlaces = getRoundingDigits(a_detail, f);
									$.extend(true, a_detail, {
										options: {decimalPlaces: decimalPlaces}
									});
								}
							}
						});
					}
				}

				function gridRoundingConfig(options){
					let columns=options.columns;
					let extraStr=options.extraStr;
					let providedFields = getRelatedFields({columns:columns});
					let roundingFieldsKeys = _.keys(getFieldsRoundType());
					if(extraStr&&extraStr.length>0) {
						let newRoundingFieldsKeys=[];
						_.forEach(roundingFieldsKeys, function (item) {
							let newItem=item+extraStr;
							newRoundingFieldsKeys.push(item);
							newRoundingFieldsKeys.push(newItem);
						});
						roundingFieldsKeys=newRoundingFieldsKeys;
					}
					let needRoundingFields = _.intersectionWith(roundingFieldsKeys, providedFields, function (providedField, roundingField) {
						return providedField.toLocaleLowerCase() === roundingField.toLocaleLowerCase();
					});
					if (columns) {
						let allFieldRoundType=getFieldsRoundType();
						_.forEach(needRoundingFields, function (f) {
							const a_column = _.find(columns, ['field', f]);
							if (a_column) {
								let options=a_column;
								let roundingField = (options && options.roundingField) ? options.roundingField : f;
								let fieldRoundType=allFieldRoundType[roundingField];
								if(_.isNil(fieldRoundType)&&extraStr&&extraStr.length>0){
									let orginalRoundingField=roundingField.replace(extraStr,'');
									fieldRoundType=allFieldRoundType[orginalRoundingField];
								}
								if(!_.isNil(fieldRoundType)) {
									let decimalPlaces = getUiRoundingDigits(fieldRoundType);
									$.extend(true, a_column, {
										formatter: a_column.formatter || 'decimal',
										formatterOptions: {decimalPlaces: decimalPlaces}
									});
								}
							}
						});
					}
				}
				
				function lookUpRoundingConfig(lookupOptions) {
					let providedFields = getRelatedFields(lookupOptions);
					let roundingFieldsKeys = _.keys(getFieldsRoundType());
					let needRoundingFields = _.intersectionWith(roundingFieldsKeys, providedFields, function (providedField, roundingField) {
						return (providedField.toLocaleLowerCase() === roundingField.toLocaleLowerCase());
					});

					if (lookupOptions.columns) {
						let _columns = lookupOptions.columns;
						_.forEach(needRoundingFields, function (f) {
							const a_column = _.find(_columns, ['field', f]);
							if (a_column) {
								let decimalPlaces = getRoundingDigits(a_column, f);
								$.extend(true, a_column, {
									formatter: 'decimal',
									formatterOptions: {decimalPlaces: decimalPlaces}
								});
							}
						});
					}
				}

				function getRoundingDigits(options, f) {
					let roundingField = (options && options.roundingField) ? options.roundingField : f;
					return getUiRoundingDigits(getFieldsRoundType()[roundingField]);
				}

				function getDecimalPlaces(field) {
					let fieldsRoundType = getFieldsRoundType();
					return (fieldsRoundType && !_.isEmpty(fieldsRoundType)) ? getUiRoundingDigits(fieldsRoundType[field]) : defaultRoundDecimalPlaces;
				}

				function getDecimalPlacesByColumnId(columnId) {
					let decimalPlace = getUiRoundingDigits(columnId);
					return decimalPlace ? decimalPlace : defaultRoundDecimalPlaces;
				}

				function getRelatedFields(options) {
					let providedFields = [];
					_.forEach(options.groups, function (g) {
						if (g.attributes && g.attributes.length) {
							providedFields = _.concat(providedFields, g.attributes);
						}
					});

					if (options.addition) {
						const g = options.addition;
						if (g.grid && g.grid.length) {
							let fields = _.map(g.grid, 'field');
							providedFields = _.concat(providedFields, fields);
						}
						if (g.detail && g.detail.length) {
							let fields = _.map(g.detail, 'model');
							providedFields = _.concat(providedFields, fields);
						}
					}
					if (options.columns) {// from lookup
						const g = options.columns;
						let fields = _.map(g, 'field');
						providedFields = _.concat(providedFields, fields);
					}
					return _.uniq(providedFields);
				}

				return service;
			}

			function getService(_moduleName, _configId) {
				let cacheKey = _configId ? 'rounding.' + _moduleName + '.' + _configId : 'rounding.' + _moduleName;
				if (!serviceCache[cacheKey]) {
					serviceCache[cacheKey] = createService(_moduleName, _configId);
				}
				return serviceCache[cacheKey];
			}

			return {
				getService: getService
			};
		}]);
})(angular);
