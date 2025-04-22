/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	var moduleName = 'sales.bid';
	var bidMainModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name salesBidCreationInitialDialogService
	 * @function
	 *
	 * @description
	 * salesBidCreationInitialDialogService is the data service for all creation initial dialog related functionality.
	 */
	bidMainModule.service('salesBidCreationInitialDialogService', SalesBidCreationInitialDialogService);

	SalesBidCreationInitialDialogService.$inject = ['_', '$q', 'salesCommonCreationInitialDialogServiceProvider', '$injector'];

	function SalesBidCreationInitialDialogService(_, $q, salesCommonCreationInitialDialogServiceProvider, $injector) {

		var service = salesCommonCreationInitialDialogServiceProvider.getInstance('salesBidService');

		service.requestCreationData = function requestCreationData(layoutConfig) {
			return $q.all([
				$injector.get('salesBidCreateBidDialogService').resetToDefault(layoutConfig.dataItem)
			]);
		};

		service.overrideRequiredRowsConfig = function overrideRequiredRowsConfig(dlgLayout) {
			var salesBidCreateBidDialogService = $injector.get('salesBidCreateBidDialogService');
			var salesBidValidationService = $injector.get('salesBidValidationService');

			// override Rubric Category layout config
			var rubricRow = _.find(dlgLayout.formConfiguration.rows, {rid: 'rubriccategoryfk'});
			if (!_.isNil(rubricRow)) {
				rubricRow.readonly = false;
				rubricRow.options.readOnly = false;
				rubricRow.validator = salesBidCreateBidDialogService.onRubricCategoryChanged;
				rubricRow.asyncValidator = salesBidValidationService.asyncValidateRubricCategoryFk;
				rubricRow.options.lookupOptions.readOnly = false;
				rubricRow.options.lookupOptions.filterKey = 'sales-bid-rubric-category-by-rubric-filter';
			}

			// override Description layout config
			var descriptionRow = _.find(dlgLayout.formConfiguration.rows, {rid: 'description'});
			if (!_.isNil(descriptionRow)) {
				descriptionRow.readonly = false;
			}

			// override Configuration layout config
			var configRow = _.find(dlgLayout.formConfiguration.rows, {rid: 'configurationfk'});
			if (!_.isNil(configRow)) {
				configRow.options.lookupOptions.readOnly = false;
				configRow.readonly = false;
				configRow.options.readOnly = false;
				configRow.options.lookupOptions.filterKey = 'sales-bid-configuration-filter';
				configRow.validator = salesBidCreateBidDialogService.onConfigurationChanged;
			}

			// override Code layout config
			var codeRow = _.find(dlgLayout.formConfiguration.rows, {rid: 'code'});
			if (!_.isNil(codeRow)) {
				codeRow.validator = salesBidValidationService.validateCodeOnMode;
				codeRow.asyncValidator = salesBidValidationService.asyncValidateCode;
			}

			// override Company Responsible layout config
			var companyRow = _.find(dlgLayout.formConfiguration.rows, {rid: 'companyresponsiblefk'});
			if (!_.isNil(companyRow)) {
				companyRow.label = 'Profit Center';
				companyRow.label$tr$ = 'sales.common.entityCompanyResponsibleFk';
				companyRow.validator = salesBidValidationService.validateCompanyResponsibleFk;
			}

			// override Clerk layout config
			var clerkRow = _.find(dlgLayout.formConfiguration.rows, {rid: 'clerkfk'});
			if (!_.isNil(clerkRow)) {
				clerkRow.validator = salesBidValidationService.validateClerkFk;
			}

			// override Project layout config
			var projectRow = _.find(dlgLayout.formConfiguration.rows, {rid: 'projectfk'});
			if (!_.isNil(projectRow)) {
				projectRow.validator = salesBidValidationService.validateProjectFk;
				projectRow.options.lookupOptions.filterKey = 'sales-common-project-filterkey';
				projectRow.options.lookupOptions.events = [{
					name: 'onSelectedItemChanged',
					handler: salesBidCreateBidDialogService.projectSelectedItemChangedHandler
				}];
			}

			// override Contract Type config
			var contractTypeRow = _.find(dlgLayout.formConfiguration.rows, {rid: 'contracttypefk'});
			if (!_.isNil(contractTypeRow)) {
				contractTypeRow.validator = salesBidValidationService.validateContractTypeFk;
				contractTypeRow.options.lookupOptions.readOnly = false;
				contractTypeRow.options.lookupOptions.filterKey = 'sales-common-project-contract-type-lookup-filter';
			}

			// override Business Partner layout config
			var bpRow = _.find(dlgLayout.formConfiguration.rows, {rid: 'businesspartnerfk'});
			if (!_.isNil(bpRow)) {
				bpRow.validator = salesBidValidationService.validateBusinesspartnerFk;
				bpRow.options.lookupOptions.filterKey = 'sales-common-subsidiary-filter';
			}

			// override Subsidiary layout config
			var subsidiaryRow = _.find(dlgLayout.formConfiguration.rows, {rid: 'subsidiaryfk'});
			if (!_.isNil(subsidiaryRow)) {
				subsidiaryRow.validator = salesBidValidationService.validateBusinesspartnerFk;
				subsidiaryRow.options.lookupOptions.filterKey = 'sales-common-subsidiary-filter';
			}
			return dlgLayout;
		};

		service.extendDataItem = function extendDataItem(dataItem) {
			$injector.get('salesBidCreateBidDialogService').extendDataItem(dataItem);
		};

		return service;
	}
})(angular);