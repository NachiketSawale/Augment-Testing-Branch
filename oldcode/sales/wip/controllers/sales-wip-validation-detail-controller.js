(function (angular) {
	'use strict';
	var moduleName = 'sales.wip';

	angular.module(moduleName).controller('salesWipValidationDetailController',
		['$scope', 'platformDetailControllerService', 'salesWipValidationDataService', 'salesWipValidationUIStandardService', 'platformTranslateService',
			function ($scope, platformDetailControllerService, dataService, formConfig, platformTranslateService) {
				platformDetailControllerService.initDetailController($scope, dataService, {}, formConfig, platformTranslateService);
			}
		]);

})(angular);
