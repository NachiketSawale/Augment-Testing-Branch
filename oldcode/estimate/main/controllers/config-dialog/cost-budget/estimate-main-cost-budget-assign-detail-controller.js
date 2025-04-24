/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	let moduleName = 'estimate.main';

	/**
	 @ngdoc controller
	 * @name estimateMainCostBudgetAssignDetailController
	 * @function
	 *
	 * @description
	 * Controller for the cost budget assignment details view.
	 */
	angular.module(moduleName).controller('estimateMainCostBudgetAssignDetailController', [
		'$scope', '$timeout', '$injector', 'platformGridAPI', 'platformCreateUuid', 'estimateMainCostBudgetAssignDetailUIConfigService', 'estimateMainCostBudgetAssignDetailDataService', 'platformGridControllerService', 'estimateMainDialogProcessService',
		'basicsLookupdataLookupDescriptorService', 'estimateMainCostBudgetAssignDetailValidationService', 'estimateMainCostBudgetDataService',
		function ($scope, $timeout, $injector, platformGridAPI, platformCreateUuid, assginmentDetailUIConfigService, assignmentDetailDataService, platformGridControllerService, estimateMainDialogProcessService,
			basicsLookupdataLookupDescriptorService, configDetailValidationService, estimateMainCostBudgetDataService) {

			let readOnly = false;

			let myGridConfig = {
				initCalled: false,
				columns: [],
				enableDraggableGroupBy: false,
				skipPermissionCheck: true,
				rowChangeCallBack: function () {
					updateTools();
				},
				cellChangeCallBack: function (arg) {
					let col = arg.grid.getColumns()[arg.cell].field;
					if(col === 'MdcCostCodeFk'){
						let costcodeItem = basicsLookupdataLookupDescriptorService.getLookupItem('costcode', arg.item.MdcCostCodeFk);
						if(costcodeItem) {
							arg.item.MdcCostCode = costcodeItem.Code;
							arg.item.BasUomFk = costcodeItem.UomFk;
							arg.item.CurrencyFk = costcodeItem.CurrencyFk;
							arg.item.CostcodeTypeFk = costcodeItem.CostCodeTypeFk;
							arg.item.Description = costcodeItem.DescriptionInfo.Description;
						}
					}
					assignmentDetailDataService.setItemToSave(arg.item);
					assignmentDetailDataService.refreshGrid();
				}
			};

			$scope.gridId = platformCreateUuid();
			assignmentDetailDataService.gridId = $scope.gridId;
			$scope.onContentResized = function () {
				resize();
			};

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
						sort: 0,
						caption: 'cloud.common.taskBarNewRecord',
						type: 'item',
						iconClass: 'tlb-icons ico-rec-new',
						fn: function () {
							let costBudgetConfigItem = estimateMainCostBudgetDataService.getCostBudgetConfig();
							let costBudgetConfigFk = costBudgetConfigItem ? costBudgetConfigItem.Id : 0;
							assignmentDetailDataService.createItem(costBudgetConfigFk);
							// assignmentDetailDataService.updateColumn(readOnly, true);
						},
						disabled: false
					},
					{
						id: 'delete',
						sort: 1,
						caption: 'cloud.common.taskBarDeleteRecord',
						type: 'item',
						iconClass: 'tlb-icons ico-rec-delete',
						fn: function () {
							let items =  assignmentDetailDataService.getSelectedEntities();
							angular.forEach(items,function (item) {
								assignmentDetailDataService.deleteItem(item);
							});

						},
						disabled: true
					},
					{
						id: 'collapse',
						sort: 2,
						caption: 'cloud.common.toolbarCollapse',
						type: 'item',
						iconClass: 'tlb-icons ico-tree-collapse',
						fn: function() { platformGridAPI.rows.collapseNextNode($scope.gridId); },
						disabled: false
					},
					{
						id: 'expand',
						sort: 3,
						caption: 'cloud.common.toolbarExpand',
						type: 'item',
						iconClass: 'tlb-icons ico-tree-expand',
						fn: function() { platformGridAPI.rows.expandNextNode($scope.gridId); },
						disabled: false
					},
					{
						id: 'collapseall',
						sort: 4,
						caption: 'cloud.common.toolbarCollapseAll',
						type: 'item',
						iconClass: 'tlb-icons ico-tree-collapse-all',
						fn: function() { platformGridAPI.rows.collapseAllSubNodes($scope.gridId); },
						disabled: false
					},
					{
						id: 'expandall',
						sort: 5,
						caption: 'cloud.common.toolbarExpandAll',
						type: 'item',
						iconClass: 'tlb-icons ico-tree-expand-all',
						fn: function() { platformGridAPI.rows.expandAllSubNodes($scope.gridId); },
						disabled: false
					}
				],
				update: function () {
				}
			};

			function resize() {
				$timeout(function () {
					updateTools();
					platformGridAPI.grids.resize($scope.gridId);
				});
			}

			function init() {
				if (platformGridAPI.grids.exist($scope.gridId)) {
					platformGridAPI.grids.unregister($scope.gridId);
				}
				platformGridControllerService.initListController($scope, assginmentDetailUIConfigService, assignmentDetailDataService, configDetailValidationService, myGridConfig);

				setDataSource(estimateMainCostBudgetDataService.getCostBudgetAssignDetails());
				$injector.get('estimateMainDialogDataService').currentItemChangeFire();
			}

			function setDataSource(data) {
				$scope.data = data;
				assignmentDetailDataService.setDataList(data);
				assignmentDetailDataService.refreshGrid();
				// $scope.onContentResized();
			}

			function updateData(currentItem) {
				setDataSource(currentItem.costBudgetAssignDetails);
			}

			// set/reset toolbar items readonly
			function updateTools() {
				readOnly = estimateMainDialogProcessService.isBudgetAssignDetailReadOnly();
				angular.forEach($scope.tools.items, function (item) {
					item.disabled = readOnly;
					if (!readOnly && item.id === 'create') {
						item.disabled = false;
					}

					if (!readOnly && item.id === 'delete') {
						item.disabled = !assignmentDetailDataService.getSelected();
					}
				});
			}
			estimateMainCostBudgetDataService.onItemChange.register(updateData);
			assignmentDetailDataService.selectionChanged.register(updateTools);


			function onSelectedRowsChanged() {
				updateTools();
			}

			platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);


			$scope.$on('$destroy', function () {
				if (platformGridAPI.grids.exist($scope.gridId)) {
					platformGridAPI.grids.unregister($scope.gridId);
				}
				estimateMainCostBudgetDataService.onItemChange.register(updateData);
				platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
				assignmentDetailDataService.selectionChanged.unregister(updateTools);
			});

			init();
		}
	]);
})();
