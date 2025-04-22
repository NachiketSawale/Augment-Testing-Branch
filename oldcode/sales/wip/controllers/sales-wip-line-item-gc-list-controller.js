/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	var moduleName = 'sales.wip';

	/**
	 * @ngdoc controller
	 * @name salesWipLineItemGcListController
	 * @function
	 * @description
	 * Controller for the  list view of indirect Estimate Line Item entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('salesWipLineItemGcListController',
		['_', '$scope', '$timeout', '$injector', 'platformGridControllerService', 'salesWipEstimateLineItemGcDataService', 'salesWipEstimateLineItemUIStandardService', 'modelViewerStandardFilterService', 'salesWipEstimateLineItemDynamicConfigurationService', 'salesWipService', 'salesWipBoqStructureService', 'salesWipEstimateLineItemDataService',
			function (_, $scope, $timeout, $injector, platformGridControllerService, lineItemGcDataService, lineItemUIStandardService, modelViewerStandardFilterService, salesWipEstLineItemDynamicConfigurationService, salesWipService, salesWipBoqStructureService, lineItemDataService) {

				$scope.gridId = '6ba1d8bc9e184389888793ca65d82808';

				var myGridConfig = {
					initCalled: false,
					columns: [],
					cellChangeCallBack: function cellChangeCallBack(arg) {
						var col = arg.grid.getColumns()[arg.cell].field;

						if (['LiQuantity', 'LiPercentageQuantity', 'LiTotalQuantity', 'LiCumulativePercentage'].includes(col)) {
							if (col === 'LiQuantity') {
								lineItemGcDataService.calcDependantValues(arg.item, col);
							} else if (_.isFunction(lineItemGcDataService['calc' + col])) {
								lineItemGcDataService['calc' + col](arg.item, true);
							}

							lineItemGcDataService.calcDependantValues(arg.item, col);
						}
					}
				};

				var tools = [{
					id: 'toggleLineItems',
					sort: 1000,
					caption: 'sales.common.switchLineItems',
					type: 'check',
					iconClass: 'tlb-icons ico-indirect-costs',
					disabled: function () {
						if (_.isEmpty(salesWipService.getSelected())) {
							return true;
						}
					},
					fn: function toggle() {
						if ($scope.isGc) {
							lineItemDataService.clearContentLI(true);
							lineItemGcDataService.clearContentLI(true);
							lineItemDataService.gcButtonClicked.fire(false);
							lineItemDataService.getDataByHeaderId();
						} else {
							lineItemDataService.clearContentLI(true);
							lineItemGcDataService.clearContentLI(true);
							lineItemDataService.gcButtonClicked.fire(true);
							lineItemGcDataService.getDataByHeaderId();
						}
						resetToggleLineItems();
					}
				}];

				function checkToggleLineItems() {
					var toggleLineItemsTool = _.filter($scope.tools.items, {id: 'toggleLineItems'})[0];
					if (toggleLineItemsTool) {
						if (_.isEmpty(salesWipBoqStructureService.getSelected()) && $scope.isGc) {
							toggleLineItemsTool.disabled = true;
						} else if (_.isEmpty(salesWipService.getSelected()) && $scope.isNormal) {
							toggleLineItemsTool.disabled = true;
						} else {
							toggleLineItemsTool.disabled = false;
						}
						if ($scope.isGc) {
							toggleLineItemsTool.value = true;
						}
						$scope.tools.update();
					}
				}

				function resetToggleLineItems() {
					var toggleLineItemsTool = _.filter($scope.tools.items, {id: 'toggleLineItems'})[0];
					if (toggleLineItemsTool) {
						toggleLineItemsTool.value = false;
						toggleLineItemsTool.isSet = false;
					}
					checkToggleLineItems();
				}

				var platformGridAPI = $injector.get('platformGridAPI');

				// set the all column readonly except wipHeaderfk
				angular.forEach(lineItemUIStandardService.getStandardConfigForListView().columns, function (entity) {
					if (entity.field !== 'wipHeaderFk' && entity.field !== 'LiQuantity' && entity.field !== 'LiTotalQuantity' && entity.field !== 'LiPercentageQuantity' && entity.field !== 'LiCumulativePercentage') {
						entity.editor = null;
						entity.readonly = true;
					}
				});

				lineItemGcDataService.canCreate = lineItemGcDataService.canDelete = function () {
					return false;
				};

				platformGridControllerService.initListController($scope, salesWipEstLineItemDynamicConfigurationService, lineItemGcDataService, {}, myGridConfig);

				var setCellEditable = function (e, args) {
					var field = args.column.field;
					var item = args.item;

					return lineItemGcDataService.getCellEditable(item, field);
				};

				platformGridAPI.events.register($scope.gridId, 'onBeforeEditCell', setCellEditable);

				// noinspection JSUnusedLocalSymbols
				function getLineItemSelectedItems(e, arg) {
					lineItemGcDataService.getLineItemSelected(arg, platformGridAPI.rows.getRows($scope.gridId));
				}

				platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', getLineItemSelectedItems);
				var deregisterClearContentLI = $scope.$on('clearContentLI', clearContentLI);

				function clearContentLI() {
					lineItemGcDataService.clearContentLI();
				}

				var deregisterShowLineItemTools = $scope.$on('showLineItemTools', showLineItemTools);

				function showLineItemTools() {
					var toggleLineItemsTool = _.filter($scope.tools.items, {id: 'toggleLineItems'})[0];
					if (toggleLineItemsTool) {
						toggleLineItemsTool.disabled = false;
					}
					$scope.tools.update();
				}

				modelViewerStandardFilterService.attachMainEntityFilter($scope, lineItemGcDataService.getServiceName());

				function setDynamicColumnsLayoutToGrid() {
					salesWipEstLineItemDynamicConfigurationService.applyToScope($scope);
				}

				salesWipEstLineItemDynamicConfigurationService.registerSetConfigLayout(setDynamicColumnsLayoutToGrid);

				var createBtnIdx = _.findIndex($scope.tools.items, function (item) {
					return item.id === 'create';
				});

				$scope.tools.items.splice(createBtnIdx, 1);

				var deleteBtnIdx = _.findIndex($scope.tools.items, function (item) {
					return item.id === 'delete';
				});

				$scope.tools.items.splice(deleteBtnIdx, 1);

				$scope.$watch('isGc', function () {
					if ($scope.isGc) {
						$timeout(function () {
							if (platformGridAPI.grids.exist($scope.gridId)) {
								platformGridAPI.grids.resize($scope.gridId);
							}
						});
						$scope.updateTools();
						$scope.addTools(tools);
					}
				});

				$scope.$on('$destroy', function () {
					platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', getLineItemSelectedItems);
					salesWipEstLineItemDynamicConfigurationService.unregisterSetConfigLayout(setDynamicColumnsLayoutToGrid);
					platformGridAPI.events.unregister($scope.gridId, 'onBeforeEditCell', setCellEditable);
					deregisterClearContentLI();
					deregisterShowLineItemTools();
				});

			}
		]);
})(angular);