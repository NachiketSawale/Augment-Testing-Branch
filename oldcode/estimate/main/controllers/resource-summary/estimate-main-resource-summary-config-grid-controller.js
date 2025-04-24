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
	 * @name estimateMainResourceSummaryConfigGridController
	 * @requires $scope
	 * @description
	 */
	angular.module(moduleName).controller('estimateMainResourceSummaryConfigGridController',
		['$scope', '$timeout', 'platformCreateUuid', 'platformGridAPI', 'platformGridControllerService',
			'estimateMainResourceSummaryUIConfigService', 'estimateMainResourceSummaryConfigGridDataService', 'estimateMainResourceSummaryConfigDataService', 'estimateMainResourceTypeLookupService',
			function ($scope, $timeout, platformCreateUuid, platformGridAPI, platformGridControllerService,
				gridUIConfigService, gridDataService, estimateMainResourceSummaryConfigDataService, estimateMainResourceTypeLookupService) {

				let myGridConfig = {
					initCalled: false,
					columns: [],
					collapsed: false,
					enableDraggableGroupBy: false,
					skipPermissionCheck: true,
					multiSelect: false,
					rowChangeCallBack: function () {
						let selectedItem = gridDataService.getSelected();
						estimateMainResourceSummaryConfigDataService.setSelectedConfig(selectedItem);
						estimateMainResourceSummaryConfigDataService.onConfigSelectedItemChanged.fire(selectedItem);
						updateTools();
					},
					cellChangeCallBack: function (arg) {
						let item = arg.item;
						item.IsModified = true;
					}
				};


				$scope.gridId = '113a8d6a96c94e418508571ee0d53764';

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
								estimateMainResourceSummaryConfigDataService.createItem().then(function (result) {
									let rowItem = result.data;
									estimateMainResourceTypeLookupService.getListAsync().then(function (data) {
										let filterData = _.filter(data, function (type) {
											return type.Id !== 4 && type.Id !== 5;
										});

										let keyValueList = _.map(filterData, function (item) {
											return {
												Id: item.Id
											};
										});
										let newIdList = _.map(filterData, function (item) {
											return item.Id;
										});

										if(rowItem && rowItem.EstResSummaryCombineEntities){
											_.each(rowItem.EstResSummaryCombineEntities, function (row) {
												if(row.ColumnId === 47){
													row.ExceptionKeyValues = keyValueList;
													row.ExceptionKeys = newIdList.join('@');
												}
											});
										}

										rowItem.IsModified = true;
										platformGridAPI.rows.add({gridId: $scope.gridId, item: rowItem});
										platformGridAPI.rows.scrollIntoViewByItem($scope.gridId, rowItem);
										estimateMainResourceSummaryConfigDataService.addNewConfig(rowItem);
										estimateMainResourceSummaryConfigDataService.onConfigItemCreated.fire(rowItem);
									});
								});
							},
							disabled: false
						},
						{
							id: 'delete',
							sort: 2,
							caption: 'cloud.common.taskBarDeleteRecord',
							type: 'item',
							iconClass: 'tlb-icons ico-rec-delete',
							fn: function () {
								let selItem = platformGridAPI.rows.selection({gridId: $scope.gridId});

								platformGridAPI.rows.delete({
									gridId: $scope.gridId,
									item: selItem
								});
								estimateMainResourceSummaryConfigDataService.deleteConfig(selItem);
								estimateMainResourceSummaryConfigDataService.setSelectedConfig(null);
								updateTools();
								platformGridAPI.grids.refresh($scope.gridId, true);
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
					let currentItem = estimateMainResourceSummaryConfigDataService.getSelectedConfig();
					$scope.tools.items[1].disabled = !currentItem;
					$scope.tools.items[1].disabled = currentItem ? estimateMainResourceSummaryConfigDataService.isDefaultSystemConfiguration(currentItem) : true;
				}

				function loadItems() {
					let data = estimateMainResourceSummaryConfigDataService.getItemsByItemPath();
					platformGridAPI.items.data($scope.gridId, data);
					estimateMainResourceSummaryConfigDataService.setSelectedConfig(null);
					updateTools();
				}
				estimateMainResourceSummaryConfigDataService.onSelectedTypeChanged.register(loadItems);

				$scope.$on('$destroy', function () {
					if (platformGridAPI.grids.exist($scope.gridId)) {
						platformGridAPI.grids.unregister($scope.gridId);
					}

					gridDataService.setSelected({});
					estimateMainResourceSummaryConfigDataService.onSelectedTypeChanged.unregister(loadItems);
				});

				init();
			}]);
})();
