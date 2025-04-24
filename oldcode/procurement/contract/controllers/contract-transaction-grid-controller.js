/**
 * Created by Ivy on 06.24.2020.
 */

(function (angular) {
	'use strict';
	var moduleName = 'procurement.contract';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	/* jshint -W072 */ // many parameters because of dependency injection

	angular.module(moduleName).controller('procurementContractTransactionGridController',
		['$scope', 'platformGridControllerService', 'procurementContractTransactionDataService', 'procurementContractTransactionUIStandardService',
			function ($scope, gridControllerService, dataService, gridColumns) {

				var gridConfig = {
					initCalled: false,
					columns: []
				};

				gridControllerService.initListController($scope, gridColumns, dataService, null, gridConfig);

				var index = 0;
				for (; index < $scope.tools.items.length; index++) {
					if ($scope.tools.items[index].id === 't14') {
						break;
					}
				}
				$scope.tools.items.splice(index, 1);
				index = 0;
				for (; index < $scope.tools.items.length; index++) {
					if ($scope.tools.items[index].id === 'delete') {
						break;
					}
				}
				$scope.tools.items.splice(index, 1);
			}]
	);
})(angular);