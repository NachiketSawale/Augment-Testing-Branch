/**
 * Created by lcn on 8/30/2017.
 */
(function(angular){
	'use strict';

	var moduleName = 'basics.material';

	angular.module(moduleName).controller('basicsMaterialStockController', basicsMaterialStockController);
	basicsMaterialStockController.$inject = ['$scope', 'platformGridControllerService', 'basicsMaterialStockUIStandardService',
		'basicsMaterialStockService', 'basicsMaterialStockValidationService'];
	function basicsMaterialStockController($scope, platformGridControllerService, basicsMaterialStockUIStandardService,
		basicsMaterialStockService,basicsMaterialStockValidationService) {
		var myGridConfig = { initCalled: false, columns: [] };

		platformGridControllerService.initListController($scope, basicsMaterialStockUIStandardService, basicsMaterialStockService, basicsMaterialStockValidationService(basicsMaterialStockService),myGridConfig);
	}
})(angular);