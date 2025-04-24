
(function(angular){
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */

	var moduleName = 'procurement.stock';
	angular.module(moduleName).controller('procurementStockAccrualDetailController', procurementStockAccrualDetailController);

	procurementStockAccrualDetailController.$inject = ['$scope', 'platformDetailControllerService', 'procurementStockAccrualDataService',
		'procurementStockAccrualUIStandardService', 'procurementStockTranslationService'];

	function procurementStockAccrualDetailController($scope, platformDetailControllerService, procurementStockAccrualDataService,
		procurementStockAccrualUIStandardService, procurementStockTranslationService) {
		platformDetailControllerService.initDetailController($scope, procurementStockAccrualDataService, {},
			procurementStockAccrualUIStandardService, procurementStockTranslationService);
	}
})(angular);