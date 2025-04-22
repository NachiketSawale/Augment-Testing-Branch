/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	var moduleName = 'sales.billing';
	var billingMainModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name salesBillingCreationInitialDialogService
	 * @function
	 *
	 * @description
	 * salesBillingCreationInitialDialogService is the data service for all creation initial dialog related functionality.
	 */
	billingMainModule.service('salesBillingCreationInitialDialogService', SalesBillingCreationInitialDialogService);

	SalesBillingCreationInitialDialogService.$inject = ['_', '$q', 'salesCommonCreationInitialDialogServiceProvider', '$injector'];

	function SalesBillingCreationInitialDialogService(_, $q, salesCommonCreationInitialDialogServiceProvider, $injector) {

		var service = salesCommonCreationInitialDialogServiceProvider.getInstance('salesBillingService');

		service.requestCreationData = function requestCreationData(dlgLayout) {
			return $q.all([
				$injector.get('salesBillingCreateBillDialogService').resetToDefault(dlgLayout.dataItem)
			]);
		};

		service.overrideRequiredRowsConfig = function overrideRequiredRowsConfig(dlgLayout) {
			var salesBillingValidationService = $injector.get('salesBillingValidationService');
			var salesBillingCreateBillDialogService = $injector.get('salesBillingCreateBillDialogService');

			// override Rubric Category layout config
			var rubricRow = _.find(dlgLayout.formConfiguration.rows, {rid: 'rubriccategoryfk'});
			if (!_.isNil(rubricRow)) {
				rubricRow.validator = salesBillingCreateBillDialogService.onRubricCategoryChanged;
				rubricRow.asyncValidator = salesBillingValidationService.asyncValidateRubricCategoryFk;
				rubricRow.options.lookupOptions.readOnly = false;
				rubricRow.options.lookupOptions.filterKey = 'sales-billing-rubric-category-by-rubric-filter';
			}

			// override Description layout config
			var descriptionRow = _.find(dlgLayout.formConfiguration.rows, {rid: 'description'});
			if (!_.isNil(descriptionRow)) {
				descriptionRow.readonly = false;
			}

			// override Configuration layout config
			var configRow = _.find(dlgLayout.formConfiguration.rows, {rid: 'configurationfk'});
			if (!_.isNil(configRow)) {
				configRow.options.readOnly = false;
				configRow.validator = salesBillingCreateBillDialogService.validateSelectedConfiguration;
				configRow.options.lookupOptions.filterKey = 'sales-billing-configuration-filter';
			}

			// override Code layout config
			var codeRow = _.find(dlgLayout.formConfiguration.rows, {rid: 'billno'});
			if (!_.isNil(codeRow)) {
				codeRow.asyncValidator = function (entity, value) {
					return $injector.get('salesBillingValidationHelperService').asyncValidateBillNo(entity.CompanyFk, value);
				};
			}

			// override Company Responsible layout config
			var companyRow = _.find(dlgLayout.formConfiguration.rows, {rid: 'companyresponsiblefk'});
			if (!_.isNil(companyRow)) {
				companyRow.label = 'Profit Center';
				companyRow.label$tr$ = 'sales.common.entityCompanyResponsibleFk';
				companyRow.validator = salesBillingValidationService.validateCompanyResponsibleFk;
			}

			// override Clerk layout config
			var clerkRow = _.find(dlgLayout.formConfiguration.rows, {rid: 'clerkfk'});
			if (!_.isNil(clerkRow)) {
				clerkRow.validator = salesBillingValidationService.validateClerkFk;
			}

			// override Project layout config
			var projectRow = _.find(dlgLayout.formConfiguration.rows, {rid: 'projectfk'});
			if (!_.isNil(projectRow)) {
				projectRow.validator = salesBillingValidationService.validateProjectFk;
				projectRow.options.lookupOptions.filterKey = 'sales-common-project-filterkey';
				projectRow.options.lookupOptions.events = [{
					name: 'onSelectedItemChanged',
					handler: salesBillingCreateBillDialogService.projectSelectedItemChangedHandler
				}];
			}

			// override Type layout config
			var typeRow = _.find(dlgLayout.formConfiguration.rows, {rid: 'typefk'});
			if (!_.isNil(typeRow)) {
				typeRow.readonly = false;
				typeRow.options.readOnly = false;
				typeRow.label = 'Bill Type';
				typeRow.label$tr$ = 'sales.billing.entityBillTypeFk';
				typeRow.validator = salesBillingCreateBillDialogService.validateSelectedType;
			}

			// override Subsidiary layout config
			var subsidiaryRow = _.find(dlgLayout.formConfiguration.rows, {rid: 'subsidiaryfk'});
			if (!_.isNil(subsidiaryRow)) {
				subsidiaryRow.validator = salesBillingValidationService.validateBusinesspartnerFk;
				subsidiaryRow.options.lookupOptions.filterKey = 'sales-common-subsidiary-filter';
			}

			// override Customer layout config
			var customerRow = _.find(dlgLayout.formConfiguration.rows, {rid: 'customerfk'});
			if (!_.isNil(customerRow)) {
				customerRow.validator = salesBillingValidationService.validateCustomerFk;
				customerRow.asyncValidator = salesBillingValidationService.asyncValidateCustomerFk;
				customerRow.options.lookupOptions.filterKey = 'sales-common-customer-filter';
			}

			// override Contract Header layout
			var contractRow = _.find(dlgLayout.formConfiguration.rows, {rid: 'ordheaderfk'});
			if (!_.isNil(contractRow)) {
				contractRow.options.lookupDirective = 'sales-common-contract-dialog-v2';
				contractRow.options.lookupOptions.filterKey = 'sales-billing-contract-filter-by-server';
				contractRow.options.lookupOptions.alerts = [{
					theme: 'info',
					message: $injector.get('salesCommonStatusHelperService').getInfoMsgOnlyOrderedContracts()
				}];
				contractRow.options.lookupOptions.events = [{
					name: 'onSelectedItemChanged',
					handler: salesBillingCreateBillDialogService.ordHeaderChangedHandler
				}];
			}

			// override Contract Type layout
			var contractTypeRow = _.find(dlgLayout.formConfiguration.rows, {rid: 'contracttypefk'});
			if (!_.isNil(contractRow)) {
				contractTypeRow.validator = salesBillingValidationService.validateContractTypeFk;
			}

			return dlgLayout;
		};

		service.extendDataItem = function extendDataItem(dataItem) {
			$injector.get('salesBillingCreateBillDialogService').extendDataItem(dataItem);
		};

		return service;
	}
})(angular);