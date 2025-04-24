/**
 * Created by pel on 7/5/2019.
 */
// eslint-disable-next-line no-redeclare
/* global angular */
(function (angular) {
	'use strict';
	/* jshint -W072 */ // many parameters because of dependency injection
	var moduleName = 'procurement.inventory';
	angular.module(moduleName).controller('procurementInventoryGridController',
		['$scope', '$translate', 'platformGridControllerService', 'procurementInventoryDataService', 'procurementInventoryUIStandardService',
			'inventoryElementValidationService',
			function ($scope, $translate, gridControllerService, dataService, gridColumns, inventoryElementValidationService) {

				var gridConfig = {
					initCalled: false,
					columns: []
				};

				gridControllerService.initListController($scope, gridColumns, dataService, inventoryElementValidationService, gridConfig);
			}]
	);
})(angular);