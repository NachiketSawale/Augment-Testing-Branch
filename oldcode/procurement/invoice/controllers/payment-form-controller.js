/**
 * Created by ltn on 11/24/2016.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	/**
     * @ngdoc controller
     * @name procurementInvoiceCertificateFormController
     * @require $scope, procurementInvoiceHeaderDataService, procurementContractHeaderFormConfigurations, invoiceHeaderElementValidationService, platformFormControllerBase,platformTranslateService, platformFormConfigService
     * @description controller for contract header's form view
     */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.invoice').controller('procurementInvoicePaymentFormController',
		['$scope', 'procurementInvoicePaymentDataService', 'procurementInvoiceDetailControllerService',
			'procurementInvoicePaymentValidationService', 'procurementInvoicePaymentUIStandardService',
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