// eslint-disable-next-line no-redeclare
/* global angular */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.stock';

	angular.module(moduleName).controller('procurementStockOrderProposalGridController',
		['$scope', '$translate', 'platformGridControllerService', 'procurementStockOrderProposalDataService', 'procurementStockOrderProposalUIStandardService',
			function ($scope, $translate, gridControllerService, dataService, gridColumns) {
				var gridConfig = {
					initCalled: false,
					columns: [],
					options: {
						editable: false,
						readonly:false
					}
				};

				dataService.createItem = false;
				dataService.deleteItem = false;

				gridControllerService.initListController($scope, gridColumns, dataService, {}, gridConfig);
			}]);
})(angular);