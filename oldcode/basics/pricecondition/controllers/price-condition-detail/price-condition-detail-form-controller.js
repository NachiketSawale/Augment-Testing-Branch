(function (angular) {
	'use strict';
	var moduleName = 'basics.pricecondition';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('basicsPriceConditionDetailFormController',
		['$scope','platformDetailControllerService', 'basicsPriceConditionDetailDataService', 'basicsPriceConditionDetailValidationService', 'basicsPriceConditionDetailUIStandardService','platformTranslateService',
			function ($scope,platformDetailControllerService, dataService, validationService, uiService,platformTranslateService) {
				platformDetailControllerService.initDetailController($scope, dataService, validationService, uiService, platformTranslateService);
			}]);

})(angular);