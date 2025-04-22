/**
 * $Id$
 * Copyright (c) RIB Software SE
 */



(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name salesContractBillFromPaymentScheduleWizardDialogUIService
	 * @function
	 *
	 * @description
	 * Service for the wizard generate bill from payment schedule dialog
	 **/

	var moduleName = 'sales.contract';

	angular.module(moduleName).factory('salesContractBillFromPaymentScheduleWizardDialogUIService', [
		'platformTranslateService', 'basicsLookupdataConfigGenerator', 'salesCommonBillTypeLookupOptions', 'salesContractValidationService', 'basicsLookupdataSimpleLookupService', 'platformRuntimeDataService', 'salesBillingNumberGenerationSettingsService', 'salesBillingValidationService',
		function (platformTranslateService, basicsLookupdataConfigGenerator, salesCommonBillTypeLookupOptions, salesContractValidationService, basicsLookupdataSimpleLookupService, platformRuntimeDataService, salesBillingNumberGenerationSettingsService, salesBillingValidationService) {

			function getBillingTypeById(typeId) {
				return basicsLookupdataSimpleLookupService.getItemById(typeId, salesCommonBillTypeLookupOptions);
			}

			// lookup configs
			// - Billing Type
			function validateSelectedType(entity, value) {
				// populate related values like rubric category
				getBillingTypeById(value).then(function (typeEntity) {
					var rubricCategoryId = typeEntity.BasRubricCategoryFk;
					entity.RubricCategoryFk = rubricCategoryId;
					validateSelectedRubricCategory(entity, rubricCategoryId);
				});
			}

			// - Rubric Category
			function validateSelectedRubricCategory(entity, value) {
				platformRuntimeDataService.readonly(entity, [{
					field: 'BillNo',
					readonly: salesBillingNumberGenerationSettingsService.hasToGenerateForRubricCategory(value)
				}]);
				entity.BillNo = salesBillingNumberGenerationSettingsService.provideNumberDefaultText(value, entity.BillNo);
			}

			function asyncValidateBillNo(entity, value) {
				entity.CompanyFk = entity.ResponsibleCompanyFk;
				return salesBillingValidationService.asyncValidateBillNo(entity, value);
			}

			return {
				getGenerateFormConfiguration: function getGenerateFormConfiguration() {

					var formOptions =
						{
							fid: 'sales.contract.generateWizardModal',
							version: '0.0.1',
							showGrouping: false,
							change: 'change',
							groups: [
								{
									gid: 'baseGroup',
									attributes: [
										'wipfk', 'boqfk', 'previousbillfk', 'typefk', 'rubriccategoryfk', 'billno', 'description',
										'responsiblecompanyfk', 'clerkfk'
									]
								}
							],
							rows: [
								// WIP
								{
									gid: 'baseGroup',
									rid: 'wipFk',
									model: 'WipFk',
									sortOrder: 1,
									label: 'WIP',
									label$tr$: 'sales.contract.wip',
									validator: salesContractValidationService.validateClerkFk,
									type: 'directive',
									directive: 'basics-lookupdata-lookup-composite',
									options: {
										lookupDirective: 'sales-common-wip-dialog',
										descriptionMember: 'DescriptionInfo.Translated',
										lookupOptions: {
											'showClearButton': false,
											filterKey: 'sales-contract-bill-from-contract-wip-filter'
										}
									}
								},
								// Existed BOQ
								{
									gid: 'baseGroup',
									rid: 'boqFk',
									model: 'BoqFk',
									sortOrder: 2,
									label: 'Existed BoQ',
									label$tr$: 'sales.contract.existBoq',
									type: 'directive',
									directive: 'basics-lookupdata-lookup-composite',
									options: {
										lookupDirective: 'sales-contract-existed-boq-lookup',
										descriptionMember: 'BoqRootItem.BriefInfo.Translated',
										lookupOptions: {
											showClearButton: false
										}
									}
								},
								// Previous Bill Fk
								{
									gid: 'baseGroup',
									rid: 'previousBillFk',
									model: 'PreviousBillFk',
									sortOrder: 1,
									label: 'Previous Bill',
									label$tr$: 'sales.common.PreviousBill',
									// validator: salesContractValidationService.validateClerkFk,
									type: 'directive',
									directive: 'basics-lookupdata-lookup-composite',
									options: {
										lookupDirective: 'sales-common-bill-dialog-v2',
										descriptionMember: 'DescriptionInfo.Translated',
										lookupOptions: {
											filterKey: 'sales-contract-billing-previousbill-filter-by-server',
											showClearButton: true,
											events: [
												{
													name: 'onSelectedItemChanged',
													handler: function (/* e, args */) { // TODO: remove code?
														// var selectedItem = args.entity;
														// var selectedLookupItem = args.selectedItem;
														//
														// // pre-assign project from selected bill
														// if (selectedItem && selectedLookupItem) {
														//  selectedItem.ProjectFk = selectedLookupItem.ProjectFk;
														//  selectedItem.OrdHeaderFk = selectedLookupItem.OrdHeaderFk;
														// }
													}
												}
											]
										}
									}
								},
								// Bill Type
								basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm(
									'basics.customize.billtype',
									'Description',
									{
										gid: 'baseGroup',
										rid: 'typeFk',
										model: 'TypeFk',
										sortOrder: 3,
										label$tr$: 'sales.contract.entityBillTypeFk',
										validator: validateSelectedType
										// asyncValidator: salesBillingValidationService.asyncValidateRubricCategoryFk
									},
									true, // caution: this parameter is ignored by the function
									{
										required: true,
										customIntegerProperty: 'BAS_RUBRIC_CATEGORY_FK'
									}
								),
								// Rubric Category
								{
									gid: 'baseGroup',
									rid: 'rubricCategoryFk',
									model: 'RubricCategoryFk',
									required: true,
									sortOrder: 4,
									label$tr$: 'project.main.entityRubric',
									label: 'Category',
									validator: validateSelectedRubricCategory,
									asyncValidator: salesBillingValidationService.asyncValidateRubricCategoryFk,
									type: 'directive',
									directive: 'basics-lookupdata-lookup-composite',
									options: {
										lookupDirective: 'basics-lookupdata-rubric-category-by-rubric-and-company-lookup',
										descriptionMember: 'Description',
										lookupOptions: {
											filterKey: 'sales-billing-rubric-category-by-rubric-filter',
											showClearButton: false
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'RubricCategoryByRubricAndCompany',
										displayMember: 'Description'
									}
								},
								{
									gid: 'baseGroup',
									rid: 'configurationfk',
									label: 'Configuration',
									sortOrder: 5,
									label$tr$: 'sales.common.entityConfigurationFk',
									type: 'directive',
									model: 'ConfigurationFk',
									directive: 'basics-configuration-configuration-combobox',
									options: {
										filterKey: 'sales-billing-configuration-filter',
										showClearButton: true
									}
								},
								// BillNo
								{
									gid: 'baseGroup',
									rid: 'billno',
									label$tr$: 'sales.billing.entityBillNo',
									model: 'BillNo',
									type: 'code',
									sortOrder: 5,
									validator: salesBillingValidationService.validateBillNo,
									asyncValidator: asyncValidateBillNo
									// mandatory: true,
								},
								// Description
								{
									rid: 'description',
									gid: 'baseGroup',
									label$tr$: 'cloud.common.entityDescription',
									model: 'Description',
									type: 'description',
									sortOrder: 6
								},

								// Responsible
								basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
									dataServiceName: 'salesBidCompanyLookupDataService',
									enableCache: true,
									filter: function (item) {
										return item.ResponsibleCompanyFk;
									}
								},
								{
									gid: 'baseGroup',
									rid: 'responsibleCompanyFk',
									model: 'ResponsibleCompanyFk',
									sortOrder: 7,
									label$tr$: 'sales.common.entityCompanyResponsibleFk',
									validator: salesContractValidationService.validateCompanyResponsibleFk
								}
								),
								// Clerk
								{
									gid: 'baseGroup',
									rid: 'clerkFk',
									model: 'ClerkFk',
									sortOrder: 8,
									label: 'Clerk',
									label$tr$: 'basics.clerk.entityClerk',
									validator: salesContractValidationService.validateClerkFk,
									type: 'directive',
									directive: 'basics-lookupdata-lookup-composite',
									options: {
										lookupDirective: 'cloud-clerk-clerk-dialog',
										descriptionMember: 'Description',
										lookupOptions: {
											showClearButton: false
										}
									}
								},

							]
						};

					platformTranslateService.translateFormConfig(formOptions);

					return formOptions;
				}
			};

		}]);
})();
