/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	var moduleName = 'sales.wip';
	var wipMainModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name salesWipCreationInitialDialogService
	 * @function
	 *
	 * @description
	 * salesWipCreationInitialDialogService is the data service for all creation initial dialog related functionality.
	 */
	wipMainModule.service('salesWipCreationInitialDialogService', SalesWipCreationInitialDialogService);

	SalesWipCreationInitialDialogService.$inject = ['_', '$q', '$translate', 'salesCommonCreationInitialDialogServiceProvider', '$injector'];

	function SalesWipCreationInitialDialogService(_, $q, $translate, salesCommonCreationInitialDialogServiceProvider, $injector) {

		var service = salesCommonCreationInitialDialogServiceProvider.getInstance('salesWipService');

		service.requestCreationData = function requestCreationData(dlgLayout) {
			return $q.all([
				$injector.get('salesWipCreateWipDialogService').resetToDefault(dlgLayout.dataItem)
			]);
		};

		function getOrdHeaderFkConfig() {
			var salesWipValidationService = $injector.get('salesWipValidationService');
			var salesWipCreateWipDialogService = $injector.get('salesWipCreateWipDialogService');

			return {
				gid: 'allData',
				rid: 'ordheaderfk',
				model: 'OrdHeaderFk',
				required: true,
				sortOrder: 1,
				label: 'Contract',
				label$tr$: 'sales.common.Contract',
				validator: salesWipValidationService.validateOrdHeaderFk,
				type: 'directive',
				directive: 'basics-lookupdata-lookup-composite',
				options: {
					lookupDirective: 'sales-common-contract-dialog-v2',
					descriptionMember: 'DescriptionInfo.Translated',
					lookupOptions: {
						filterKey: 'sales-wip-contract-filter-by-server',
						showClearButton: false,
						events: [
							{
								name: 'onSelectedItemChanged',
								handler: function (e, args) {
									var selectedItem = args.entity;
									var selectedLookupItem = args.selectedItem;

									// pre-assign project from selected contract
									if (selectedItem && selectedLookupItem) {
										selectedItem.ProjectFk = selectedLookupItem.ProjectFk;
										selectedItem.ContractTypeFk = selectedLookupItem.ContractTypeFk;
										selectedItem.BusinessPartnerFk = selectedLookupItem.BusinesspartnerFk;
										selectedItem.SubsidiaryFk = selectedLookupItem.SubsidiaryFk;
										selectedItem.CustomerFk = selectedLookupItem.CustomerFk;
									}
								}
							}
						],
						dialogOptions: {
							alerts: [{
								theme: 'info',
								message: $translate.instant('sales.wip.assignContractStatusInfo',
									{statuslist: _.join(_.map(salesWipCreateWipDialogService.getOrderedList(), 'DescriptionInfo.Translated'), '" ' + $translate.instant('cloud.common.conjunctionOr') + ' "')})
							}]
						}
					}
				}
			};
		}

		service.overrideRequiredRowsConfig = function overrideRequiredRowsConfig(dlgLayout) {
			var basicsLookupdataConfigGenerator = $injector.get('basicsLookupdataConfigGenerator');
			var salesWipValidationService = $injector.get('salesWipValidationService');
			var salesWipCreateWipDialogService = $injector.get('salesWipCreateWipDialogService');

			// override Rubric Category layout config
			var rubricRow = _.find(dlgLayout.formConfiguration.rows, {rid: 'rubriccategoryfk'});
			if (!_.isNil(rubricRow)) {
				rubricRow.readonly = false;
				rubricRow.options.readOnly = false;
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
				configRow.options.lookupOptions.filterKey = 'sales-wip-configuration-filter';
				configRow.validator = salesWipCreateWipDialogService.validateSelectedConfiguration;
			}

			// override Company Responsible layout config
			var companyRow = _.find(dlgLayout.formConfiguration.rows, {rid: 'companyresponsiblefk'});
			if (!_.isNil(companyRow)) {
				companyRow.label = 'Profit Center';
				companyRow.label$tr$ = 'sales.common.entityCompanyResponsibleFk';
				companyRow.validator = salesWipValidationService.validateCompanyResponsibleFk;
			}

			// override Clerk layout config
			var clerkRow = _.find(dlgLayout.formConfiguration.rows, {rid: 'clerkfk'});
			if (!_.isNil(clerkRow)) {
				clerkRow.validator = salesWipValidationService.validateClerkFk;
			}

			// override Project layout config
			var projectRow = _.find(dlgLayout.formConfiguration.rows, {rid: 'projectfk'});
			if (!_.isNil(projectRow)) {
				projectRow.readonly = false;
				projectRow.options.readOnly = false;
				projectRow.options.lookupOptions.readOnly = false;
				projectRow.validator = salesWipValidationService.validateProjectFk;
				projectRow.options.lookupOptions.filterKey = 'sales-common-project-filterkey';
				projectRow.options.lookupOptions.events = [{
					name: 'onSelectedItemChanged',
					handler: salesWipCreateWipDialogService.projectFkOnSelectedItemChangeHandler
				}];
			}

			// override Contract Type config
			var contractTypeRow = _.find(dlgLayout.formConfiguration.rows, {rid: 'contracttypefk'});
			if (_.isNil(contractTypeRow)) {
				// TODO: 139810
				var contractConfigObject = basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('project.main.contracttype', 'Description', {
					gid: 'allData',
					rid: 'contracttypefk',
					model: 'ContractTypeFk',
					required: true,
					sortOrder: 7,
					label: 'Contract Type',
					label$tr$: 'sales.common.entityContracttypeFk',
					validator: salesWipValidationService.validateContract,
					readonly: true
				}, undefined, {
					filterKey: 'sales-common-project-contract-type-lookup-filter'
				});

				dlgLayout.formConfiguration.rows.push(contractConfigObject);
			}

			// override Contract config
			var contractRow = _.find(dlgLayout.formConfiguration.rows, {rid: 'ordheaderfk'});
			if (!_.isNil(contractRow)) {
				contractRow.readonly = false;
				contractRow.options.readOnly = false;
			} else {
				contractRow = getOrdHeaderFkConfig();
				dlgLayout.formConfiguration.rows.push(contractRow);
			}

			return dlgLayout;
		};
		service.extendDataItem = function extendDataItem(dataItem) {
			$injector.get('salesWipCreateWipDialogService').extendDataItem(dataItem);
		};
		return service;
	}
})(angular);