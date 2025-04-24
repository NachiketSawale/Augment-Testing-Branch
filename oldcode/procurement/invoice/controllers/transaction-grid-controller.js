(function (angular) {
	'use strict';
	var moduleName = 'procurement.invoice';

	/* jshint -W072 */ // many parameters because of dependency injection
	// eslint-disable-next-line no-redeclare
	/* global angular */
	/**
     * @ngdoc controller
     * @name procurementInvoiceValidationGridController
     * @require $scope, platformContextService, platformGridControllerBase, $filter,  procurementInvoiceHeaderDataService, procurementInvoiceHeaderGridColumns,  invoiceHeaderElementValidationService
     * @description controller for contract header
     */
	angular.module(moduleName).controller('procurementInvoiceTransactionGridController',
		['$scope', 'procurementInvoiceGridControllerService', 'procurementInvoiceTransactionDataService',
			'procurementInvoiceTransactionValidationService', 'procurementInvoiceTransactionUIStandardService',
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