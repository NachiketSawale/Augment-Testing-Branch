(function (angular) {
	/* global globals, _ */

	'use strict';
	var moduleName = 'estimate.main';
	angular.module(moduleName).controller('estimateCombinedLineItemClientController', [
		'$scope','$rootScope', '$injector', '$timeout', '$http',
		'$translate', 'platformGridControllerService', 'estimateMainValidationService',
		'estimateMainCombinedLineItemDynamicConfigurationService', 'estimateMainCombinedLineItemClientService',
		'platformGridAPI', 'estimateMainService', 'estimateMainLineItemDetailService',
		'estimateMainCombineLineItemCustomViewDialogService',

		function ($scope,$rootScope, $injector, $timeout, $http,
			$translate, platformGridControllerService, estimateMainValidationService, estimateMainCombinedLineItemDynamicConfigurationService, estimateMainCombinedLineItemClientService,
			platformGridAPI, estimateMainService, estimateMainLineItemDetailService,
			estimateMainCombineLineItemCustomViewDialogService) {

			let myGridConfig = {
				initCalled: false, columns: [],
				type: 'combinelineItems',
				cellChangeCallBack: function (arg) {
					let column = arg.grid.getColumns()[arg.cell];
					let field = arg.grid.getColumns()[arg.cell].field;

					let quantitys = ['QuantityTotal', 'Quantity', 'WqQuantityTarget', 'QuantityTarget'];
					if(_.includes(quantitys, field)) {
						return;
					}

					let selected = estimateMainCombinedLineItemClientService.getSelected();
					if (selected) {
						let lineitem = estimateMainCombinedLineItemClientService.changeCombinedValues(selected, field, arg.item[field]);
						angular.forEach(lineitem.CombinedLineItems, function (lineitem) {
							estimateMainLineItemDetailService.fieldChange(lineitem, field, column);
						});
					}
				},
				rowChangeCallBack: function rowChangeCallBack() {
					var selectedLineItem = estimateMainCombinedLineItemClientService.getSelected();
					estimateMainCombinedLineItemClientService.setSelected(selectedLineItem);

					if (!selectedLineItem.CombinedLineItems && selectedLineItem.CombinedLineItemsSimple) {
						$scope.$emit('AttachCombinedLineItemsProgress', true);
						let postData = {EstHeaderFk: selectedLineItem.EstHeaderFk, EstLineItems: selectedLineItem.CombinedLineItemsSimple};
						$http.post(globals.webApiBaseUrl + 'estimate/main/lineitem/getLineItemByCondition', postData).then(function (response) {
							if (response.data) {
								selectedLineItem.CombinedLineItems = response.data.dtos;
							}
							$scope.$emit('AttachCombinedLineItemsProgress', false);
						});
					}
				}
			};

			platformGridControllerService.initListController($scope, estimateMainCombinedLineItemDynamicConfigurationService, estimateMainCombinedLineItemClientService, estimateMainValidationService, myGridConfig);

			estimateMainCombinedLineItemClientService.getGridId($scope.gridId);

			var tools = [
				{
					id: 'combineGroup',
					caption: 'radio group caption',
					type: 'sublist',
					list: {
						cssClass: 'radio-group',
						activeValue: '',
						showTitles: true,
						items: [
							{
								id: 'combineItemsRefresh',
								caption: 'Refresh',
								caption$tr$: 'estimate.main.combineLineItems.refresh',
								type: 'item',
								cssClass: 'tlb-icons ico-refresh',
								fn: function () {
									estimateMainCombinedLineItemClientService.load();
								}
							},
							{
								id: 'combineItemsStandardView',
								caption: 'Standard View',
								caption$tr$: 'estimate.main.combineLineItems.standardView',
								type: 'radio',
								value: 'views',
								iconClass: 'tlb-icons tlb-icons ico-combined-standard',
								fn: function () {
									estimateMainCombinedLineItemClientService.setCombineFilters(0);
									estimateMainCombinedLineItemClientService.setListView(0, null);
									estimateMainCombinedLineItemClientService.load();
								},
								disabled: function () {
									return !!estimateMainCombinedLineItemClientService.getHeaderStatus();
								}
							},
							{
								id: 'combineItemsItemUnitCost',
								caption: 'Item, Unit Cost View',
								caption$tr$: 'estimate.main.combineLineItems.itemUnitCostView',
								type: 'radio',
								value: 'viewu',
								iconClass: 'tlb-icons tlb-icons ico-combined-unit-cost',
								fn: function () {
									estimateMainCombinedLineItemClientService.setCombineFilters(1);
									estimateMainCombinedLineItemClientService.setListView(1, null);
									estimateMainCombinedLineItemClientService.load();
								},
								disabled: function () {
									return !!estimateMainCombinedLineItemClientService.getHeaderStatus();
								}
							},
							{
								id: 'combineItemsCustomView',
								caption: 'Custom View',
								caption$tr$: 'estimate.main.combineLineItems.customView',
								type: 'radio',
								value: 'viewc',
								iconClass: 'tlb-icons tlb-icons tlb-icons ico-combined-custom',
								fn: function () {
									var getPromise = estimateMainCombineLineItemCustomViewDialogService.showCustomCombinedViewDialog();

									getPromise.then(function (result) {
										result.currentCustomView.ViewConfig.columns.combineColumns = $rootScope.customColumnList;
										estimateMainCombinedLineItemClientService.setListView(2, result.currentCustomView);
										estimateMainCombinedLineItemClientService.setCombineFilters(2);
										estimateMainCombinedLineItemClientService.refresh();
									});
								},
								disabled: function () {
									return !!estimateMainCombinedLineItemClientService.getHeaderStatus();
								}
							}
						]
					}
				}
			];

			$scope.addTools(tools);

			estimateMainService.onContextUpdated.register(estimateMainCombinedLineItemClientService.loadCombinedLineItem);

			$timeout(function () {
				estimateMainCombinedLineItemClientService.loadCombinedLineItem();
			}, 3000);

			$scope.$on('AttachCombinedLineItemsProgress', function (eventObject, isInProgress) {
				if (isInProgress) {
					$scope.loadingText = $translate.instant('estimate.main.attachCombinedLineItemsProgress');
					$scope.isLoading = isInProgress;
				} else {
					$scope.isLoading = isInProgress;
				}
			});

			/* add costGroupService to mainService */
			if(!estimateMainCombinedLineItemClientService.costGroupService){
				estimateMainCombinedLineItemClientService.costGroupService = $injector.get('estimateMainCombineLineItemCostGroupService');
			}
			estimateMainCombinedLineItemClientService.costGroupService.registerCellChangedEvent($scope.gridId);

			$scope.$on('$destroy', function () {
				estimateMainService.onContextUpdated.unregister(estimateMainCombinedLineItemClientService.loadCombinedLineItem);
			});
		}
	]);
})(angular);
