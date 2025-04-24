(function () {
	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimate.main.estimateMainBoqStructureControllerFactory
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).factory('estimateMainBoqStructureControllerFactory',
		['_', '$injector', 'platformGridAPI', 'platformControllerExtendService', 'platformGridControllerService', 'estimateMainCommonUIService', 'estimateMainService',
			'loadingIndicatorExtendServiceFactory', 'estimateDefaultGridConfig', 'estimateMainFilterService',
			'estimateCommonControllerFeaturesServiceProvider', 'boqMainClipboardService', 'cloudCommonGridService', 'estimateMainLeadQuantityAggregatorConfigService', 'estimateMainLeadQuantityAggregatorDataService',
			function (_, $injector, platformGridAPI, platformControllerExtendService, platformGridControllerService, estimateMainCommonUIService, estimateMainService,
				loadingIndicatorExtendServiceFactory, estimateDefaultGridConfig, estimateMainFilterService,
				estimateCommonControllerFeaturesServiceProvider, boqMainClipboardService, cloudCommonGridService, leadQuantityAggrConfigService, leadQuantityAggregatorDataService) {

				function initMainBoqSimpleController($scope, gridConfig, uiService, estimateMainBoqServiceName, estimateMainValidationService, options) {

					let defaultOption = {
						isAggr: true,
						isLoad: true,
						isLoadUDP: true
					};

					if (angular.isDefined(options)) {
						angular.extend(defaultOption, options);
					}

					let estimateMainBoqService = $injector.get(estimateMainBoqServiceName);

					platformControllerExtendService.initListController($scope, uiService, estimateMainBoqService, estimateMainValidationService, gridConfig);

					estimateCommonControllerFeaturesServiceProvider.extendControllerByIsProjectContextService($scope);

					estimateMainBoqService.registerSelectionChanged(estimateMainBoqService.creatorItemChanged);

					if (defaultOption.isAggr) {
						leadQuantityAggrConfigService.addAggrLeadQuantityTool($scope, estimateMainBoqServiceName);
					}

					estimateMainService.setIsEstimate(true);

					// refresh data when assemblies are refreshed
					/* function refreshBoqListService() {
						let grid = platformGridAPI.grids.element('id', $scope.gridId);
						grid.instance.setSelectedRows([]);
						estimateMainBoqService.clearSelectedItem();
						let projectId = estimateMainService.getSelectedProjectId();
						if (projectId) {
							estimateMainBoqService.refresh();
						}

					} */

					// estimateMainService.registerRefreshRequested(refreshBoqListService);

					platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);

					function onSelectedRowsChanged() {
						$injector.get('estimateMainWicBoqService').onBarToolHighlightStatusChanged.fire();
					}

					function estimateBoQFilterOff() {
						estimateMainBoqService.markersChanged(null);
						$scope.tools.update();
					}

					estimateMainService.registerBoqFilterOffEvent(estimateBoQFilterOff);

					let addInList = [];
					let convertToNewList = function convertToNewList(data) {
						data.HasChildren = data && data.BoQItems ? true : false;
						addInList.push(data);

						if (data && data.BoQItems) {
							data.BoqItems = angular.copy(data.BoQItems);
							delete data.BoQItems;
							_.each(data.BoqItems, function (item) {
								if (item && item.BoQItems) {
									convertToNewList(item);
								}
							});
						}
						return data;
					};

					let reactOnLinkBoqItemSucceeded = function reactOnLinkBoqItemSucceeded(data) {
						if (data) {
							let newDataList = convertToNewList(data);
							estimateMainBoqService.addList(addInList);
							let datalist = estimateMainBoqService.getUnfilteredList();
							let flatdatalist = cloudCommonGridService.flatten(datalist, [], 'BoqItems');
							let parentItem = _.find(flatdatalist, {Id: newDataList.BoqItemFk});
							let isExist = false;
							if (parentItem && _.isArray(parentItem.BoqItems)) {
								isExist = _.find(parentItem.BoqItems, {Id: newDataList.Id});
							}
							if (parentItem && !isExist) {
								boqMainClipboardService.spliceBoqItemTree([{BoqItem: newDataList}], parentItem, estimateMainBoqService, function () {
								});
							}
						}
					};
					let estimateMainCommonService = $injector.get('estimateMainCommonService');
					estimateMainCommonService.onLinkBoqItemSucceeded.register(reactOnLinkBoqItemSucceeded);

					/* function reloadBoqItems() {
						let selectedRow = estimateMainBoqService.getSelected();

						estimateMainBoqService.load().then(function () {
							platformGridAPI.rows.expandAllNodes($scope.gridId);
							let newItems = platformGridAPI.items.data($scope.gridId);
							let output = [];
							cloudCommonGridService.flatten(newItems, output, 'BoqItems');

							let newItem = _.find(output, {Id: selectedRow.Id});
							if (newItem) {
								newItem.IsMarked = true;
							}

							estimateMainBoqService.setSelected({}).then(function () {
								estimateMainBoqService.setSelected(newItem);
							});
						});
					} */

					// estimateMainService.onBoqItesmUpdated.register(reloadBoqItems);

					function onClickFuc() {
						$injector.get('estimateParamComplexLookupCommonService').setCurrentGridContent($scope.getContentValue('permission') || $scope.gridId, estimateMainBoqService);
					}

					function updateAggregator(items) {
						estimateMainBoqService.addList(items);
						estimateMainBoqService.gridRefresh();
					}

					platformGridAPI.events.register($scope.gridId, 'onClick', onClickFuc);

					// estimateMainService.onContextUpdated.register(estimateMainBoqService.loadBoq);
					if (defaultOption.isLoad) {
						estimateMainBoqService.loadBoq(); // load data when open the container
					}
					leadQuantityAggregatorDataService.onBoQLeadQtyAggregatorUpdated.register(updateAggregator);

					function initDynamicUserDefinedColumns() {
						let esttimateBoqMainDynamicUserDefinedColumnService = $injector.get('estimateBoqMainDynamicUserDefinedColumnService');
						let estimateCommonDynamicConfigurationServiceFactory = $injector.get('estimateCommonDynamicConfigurationServiceFactory');

						let options = {
							dynamicColDictionaryForDetail: []
						};
						let commonDynamicConfigurationService = estimateCommonDynamicConfigurationServiceFactory.createService(uiService, estimateMainValidationService, options);

						if (!estimateMainBoqService.getDynamicUserDefinedColumnsService()) {
							let userDefinedColumnService = esttimateBoqMainDynamicUserDefinedColumnService.getService(estimateMainValidationService, estimateMainBoqService, commonDynamicConfigurationService);
							estimateMainBoqService.setDynamicUserDefinedColumnsService(userDefinedColumnService);
						}

						let dynamicUserDefinedColumnsService = estimateMainBoqService.getDynamicUserDefinedColumnsService();
						if (dynamicUserDefinedColumnsService && _.isFunction(dynamicUserDefinedColumnsService.applyToScope)) {
							dynamicUserDefinedColumnsService.applyToScope($scope);
						}
						if (dynamicUserDefinedColumnsService && _.isFunction(dynamicUserDefinedColumnsService.loadDynamicColumns)) {
							dynamicUserDefinedColumnsService.loadDynamicColumns();
						}
					}

					if (defaultOption.isLoadUDP) {
						initDynamicUserDefinedColumns();
					}

					$scope.$on('$destroy', function () {
						// estimateMainService.unregisterRefreshRequested(refreshBoqListService);
						estimateMainBoqService.unregisterSelectionChanged(estimateMainBoqService.creatorItemChanged);
						estimateMainCommonService.onLinkBoqItemSucceeded.unregister(reactOnLinkBoqItemSucceeded);
						estimateMainService.unregisterBoqFilterOffEvent(estimateBoQFilterOff);
						// estimateMainService.onBoqItesmUpdated.unregister(reloadBoqItems);
						platformGridAPI.events.unregister($scope.gridId, 'onClick', onClickFuc);
						platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
						// estimateMainService.onContextUpdated.unregister(estimateMainBoqService.loadBoq);
						leadQuantityAggregatorDataService.onBoQLeadQtyAggregatorUpdated.unregister(updateAggregator);
					});

				}

				return {
					initEstMainBoqSimpleController: initMainBoqSimpleController
				};
			}]);
})();