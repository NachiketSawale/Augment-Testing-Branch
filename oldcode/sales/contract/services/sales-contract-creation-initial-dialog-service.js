/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	var moduleName = 'sales.contract';
	var contractMainModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name salesContractCreationInitialDialogService
	 * @function
	 *
	 * @description
	 * salesContractCreationInitialDialogService is the data service for all creation initial dialog related functionality.
	 */
	contractMainModule.service('salesContractCreationInitialDialogService', SalesContractCreationInitialDialogService);

	SalesContractCreationInitialDialogService.$inject = ['_', '$q', 'salesCommonCreationInitialDialogServiceProvider', '$injector'];

	function SalesContractCreationInitialDialogService(_, $q, salesCommonCreationInitialDialogServiceProvider, $injector) {

		var service = salesCommonCreationInitialDialogServiceProvider.getInstance('salesContractService');

		service.requestCreationData = function requestCreationData(dlgLayout) {
			return $q.all([
				$injector.get('salesContractCreateContractDialogService').resetToDefault(dlgLayout.dataItem)
			]);
		};

		service.overrideRequiredRowsConfig = function overrideRequiredRowsConfig(dlgLayout) {
			var contractDialogService = $injector.get('salesContractCreateContractDialogService');
			var contractValidationService = $injector.get('salesContractValidationService');

			// override Rubric Category layout config
			var rubricRow = _.find(dlgLayout.formConfiguration.rows, {rid: 'rubriccategoryfk'});
			if (!_.isNil(rubricRow)) {
				rubricRow.readonly = false;
				rubricRow.options.readOnly = false;
			}

			// override Configuration layout config
			var configRow = _.find(dlgLayout.formConfiguration.rows, {rid: 'configurationfk'});
			if (!_.isNil(configRow)) {
				configRow.options.readOnly = false;
				configRow.validator = contractDialogService.onConfigurationChanged;
			}

			// override Code layout config
			var codeRow = _.find(dlgLayout.formConfiguration.rows, {rid: 'code'});
			if (!_.isNil(codeRow)) {
				// TODO: 139810
			}

			// override Company Responsible layout config
			var companyRow = _.find(dlgLayout.formConfiguration.rows, {rid: 'companyresponsiblefk'});
			if (!_.isNil(companyRow)) {
				companyRow.validator = contractValidationService.validateCompanyResponsibleFk;
				companyRow.label$tr$ = 'sales.common.entityCompanyResponsibleFk';
			}

			// override Clerk layout config
			var clerkRow = _.find(dlgLayout.formConfiguration.rows, {rid: 'clerkfk'});
			if (!_.isNil(clerkRow)) {
				clerkRow.validator = contractValidationService.validateClerkFk;
				clerkRow.options.lookupDirective = 'cloud-clerk-clerk-dialog';
			}

			// override Project layout config
			var projectRow = _.find(dlgLayout.formConfiguration.rows, {rid: 'projectfk'});
			if (!_.isNil(projectRow)) {
				projectRow.readonly = false;
				projectRow.validator = contractValidationService.validateProjectFk;
				projectRow.options.readOnly = false;
				projectRow.options.lookupOptions.readOnly = false;
				projectRow.options.lookupOptions.filterKey = 'sales-common-project-filterkey';
				projectRow.options.lookupOptions.events = [{
					name: 'onSelectedItemChanged',
					handler: contractDialogService.getDataFromProject
				}];
			}

			// override Contract Type config
			var contractTypeRow = _.find(dlgLayout.formConfiguration.rows, {rid: 'contracttypefk'});
			if (!_.isNil(contractTypeRow)) {
				contractTypeRow.validator = contractValidationService.validateContractTypeFk;
				contractTypeRow.options.lookupOptions.filterKey = 'sales-common-project-contract-type-lookup-filter';
				contractTypeRow.options.lookupOptions.readOnly = false;
				contractTypeRow.readonly = false;
			}

			// override Business Partner layout config
			var bpRow = _.find(dlgLayout.formConfiguration.rows, {rid: 'businesspartnerfk'});
			if (!_.isNil(bpRow)) {
				// TODO: ?
			}

			// override Subsidiary layout config
			var subsidiaryRow = _.find(dlgLayout.formConfiguration.rows, {rid: 'subsidiaryfk'});
			if (!_.isNil(subsidiaryRow)) {
				subsidiaryRow.options.lookupOptions.filterKey = 'sales-common-subsidiary-filter';
			}

			// override Bid Header layout config
			var bidHeaderRow = _.find(dlgLayout.formConfiguration.rows, {rid: 'bidheaderfk'});
			if (!_.isNil(bidHeaderRow)) {
				bidHeaderRow.readonly = false;
				bidHeaderRow.options.readOnly = false;
				bidHeaderRow.options.lookupOptions.events = [{
					name: 'onSelectedItemChanged',
					handler: contractDialogService.getDataFromBid
				}];
			}

			// override Ord Header layout config
			var ordHeaderRow = _.find(dlgLayout.formConfiguration.rows, {rid: 'ordheaderfk'});
			if (!_.isNil(ordHeaderRow)) {
				ordHeaderRow.readonly = false;
				ordHeaderRow.options.readOnly = false;
				ordHeaderRow.label = 'Main Contract';
				ordHeaderRow.label$tr$ = ' sales.common.MainContract';
				ordHeaderRow.options.lookupDirective = 'sales-common-contract-dialog-v2';
				ordHeaderRow.options.lookupOptions.filterKey = 'sales-contract-main-contract-filter-by-server';
				ordHeaderRow.options.lookupOptions.events = [{
					name: 'onSelectedItemChanged',
					handler: contractDialogService.getDataFromMainContract
				}];
			}

			return dlgLayout;
		};

		service.extendDataItem = function extendDataItem(dataItem) {
			$injector.get('salesContractCreateContractDialogService').extendDataItem(dataItem);
		};

		return service;
	}
})(angular);