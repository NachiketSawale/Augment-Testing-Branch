(function () {
	'use strict';

	var moduleName = 'sales.contract';

	angular.module(moduleName).controller('salesContractAdvanceGridController', [
		'$scope',
		'platformGridControllerService',
		'salesContractAdvanceUIStandardService',
		'prcAndSalesContractAdvanceDataService',
		'salesContractAdvanceValidationService',
		'salesContractService',
		function (
			$scope,
			platformGridControllerService,
			columnsService,
			dataServiceFactory,
			validationService,
			parentService
		) {
			var dataService = dataServiceFactory.getService(parentService);

			platformGridControllerService.initListController($scope, columnsService, dataService, validationService, {});
		}
	]);
})();