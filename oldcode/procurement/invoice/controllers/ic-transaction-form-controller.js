(function (angular) {
	'use strict';
	var moduleName = 'procurement.invoice';
	/* jshint -W072 */ // many parameters because of dependency injection
	// eslint-disable-next-line no-redeclare
	/* global angular */
	/**
	 * @ngdoc controller
	 * @name procurementInvoiceIcTransactionFormController
	 * @require $scope
	 * @description controller for contract header
	 */
	angular.module(moduleName).controller('procurementInvoiceIcTransactionFormController',
		['$scope', 'procurementInvoiceIcTransactionDataService', 'procurementInvoiceDetailControllerService',
			'procurementInvoiceIcTransactionValidationService', 'procurementInvoiceIcTransactionUIStandardService',
			'platformTranslateService',
			function ($scope, dataService, platformDetailControllerService, validationService, formConfig, platformTranslateService) {
				platformDetailControllerService.initDetailController($scope, dataService, validationService, formConfig, platformTranslateService);
			}
		]);
})(angular);