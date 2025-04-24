/**
 */
/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	'use strict';
	/* global globals, _, angular */
	let moduleName = 'estimate.main';
	let estimateMainModule = angular.module(moduleName);

	angular.module(moduleName).constant('plantTotalsType', {
		plantTotalGrand: 'plantTotalGrand',
		plantTotal: 'plantTotal'
	});

	/**
	 * @ngdoc service
	 * @name estimateMainPlantTotalsService
	 * @function
	 *
	 * @description
	 * estimateMainPlantTotalsService is the data service for totals of plants.
	 */
	estimateMainModule.factory('estimateMainPlantTotalsService', ['$translate', '$injector', 'platformDataServiceFactory', 'platformTranslateService', 'estimateMainService',
		'estimateMainPlantListService', 'plantTotalsType',
		function ($translate, $injector, platformDataServiceFactory, platformTranslateService, estimateMainService,
		          estimateMainPlantListService, plantTotalsType) {

			let ctrlScope = {},
				isLoad = false,
				isFristLoad = false,
				lastSelectedKey = null;


			let totalTitles = {
					'plantTotalGrand': 'estimate.main.grandTotalContainer',
					'plantTotal': 'estimate.main.plantTotal'
				},

				currentActiveIcon = plantTotalsType.plantTotalGrand;

			let requestParams = {
				PlantTotalType: 'plant_total_grand',
				EstHeaderFk: estimateMainService.getSelectedEstHeaderId() || -1,
				ProjectFk: estimateMainService.getSelectedProjectId() || -1
			};

			let options = {
				flatNodeItem: {
					module: estimateMainModule,
					serviceName: 'estimateMainPlantTotalsService',
					httpRead: {
						route: globals.webApiBaseUrl + 'estimate/main/planttotals/',
						endRead: 'getplanttotals',
						usePostForRead: true,
						initReadData: function initReadData(readData) {
							if (requestParams.PlantTotalType === 'plant_total') {
								let plantSelected = estimateMainPlantListService.getSelected();
								if (plantSelected) {
									requestParams.EtmPlantFk = plantSelected.EtmPlantFk;
								}
							}

							angular.extend(readData, requestParams);
						}
					},
					presenter: {
						list: {
							incorporateDataRead: incorporateDataRead
						}
					},
					entityRole: {
						node: {
							itemName: 'ConfigTotal',
							parentService: estimateMainPlantListService
						}
					},
					actions: {},
					modification: 'none'
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(options);

			let service = serviceContainer.service;

			serviceContainer.data.doNotUnloadOwnOnSelectionChange = true;

			function incorporateDataRead(readData, data) {

				let listData = readData;

				// generate dynamic columns by cost code info
				let columns = generateCostCodeFields(listData);

				// activate the grand total or plant total gird
				if (_.includes([plantTotalsType.plantTotalGrand, plantTotalsType.plantTotal], getTotalKey())) {
					activateStrLayout(service.scope(), columns);
				} else {
					deactivateStrLayout(service.scope());
				}

				return data.handleReadSucceeded(listData, data);
			}

			function generateCostCodeFields(listData) {
				let columns = [];

				let costCodesData = getMdcCostCodeSummary();

				let mdcColumnPrefix = 'Mdc_CostCode_';

				if (costCodesData && costCodesData.length > 0) {
					_.each(costCodesData, function (costCodeData) {
						let columnName = mdcColumnPrefix + costCodeData.id.toString();
						let modelName = costCodeData.code + '(' + costCodeData.desc + ')';
						let column = platformTranslateService.translateGridConfig({
							id: columnName,
							field: columnName,
							name: modelName,
							formatter: 'money',
							readonly: true,
							grouping: {
								title: modelName,
								getter: columnName,
								aggregators: [],
								aggregateCollapsed: true
							}
						});
						columns.push(column);

						// set dynamic column data
						listData[0][columnName] = costCodeData.assemblyCostTotal;
						listData[1][columnName] = costCodeData.costTotal;
						listData[2][columnName] = costCodeData.difference;
					});
				}

				return columns;
			}

			function getMdcCostCodeSummary() {
				let plantList = requestParams.PlantTotalType === 'plant_total' ? [estimateMainPlantListService.getSelected()] :
					estimateMainPlantListService.getList();

				let mdcCostCodes = estimateMainPlantListService.getMdcCostCodes();

				let mdcCostCodeSummaries = [];

				_.each(_.map(plantList, 'MdcCostCodeSummary'), function (mdcCostCodeSummary) {
					mdcCostCodeSummaries = mdcCostCodeSummaries.concat(_.map(mdcCostCodeSummary));
				});

				let costCodesData = [];

				let mdcCostCodeSummaryGroup = _.groupBy(mdcCostCodeSummaries, 'CostCodeId');
				_.each(mdcCostCodeSummaryGroup, function (groupItems, key) {
					let id = parseInt(key);
					let assemblyCostTotal = _.sum(_.map(groupItems, 'AssemblyCostTotal'));
					let costTotal = _.sum(_.map(groupItems, 'CostTotal'));
					let difference = assemblyCostTotal - costTotal;

					let mdcCostCode = _.find(mdcCostCodes, {'Id': id});

					let costCodeData = {
						id: id,
						code: mdcCostCode.Code,
						desc: mdcCostCode.DescriptionInfo.Translated,
						assemblyCostTotal: assemblyCostTotal,
						costTotal: costTotal,
						difference: difference
					};

					costCodesData.push(costCodeData);
				});

				return costCodesData;
			}

			function buildRequestParams(totalKey) {
				if (!_.includes(_.keys(totalTitles), totalKey)) {
					totalKey = _.head(_.keys(totalTitles));
				}

				let params = {
					readyToLoad: true
				};

				switch (totalKey) {
					case plantTotalsType.plantTotalGrand:
						params.PlantTotalType = 'plant_total_grand';
						break;
					case plantTotalsType.plantTotal:
						params.PlantTotalType = 'plant_total';
						break;
				}
				return params;
			}

			function setIconHighlight() {
				if (!_.isEmpty(estimateMainService.getSelected())) {
					activateIcon(scope(), plantTotalsType.plantTotal);
				} else {
					activateIcon(scope(), plantTotalsType.plantTotalGrand);
				}
			}


			function loadTotalData(totalKey, ignoreLoad) {
				// build the request parameters
				angular.extend(requestParams, buildRequestParams(totalKey));
				let plantList = estimateMainPlantListService.getList();
				if (!ignoreLoad) {
					if (plantList && plantList.length > 0 && requestParams.readyToLoad === true) {
						service.load();
					} else {
						service.setList([]);
					}
				}
			}


			function activateIcon(scope, totalKey, ignoreLoad) {
				setActiveIcon(scope, totalKey);
				loadTotalData(totalKey, ignoreLoad);
				totalDataDirty(false);
			}

			function changeIcon(scope, totalKey) {
				activateIcon(scope, totalKey, totalKey !== plantTotalsType.plantTotalGrand);
			}

			function activateStrLayout(scope, columns) {
				let estPlantUiTotalsService = $injector.get('estimateMainPlantUiTotalsService');

				let platformGridAPI = $injector.get('platformGridAPI');

				let grid = platformGridAPI.grids.element('id', scope.gridId);
				if (grid && grid.instance) {
					estPlantUiTotalsService.attachData({'estPlantTotals': columns});

					estPlantUiTotalsService.fireRefreshConfigLayout();
				}
			}

			function deactivateStrLayout() {
				let estPlantUiTotalsService = $injector.get('estimateMainPlantUiTotalsService');
				estPlantUiTotalsService.detachData('estPlantTotals');
				estPlantUiTotalsService.fireRefreshConfigLayout();
			}


			// set the active total icon
			function setActiveIcon(scope, totalKey) {
				if (!_.includes(_.keys(totalTitles), totalKey)) {
					totalKey = _.head(_.keys(totalTitles));
				}

				if (scope.tools) {
					let toolItem = _.find(scope.tools.items, function (i) {
						return i.totalIconsGroup && i.totalIconsGroup === '3typesOfTotal';
					});

					if (toolItem && Object.prototype.hasOwnProperty.call(toolItem, 'list')) {
						toolItem.list.activeValue = totalKey;
					}

					setContainerTitle(scope, totalKey);
					scope.tools.update();
					currentActiveIcon = totalKey;
					lastSelectedKey = totalKey;
				}
			}

			// set the container title on run time
			function setContainerTitle(scope, totalKey) {
				let title = $translate.instant(totalTitles[totalKey]);
				if (_.isEmpty(title)) {
					return false;
				}

				scope.title = title;
				ctrlScope.title = title;
			}

			function initTotalIcons(scope) {
				let totalKey = plantTotalsType.plantTotalGrand;
				setContainerTitle(scope, totalKey);
				let tools = [
					{
						id: 'plant_total_calculatorTools',
						totalIconsGroup: '3typesOfTotal', // a flag to distinguish the icons
						type: 'sublist',
						list: {
							cssClass: 'radio-group',
							showTitles: true,
							items: [
								{
									id: 'plant_total_grand',
									caption: totalTitles.plantTotalGrand,
									type: 'radio',
									value: plantTotalsType.plantTotalGrand,
									iconClass: 'tlb-icons ico-total-grand',
									fn: function () {
										activateIcon(scope, plantTotalsType.plantTotalGrand);
									}
								},
								{
									id: 'plant_total',
									caption: totalTitles.plantTotal,
									type: 'radio',
									value: plantTotalsType.plantTotal,
									iconClass: 'tlb-icons ico-total-line-item',
									fn: function () {
										activateIcon(scope, plantTotalsType.plantTotal);
									}
								}
							]
						}
					}
				];
				return tools;
			}

			function changeCalculatorIcon(isDirty) {
				scope().tools.update();
			}

			// set , get isDirty
			function totalDataDirty(isDirty) {
				if (_.isUndefined(isDirty) || _.isNull(isDirty)) {
					isDirty = true;
				}

				if (isDirty !== true) {
					isDirty = false; // bool, only true or false
				}

				changeCalculatorIcon(isDirty);
			}

			// get, set
			function scope(controllerScope) {
				if (controllerScope) {
					ctrlScope = controllerScope;
				}
				return ctrlScope;
			}

			function getTotalKey() {
				return currentActiveIcon;
			}

			function setIsLoad(value) {
				isLoad = value;
			}

			function getIsLoad() {
				return isLoad;
			}

			function setIsFristLoad(value) {
				isFristLoad = value;
			}

			function getIsFristLoad() {
				return isFristLoad;
			}

			function getLastSelectedKey() {
				return lastSelectedKey;
			}

			function setLastSelectedKey(key) {
				lastSelectedKey = key;
			}

			function getToolActiveValue(items) {
				let calculatorTools = _.find(items, function (item) {
					return item.id === 'plant_total_calculatorTools';
				});
				if (!calculatorTools) {
					return null;
				}
				return calculatorTools.list.activeValue;
			}

			return angular.extend(service, {
				toolHasAdded: false,
				loadTotalData: loadTotalData,
				initTotalIcons: initTotalIcons,
				activateIcon: activateIcon,
				changeIcon: changeIcon,
				setActiveIcon: setActiveIcon,
				totalDataDirty: totalDataDirty,
				setIconHighlight: setIconHighlight,
				scope: scope,
				setIsLoad: setIsLoad,
				getIsLoad: getIsLoad,
				setIsFristLoad: setIsFristLoad,
				getIsFristLoad: getIsFristLoad,
				getLastSelectedKey: getLastSelectedKey,
				setLastSelectedKey: setLastSelectedKey,
				getToolActiveValue: getToolActiveValue
			});
		}]);
})(angular);
