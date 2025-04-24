/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	/* global _ */
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc controller
	 * @name estimateMainResourceSummaryCombineGridController
	 * @requires $scope
	 * @description
	 */
	angular.module(moduleName).controller('estimateMainResourceSummaryCombineGridController',
		['$scope', '$timeout', 'platformCreateUuid', 'platformRuntimeDataService', 'basicsLookupdataLookupFilterService', 'platformGridAPI', 'platformGridControllerService',
			'estimateMainResourceSummaryCombineUIService', 'estimateMainResourceSummaryCombineGridDataService', 'estimateMainResourceSummaryConfigDataService',
			function ($scope, $timeout, platformCreateUuid, platformRuntimeDataService, basicsLookupdataLookupFilterService, platformGridAPI, platformGridControllerService,
				gridUIConfigService, gridDataService, estimateMainResourceSummaryConfigDataService) {

				let myGridConfig = {
					initCalled: false,
					columns: [],
					collapsed: false,
					enableDraggableGroupBy: false,
					skipPermissionCheck: true,
					multiSelect: false,
					rowChangeCallBack: function () {
						updateTools();
					},
					cellChangeCallBack: function (arg) {
						let item = arg.item,
							col = arg.grid.getColumns()[arg.cell].field;
						if(col === 'ColumnId'){
							if(item) {
								estimateMainResourceSummaryConfigDataService.setCombinedGridReadOnly([item], true);
								platformGridAPI.grids.refresh($scope.gridId, true);
							}
						}
						item.IsModified = true;
					}
				};


				$scope.gridId = 'f2b380e8c6e44fbf86e17c20f24b1016';

				$scope.setTools = function (tools) {
					tools.update = function () {
						tools.version += 1;
					};
				};

				// Define standard toolbar Icons and their function on the scope
				$scope.tools = {
					showImages: true,
					showTitles: true,
					cssClass: 'tools',
					items: [
						{
							id: 'create',
							sort: 1,
							caption: 'cloud.common.taskBarNewRecord',
							type: 'item',
							iconClass: 'tlb-icons ico-rec-new',
							fn: function () {
								estimateMainResourceSummaryConfigDataService.createNewCombineItem().then(function (rowItem) {
									if(rowItem) {
										rowItem.IsModified = true;
										platformGridAPI.rows.add({gridId: $scope.gridId, item: rowItem});
										estimateMainResourceSummaryConfigDataService.setCombinedGridReadOnly([rowItem], true);
										platformGridAPI.grids.refresh($scope.gridId, true);
										platformGridAPI.rows.scrollIntoViewByItem($scope.gridId, rowItem);
									}
								});
							},
							disabled: true
						},
						{
							id: 'delete',
							sort: 2,
							caption: 'cloud.common.taskBarDeleteRecord',
							type: 'item',
							iconClass: 'tlb-icons ico-rec-delete',
							fn: function () {
								let selItems = gridDataService.getSelectedEntities();
								estimateMainResourceSummaryConfigDataService.deleteCombine(selItems);

								platformGridAPI.rows.delete({
									gridId: $scope.gridId,
									item: selItems
								});

								platformGridAPI.grids.refresh($scope.gridId, true);
								updateTools();
							},
							disabled: true
						}
					],
					update: function () {
					}
				};

				function init() {
					if (platformGridAPI.grids.exist($scope.gridId)) {
						platformGridAPI.grids.unregister($scope.gridId);
					}
					platformGridControllerService.initListController($scope, gridUIConfigService, gridDataService, null, myGridConfig);

				}

				function updateTools() {
					let currentItem = gridDataService.getSelected();

					// also check with default combine settings
					let defaultIds = estimateMainResourceSummaryConfigDataService.getDefaulstIds();
					let isDisabled = (currentItem && _.includes(defaultIds, currentItem.ColumnId)) || !currentItem;

					// Allow user to delete these optional fields
					let optionalFieldIds = estimateMainResourceSummaryConfigDataService.getOptionalFieldIds();
					if (currentItem && _.includes(optionalFieldIds, currentItem.ColumnId)){
						isDisabled = false;
					}

					// get configItem
					let configItem = estimateMainResourceSummaryConfigDataService.getSelectedConfig();
					if(configItem){
						// only c or m type
						isDisabled = estimateMainResourceSummaryConfigDataService.isDefaultSystemConfiguration(configItem);
						$scope.tools.items[0].disabled = isDisabled;
					}

					$scope.tools.items[1].disabled = isDisabled;
				}

				function configItemChangedEvent(configItem) {
					$scope.tools.items[0].disabled = false;
					$scope.tools.update();
					updateTools();

					let configId = configItem ? configItem.Id : null;
					let data = estimateMainResourceSummaryConfigDataService.getCombinedItems(configId);
					if(configItem && configItem.Version > 0) {
						estimateMainResourceSummaryConfigDataService.setCombinedGridReadOnly(data);
					}
					else{
						estimateMainResourceSummaryConfigDataService.setCombinedGridReadOnly(data, null, true);
						platformGridAPI.grids.refresh($scope.gridId, true);
					}
					platformGridAPI.items.data($scope.gridId, data);
					platformGridAPI.grids.refresh($scope.gridId);
				}



				function typeChangedEvent() {
					$scope.tools.items[0].disabled = true;
					$scope.tools.update();
					platformGridAPI.items.data($scope.gridId, []);
					updateTools();
				}

				function configDeletedEvent() {
					typeChangedEvent();
				}

				let filters = [
					{
						key: 'estimate-main-resource-summary-columnid-filter',
						fn: function (item, entity) {
							let list = estimateMainResourceSummaryConfigDataService.getCombinedItems();
							let existInGrid = _.find(list, function (gridItem) {
								return gridItem.ColumnId === item.Id && gridItem.Id !== entity.Id;
							});
							return !existInGrid;
						}
					}
				];

				estimateMainResourceSummaryConfigDataService.onSelectedTypeChanged.register(typeChangedEvent);
				estimateMainResourceSummaryConfigDataService.onConfigSelectedItemChanged.register(configItemChangedEvent);
				estimateMainResourceSummaryConfigDataService.onConfigDeleted.register(configDeletedEvent);

				basicsLookupdataLookupFilterService.registerFilter(filters);

				// Init with empty grouping columns
				estimateMainResourceSummaryConfigDataService.onSelectedTypeChanged.fire();

				$scope.$on('$destroy', function () {
					if (platformGridAPI.grids.exist($scope.gridId)) {
						platformGridAPI.items.data($scope.gridId, []);
						platformGridAPI.grids.unregister($scope.gridId);
					}
					estimateMainResourceSummaryConfigDataService.onSelectedTypeChanged.unregister(typeChangedEvent);
					estimateMainResourceSummaryConfigDataService.onConfigSelectedItemChanged.unregister(configItemChangedEvent);
					estimateMainResourceSummaryConfigDataService.onConfigDeleted.unregister(configDeletedEvent);

					basicsLookupdataLookupFilterService.unregisterFilter(filters);
				});

				init();
			}]);
})();
