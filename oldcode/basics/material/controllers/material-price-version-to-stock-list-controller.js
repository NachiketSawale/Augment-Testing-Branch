/**
 * Created by lw on 11/10/2021.
 */
(function(angular){
	'use strict';

	var moduleName = 'basics.material';

	angular.module(moduleName).controller('basicsMaterialPriceVersionToStockListController', basicsMaterialPriceVersionToStockListController);
	basicsMaterialPriceVersionToStockListController.$inject = ['$scope', 'platformGridControllerService', 'basicsMaterialPriceVersionToStockListUIStandardService',
		'basicsMaterialPriceVersionToStockListService', 'basicsMaterialPriceVersionToStockListValidationService'];
	function basicsMaterialPriceVersionToStockListController($scope, platformGridControllerService, basicsMaterialPriceVersionToStockListUIStandardService,
		basicsMaterialPriceVersionToStockListService, basicsMaterialPriceVersionToStockListValidationService) {
		var myGridConfig = { initCalled: false, columns: [] };

		platformGridControllerService.initListController($scope, basicsMaterialPriceVersionToStockListUIStandardService, basicsMaterialPriceVersionToStockListService, 
			basicsMaterialPriceVersionToStockListValidationService(basicsMaterialPriceVersionToStockListService), myGridConfig);
	}
})(angular);