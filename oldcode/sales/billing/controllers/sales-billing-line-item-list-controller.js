/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	var moduleName = 'sales.billing';

	/**
	 * @ngdoc controller
	 * @name salesBillingLineItemListController
	 * @function
	 * @description
	 * Controller for the  list view of Estimate Line Item entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('salesBillingLineItemListController',
		['_', '$scope', '$injector', '$timeout', 'platformGridControllerService', 'salesBillingEstimateLineItemDataService', 'salesBillingEstimateLineItemUIStandardService', 'modelViewerStandardFilterService', 'salesBillingEstimateLineItemDynamicConfigurationService', 'salesBillingBoqStructureService', 'salesBillingEstimateLineItemDataService', 'salesBillingService', 'salesBillingEstimateLineItemGcDataService',
			function (_, $scope, $injector, $timeout, platformGridControllerService, lineItemDataService, lineItemUIStandardService, modelViewerStandardFilterService, salesBillingEstLineItemDynamicConfigurationService, salesBillingBoqStructureService, salesBillingEstLineItemDataService, salesBillingService, lineItemGcDataService) {

				$scope.gridId = '1A68D99550B34B44844FC7B4E856F70C';

				var myGridConfig = {
					initCalled: false,
					columns: [],
					cellChangeCallBack: function cellChangeCallBack(arg) {
						var col = arg.grid.getColumns()[arg.cell].field;

						if (['LiQuantity', 'LiPercentageQuantity', 'LiTotalQuantity', 'LiCumulativePercentage', 'LiBilledQuantity'].includes(col)) {
							if (col === 'LiBilledQuantity') {
								salesBillingEstLineItemDataService.calcDependantValues(arg.item, col);
							} else if (_.isFunction(salesBillingEstLineItemDataService['calc' + col])) {
								salesBillingEstLineItemDataService['calc' + col](arg.item, true);
							}

							salesBillingEstLineItemDataService.calcDependantValues(arg.item, col);

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
						if (_.isEmpty(salesBillingService.getSelected())) {
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

				var platformGridAPI = $injector.get('platformGridAPI');

				function updateCorrespondingBoqItemWithLineItemQuantity() {
					var boqEntity = salesBillingBoqStructureService.getSelected();
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
						boqEntity.Quantity = ordQuantity * liqList[0].LiBilledQuantity / liqList[0].QuantityTotal;
					} else {
						boqEntity.Quantity = _.reduce(liqList, function (sum, liqItem) {

							var billIQPart = 0;

							if (liqItem.QuantityTotal !== 0 && costTotalSum !== 0) {
								billIQPart = ordQuantity * liqItem.CostTotal * liqItem.LiBilledQuantity / liqItem.QuantityTotal / costTotalSum;
							}

							return sum + billIQPart;
						}, 0);
					}

					boqEntity.QuantityDetail = boqEntity.Quantity.toString();

					salesBillingBoqStructureService.boqItemQuantityChanged.fire(boqEntity);
					boqMainChangeService.reactOnChangeOfBoqItem(boqEntity, 'Quantity', salesBillingBoqStructureService, boqMainCommonService, false);
				}

				// set the all column readonly except billHeaderfk
				angular.forEach(lineItemUIStandardService.getStandardConfigForListView().columns, function (entity) {
					if (entity.field !== 'BilHeaderFk' && entity.field !== 'LiBilledQuantity' && entity.field !== 'LiTotalQuantity' && entity.field !== 'LiPercentageQuantity' && entity.field !== 'LiCumulativePercentage') {
						entity.editor = null;
						entity.readonly = true;
					}
				});

				lineItemDataService.canCreate = lineItemDataService.canDelete = function () {
					return false;
				};

				platformGridControllerService.initListController($scope, salesBillingEstLineItemDynamicConfigurationService, lineItemDataService, {}, myGridConfig);

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
				var deregisterClearContentLI = $scope.$on('clearContentLI', clearContentLI);
				var deregisterResetToggleLineItem = $scope.$on('resetToggleLineItem', resetToggleLineItems);

				function clearContentLI() {
					if ($scope.isNormal) {
						lineItemDataService.clearContentLI(true);
						if ($scope.isGc === true) {
							checkToggleLineItems();
						}
					}
				}

				function checkToggleLineItems() {
					var toggleLineItemsTool = _.filter($scope.tools.items, {id: 'toggleLineItems'})[0];
					if (toggleLineItemsTool) {
						if (_.isEmpty(salesBillingService.getSelected()) && $scope.isNormal) {
							toggleLineItemsTool.disabled = true;
						} else if (_.isEmpty(salesBillingBoqStructureService.getSelected()) && $scope.isGc) {
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
					salesBillingEstLineItemDynamicConfigurationService.applyToScope($scope);
				}

				salesBillingEstLineItemDynamicConfigurationService.registerSetConfigLayout(setDynamicColumnsLayoutToGrid);

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

				$scope.$on('$destroy', function () {
					platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', getLineItemSelectedItems);
					salesBillingEstLineItemDynamicConfigurationService.unregisterSetConfigLayout(setDynamicColumnsLayoutToGrid);
					platformGridAPI.events.unregister($scope.gridId, 'onBeforeEditCell', setCellEditable);
					deregisterClearContentLI();
					deregisterShowLineItemTools();
					deregisterCheckToggleLineItems();
					deregisterResetToggleLineItem();
				});

			}
		]);
})(angular);