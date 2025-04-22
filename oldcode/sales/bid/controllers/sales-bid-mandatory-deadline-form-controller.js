(function () {
	'use strict';

	var moduleName = 'sales.bid';
	angular.module(moduleName).controller('bidMandatoryDeadlineFormController', [
		'$scope',
		'platformDetailControllerService',
		'ordMandatoryDeadlineDataFactory',
		'ordMandatoryDeadlineValidationFactory',
		'ordMandatoryDeadlineUIStandardFactory',
		'salesBidService',
		function (
			$scope,
			platformDetailControllerService,
			dataFactory,
			validationFactory,
			gridColumnsFactory,
			salesBidService
		) {
			var dataService = dataFactory.getService(salesBidService);
			var gridColumns = gridColumnsFactory();
			var validationService = validationFactory.getService(salesBidService);

			platformDetailControllerService.initDetailController( $scope, dataService, validationService, gridColumns, null );
		}
	]);
})();