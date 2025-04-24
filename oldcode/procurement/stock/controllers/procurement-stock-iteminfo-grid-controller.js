
(function(angular){
	'use strict';
	/* global _ */

	var moduleName = 'procurement.stock';
	angular.module(moduleName).controller('procurementStockItemInfoGridController', procurementStockItemInfoGridController);

	procurementStockItemInfoGridController.$inject = ['$scope', 'platformGridControllerService','$translate',
		'procurementStockItemInfoUIStandardService', 'procurementStockItemInfoDataService','procurementStockHeaderDataService'];

	function procurementStockItemInfoGridController($scope, platformGridControllerService, $translate,
		uiStandardService, dataService, parentService) {
		$scope.viewOptions = {
			outStandingText: $translate.instant('procurement.stock.outStandingText'),
			deliveredText: $translate.instant('procurement.stock.deliveredText'),
			isOutStanding: true,
			isDelivered: false,
			startDate: null,
			endDate: null
		};
		let gridConfig = {
			initCalled: false,
			columns: [],
			options: {
				editable: false,
				readonly: true
			}
		};
		platformGridControllerService.initListController($scope, uiStandardService, dataService, {}, gridConfig);

		$scope.tools.items.splice(0, 0,
			{
				id: 'refresh',
				caption: 'basics.common.button.refresh',
				type: 'item',
				iconClass: 'tlb-icons ico-refresh',
				fn: function () {
					setFilter();
					dataService.loadData();
				},
				disabled: function () {
					return _.isEmpty(dataService.getParentData());
				}
			},
			{
				id: 'dItemSub',
				type: 'divider'
			}
		);
		$scope.tools.update();

		function setFilter(){
			dataService.initItemInfoFilter($scope.viewOptions);
		}
		setFilter();

		parentService.registerSelectionChanged(setFilter);

		$scope.$on('$destroy', function () {
			parentService.unregisterSelectionChanged(setFilter);
		});
	}
})(angular);