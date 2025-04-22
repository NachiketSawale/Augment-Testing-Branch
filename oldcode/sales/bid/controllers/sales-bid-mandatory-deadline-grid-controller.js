(function () {
	'use strict';

	var moduleName = 'sales.bid';
	angular.module(moduleName).controller('bidMandatoryDeadlineGridController', [
		'$scope',
		'platformGridControllerService',
		'ordMandatoryDeadlineDataFactory',
		'ordMandatoryDeadlineValidationFactory',
		'ordMandatoryDeadlineUIStandardFactory',
		'salesBidService',
		function (
			$scope,
			platformGridControllerService,
			dataFactory,
			validationFactory,
			gridColumnsFactory,
			salesBidService
		) {
			var gridConfig = {initCalled: false, columns: []};
			var dataService = dataFactory.getService(salesBidService);
			var gridColumns = gridColumnsFactory();
			var validationService = validationFactory.getService(salesBidService);

			platformGridControllerService.initListController($scope, gridColumns, dataService, validationService, gridConfig);
		}
	]);

})();