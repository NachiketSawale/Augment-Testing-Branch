/**
 * Created by lcn on 8/30/2017.
 */
(function(angular){
	'use strict';

	var moduleName = 'basics.material';

	angular.module(moduleName).controller('basicsMaterialStockDetailController', basicsMaterialStockDetailController);
	basicsMaterialStockDetailController.$inject = ['$scope', 'platformTranslateService','platformDetailControllerService',
		'basicsMaterialStockService', 'basicsMaterialStockValidationService','basicsMaterialStockUIStandardService'];
	function basicsMaterialStockDetailController($scope, platformTranslateService,detailControllerService,
		basicsMaterialStockService,basicsMaterialStockValidationService, basicsMaterialStockUIStandardService) {
		detailControllerService.initDetailController($scope, basicsMaterialStockService, basicsMaterialStockValidationService(basicsMaterialStockService),
			basicsMaterialStockUIStandardService, platformTranslateService);

	}
})(angular);