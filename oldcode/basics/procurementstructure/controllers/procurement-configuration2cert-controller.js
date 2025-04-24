(function (angular) {
	'use strict';
	/* jshint -W072 */ // many parameters because of dependency injection

	var moduleName = 'basics.procurementstructure';
	angular.module(moduleName).controller('basicsProcurementConfiguration2CertGridController',
		['$scope', 'platformGridControllerService', 'basicsProcurementConfiguration2CertUIStandardService',
			'basicsProcurementConfiguration2CertService', 'basicsProcurementConfiguration2CertValidationService',
			function ($scope, gridControllerService, gridColumns, dataService, validationService) {
				var gridConfig = {
					columns: []
				};
				gridControllerService.initListController($scope, gridColumns, dataService, validationService, gridConfig);

			}]);
})(angular);