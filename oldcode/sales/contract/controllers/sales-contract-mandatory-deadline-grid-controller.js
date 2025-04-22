(function () {
	'use strict';

	var moduleName = 'sales.contract';
	angular.module(moduleName).controller('ordMandatoryDeadlineGridController', [
		'$scope',
		'platformGridControllerService',
		'ordMandatoryDeadlineDataFactory',
		'ordMandatoryDeadlineValidationFactory',
		'ordMandatoryDeadlineUIStandardFactory',
		'salesContractService',
		function (
			$scope,
			platformGridControllerService,
			dataFactory,
			validationFactory,
			gridColumnsFactory,
			salesContractService
		) {
			var gridConfig = {initCalled: false, columns: []};
			var dataService = dataFactory.getService(salesContractService);
			var gridColumns = gridColumnsFactory();
			var validationService = validationFactory.getService(salesContractService);

			platformGridControllerService.initListController($scope, gridColumns, dataService, validationService, gridConfig);
		}
	]);

})();