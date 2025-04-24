/**
 * Created by chi on 5/26/2017.
 */
(function(angular){
	'use strict';

	var moduleName = 'basics.material';

	angular.module(moduleName).controller('basicsMaterialPriceListController', basicsMaterialPriceListController);
	basicsMaterialPriceListController.$inject = ['$scope', 'platformGridControllerService', 'basicsMaterialPriceListUIStandardService',
		'basicsMaterialPriceListService', 'basicsMaterialPriceListValidationService'];
	function basicsMaterialPriceListController($scope, platformGridControllerService, basicsMaterialPriceListUIStandardService,
		basicsMaterialPriceListService, basicsMaterialPriceListValidationService) {
		var myGridConfig = { initCalled: false, columns: [] };

		platformGridControllerService.initListController($scope, basicsMaterialPriceListUIStandardService, basicsMaterialPriceListService, basicsMaterialPriceListValidationService(basicsMaterialPriceListService), myGridConfig);
	}
})(angular);