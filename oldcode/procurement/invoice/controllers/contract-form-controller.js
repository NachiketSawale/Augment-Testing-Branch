(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	/**
	 * @ngdoc controller
	 * @name procurementInvoiceContractFormController
	 * @require $scope, procurementInvoiceHeaderDataService, procurementContractHeaderFormConfigurations, invoiceHeaderElementValidationService, platformFormControllerBase,platformTranslateService, platformFormConfigService, modelViewerStandardFilterService
	 * @description controller for contract header's form view
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.invoice').controller('procurementInvoiceContractFormController',
		['$scope', 'procurementInvoiceContractDataService', 'procurementInvoiceDetailControllerService',
			'procurementInvoiceContractValidationService', 'procurementInvoiceContractUIStandardService',
			'platformTranslateService', 'modelViewerStandardFilterService',
			function ($scope, dataService, platformDetailControllerService, validationService, formConfig, platformTranslateService,
				modelViewerStandardFilterService) {
				platformDetailControllerService.initDetailController($scope, dataService, validationService, formConfig, platformTranslateService);

				modelViewerStandardFilterService.attachMainEntityFilter($scope, dataService.getServiceName());
			}
		]);

})(angular);