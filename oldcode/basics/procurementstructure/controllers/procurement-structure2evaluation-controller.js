(function (angular) {
	'use strict';

	/* jshint -W072 */ // many parameters because of dependency injection

	var moduleName = 'basics.procurementstructure';
	angular.module(moduleName).controller('basicsProcurementEvaluationController',
		['$scope', 'platformGridControllerService', 'basicsProcurementEvaluationUIStandardService',
			'basicsProcurement2EvaluationService', 'basicsProcurementStructure2EvaluationValidationService',
			function ($scope, gridControllerService, gridColumns, dataService, validation) {
				var gridConfig = {
					columns: []
				};
				gridControllerService.initListController($scope, gridColumns, dataService, validation, gridConfig);
			}]);
})(angular);