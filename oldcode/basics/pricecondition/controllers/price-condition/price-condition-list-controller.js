(function (angular) {
	'use strict';
	var moduleName = 'basics.pricecondition';

	angular.module(moduleName).controller('basicsPriceConditionListController',
		['$scope', 'platformGridControllerService', 'basicsPriceConditionDataService', 'basicsPriceConditionValidationService', 'basicsPriceConditionUIStandardService', 'cloudDesktopSidebarService',
			function ($scope, gridControllerService, dataService, validationService, uiService, cloudDesktopSidebarService) {
				var gridConfig = {initCalled: false, columns: []};
				gridControllerService.initListController($scope, uiService, dataService, validationService, gridConfig);
			}]);

})(angular);