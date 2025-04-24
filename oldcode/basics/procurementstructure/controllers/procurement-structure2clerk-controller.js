(function (angular) {
	'use strict';

	/* jshint -W072 */ // many parameters because of dependency injection

	var moduleName = 'basics.procurementstructure';
	angular.module(moduleName).controller('basicsProcurementClerkController',
		['$scope', 'platformGridControllerService', 'basicsProcurementClerkUIStandardService',
			'basicsProcurement2ClerkService','basicsProcurementStructure2ClerkValidationService',
			function ($scope, gridControllerService, gridColumns, dataService,validation) {
				var gridConfig = {
					columns: []
				};
				gridControllerService.initListController( $scope, gridColumns, dataService, validation, gridConfig );
			}]);
})(angular);