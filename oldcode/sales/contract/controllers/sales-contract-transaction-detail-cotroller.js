(function (angular) {
	'use strict';
	var moduleName = 'sales.contract';

	angular.module(moduleName).controller('salesContractTransactionFormController', [
		'$scope',
		'salesContractTransactionDataService',
		'platformDetailControllerService',
		'salesOrdTransactionUIStandardService',
		'platformTranslateService',
		function (
			$scope,
			dataService,
			platformDetailControllerService,
			formConfig,
			platformTranslateService
		) {
			platformDetailControllerService.initDetailController($scope, dataService, null, formConfig, platformTranslateService);
		}
	]);
})(angular);