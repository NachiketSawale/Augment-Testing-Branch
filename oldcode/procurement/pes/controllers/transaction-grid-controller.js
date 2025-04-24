/**
 * Created by lcn on 06.22.2020.
 */

(function (angular) {
	'use strict';
	var moduleName = 'procurement.pes';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	/* jshint -W072 */ // many parameters because of dependency injection

	angular.module(moduleName).controller('procurementPesTransactionGridController',
		['$scope', 'platformGridControllerService', 'procurementPesTransactionDataService',
			'procurementPesTransactionValidationService', 'procurementPesTransactionUIStandardService',
			function ($scope, gridControllerService, dataService, validationService, gridColumns) {

				var gridConfig = {
					initCalled: false,
					columns: []
				};

				gridControllerService.initListController($scope, gridColumns, dataService, validationService, gridConfig);

				var index = 0;
				for (; index < $scope.tools.items.length; index++) {
					if ($scope.tools.items[index].id === 't14') {
						break;
					}
				}
				$scope.tools.items.splice(index, 1);
			}]
	);
})(angular);