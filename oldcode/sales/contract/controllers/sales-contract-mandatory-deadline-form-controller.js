(function () {
	'use strict';

	var moduleName = 'sales.contract';
	angular.module(moduleName).controller('ordMandatoryDeadlineFormController', [
		'$scope',
		'platformDetailControllerService',
		'ordMandatoryDeadlineDataFactory',
		'ordMandatoryDeadlineValidationFactory',
		'ordMandatoryDeadlineUIStandardFactory',
		'salesContractService',
		function (
			$scope,
			platformDetailControllerService,
			dataFactory,
			validationFactory,
			gridColumnsFactory,
			salesContractService
		) {
			var dataService = dataFactory.getService(salesContractService);
			var gridColumns = gridColumnsFactory();
			var validationService = validationFactory.getService(salesContractService);

			platformDetailControllerService.initDetailController( $scope, dataService, validationService, gridColumns, null );
		}
	]);
})();