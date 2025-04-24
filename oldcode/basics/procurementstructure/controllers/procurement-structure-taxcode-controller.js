(function (angular) {
	'use strict';

	var moduleName = 'basics.procurementstructure';
	angular.module(moduleName).controller('basicsProcurementTaxCodeController',
		['$scope', 'platformGridControllerService', 'basicsProcurementStructureTaxCodeUIStandardService',
			'basicsProcurementStructureTaxCodeService', 'basicsProcurementStructureTaxCodeValidationService','$translate',
			function ($scope, gridControllerService, gridColumns, dataService, validation,$translate) {
				var gridConfig = {
					columns: []
				};
				gridControllerService.initListController($scope, gridColumns, dataService, validation, gridConfig);

			}]);
})(angular);