(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	/**
	 * @ngdoc controller
	 * @name procurementInvoiceHeader2HeaderGridController
	 * @require $scope
	 * @description controller for Invoice Header2Header grid
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.invoice').controller('procurementInvoiceHeader2HeaderGridController',
		['$scope', 'procurementInvoiceGridControllerService', 'procurementInvoiceHeader2HeaderDataService',
			'procurementInvoiceHeader2HeaderValidationService', 'procurementInvoiceHeader2HeaderUIStandardService',
			function ($scope, gridControllerService, dataService, validationService,
				uiStandardService) {

				var gridConfig = {
					initCalled: false,
					columns: []
				};

				gridControllerService.initListController($scope, uiStandardService, dataService, validationService, gridConfig);

			}]);
})(angular);