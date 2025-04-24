/**
 * Created by wed on 4/26/2018.
 */

(function (angular) {

	'use strict';
	const moduleName = 'procurement.pricecomparison';
	angular.module(moduleName).factory('procurementPriceComparisonConfigurationService', [
		'_',
		'globals',
		'$q',
		'$http',
		'$rootScope',
		'mainViewService',
		'procurementPriceComparisonCommonService',
		'procurementPriceComparisonTranslationDescriptionService',
		'procurementPriceComparisonCommonHelperService',
		function (_,
			globals,
			$q,
			$http,
			$rootScope,
			mainViewService,
			commonService,
			descriptionService,
			commonHelperService) {

			let rowCache = {}, defaultRowCache = {}, service = {}, settingCache = {};
			const compareFieldMapping = {
				'TotalCurrencyNoDiscount': 'TotalOcNoDiscount',
				'TotalGrossOc': 'TotalOCGross',
				'PriceGrossOc': 'PriceOCGross',
				'TotalPriceGrossOc': 'TotalPriceOCGross',
				'QuantityConverted': 'FactoredQuantity'
			};

			function getKey(configurationFk, compareType, isQuote) {
				return (configurationFk || '') + '_' + compareType + '_' + getFieldType(isQuote);
			}

			function getGuid(compareType) {
				return compareType === commonService.constant.compareType.prcItem ? 'ef496d027ad34b1f8fe282b1d6692ded'
					: '8b9a53f0a1144c03b8447a99f7b38448';
			}

			function getConfigKey(compareType) {
				return compareType === commonService.constant.compareType.prcItem ? 'itemCompareConfig'
					: 'boqCompareConfig';
			}

			function getFirstConfig(compareType, isQuote) {
				let first = null, matchValue = '_' + compareType + '_' + getFieldType(isQuote);
				for (let name in rowCache) {
					if (Object.hasOwnProperty.call(rowCache, name) && name.lastIndexOf(matchValue) > -1) {
						first = rowCache[name];
						break;
					}
				}
				return first;
			}

			function getFieldType(isQuote) {
				if (angular.isNumber(isQuote)) {
					return isQuote;
				}
				return (isQuote ? 1 : 0);
			}

			function getDefaultRows(configurationFk, compareType, isQuote) {
				let key = getKey(configurationFk, compareType, isQuote);
				let defaultRows = defaultRowCache[key];
				if (defaultRows) {
					return defaultRows;
				}
				defaultRows = rowCache[key];
				if (!defaultRows) {
					defaultRows = getFirstConfig(compareType, isQuote);
				}
				if (defaultRows) {
					_.each(defaultRows, function (row) {
						if (row.DescriptionInfo) {
							row.DefaultDescription = row.DescriptionInfo.Description;
							row.DescriptionInfo.Description = '';
						} else {
							row.DefaultDescription = row.Field;
						}
					});
					defaultRows = angular.copy(defaultRows);
				}
				defaultRowCache[key] = defaultRows;
				return defaultRows;
			}

			function clearProps(items, props) {
				_.each(items, function (item) {
					if (_.isNil(item)) {
						return;
					}
					if (_.isArray(item)) {
						clearProps(item, props);
					} else {
						_.each(_.isArray(props) ? props : [props], function (prop) {
							delete item[prop];
						});
					}
				});
			}

			function clearPropsFromCustomData(customData) {
				clearProps([customData.compareBillingSchemaRows, customData.compareQuoteRows, customData.compareRows], ['DescriptionInfo', 'DefaultDescription', '__rt$data']);
			}

			function getCustomDataFromView(guidId, itemKey) {
				let customData = mainViewService.customData(guidId, itemKey);

				if (customData) {
					clearPropsFromCustomData(customData);
				}

				return customData;
			}

			service.loadAllDefaultConfiguration = function () {
				return $http.post(globals.webApiBaseUrl + 'procurement/pricecomparison/comparerow/getdefaultrows').then(function (response) {
					rowCache = response.data;
					return rowCache;
				});
			};

			service.saveCustomSettings2DB = function (configurationFk, compareType, createData) {
				const guidId = getGuid(compareType), itemKey = getConfigKey(compareType);
				clearPropsFromCustomData(createData);
				setViewConfig(guidId, createData.gridColumns);
				let updatePromise = $http.post(globals.webApiBaseUrl + 'procurement/pricecomparison/compareview/update', {
					rfqHeaderFk: createData.rfqHeaderFk,
					compareType: createData.compareType,
					compareColumns: createData.compareColumns,
					deletedColumns: createData.deletedColumns
				});
				return updatePromise.then(function () {
					mainViewService.customData(guidId, itemKey, {
						compareBillingSchemaRows: createData.compareBillingSchemaRows,
						compareQuoteRows: createData.compareQuoteRows,
						compareRows: createData.compareRows,
						compareBaseColumns: createData.compareBaseColumns,
						compareTypeSummaryFields: commonService.typeSummary,
						isVerticalCompareRows: createData.isVerticalCompareRows,
						isLineValueColumn: createData.isLineValueColumn,
						isFinalShowInTotal: createData.isFinalShowInTotal,
						isCalculateAsPerAdjustedQuantity: createData.isCalculateAsPerAdjustedQuantity
					});

					// Clear cache
					for (let i = 0, cacheTypes = [true, false, 2]; i < cacheTypes.length; i++) {
						let cacheKey = getKey(configurationFk, compareType, cacheTypes[i]);
						settingCache[cacheKey] = null;
					}
					return createData;
				});
			};

			function setViewConfig(gridId, gridColumns) {
				_.forEach(commonService.allConfigColumns, function (item) {
					if (_.startsWith(item.id, 'QuoteCol_')) {
						return;
					}
					let column = _.find(gridColumns, {id: item.id});
					if (!column) {
						item.hidden = false;
						gridColumns.push(item);
					}
				});
				let config = mainViewService.getViewConfig(gridId);
				if (config && config.Propertyconfig) {
					config = angular.isArray(config.Propertyconfig) ? config.Propertyconfig : JSON.parse(config.Propertyconfig);
				}
				if (config) {
					let structure = _.find(config, {id: 'tree'});
					if (structure) {
						gridColumns.unshift(structure);
					}
				}
				mainViewService.setViewConfig(gridId, gridColumns, null, true);
			}

			service.setViewConfig = setViewConfig;

			service.getCustomSettingsCompareQuoteRows = function (configurationFk, compareType) {
				let guidId = getGuid(compareType),
					itemKey = getConfigKey(compareType),
					customData = getCustomDataFromView(guidId, itemKey) || {},
					defaultRows = getDefaultRows(configurationFk, compareType, true),
					customRows = customData.compareQuoteRows || [],
					mergeRows = defaultRows,
					cacheKey = getKey(configurationFk, compareType, true);
				if (!settingCache[cacheKey]) {
					_.forEach(mergeRows, function (item) {
						let customItem = _.find(customRows, {Field: item.Field});
						let lockedProperties = {
							Id: item.Id,
							DefaultDescription: item.DefaultDescription
						};
						if (customItem) {
							angular.extend(item, customItem, lockedProperties);
						}
						item.UserLabelName = angular.isDefined(item.UserLabelName) ? item.UserLabelName : (item.DescriptionInfo ? item.DescriptionInfo.Description : '');
						item.FieldName = descriptionService.getQuoteDisplayText(item.Field, null, item.DefaultDescription);
						item.DisplayName = descriptionService.getQuoteDisplayText(item.Field, item.UserLabelName, item.DefaultDescription);
					});
					settingCache[cacheKey] = _.orderBy(mergeRows, ['Sorting']);
				}
				return settingCache[cacheKey];
			};

			service.getCustomSettingsCompareQuoteRowsAsync = function (configurationFk, compareType) {
				let compareQuoteRows = service.getCustomSettingsCompareQuoteRows(configurationFk, compareType);
				return $q.when(compareQuoteRows);
			};

			service.getCustomSettingsCompareBillingSchemaRows = function (configurationFk, compareType) {
				let guidId = getGuid(compareType),
					itemKey = getConfigKey(compareType),
					customData = getCustomDataFromView(guidId, itemKey) || {},
					defaultRows = getDefaultRows(configurationFk, compareType, 2),
					customRows = customData.compareBillingSchemaRows || [],
					mergeRows = defaultRows,
					maxSortingItem = customRows.length > 0 ? _.maxBy(customRows, function (o) {
						return o.Sorting;
					}) : null,
					maxSorting = maxSortingItem ? (maxSortingItem.Sorting || 0) : 0,
					cacheKey = getKey(configurationFk, compareType, 2);
				if (!settingCache[cacheKey]) {
					_.forEach(mergeRows, function (item) {
						let customItem = _.find(customRows, {Id: item.Id}),
							lockedProperties = {
								DefaultDescription: item.DefaultDescription,
								Field: item.Field,
								IsLive: item.IsLive
							};
						if (customItem) {
							angular.extend(item, customItem, lockedProperties);
						} else {
							item.Sorting = ++maxSorting;
						}
						item.UserLabelName = angular.isDefined(item.UserLabelName) ? item.UserLabelName : (item.DescriptionInfo ? item.DescriptionInfo.Description : '');
						item.FieldName = item.DescriptionInfo && item.DescriptionInfo.Translated ? item.DescriptionInfo.Translated : item.DefaultDescription;
						item.DisplayName = descriptionService.getBillingSchemaDisplayText(item.Field, item.UserLabelName, item.FieldName);
					});
					settingCache[cacheKey] = _.orderBy(mergeRows, ['Sorting']);
				}
				return settingCache[cacheKey];
			};

			service.getCustomSettingsCompareBillingSchemaRowsAsync = function (configurationFk, compareType) {
				let compareBillingSchemaRows = service.getCustomSettingsCompareBillingSchemaRows(configurationFk, compareType);
				return $q.when(compareBillingSchemaRows);
			};

			service.getCustomSettingsCompareRows = function (configurationFk, compareType) {
				let guidId = getGuid(compareType),
					itemKey = getConfigKey(compareType),
					customData = getCustomDataFromView(guidId, itemKey) || {},
					defaultRows = getDefaultRows(configurationFk, compareType, false),
					customRows = customData.compareRows || [],
					mergeRows = defaultRows,
					cacheKey = getKey(configurationFk, compareType, false);
				if (!settingCache[cacheKey]) {
					_.forEach(mergeRows, function (item) {
						if (_.includes(commonService.boqAllowEditVisibleFields, item.Field) &&
							commonService.constant.compareType.boqItem === compareType && item.Field !== 'Quantity') {
							item.AllowEdit = true;
						}
						let customItem = _.find(customRows, row => {
								return row.Field === item.Field || compareFieldMapping[item.Field] === row.Field;
							}),
							lockedProperties = {
								Id: item.Id,
								Field: item.Field,
								DefaultDescription: item.DefaultDescription
							};
						if (customItem) {
							angular.extend(item, customItem, lockedProperties);
						}
						item.UserLabelName = angular.isDefined(item.UserLabelName) ? item.UserLabelName : (item.DescriptionInfo ? item.DescriptionInfo.Description : '');
						if (compareType === commonService.constant.compareType.prcItem) {
							item.FieldName = descriptionService.getItemDisplayText(item.Field, null, item.DefaultDescription);
							item.DisplayName = descriptionService.getItemDisplayText(item.Field, item.UserLabelName, item.DefaultDescription);
						} else {
							item.FieldName = descriptionService.getBoqDisplayText(item.Field, null, item.DefaultDescription);
							item.DisplayName = descriptionService.getBoqDisplayText(item.Field, item.UserLabelName, item.DefaultDescription);
						}
					});
					settingCache[cacheKey] = _.orderBy(mergeRows, ['Sorting']);
				}
				return settingCache[cacheKey];
			};

			service.getCustomSettingsCompareColumns = function (configurationFk, compareType) {
				let guidId = getGuid(compareType),
					itemKey = getConfigKey(compareType),
					customData = getCustomDataFromView(guidId, itemKey) || {};

				let columns = customData.compareBaseColumns;
				_.forEach(columns, function (col) {
					if (angular.isUndefined(col.IsCountInTarget)) {
						col.IsCountInTarget = col.Id === -1;
					}
				});
				return columns;
			};

			service.getCustomSettingsCompareRowsAsync = function (configurationFk, compareType) {
				let compareRows = service.getCustomSettingsCompareRows(configurationFk, compareType);
				return $q.when(compareRows);
			};

			service.getTypeSummaryCompareFields = function (configurationFk, compareType) {

				let defaultConfig = getTypeSummaryDefault();

				let guidId = getGuid(compareType),
					itemKey = getConfigKey(compareType),
					customData = getCustomDataFromView(guidId, itemKey) || {};
				return _.extend(defaultConfig, customData.compareTypeSummaryFields);
			};

			function getTypeSummaryDefault() {
				return {
					checkedLineTypes: _.map(commonHelperService.getBoqLineTypes(), function (item) {
						return item.Id;
					}),
					checkedBoqItemTypes: _.map(commonHelperService.getBoqItemTypeCodes(), function (item) {
						return item.Id;
					}),
					checkedBoqItemTypes2: _.map(commonHelperService.getBoqItemType2Codes(), function (item) {
						return item.Id;
					}),
					hideZeroValueLines: true,
					percentageLevels: false
				};
			}

			service.isVerticalCompareRows = function (configurationFk, compareType) {
				let guidId = getGuid(compareType), itemKey = getConfigKey(compareType);
				let customData = getCustomDataFromView(guidId, itemKey) || {};
				return !!(customData && customData.isVerticalCompareRows);
			};

			service.isLineValueColumnVisible = function (configurationFk, compareType) {
				let guidId = getGuid(compareType), itemKey = getConfigKey(compareType);
				let customData = getCustomDataFromView(guidId, itemKey) || {};
				return !!(customData && customData.isLineValueColumn);
			};

			service.isFinalShowInTotal = function (configurationFk, compareType) {
				let guidId = getGuid(compareType), itemKey = getConfigKey(compareType);
				let customData = getCustomDataFromView(guidId, itemKey) || {};
				if (!_.has(customData, 'isFinalShowInTotal')) {
					customData.isFinalShowInTotal = true;
				}
				return !!(customData && customData.isFinalShowInTotal);
			};

			service.isCalculateAsPerAdjustedQuantity = function (configurationFk, compareType) {
				let guidId = getGuid(compareType), itemKey = getConfigKey(compareType);
				let customData = getCustomDataFromView(guidId, itemKey) || {};
				return !!(customData && customData.isCalculateAsPerAdjustedQuantity);
			};

			service.clearCache = function () {
				for (let key in settingCache) {
					if (Object.hasOwnProperty.call(settingCache, key)) {
						settingCache[key] = null;
					}
				}
			};

			$rootScope.$on('$stateChangeSuccess', function (state, module) {
				// The cache must be clear after user changed to other views, cause we didn't found appropriate point to watching view chang event.
				if (module && module.name === 'app.procurementpricecomparison') {
					service.clearCache();
				}
			});

			return service;

		}]);

})(angular);