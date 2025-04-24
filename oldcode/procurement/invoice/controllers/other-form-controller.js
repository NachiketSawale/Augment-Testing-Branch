(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	/**
	 * @ngdoc controller
	 * @name procurementInvoiceOtherFormController
	 * @require $scope, procurementInvoiceHeaderDataService, procurementContractHeaderFormConfigurations, invoiceHeaderElementValidationService, platformFormControllerBase,platformTranslateService, platformFormConfigService
	 * @description controller for contract header's form view
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.invoice').controller('procurementInvoiceOtherFormController',
		['$scope', 'procurementInvoiceOtherDataService', 'procurementInvoiceDetailControllerService',
			'procurementInvoiceOtherValidationService', 'procurementInvoiceOtherUIStandardService',
			'platformTranslateService',
			function ($scope, dataService, platformDetailControllerService, validationService, formConfig, platformTranslateService) {
				platformDetailControllerService.initDetailController($scope, dataService, validationService, formConfig, platformTranslateService);

			}
		]);

})(angular);