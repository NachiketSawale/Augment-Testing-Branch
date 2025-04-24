
(function(angular){
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */

	var moduleName = 'procurement.stock';
	angular.module(moduleName).controller('procurementStockAccrualGridController', procurementStockAccrualGridController);

	procurementStockAccrualGridController.$inject = ['$scope', 'platformGridControllerService', 'procurementStockAccrualUIStandardService',
		'procurementStockAccrualDataService'];

	function procurementStockAccrualGridController($scope, platformGridControllerService, procurementStockAccrualUIStandardService,
		procurementStockAccrualDataService) {
		var gridConfig = {
			initCalled: false,
			columns: []
		};
		platformGridControllerService.initListController($scope, procurementStockAccrualUIStandardService, procurementStockAccrualDataService, {}, gridConfig);
	}
})(angular);