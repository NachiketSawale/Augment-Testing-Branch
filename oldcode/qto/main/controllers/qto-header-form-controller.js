(function (angular) {
	'use strict';
	/* jshint -W072 */ // many parameters because of dependency injection
	var moduleName='qto.main';
	angular.module(moduleName).controller('qtoMainHeaderFormController',
		['$scope', 'qtoMainHeaderUIStandardService', 'qtoMainHeaderDataService', 'platformDetailControllerService', 'platformTranslateService', 'qtoMainHeaderValidationService',
			function ($scope, formConfiguration, dataService, detailControllerService, translateService, validationService) {
				detailControllerService.initDetailController($scope, dataService, validationService, formConfiguration, translateService);
			}]);
})(angular);