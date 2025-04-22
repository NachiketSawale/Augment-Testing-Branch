/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'sales.billing';
	var salesBillingModule = angular.module(moduleName);

	salesBillingModule.factory('salesBillingCreateCreditMemoDialogService',
		['globals', '_', '$injector', '$translate', '$http', 'platformRuntimeDataService', 'platformContextService', 'platformTranslateService', 'platformModalFormConfigService', 'basicsLookupdataConfigGenerator', 'platformUserInfoService', 'basicsClerkUtilitiesService', 'salesBillingService', 'salesBillingFilterService', 'salesBillingValidationService', 'cloudDesktopPinningContextService', 'salesBillingNumberGenerationSettingsService', 'platformSidebarWizardCommonTasksService', 'salesBillTypeLookupDataService',
			function (globals, _, $injector, $translate, $http, platformRuntimeDataService, platformContextService, platformTranslateService, platformModalFormConfigService, basicsLookupdataConfigGenerator, platformUserInfoService, basicsClerkUtilitiesService, salesBillingService, salesBillingFilterService, salesBillingValidationService, cloudDesktopPinningContextService, salesBillingNumberGenerationSettingsService, platformSidebarWizardCommonTasksService, salesBillTypeLookupDataService) {

				var service = {},
					selectedBill = null,
					// default item init values
					initDataItem = {};

				// lookup configs
				// - Billing Type
				function validateSelectedType(entity, typeId) {
					salesBillTypeLookupDataService.getItemByIdAsync(typeId).then(function (typeEntity) {
						// populate related values like rubric category
						var rubricCategoryId = typeEntity.RubricCategoryFk;
						entity.RubricCategoryFk = rubricCategoryId;
					});
				}

				function resetToDefault() {
					var context = platformContextService.getContext(),
						userId = _.get(platformUserInfoService.getCurrentUserInfo(), 'UserId', -1);

					selectedBill = salesBillingService.getSelected();

					// default item init values
					initDataItem = {
						// company defaulted with the login company, never shown in the ui
						CompanyFk: context.clientId,
						// ui fields
						OrdHeaderFk: null,
						PreviousBillFk: null,
						BillNo: selectedBill.BillNo,
						Description: '',
						TypeFk: 0,
						RubricCategoryFk: 0,
						ResponsibleCompanyFk: context.signedInClientId,
						ClerkFk: null,
						ProjectFk: context.ProjectFk,
						ContractTypeFk: 0,
					};
					// make rubric category readonly (after billing type was introduced)
					platformRuntimeDataService.readonly(initDataItem, [
						{ field: 'RubricCategoryFk', readonly: true },
					]);
					// user id -> clerk
					basicsClerkUtilitiesService.getClerkByUserId(userId).then(function (clerk) {
						initDataItem.ClerkFk = clerk && clerk.IsLive ? clerk.Id : null;
					});

					// try to find related credit memo bill type or set default credit memo billing type
					salesBillTypeLookupDataService.getRelatedCreditMemoBillType(selectedBill.TypeFk).then(function (typeEntity) {
						if (typeEntity === null) {
							salesBillTypeLookupDataService.getDefaultCreditMemoBillType().then(function (typeEntity) {
								initDataItem.TypeFk = _.get(typeEntity, 'Id') || initDataItem.TypeFk;
							});
						} else {
							initDataItem.TypeFk = _.get(typeEntity, 'Id') || initDataItem.TypeFk;
						}
					});

					// set default rubric category
					var lookupService = 'basicsMasterDataRubricCategoryLookupDataService';
					var rubricCategoryDataService = $injector.get(lookupService);
					rubricCategoryDataService.setFilter(7); // Customer Billing ([BAS_RUBRIC])
					rubricCategoryDataService
						.getList({ lookupType: lookupService })
						.then(function (data) {
							var defaultItem = _.find(data, { IsDefault: true });
							initDataItem.RubricCategoryFk = _.get(defaultItem, 'Id') || 0;
						});
				}

				// <editor-fold desc="[definition of filters]">
				var filters = [{
					key: 'sales-billing-bill-type',
					fn: function (entity) {
						return _.isBoolean(_.get(entity, 'IsCreditMemo')) ? entity.IsCreditMemo : false;
					}
				}];

				function registerFilters() {
					$injector.get('basicsLookupdataLookupFilterService').registerFilter(filters);
				}

				function unregisterFilters() {
					$injector.get('basicsLookupdataLookupFilterService').unregisterFilter(filters);
				}

				// </editor-fold>

				function getFormConfig() {
					return {
						fid: 'sales.billing.createCreditMemoModal',
						version: '0.1.0',
						showGrouping: false,
						groups: [{
							gid: 'baseGroup',
							attributes: ['typefk', 'rubriccategoryfk', 'billno', 'description', 'clerkfk']
						}],
						rows: [
							// Billing Type
							basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm(
								{
									dataServiceName: 'salesBillTypeLookupDataService',
									enableCache: true,
									filterKey: 'sales-billing-bill-type'
								},
								{
									gid: 'baseGroup',
									rid: 'typefk',
									model: 'TypeFk',
									required: true,
									sortOrder: 1,
									label$tr$: 'sales.billing.entityBillTypeFk',
									validator: validateSelectedType
								}),
							// Rubric Category
							{
								gid: 'baseGroup',
								rid: 'rubriccategoryfk',
								model: 'RubricCategoryFk',
								required: true,
								sortOrder: 2,
								label$tr$: 'project.main.entityRubric',
								label: 'Category',
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
							// BillNo
							{
								gid: 'baseGroup',
								rid: 'billno',
								model: 'BillNo',
								label$tr$: 'sales.billing.entityBillNo',
								type: 'code',
								sortOrder: 3,
								readonly: true
							},
							// Description
							{
								gid: 'baseGroup',
								rid: 'description',
								label$tr$: 'cloud.common.entityDescription',
								model: 'Description',
								type: 'description',
								sortOrder: 4
							},
							// Clerk
							{
								gid: 'baseGroup',
								rid: 'clerkFk',
								model: 'ClerkFk',
								required: true,
								sortOrder: 5,
								label: 'Clerk',
								label$tr$: 'basics.clerk.entityClerk',
								type: 'directive',
								directive: 'basics-lookupdata-lookup-composite',
								options: {
									lookupDirective: 'cloud-clerk-clerk-dialog',
									descriptionMember: 'Description',
									lookupOptions: {
										showClearButton: false
									}
								}
							}
						]
					};
				}

				service.showDialog = function createCreditMemo() {
					var selectedEntity = salesBillingService.getSelected();
					var title = 'sales.billing.createCreditMemoTitle';
					// bill selected? otherwise show error dialog
					if (selectedEntity === null) {
						platformSidebarWizardCommonTasksService.showErrorNoSelection(
							title,
							$translate.instant('sales.billing.noCurrentBillSelection')
						);
						return;
					}

					// wizard should be only available for selected bills those status has the flag "is billed" set
					var _isBilled = $injector.get('salesCommonStatusHelperService').checkIsBilled(selectedEntity.BilStatusFk);
					if (_isBilled === false) {
						platformSidebarWizardCommonTasksService.showErrorNoSelection(title, $translate.instant('sales.billing.isBilledNotSelected'));
						return;
					}

					// init dialog
					resetToDefault();
					registerFilters();

					// dialog configuration
					var modalDlgConfig = {
						title: $translate.instant('sales.billing.createCreditMemoTitle'),
						dialogOptions: {
							disableOkButton: function disableOkButton() {
								// is valid?
								return initDataItem.TypeFk === 0 || initDataItem.TypeFk === null ||
									initDataItem.RubricCategoryFk === 0 || initDataItem.RubricCategoryFk === null ||
									initDataItem.ClerkFk === null || initDataItem.ClerkFk === 0;
							}
						},
						dataItem: initDataItem,
						formConfiguration: getFormConfig(),
						handleOK: function handleOK(result) {
							var newBill = result.data;
							var postData = {
								entityId: selectedEntity.Id,
								creationData: {
									CompanyFk: newBill.CompanyFk,
									OrdHeaderFk: newBill.OrdHeaderFk,
									PreviousBillFk: newBill.PreviousBillFk,
									TypeFk: newBill.TypeFk,
									RubricCategoryFk: newBill.RubricCategoryFk,
									BillNo: 'Is generated',
									Description: newBill.Description,
									ResponsibleCompanyFk: newBill.ResponsibleCompanyFk,
									// TODO: do not take over clerk from bill. clerk from the user who has created the credit memo should be entered here
									ClerkFk: newBill.ClerkFk,
									ProjectFk: newBill.ProjectFk,
									// ConfigurationId: newBill.ConfigurationFk,
									ContractTypeFk: newBill.ContractTypeFk
								},
								copyIdentifiers: ['sales.billing.boq', 'sales.billing.item', 'sales.billing.general']
							};

							// server request
							$http.post(globals.webApiBaseUrl + 'sales/billing/' + 'createcreditmemo', postData).then(function (response) {
								var newCreditMemo = response.data.BilHeader;
								salesBillingService.addNewBill(newCreditMemo).then(function () {
									$injector.get('salesBillingSchemaService').recalculateBillingSchema();
									platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage('sales.billing.createCreditMemoTitle');
								});

								unregisterFilters();
							});
						},
						handleCancel: function handleCancel() {
							unregisterFilters();
						}
					};

					// show dialog
					platformTranslateService.translateFormConfig(modalDlgConfig.formConfiguration);
					return platformModalFormConfigService.showDialog(modalDlgConfig);
				};

				return service;
			},
		]);
})();