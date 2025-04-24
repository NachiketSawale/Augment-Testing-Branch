/**
 * Created by pel on 2021/08/04
 */
/* jshint -W072 */ // many parameters because of dependency injection
(function (angular) {
	'use strict';
	var moduleName = 'procurement.invoice';
	var invoiceMainModule = angular.module(moduleName);
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,moment */
	/**
     * @ngdoc service
     * @name invoiceCreationInitialDialogService
     * @function
     *
     * @description
     * invoiceCreationInitialDialogService is the data service for all creation initial dialog related functionality.
     */
	/* jshint -W072 */ // many parameters because of dependency injection
	invoiceMainModule.service('invoiceCreationInitialDialogService', InvoiceCreationInitialDialogService);

	InvoiceCreationInitialDialogService.$inject = ['_','$q','procurementContextService', '$injector', 'basicsLookupdataLookupDescriptorService','platformRuntimeDataService',
		'$http'];

	function InvoiceCreationInitialDialogService(_,$q, procurementContextService,$injector,basicsLookupdataLookupDescriptorService,platformRuntimeDataService,$http) {

		function requestDefaultForInvoice(createItem) {
			var validationService = $injector.get('invoiceHeaderElementValidationService');
			var projectId = createItem.dataItem.ProjectFk;
			if(_.isNil(projectId)){
				projectId = 0;
			}
			return  $http.get(globals.webApiBaseUrl + 'procurement/invoice/header/getdefaultvalues?projectFk=' + projectId).then(function callback(response){
				var defaultInvoice = response.data;
				defaultInvoice.DateInvoiced=moment.utc(defaultInvoice.DateInvoiced);
				defaultInvoice.DateReceived=moment.utc(defaultInvoice.DateReceived);
				defaultInvoice.DateNetPayable=moment.utc(defaultInvoice.DateNetPayable);
				defaultInvoice.DatePosted=moment.utc(defaultInvoice.DatePosted);
				_.extend(createItem.dataItem, defaultInvoice);
				if(defaultInvoice.Id === 0){
					delete createItem.dataItem.Id;
				}
				if(defaultInvoice.ProjectFk === 0){
					delete createItem.dataItem.ProjectFk;
				}
				if(defaultInvoice.CurrencyFk === 0){
					delete createItem.dataItem.CurrencyFk;
				}
				if(defaultInvoice.TaxCodeFk === 0){
					delete createItem.dataItem.TaxCodeFk;
				}
				if(defaultInvoice.Reference === null){
					delete createItem.dataItem.Reference;
				}
				if(defaultInvoice.BusinessPartnerFk === null){
					delete createItem.dataItem.BusinessPartnerFk;
				}
				var result1 = validationService.validateDialogConfigurationFk(createItem.dataItem, createItem.dataItem.PrcConfigurationFk, 'PrcConfigurationFk');
				platformRuntimeDataService.applyValidationResult(result1, createItem.dataItem, 'PrcConfigurationFk');

				if(defaultInvoice.BusinessPartnerFk !== null){
					var result2 = validationService.validateBusinessPartnerFk(createItem.dataItem, createItem.dataItem.BusinessPartnerFk, 'BusinessPartnerFk', true, true);
					platformRuntimeDataService.applyValidationResult(result2, createItem.dataItem, 'BusinessPartnerFk');
				}
				if(defaultInvoice.Reference !== null){
					var result3 = validationService.validateReference(createItem.dataItem, createItem.dataItem.Reference, 'Reference', true);
					platformRuntimeDataService.applyValidationResult(result3, createItem.dataItem, 'Reference');
				}

			});
		}

		function requestInvoiceCreationData(modalCreateProjectConfig) {
			return $q.all([
				requestDefaultForInvoice(modalCreateProjectConfig)
			]);
		}

		this.adjustCreateConfiguration= function adjustCreateConfiguration(dlgLayout) {

			// eslint-disable-next-line no-unused-vars
			var validationService = $injector.get('invoiceHeaderElementValidationService');
			var invoiceService = $injector.get('procurementInvoiceHeaderDataService');
			invoiceService.deselect();
			dlgLayout.dataItem.ProjectFk = procurementContextService.loginProject;

			return requestInvoiceCreationData(dlgLayout).then(function() {
				return dlgLayout;
			});
		};
	}
})(angular);
