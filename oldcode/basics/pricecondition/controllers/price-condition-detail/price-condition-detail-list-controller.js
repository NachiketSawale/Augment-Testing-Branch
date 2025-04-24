(function (angular) {
	'use strict';
	var moduleName = 'basics.pricecondition';

	angular.module(moduleName).controller('basicsPriceConditionDetailListController',
		['$scope','platformGridControllerService', 'basicsPriceConditionDetailDataService', 'basicsPriceConditionDetailValidationService', 'basicsPriceConditionDetailUIStandardService',
			function ($scope,gridControllerService, dataService, validationService, uiService) {
				var gridConfig = {initCalled: false, columns: []};
				gridControllerService.initListController($scope, uiService, dataService, validationService, gridConfig);
			}]);

})(angular);