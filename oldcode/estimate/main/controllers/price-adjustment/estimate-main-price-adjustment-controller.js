(function(angular) {
	'use strict';
	let moduleName = 'estimate.main';
	angular.module(moduleName).controller('estimateMainPriceAdjustmentController', ['_', 'globals', '$scope', '$timeout', '$injector', 'platformGridControllerService',
		'estimateMainPriceAdjustmentDataService', 'estMainPriceAdjustmentUIConfigurationService',
		'estimateMainBoqStructureControllerFactory', 'estimateMainCommonUIService', 'estimateDefaultGridConfig', 'estimateMainClipboardService',
		'estimateMainPriceAdjustmentValidationService','estimateMainFilterService',
		function (_, globals, $scope, $timeout, $injector, platformGridControllerService, estimateMainPriceAdjustmentDataService, estMainPriceAdjustmentUIConfigurationService,
			estimateMainBoqStructureControllerFactory, estimateMainCommonUIService, estimateDefaultGridConfig, estimateMainClipboardService,
			estimateMainPriceAdjustmentValidationService,estimateMainFilterService) {

			$scope.showHeaderInfo = false;
			$scope.filteredTotalEntity = {};
			$scope.totalEntity = {};

			let myGridConfig = angular.extend({
				initCalled: false,
				parentProp: 'BoqItemFk',
				childProp: 'BoqItems',
				type: 'estBoqItems',
				propagateCheckboxSelection: true,
				dragDropService: estimateMainClipboardService,
				costGroupService: 'estimateMainBoqCostGroupService',
				cellChangeCallBack:function cellChangeCallBack(arg) {
					let field = arg.grid.getColumns()[arg.cell].field;
					if (field === 'WqTenderPrice' && estimateMainPriceAdjustmentDataService.canEditWqTenderPrice(arg.item)) {
						if ( arg.item.WqTenderPrice === null || arg.item.WqEstimatedPrice === 0 || arg.item.WqAdjustmentPrice === 0) {
							arg.item.WqTenderPrice = 0;
							estimateMainPriceAdjustmentDataService.gridRefresh();
						}
						$injector.get('estimateMainPriceAdjustmentDataService').update();
					}

				},
				rowChangeCallBack:function rowChangeCallBack () {
					$injector.get('estimateMainPriceAdjustmentDataService').update();
				},marker : {
					filterService: estimateMainFilterService,
					filterId: 'estimateMainPriceAdjustmentController',
					dataService: estimateMainPriceAdjustmentDataService,
					serviceName: 'estimateMainPriceAdjustmentDataService'
				}
			}, estimateDefaultGridConfig);

			estimateMainBoqStructureControllerFactory.initEstMainBoqSimpleController($scope, myGridConfig, estMainPriceAdjustmentUIConfigurationService,
				'estimateMainPriceAdjustmentDataService', estimateMainPriceAdjustmentValidationService,{isAggr: false, isLoad: false, isLoadUDP: false});
			let tools = [
				{
					id: 'refreshPriceAdjust',
					sort: 200,
					caption: 'cloud.common.toolbarRefresh',
					type: 'item',
					iconClass: 'tlb-icons ico-refresh',
					disabled: function () {
						return false;
					},
					fn: function refresh() {
						reload();
					}
				},
				{
					id: 'modifyPriceAdjust',
					sort: 200,
					caption: 'estimate.main.priceAdjust.title',
					type: 'item',
					iconClass: 'tlb-icons ico-price-adjustment',
					disabled: function () {
						return estimateMainPriceAdjustmentDataService.hasReadOnly();
					},
					fn: function showDialog() {
						$injector.get('platformModalService').showDialog({
							headerTextKey: 'estimate.main.priceAdjust.title',
							templateUrl: globals.appBaseUrl + 'estimate.main/templates/price-adjustment/estimate-main-modify-price-adjustment-window.html',
							controller: 'estimateMainModifyPriceAdjustmentController',
							width: '800px'
						});
					}
				},
				{
					id: 'copyTenderPrice',
					sort: 200,
					caption: 'estimate.main.copyTenderPrice',
					type: 'item',
					iconClass: 'tlb-icons ico-price-copy-boq',
					disabled: function () {
						return estimateMainPriceAdjustmentDataService.hasReadOnly();
					},
					fn: function showDialog() {
						$injector.get('estimateMainSyncTenderPriceService').showDialog();
					}
				},
				{
					id: 'filterTenderPrice',
					sort: 200,
					caption: 'estimate.main.filterTenderPrice',
					type: 'check',
					iconClass: 'tlb-icons ico-pencil',
					fn: function showDialog() {
						$scope.showHeaderInfo = !$scope.showHeaderInfo;
						if($scope.showHeaderInfo){
							estimateMainPriceAdjustmentDataService.updateFilterTotalData(estimateMainPriceAdjustmentDataService.filterItemList);
						}
						$timeout(function () {
							$injector.get('platformGridAPI').grids.resize($scope.gridId);
						},100);
					}
				}
			];

			function updateTools() {

				$scope.addTools(tools);

				_.remove($scope.tools.items, function (e) {
					return e.id === 'createChild' || e.id === 'create' || e.id === 'delete';
				});

				$timeout(function () {
					$scope.tools.update();
				});
			}

			updateTools();

			function reload() {
				$scope.isLoading = true;
				estimateMainPriceAdjustmentDataService.load().then(function () {
					estimateMainPriceAdjustmentDataService.updateFilterTotalData();
					$scope.isLoading = false;
					estimateMainPriceAdjustmentDataService.clearSelectedItem();
				});
			}

			estimateMainPriceAdjustmentDataService.setScope($scope);

			$scope.headerInfoValueChange = function(entityName, field) {
				estimateMainPriceAdjustmentDataService.cellChangeFilterData(entityName, field);
			};

			$scope.$on('$destroy', function () {
			});
		}]);
})(angular);
