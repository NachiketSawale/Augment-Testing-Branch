/**
 * Created by chi on 5/26/2017.
 */
(function(angular){
	'use strict';

	var moduleName = 'basics.material';

	angular.module(moduleName).controller('basicsMaterialPriceListDetailController', basicsMaterialPriceListDetailController);
	basicsMaterialPriceListDetailController.$inject = ['$scope', 'platformTranslateService', 'platformDetailControllerService', 'basicsMaterialPriceListService',
		'basicsMaterialPriceListValidationService', 'basicsMaterialPriceListUIStandardService'];
	function basicsMaterialPriceListDetailController($scope, platformTranslateService, detailControllerService, basicsMaterialPriceListService,
		basicsMaterialPriceListValidationService, basicsMaterialPriceListUIStandardService) {
		detailControllerService.initDetailController($scope, basicsMaterialPriceListService, basicsMaterialPriceListValidationService(basicsMaterialPriceListService),
			basicsMaterialPriceListUIStandardService, platformTranslateService);
	}
})(angular);