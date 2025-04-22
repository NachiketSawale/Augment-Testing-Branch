(function () {
	'use strict';

	var moduleName = 'sales.contract';

	angular.module(moduleName).controller('salesContractAdvanceFormController', [
		'$scope',
		'platformDetailControllerService',
		'salesContractAdvanceUIStandardService',
		'prcAndSalesContractAdvanceDataService',
		'salesContractAdvanceValidationService',
		'salesContractService',
		function (
			$scope,
			platformDetailControllerService,
			columnsService,
			dataServiceFactory,
			validationService,
			parentService
		) {
			var dataService = dataServiceFactory.getService(parentService);

			platformDetailControllerService.initDetailController($scope, dataService, validationService, columnsService);
		}
	]);
})();