(function (angular) {
	'use strict';
	var moduleName = 'procurement.invoice';

	/* jshint -W072 */ // many parameters because of dependency injection
	// eslint-disable-next-line no-redeclare
	/* global angular */
	/**
	 * @ngdoc controller
	 * @name procurementInvoiceIcTransactionGridController
	 * @require $scope, procurementInvoiceGridControllerService, procurementInvoiceIcTransactionDataService, procurementInvoiceIcTransactionValidationService,  procurementInvoiceIcTransactionUIStandardService
	 * @description controller for Ic transaction
	 */
	angular.module(moduleName).controller('procurementInvoiceIcTransactionGridController',
		['$scope', 'procurementInvoiceGridControllerService', 'procurementInvoiceIcTransactionDataService',
			'procurementInvoiceIcTransactionValidationService', 'procurementInvoiceIcTransactionUIStandardService',
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