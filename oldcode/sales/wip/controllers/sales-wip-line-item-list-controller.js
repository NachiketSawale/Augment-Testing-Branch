/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	var moduleName = 'estimate.main';

	/**
	 * @ngdoc controller
	 * @name salesWipLineItemListController
	 * @function
	 * @description
	 * Controller for the  list view of Estimate Line Item entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('salesWipLineItemListController',
		['_', '$scope', '$timeout', '$injector', 'platformGridControllerService', 'salesWipEstimateLineItemDataService', 'salesWipEstimateLineItemUIStandardService', 'modelViewerStandardFilterService', 'salesWipEstimateLineItemDynamicConfigurationService', 'salesWipBoqStructureService', 'salesWipService', 'salesWipEstimateLineItemGcDataService',
			function (_, $scope, $timeout, $injector, platformGridControllerService, lineItemDataService, lineItemUIStandardService, modelViewerStandardFilterService, salesWipEstLineItemDynamicConfigurationService, salesWipBoqStructureService, salesWipService, lineItemGcDataService) {

				$scope.gridId = 'D2EA490FFFC84F0090DD1D1B78E69768';

				var myGridConfig = {
					initCalled: false,
					columns: [],
					cellChangeCallBack: function cellChangeCallBack(arg) {
						var col = arg.grid.getColumns()[arg.cell].field;

						if (['LiQuantity', 'LiPercentageQuantity', 'LiTotalQuantity', 'LiCumulativePercentage'].includes(col)) {
							if (col === 'LiQuantity') {
								lineItemDataService.calcDependantValues(arg.item, col);
							} else if (_.isFunction(lineItemDataService['calc' + col])) {
								lineItemDataService['calc' + col](arg.item, true);
							}

							lineItemDataService.calcDependantValues(arg.item, col);
							if ($scope.isNormal) {
								updateCorrespondingBoqItemWithLineItemQuantity();
							}
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

				$scope.lineItemTools = tools;

				var platformGridAPI = $injector.get('platformGridAPI');

				function updateCorrespondingBoqItemWithLineItemQuantity() {
					var boqEntity = salesWipBoqStructureService.getSelected();
					var boqMainChangeService = $injector.get('boqMainChangeService');
					var boqMainCommonService = $injector.get('boqMainCommonService');
					var ordQuantity = boqEntity.OrdQuantity;
					var liqList = lineItemDataService.getList();

					if (!_.isArray(liqList) && liqList.length === 0) {
						return;
					}

					var costTotalSum = _.reduce(liqList, function (sum, liqItem) {
						return sum + liqItem.CostTotal;
					}, 0);

					if (liqList.length === 1) {
						boqEntity.Quantity = ordQuantity * liqList[0].LiQuantity / liqList[0].QuantityTotal;
					} else {
						boqEntity.Quantity = _.reduce(liqList, function (sum, liqItem) {

							var wipIQPart = 0;

							if (liqItem.QuantityTotal !== 0 && costTotalSum !== 0) {
								wipIQPart = ordQuantity * liqItem.CostTotal * liqItem.LiQuantity / liqItem.QuantityTotal / costTotalSum;
							}

							return sum + wipIQPart;
						}, 0);
					}

					boqEntity.QuantityDetail = boqEntity.Quantity.toString();

					salesWipBoqStructureService.boqItemQuantityChanged.fire(boqEntity);
					boqMainChangeService.reactOnChangeOfBoqItem(boqEntity, 'Quantity', salesWipBoqStructureService, boqMainCommonService, false);
				}

				// set the all column readonly except wipHeaderfk
				angular.forEach(lineItemUIStandardService.getStandardConfigForListView().columns, function (entity) {
					if (entity.field !== 'WipHeaderFk' && entity.field !== 'LiQuantity' && entity.field !== 'LiTotalQuantity' && entity.field !== 'LiPercentageQuantity' && entity.field !== 'LiCumulativePercentage') {
						entity.editor = null;
						entity.readonly = true;
					}
				});

				lineItemDataService.canCreate = lineItemDataService.canDelete = function () {
					return false;
				};

				platformGridControllerService.initListController($scope, salesWipEstLineItemDynamicConfigurationService, lineItemDataService, {}, myGridConfig);

				$scope.addTools(tools);

				var setCellEditable = function (e, args) {
					var field = args.column.field;
					var item = args.item;

					return lineItemDataService.getCellEditable(item, field);
				};

				platformGridAPI.events.register($scope.gridId, 'onBeforeEditCell', setCellEditable);

				// noinspection JSUnusedLocalSymbols
				function getLineItemSelectedItems(e, arg) {
					lineItemDataService.getLineItemSelected(arg, platformGridAPI.rows.getRows($scope.gridId));
				}

				platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', getLineItemSelectedItems);
				var deregisterResetToggleLineItem = $scope.$on('resetToggleLineItem', resetToggleLineItems);

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

				function activateToggleLineItems() {
					if ($scope.tools && $scope.tools.items) {
						var toggleLineItemsTool = _.filter($scope.tools.items, {id: 'toggleLineItems'})[0];
						if (toggleLineItemsTool) {
							toggleLineItemsTool.value = true;
							toggleLineItemsTool.isSet = true;
						}
						$scope.tools.update();
					}
				}

				lineItemDataService.setButton.register(activateToggleLineItems);

				var deregisterShowLineItemTools = $scope.$on('showLineItemTools', showLineItemTools);
				var deregisterCheckToggleLineItems = $scope.$on('checkToggleLineItems', checkToggleLineItems);

				function showLineItemTools() {
					var toggleLineItemsTool = _.filter($scope.tools.items, {id: 'toggleLineItems'})[0];
					if (toggleLineItemsTool) {
						toggleLineItemsTool.disabled = false;
					}
					$scope.tools.update();
				}

				modelViewerStandardFilterService.attachMainEntityFilter($scope, lineItemDataService.getServiceName());

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

				$scope.$watch('isNormal',  function(){
					if($scope.isNormal){
						$timeout(function () {
							if (platformGridAPI.grids.exist($scope.gridId)) {
								platformGridAPI.grids.resize($scope.gridId);
							}
						});
						$scope.updateTools();
					}
				});

				function clearContentLI() {
					if ($scope.isNormal) {
						lineItemDataService.clearContentLI(true);
						if ($scope.isGc === true) {
							checkToggleLineItems();
						}
					}
				}

				var deregisterClearContentLI = $scope.$on('clearContentLI', clearContentLI);

				$scope.$on('$destroy', function () {
					platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', getLineItemSelectedItems);
					salesWipEstLineItemDynamicConfigurationService.unregisterSetConfigLayout(setDynamicColumnsLayoutToGrid);
					platformGridAPI.events.unregister($scope.gridId, 'onBeforeEditCell', setCellEditable);
					lineItemDataService.setButton.unregister(activateToggleLineItems);
					deregisterClearContentLI();
					deregisterShowLineItemTools();
					deregisterCheckToggleLineItems();
					deregisterResetToggleLineItem();
				});

			}
		]);
})(angular);
