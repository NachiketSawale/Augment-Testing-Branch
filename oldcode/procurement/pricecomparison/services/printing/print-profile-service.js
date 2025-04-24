/**
 * Created by wed on 9/17/2018.
 */

(function (angular) {

	'use strict';

	const moduleName = 'procurement.pricecomparison';
	angular.module(moduleName).factory('procurementPriceComparisonPrintProfileService', [
		'_',
		'globals',
		'$q',
		'$http',
		'$injector',
		'$translate',
		'platformGridAPI',
		'procurementPriceComparisonPrintConstants',
		'procurementPriceComparisonCommonService',
		'procurementPriceComparisonConfigurationService',
		'procurementPriceComparisonMainService',
		'procurementPriceComparisonItemColumnService',
		'procurementPriceComparisonBoqColumnService',
		'procurementPriceComparisonPrintCommonService',
		'procurementPriceComparisonItemConfigService',
		'procurementPriceComparisonItemHelperService',
		'procurementPriceComparisonBoqConfigService',
		'procurementPriceComparisonBoqHelperService',
		'procurementPriceComparisonBoqService',
		'procurementPriceComparisonItemService',
		'procurementPriceComparisonCommonHelperService',
		'basicsCostGroupAssignmentService',
		function (
			_,
			globals,
			$q,
			$http,
			$injector,
			$translate,
			platformGridAPI,
			constants,
			commonService,
			configurationService,
			mainDataService,
			itemColumnService,
			boqColumnService,
			printCommonService,
			itemConfigService,
			itemHelperService,
			boqConfigService,
			boqHelperService,
			boqService,
			itemService,
			commonHelperService,
			basicsCostGroupAssignmentService) {

			let genericProfileCache = {
					items: null
				},
				rfqProfileCache = {
					items: {},
					boqs: {}
				},
				profileDefinitions = {
					generic: {
						pageLayout: {
							paperSize: constants.paperSize.A4,
							orientation: constants.orientation.portrait
						},
						report: {
							coverSheetCheck: true,
							coverSheetTemplateId: -1,
							bidderNameTemplate: constants.bidderNameTemplate,
							bidderNameCheck: true,
							bidderPageSizeCheck: false,
							bidderPageSize: 5,
							header: {
								leftTemplate: '',
								middleTemplate: '',
								rightTemplate: '',
								leftPicture: '',
								middlePicture: '',
								rightPicture: ''
							},
							footer: {
								leftTemplate: '',
								middleTemplate: '',
								rightTemplate: '',
								leftPicture: '',
								middlePicture: '',
								rightPicture: ''
							}
						},
						column: {
							boq: {
								printColumns: []
							},
							item: {
								printColumns: []
							}
						},
						row: {
							boq: {
								billingSchemaFields: [],
								isVerticalCompareRows: false,
								isFinalShowInTotal: false,
								isCalculateAsPerAdjustedQuantity: false,
								itemFields: [],
								quoteFields: []
							},
							item: {
								billingSchemaFields: [],
								isVerticalCompareRows: false,
								isFinalShowInTotal: false,
								itemFields: [],
								quoteFields: []
							}
						},
						boq: {
							checkedBoqItemTypes: [],
							checkedBoqItemTypes2: [],
							checkedLineTypes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 103],
							hideZeroValueLines: true,
							percentageLevels: false
						},
						item: {
							checkedItemTypes: [],
							checkedItemTypes2: []
						}
					},
					boq: {
						bidder: {
							quotes: []
						},
						boq: {
							checkedBoqRanges: []
						},
						analysis: {
							filterBasis: {
								selectedValue: -12
							},
							criteria: {
								selectedValue: '1',
								totalPercent: 0,
								singlePercent: 0,
								amount: 0
							}
						}
					},
					item: {
						bidder: {
							quotes: []
						}
					}
				};

			function getProfileDefinitions() {
				return angular.copy(profileDefinitions);
			}

			function clearCache() {
				genericProfileCache.items = null;
				rfqProfileCache.items = {};
				rfqProfileCache.boqs = {};
			}

			function getGenericProfiles(reload) {
				if (reload || !genericProfileCache.items || !genericProfileCache.items.length) {
					return $http.get(globals.webApiBaseUrl + 'procurement/pricecomparison/print/getgenericprofile').then(function (response) {
						let currentViewObj = currentView(constants.currentView.generic, constants.profileSaveType.user);
						response.data.push(currentViewObj);
						let latestItem = _.find(genericProfileCache.items, {Description: null});
						if (latestItem) {
							let currLatest = _.find(response.data, {Id: latestItem.Id});
							if (currLatest) {
								currLatest.PropertyConfig = angular.copy(latestItem.PropertyConfig);
							} else {
								response.data.push(angular.copy(latestItem));
							}
						}
						genericProfileCache.items = response.data;
						_.each(genericProfileCache.items, function (item) {
							let propertyConfig = angular.isString(item.PropertyConfig) ? JSON.parse(item.PropertyConfig) : {};
							if (propertyConfig.row && propertyConfig.row.boq) {
								setPercentDeviation(propertyConfig.row.boq.itemFields);
							}
							if (propertyConfig.row && propertyConfig.row.item) {
								setPercentDeviation(propertyConfig.row.item.itemFields);
							}
							item.PropertyConfig = getCorrectPropertyConfig(propertyConfig);
							printCommonService.propCompletion(item.PropertyConfig, profileDefinitions.generic);
							item.PropertyConfig = JSON.stringify(item.PropertyConfig);
						});
						return genericProfileCache.items;
					});
				}
				return $q.when(genericProfileCache.items);
			}

			function getCorrectPropertyConfig(item) {
				if (!item.PropertyConfig) {
					return item;
				}
				return getCorrectPropertyConfig(item.PropertyConfig);
			}

			function getRfqProfiles(rfqHeaderId, profType, reload) {
				if (reload || !rfqProfileCache[profType][rfqHeaderId]) {
					let profTypeValue = profType === 'items' ? constants.profileType.item : constants.profileType.boq;
					return $http.get(globals.webApiBaseUrl + 'procurement/pricecomparison/print/getrfqprofile?rfqid=' + rfqHeaderId + '&proftype=' + profTypeValue).then(function (response) {
						let currentViewObj = currentView(constants.currentView.rfq,
							profType === 'items' ? constants.profileSaveType.role : constants.profileSaveType.system);
						response.data.push(currentViewObj);
						let latestItem = _.find(rfqProfileCache[profType][rfqHeaderId], {Description: null});
						if (latestItem) {
							let currLatest = _.find(response.data, {Id: latestItem.Id});
							if (currLatest) {
								currLatest.PropertyConfig = angular.copy(latestItem.PropertyConfig);
							} else {
								response.data.push(angular.copy(latestItem));
							}
						}
						rfqProfileCache[profType][rfqHeaderId] = response.data;
						_.each(rfqProfileCache[profType][rfqHeaderId], function (item) {
							item.PropertyConfig = angular.isString(item.PropertyConfig) ? JSON.parse(item.PropertyConfig) : {};
							printCommonService.propCompletion(item.PropertyConfig, profType === 'items' ? profileDefinitions.item : profileDefinitions.boq);
							item.PropertyConfig = JSON.stringify(item.PropertyConfig);
						});
						return rfqProfileCache[profType][rfqHeaderId];
					});
				}
				return $q.when(rfqProfileCache[profType][rfqHeaderId]);
			}

			function currentView(id, profileType) {
				return {
					Id: id,
					IsCurrentView: true,
					ProfileType: profileType,
					Description: $translate.instant('procurement.pricecomparison.printing.currentViewProfile')
				};
			}

			function setLatestGeneric(genericProfile, current) {
				if (!!genericProfileCache.items && !!genericProfileCache.items.length) {
					let user = _.find(genericProfile.options.items, function (item) {
						return !item.Description;
					});

					// var defer = $q.defer(), profiles = [];
					let currentSetting = current && current.PropertyConfig;
					if (currentSetting) {
						let profile = {
							Id: -10,
							DisplayText: $translate.instant('procurement.pricecomparison.printing.latestProfile'),
							Description: null,
							ProfileType: constants.profileType.generic,
							PropertyConfig: JSON.stringify(angular.copy(currentSetting))
						};
						if (!user) {
							// profiles.push(profile);
							genericProfile.options.items.push(profile);
							genericProfile.selectedValue = profile.Id;
						} else {
							user.PropertyConfig = JSON.stringify(angular.copy(currentSetting));
							genericProfile.selectedValue = user.Id;
						}
						let cacheUser = _.find(genericProfileCache.items, function (item) {
							return !item.Description;
						});
						if (!cacheUser) {
							genericProfileCache.items.push(profile);
						} else {
							cacheUser.PropertyConfig = JSON.stringify(angular.copy(currentSetting));
						}
					}
				}
			}

			function setLatestRfqProfile(rfqProfile, printType, rfqHeaderId, current) {
				let userItem = _.find(rfqProfile.options.items, function (item) {
					return !item.Description;
				});
				if (printType === constants.printType.item) {
					let currentItem = current && current[rfqHeaderId] && current[rfqHeaderId].item;
					setLatestRfq(rfqHeaderId, rfqProfile, userItem, currentItem, rfqProfileCache.items);

				} else {
					let currentBoq = current && current[rfqHeaderId] && current[rfqHeaderId].boq;
					setLatestRfq(rfqHeaderId, rfqProfile, userItem, currentBoq, rfqProfileCache.boqs);
				}
			}

			function setLatestRfq(rfqHeaderId, rfqProfile, userItem, currentItem, cacheItem) {
				// current from rfqProfileCache.current
				if (currentItem && currentItem.PropertyConfig) {
					let profileItem = {
						Id: -11,
						DisplayText: $translate.instant('procurement.pricecomparison.printing.latestProfile'),
						RfqHeaderFk: rfqHeaderId,
						Description: null,
						ProfileType: constants.profileType.item,
						PropertyConfig: JSON.stringify(angular.copy(currentItem.PropertyConfig))
					};
					if (!userItem) {
						// rfqProfile: from scope.setting
						rfqProfile.options.items.push(profileItem);
						rfqProfile.selectedValue = profileItem.Id;
					} else {
						userItem.PropertyConfig = JSON.stringify(angular.copy(currentItem.PropertyConfig));
						rfqProfile.selectedValue = userItem.Id;
					}
					// get item cache: rfqProfileCache.items, boqs
					let cacheItemUser = _.find(cacheItem[rfqHeaderId], function (item) {
						return !item.Description;
					});
					if (!cacheItemUser) {
						cacheItem[rfqHeaderId].push(profileItem);
					} else {
						cacheItemUser.PropertyConfig = JSON.stringify(angular.copy(currentItem.PropertyConfig));
					}
				}
			}

			function getRfqItemProfiles(rfqHeaderId, reload) {
				return getRfqProfiles(rfqHeaderId, 'items', reload);
			}

			function getRfqBoqProfiles(rfqHeaderId, reload) {
				return getRfqProfiles(rfqHeaderId, 'boqs', reload);
			}

			function getAllRowConfig(printType) {
				let selectItem = mainDataService.getSelected(),
					configurationFk = selectItem.PrcConfigurationFk,
					compareType = constants.compareType[printType],
					row = {};

				row[compareType] = {
					quoteFields: getRowConfig(configurationFk, printType, 'quote'),
					billingSchemaFields: getRowConfig(configurationFk, printType, 'billingSchema'),
					itemFields: getRowConfig(configurationFk, printType, 'item'),
					isVerticalCompareRows: configurationService.isVerticalCompareRows(configurationFk, printType),
					isLineValueColumn: configurationService.isLineValueColumnVisible(configurationFk, printType),
					isFinalShowInTotal: configurationService.isFinalShowInTotal(configurationFk, printType)
				};

				if (printType === constants.printType.boq) {
					row[compareType].isCalculateAsPerAdjustedQuantity = configurationService.isCalculateAsPerAdjustedQuantity(configurationFk, printType);
				}

				return row;
			}

			function getRowConfig(configurationFk, compareType, fieldType) {

				if (fieldType === 'quote') {
					return configurationService.getCustomSettingsCompareQuoteRows(configurationFk, compareType);
				}
				if (fieldType === 'billingSchema') {
					return configurationService.getCustomSettingsCompareBillingSchemaRows(configurationFk, compareType);
				}
				if (fieldType === 'item') {
					return configurationService.getCustomSettingsCompareRows(configurationFk, compareType);
				}
				return null;
			}

			function getDefaultColumnsSetting(printType) {

				const gridId = getPrintContainerGuid(printType);
				let helpService;
				let configService;
				let isVerticalCompareRows;

				if (printType === constants.printType.boq) {
					helpService = boqHelperService;
					configService = boqConfigService;
					isVerticalCompareRows = boqService.isVerticalCompareRows();
				} else {
					helpService = itemHelperService;
					configService = itemConfigService;
					isVerticalCompareRows = itemService.isVerticalCompareRows();
				}
				let quoteColumns = configService.visibleCompareColumnsCache;
				let defaultColumns = helpService.getDefaultColumns(configService);
				let verticalCompareRows = _.filter(configService.visibleCompareRowsCache, function (row) {
					return !commonHelperService.isExcludedCompareRowInVerticalMode(row.Field);
				});
				let costGroupColumns = basicsCostGroupAssignmentService.createCostGroupColumns(configService.costGroupCats || [], false);
				let configColumns = commonService.getGridLayoutColumns(gridId, defaultColumns, quoteColumns, verticalCompareRows, isVerticalCompareRows, null, costGroupColumns);
				let visibleColumns = _.filter(configColumns, ['hidden', true]);
				let compareType = constants.compareType[printType];
				let column = {};
				column[compareType] = {};
				column[compareType].printColumns = angular.copy(visibleColumns);
				return column;
			}

			function getPrintContainerGuid(printType) {
				return printType === constants.printType.boq ? '8b9a53f0a1144c03b8447a99f7b38448' : 'ef496d027ad34b1f8fe282b1d6692ded';
			}

			function getAvailableColumns(printType, configItems) {
				const gridId = getPrintContainerGuid(printType);
				const grid = platformGridAPI.grids.element('id', gridId);
				let columnList = grid ? angular.copy(grid.columns.current) : [];
				let bidderColumn = {};
				bidderColumn.id = constants.bidderFieldName;
				bidderColumn.name = $translate.instant('procurement.pricecomparison.printing.bidder');
				bidderColumn.width = 200;
				columnList.push(bidderColumn);
				let availableColumns = [];
				_.forEach(columnList, function (item) {
					if (item.id !== 'tree' && item.id !== 'indicator' && !_.startsWith(item.id, commonService.constant.prefix2) && !_.find(configItems, {id: item.id})) {
						let column = {};
						column.id = item.id;
						column.field = item.name;
						column.hidden = true;
						column.width = item.width;
						// column.userLabelName = '';
						availableColumns.push(column);
					}
				});
				return availableColumns;
			}

			function getVisibleColumns(printType, configItems/* , maxBidderNum */) {
				const gridId = getPrintContainerGuid(printType);
				const grid = platformGridAPI.grids.element('id', gridId);
				let columnList = grid ? angular.copy(grid.columns.current) : [];
				let visibleColumns = [];

				_.forEach(configItems, function (item) {
					// set the default value
					item.isOverSize = false;
					item.fieldLeft = null;
					// filter the item witch no in base
					let findInBase = _.find(columnList, {id: item.id});
					if (findInBase || item.id === constants.bidderFieldName) {
						if (!_.isNumber(item.width) || _.isNaN(item.width)) {
							item.width = 0;
						}
						item.field = findInBase ? findInBase.name : item.field;
						visibleColumns.push(item);
					}
					if (item.id === constants.bidderFieldName) {
						item.name = $translate.instant('procurement.pricecomparison.printing.bidder');
						item.field = item.name;
					}
				});
				return visibleColumns;
			}

			function getInitialGenericProfile(printType, profile) {
				let bidder = {},
					baseColumns = null, initPromise = [getBaseBidders(), getGenericProfiles()];
				if (!profile) {
					profile = angular.copy(profileDefinitions.generic);
				} else {
					profile = angular.copy(profile);
				}

				return $q.all(initPromise).then(function (result) {
					let baseBidder = result[0];
					let genericItems = result[1];
					let boq = {};
					let latestItem = _.find(genericItems, {Description: null});

					if (printType === constants.printType.boq) {
						baseColumns = boqService.getCustomSettingsCompareColumns();
						bidder.boq = baseColumns || baseBidder.boq;
						boq = boqService.getCustomSettingsTypeSummaryFields();
					} else {
						baseColumns = itemService.getCustomSettingsCompareColumns();
						bidder.item = baseColumns || baseBidder.item;
					}
					if (latestItem && latestItem.PropertyConfig) {
						let latestItemJson = JSON.parse(latestItem.PropertyConfig);
						if (latestItemJson) {
							profile.report = latestItemJson.report;
						}
					}
					return angular.extend(profile, {
						column: getDefaultColumnsSetting(printType),
						row: getAllRowConfig(printType),
						bidder: bidder,
						boq: boq
					});
				});
			}

			function getBaseBidders() {
				return $http.get(globals.webApiBaseUrl + 'procurement/pricecomparison/print/getbasecomparecolumns').then(function (res) {
					return {
						item: res.data.Item,
						boq: res.data.Boq
					};
				});
			}

			function getInitialRfqItemProfile(profile) {
				return itemColumnService.load().then(function () {
					if (!profile) {
						profile = angular.copy(profileDefinitions.item);
					} else {
						profile = angular.copy(profile);
					}
					return angular.extend(profile, {
						bidder: {
							quotes: itemColumnService.getList()
						}
					});
				});
			}

			function getInitialRfqBoqProfile(profile) {
				return boqColumnService.load().then(function () {
					if (!profile) {
						profile = angular.copy(profileDefinitions.boq);
					} else {
						profile = angular.copy(profile);
					}
					return angular.extend(profile, {
						bidder: {
							quotes: boqColumnService.getList()
						}
					});
				});
			}

			function saveProfile(saveType, profiles) {
				return $http.post(globals.webApiBaseUrl + 'procurement/pricecomparison/print/saveprofile?saveType=' + saveType, profiles);
			}

			function deleteProfile(id) {
				return $http.post(globals.webApiBaseUrl + 'procurement/pricecomparison/print/deleteprofile?id=' + id);
			}

			function setDefault(id, saveType) {
				return $http.post(globals.webApiBaseUrl + 'procurement/pricecomparison/print/setdefault', {
					Id: id,
					SaveType: saveType
				});
			}

			// set the percent Deviation fields the same as the discountAbsolute
			function setPercentDeviation(compareRows) {
				let percentage = _.find(compareRows, {Field: commonService.itemCompareFields.percentage});
				let discountAbsolute = _.find(compareRows, {Field: commonService.itemCompareFields.absoluteDifference});
				if (percentage && discountAbsolute) {
					percentage.DeviationField = discountAbsolute.DeviationField;
					percentage.DeviationPercent = discountAbsolute.DeviationPercent;
					percentage.DeviationReference = discountAbsolute.DeviationReference;
				}
			}

			return {
				getInitialGenericProfile: getInitialGenericProfile,
				getGenericProfiles: getGenericProfiles,
				getInitialRfqItemProfile: getInitialRfqItemProfile,
				getRfqItemProfiles: getRfqItemProfiles,
				getInitialRfqBoqProfile: getInitialRfqBoqProfile,
				getRfqBoqProfiles: getRfqBoqProfiles,
				saveProfile: saveProfile,
				deleteProfile: deleteProfile,
				setDefault: setDefault,
				getAvailableColumns: getAvailableColumns,
				getVisibleColumns: getVisibleColumns,
				getAllRowConfig: getAllRowConfig,
				getDefaultColumnsSetting: getDefaultColumnsSetting,
				setLatestGeneric: setLatestGeneric,
				setLatestRfqProfile: setLatestRfqProfile,
				clearCache: clearCache,
				getProfileDefinitions: getProfileDefinitions
			};

		}]);
})(angular);