(function (angular) {
	'use strict';

	/* jshint -W072 */ // many parameters because of dependency injection

	/**
	 * @ngdoc controller
	 * @name basics.procurementstructure.basicsProcurementConfiguration2generalsGridController
	 * @require $scope
	 * @description controller for basics procurement configuration2Generals
	 */
	var moduleName = 'basics.procurementstructure';
	angular.module(moduleName).controller('basicsProcurementConfiguration2GeneralsGridController',
		['$scope', 'platformGridControllerService', 'basicsProcurementConfiguration2GeneralsUIStandardService',
			'basicsProcurementConfiguration2GeneralsService', 'basicsProcurementConfiguration2GeneralsValidationService',
			function ($scope, gridControllerService, gridColumns, dataService, validationService) {

				var gridConfig = {
					columns: []
				};

				gridControllerService.initListController($scope, gridColumns, dataService, validationService, gridConfig);

			}]);
})(angular);