/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	var moduleName = 'sales.contract';
	/**
	 * @ngdoc service
	 * @name salesContractCreateWizardDialogUIService
	 * @function
	 *
	 * @description
	 * Service for the wizard creation dialog
	 **/
	angular.module(moduleName).factory('salesContractCreateWizardDialogUIService', [
		'_', 'platformTranslateService', 'basicsLookupdataConfigGenerator', 'projectMainService', 'salesContractService','salesWipValidationService',
		function (_, platformTranslateService, basicsLookupdataConfigGenerator, projectMainService, salesContractService, salesWipValidationService) {

			var commonLookups = {
				getRubricCategory: function getRubricCategory(filterKey, onSelectedItemChangedHandler) {
					return _.cloneDeep({
						gid: 'baseGroup',
						rid: 'rubricCategoryFk',
						model: 'RubricCategoryFk',
						required: true,
						label$tr$: 'project.main.entityRubric',
						label: 'Category',
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'basics-lookupdata-rubric-category-by-rubric-and-company-lookup',
							descriptionMember: 'Description',
							lookupOptions: {
								filterKey: filterKey,
								showClearButton: false
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'RubricCategoryByRubricAndCompany',
							displayMember: 'Description'
						},
						events: [{
							name: 'onSelectedItemChanged',
							handler: onSelectedItemChangedHandler
						}],
						visible: true
					});
				},
				getConfiguration: function getConfiguration(configFilterKey) {
					return _.cloneDeep({
						gid: 'baseGroup',
						rid: 'configurationfk',
						label: 'Configuration',
						label$tr$: 'sales.common.entityConfigurationFk',
						type: 'directive',
						model: 'ConfigurationFk',
						directive: 'basics-configuration-configuration-combobox',
						options: {
							filterKey: configFilterKey,
							showClearButton: true
						},
						visible: true
					});
				},
				getDescription: function getDescription() {
					return _.cloneDeep({
						'rid': 'description',
						'gid': 'baseGroup',
						'label$tr$': 'cloud.common.entityDescription',
						'model': 'DescriptionInfo',
						'type': 'translation',
						'visible': true
					});
				},
				getCode: function getCode(generateType) {
					if (generateType === 'update') {
						return {
							gid: 'baseGroup',
							rid: 'code',
							label$tr$: 'cloud.common.entityCode',
							type: 'directive', // set this as code type first, and it will be changed by option user check
							directive: 'sales-contract-wip-code-grid-selector',
							options: {
								filterKey: 'sales-wip-code-filter',
								valueMember: 'Code',
								displayMember: 'Code',
							},
							model: 'Code',
							visible: true,
							required: true,
							validator: salesWipValidationService.validateCode
						};
					}
					else {
						return {};
					}
				},
				getPreviousWip: function getPreviousWip() {
					return _.cloneDeep({
						gid: 'baseGroup',
						rid: 'previousWipId',
						model: 'PreviousWipId',
						label: 'Previous WIP',
						label$tr$: 'sales.wip.previousWip',
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'sales-common-wip-dialog-v2',
							descriptionMember: 'DescriptionInfo.Translated',
							lookupOptions: {
								filterKey: 'sales-contract-create-wip-previouswip-filter',
								showClearButton: true
							}
						},
						visible: true,
					});
				},
			};

			return {
				getCreateOrUpdateWipFormConfig: function getCreateOrUpdateWipFormConfig(onSelectedItemChangedHandler, generateType) {
					var formConfig = {
						fid: 'sales.contract.createWipWizardFormConfig',
						version: '0.1.0',
						showGrouping: false,
						groups: [{
							gid: 'baseGroup',
							attributes: ['rubriccategoryfk', 'configurationfk', 'description', 'performedfrom', 'performedto']
						}],
						rows: [
							// adding option [x] "Collective WIP for BoQs that are split to contracts with different bill-to"
							{
								gid: 'baseGroup',
								rid: 'iscollectivewip',
								label: 'Collective WIP',
								label$tr$: 'sales.contract.wizardCWCreateWipContractsCollectiveWIPOption',
								type: 'boolean',
								model: 'IsCollectiveWip',
								checked: false,
								disabled: false,
								visible: true,
								readonly: generateType === 'update' ? true : false
							},
							commonLookups.getRubricCategory('sales-wip-rubric-category-by-rubric-filter', onSelectedItemChangedHandler),
							commonLookups.getConfiguration('sales-wip-configuration-filter'), // Sales Configuration
							commonLookups.getPreviousWip(),
							commonLookups.getCode(generateType),
							commonLookups.getDescription(),
							// adding grid
							{
								gid: 'baseGroup',
								rid: 'contractsGrid',
								label: 'Contracts',
								label$tr$: 'sales.contract.wizardCWCreateWipContractsGridLabel',
								type: 'directive',
								directive: 'sales-contract-select-contracts',
								options: {
									contractServiceName: 'salesContractCreateWipWizardDialogService',
									getListName: generateType === 'update' ? 'getWipRelatedContracts' : 'getContractsFromServer'
								},
								readonly: true, disabled: false, maxlength: 5000, rows: 20, visible: true
							},
							{
								gid: 'baseGroup',
								rid: 'performedFrom',
								label: 'Performed From',
								label$tr$: 'sales.common.entityPerformedFrom',
								validator: salesWipValidationService.validatePerformedFrom,
								model: 'PerformedFrom',
								type: 'dateutc',
								visible:true,
								sortOrder: 14
							},
							{
								gid: 'baseGroup',
								rid: 'performedTo',
								label: 'Performed To',
								label$tr$: 'sales.common.entityPerformedTo',
								validator: salesWipValidationService.validatePerformedTo,
								model: 'PerformedTo',
								type: 'dateutc',
								visible:true,
								sortOrder: 15
							}
						]
					};

					platformTranslateService.translateFormConfig(formConfig);

					return formConfig;
				},

				getCreateBillFormConfig: function getCreateBillFormConfig(onSelectedItemChangedHandler, filterKey) {
					var formConfig = {
						fid: 'sales.contract.createBillWizardFormConfig',
						version: '0.2.0',
						showGrouping: false,
						groups: [{
							gid: 'baseGroup',
							attributes: ['rubriccategoryfk', 'configurationfk', 'description']
						}],
						rows: [
							commonLookups.getRubricCategory(filterKey, onSelectedItemChangedHandler),
							commonLookups.getConfiguration('sales-billing-configuration-filter'), // Sales Configuration
							commonLookups.getDescription()
						]
					};

					platformTranslateService.translateFormConfig(formConfig);

					return formConfig;
				},
				getRevenueFormConfiguration: function getRevenueFormConfiguration() {
					var formOptions =
					{
						fid: 'sales.contract.createWizardModal',
						version: '0.0.1',
						showGrouping: false,
						groups: [
							{
								gid: 'baseGroup',
								attributes: [
									'projectfk', 'estimateheaderfk', 'mdccostcodefk', 'discountcostcodefk'
								]
							}
						],
						rows: [
							{
								'rid': 'projectfk',
								'gid': 'baseGroup',
								'label$tr$': 'cloud.common.entityProjectNo',
								'label': 'Project No.',
								'type': 'directive',
								'model': 'ProjectFk',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									'lookupDirective': 'basics-lookup-data-project-project-dialog',
									'descriptionMember': 'ProjectName',
									'lookupOptions': {
										'initValueField': 'ProjectNo',
										'lookupKey': 'prc-req-header-project-property',
										'readOnly' : true,
										'disableInput' : false
									}
								}
							},
							basicsLookupdataConfigGenerator.provideDataServiceCompositeLookupConfigForForm({
								dataServiceName: 'estimateMainHeaderLookupDataService',
								enableCache: false,
								filter: function () {
									// get project Id from project main service as default, but will retrieve from current contract as the correctly one
									var projectId = projectMainService.getIfSelectedIdElse(-1);
									var selectedContract = salesContractService.getSelected();
									if (selectedContract && selectedContract.ProjectFk) {
										projectId = selectedContract.ProjectFk;
									}
									return projectId;
								},
								desMember: 'DescriptionInfo.Translated'
							},
							{
								gid: 'baseGroup',
								rid: 'estimateHeaderFk',
								model: 'EstHeaderFk',
								label$tr$: 'estimate.main.estHeaderFk'
							}),
							{
								gid: 'baseGroup',
								rid: 'mdccostcodefk',
								label: 'Revenue Cost Code',
								label$tr$: 'sales.contract.revenueCostCodeFk',
								type: 'directive',
								model: 'mdcCostCodeFk',
								directive: 'basics-cost-codes-lookup',
								options: {
									showClearButton: true,
									filterKey: 'sales-contract-costcode-revenue-filter',
									events: [
										{
											name: 'onSelectedItemChanged',
											handler: function (/* e, args */) {
												// var item = args.Entity; // TODO: remove here?
											}
										}
									]
								},
								readonly: false,
								visible: true,
								sortOrder: 2
							},
							{
								gid: 'baseGroup',
								rid: 'discountcostcodefk',
								label: 'DisCount Cost Code',
								label$tr$: 'sales.contract.disCountCostCodeFk',
								type: 'directive',
								model: 'disCountCostCodeFk',
								directive: 'basics-cost-codes-lookup',
								options: {
									showClearButton: true,
									filterKey: 'sales-contract-costcode-discount-filter'
								},
								readonly: false,
								visible: true,
								sortOrder: 3
							}
						]
					};

					platformTranslateService.translateFormConfig(formOptions);

					// if (formOptions){
					// make the EstHeaderFk readonly
					// formOptions.rows[0].readonly = (entity && entity.EstHeaderFk);
					// }

					return formOptions;
				}
			};

		}]);
})();
