(function (angular) {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name procurementInvoiceCertificateFormController
	 * @require $scope, procurementInvoiceHeaderDataService, procurementContractHeaderFormConfigurations, invoiceHeaderElementValidationService, platformFormControllerBase,platformTranslateService, platformFormConfigService
	 * @description controller for contract header's form view
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	// eslint-disable-next-line no-redeclare
	/* global angular */
	angular.module('procurement.invoice').controller('procurementInvoiceCertificateFormController',
		['$scope', 'procurementInvoiceCertificateDataService', 'procurementInvoiceDetailControllerService',
			'procurementInvoiceCertificateValidationService', 'procurementInvoiceCertificateUIStandardService',
			'platformTranslateService', 'procurementContextService',
			function ($scope, dataService, platformDetailControllerService, validationService, formConfig, platformTranslateService, moduleContext) {
				platformDetailControllerService.initDetailController($scope, dataService, validationService, formConfig, platformTranslateService);
				$scope.formContainerOptions.customButtons = [
					{
						id: 'create',
						caption: 'cloud.desktop.navBarRefreshDesc',
						type: 'item',
						iconClass: 'tlb-icons ico-refresh',
						fn:dataService.refreshItem,
						disabled: function(){
							return moduleContext.isReadOnly;
						}
					}];

			}
		]);

})(angular);