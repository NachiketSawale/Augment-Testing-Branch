(function (angular) {
	'use strict';

	var moduleName = 'sales.contract';

	angular.module(moduleName).controller('salesContractValidationDetailController',
		['$scope', 'platformDetailControllerService', 'salesContractValidationDataService', 'salesContractValidationUIStandardService', 'platformTranslateService',
			function ($scope, platformDetailControllerService, dataService, formConfig, platformTranslateService) {
				platformDetailControllerService.initDetailController($scope, dataService, {}, formConfig, platformTranslateService);
			}
		]);

})(angular);
