(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc factory
	 * @name objectMainBillWizardService
	 * @description
	 *
	 * @example
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('object.main').factory('objectMainBillWizardService',
		['_','$injector', '$translate', '$http', 'moment', 'platformTranslateService', 'platformModalService', 'platformModalFormConfigService', 'platformRuntimeDataService', 'basicsLookupdataLookupFilterService',
			'objectMainUnitService', 'basicsLookupdataConfigGenerator', 'platformUserInfoService', 'basicsClerkUtilitiesService', 'platformModuleNavigationService', 'objectMainUnitInstallmentDataService', 'platformModalGridConfigService', 'basicsConfigDataConfigurationDialogDataService',  'platformGridControllerService',
			function (_,$injector, $translate, $http, moment, platformTranslateService, platformModalService, platformModalFormConfigService, platformRuntimeDataService, basicsLookupdataLookupFilterService,
				objectMainUnitService, basicsLookupdataConfigGenerator, platformUserInfoService, basicsClerkUtilitiesService, platformModuleNavigationService, objectMainUnitInstallmentDataService, platformModalGridConfigService, basicsConfigDataConfigurationDialogDataService, platformGridControllerService
				){
				basicsLookupdataLookupFilterService.registerFilter([
					{
						key: 'bill-rubric-category-by-rubric-filter',
						fn: function (rubricCategory /* , entity */) {
							return rubricCategory.RubricFk === 7;
						}
					},{
						key: 'object-unit-installment-by-agreement-filter',
						fn: function (installment /* , entity */) {
							return installment.InstallmentagreementFk < 1000007;
						}
					},
					{
						key: 'object-main-rubric-bill-category-lookup-filter',
						serverKey: 'rubric-category-by-rubric-company-lookup-filter',
						serverSide: true,
						fn: function (entity) {
							return { Rubric: 7 };//7 is rubric for Bill.
						}
					}
				]);

				function validateSelectedRubricCategory(entity) {
					entity.ObjectUnitBill.BillNo = $translate.instant('sales.common.isGenerated');
				}

				let serviceContainer = {data: {}, service: {}};

				serviceContainer.service.createObjectUnitBill = function createObjectUnitBill() {
					let title = $translate.instant('object.main.titelObjectUnitBill');
					let selectedMainUnitService = objectMainUnitService.getSelected();
					let selectedUnits = objectMainUnitService.getSelectedEntities();
					let selectedUnitInstallment = objectMainUnitInstallmentDataService.getSelected();
					let handleOK = function () {
						return function (result) {
							$http.post(globals.webApiBaseUrl + 'object/main/unit/execute', result.data)
								.then(function (response) {
										function provideExternalSystemGridLayout() {
											var dataConfigurationColumnGridColumns =
												[
													{
														id: 'UnitName',
														field: 'UnitName',
														name: 'UnitName',
														formatter: 'code',
														width: 150,
														name$tr$: 'object.main.objectUnitName'
													},
													{
														id: 'Success',
														field: 'Success',
														name: 'Success',
														formatter: 'boolean',
														width: 50,
														name$tr$: 'object.main.success'
													},
													{
														id: 'BillName',
														field: 'BillName',
														name: 'BillName',
														formatter: 'code',
														width: 150,
														name$tr$: 'object.main.billName'
													},
													{
														id: 'Message',
														field: 'Message',
														name: 'Message',
														formatter: 'code',
														width: 200,
														name$tr$: 'object.main.message'
													}
												];

											platformGridControllerService.addValidationAutomatically(dataConfigurationColumnGridColumns, null);

											return {
												uuid: '4564ec0f92224c678914b55ab054a5fa',
												columns: dataConfigurationColumnGridColumns,
												tools: {
													showTitles: false,
													cssClass: 'tools',
													items: null,
												}
											};
										}

										function provideColumnInformationConfig() {
											var gridLayout = provideExternalSystemGridLayout();

											return {
												title: $translate.instant('object.main.titelObjectUnitBill'),
												getDataItems: function getDataItems() {
													return response.data.CreatedBill;
												},
												gridConfiguration: gridLayout,
												handleOK: function handleOK() {
												}
											};
										}

										var modalExternalSystemCredentialsConfig = provideColumnInformationConfig();
										platformModalGridConfigService.showDialog(modalExternalSystemCredentialsConfig);
									},
								function (/* error */) {
								});
						};
					};

					let validationCheck = function (modalCreateCalendarConfig) {
						return modalCreateCalendarConfig.dataItem.ObjectUnitBill.BillNo === '' ||
							modalCreateCalendarConfig.dataItem.ObjectUnitBill.ClerkFk === null || modalCreateCalendarConfig.dataItem.ObjectUnitBill.ContractTypeFk === null ||
							modalCreateCalendarConfig.dataItem.ObjectUnitBill.InstallmentFk === null;
					};

					function provideObjectUnitBill() {
						let billUnits = [];
							_.forEach(selectedUnits, function (unit) {
								billUnits.push( ' ' + unit.Code);
						});

						let selectedUnit = objectMainUnitService.getSelected();
						return {
							RubricCategoryFk: 0,
							ProjectFk: selectedUnit.Header.ProjectFk,
							BusinesspartnerFk: selectedUnit.BusinessPartner02Fk,
							SubsidiaryFk: selectedUnit.Subsidiary02Fk,
							CustomerFk: selectedUnit.Customer02Fk,
							DescriptionInfo: {
								Translated: selectedUnit.Description
							},
							ObjUnitFk: selectedUnit.Id,
							BillNo: '',
							BilledUnits: billUnits,
							InstallmentAgreementFk: selectedMainUnitService.InstallmentAgreementFk,
							InstallmentFk: null,
							ExchangeRate: 0,
							ClerkFk: null,
							ContractTypeFk: null,
							StructureType: 1,
							IsCanceled: false,
							Price: selectedMainUnitService.Price,
							TaxCodeFk: selectedMainUnitService.TaxCodeFk
						};
					}

					if (selectedMainUnits().selectedUnitFlag) {
						if (!!selectedMainUnitService.BusinessPartner02Fk && !!selectedMainUnitService.Customer02Fk) {
							let action = 2;

							let userId = _.get(platformUserInfoService.getCurrentUserInfo(), 'UserId', -1);
							// user id -> clerk
							basicsClerkUtilitiesService.getClerkByUserId(userId).then(function (clerk) {
								modalCreateCalendarConfig.dataItem.ObjectUnitBill.ClerkFk = clerk && clerk.IsLive ? clerk.Id : 0;
							});

							$http.post(globals.webApiBaseUrl + 'basics/customize/projectcontracttype/list').then(function (response) {
								let res = _.find(response.data, {IsDefault: true});
								if (!_.isNil(res)) {
									modalCreateCalendarConfig.dataItem.ObjectUnitBill.ContractTypeFk = res.Id;
								} else {
									modalCreateCalendarConfig.dataItem.ObjectUnitBill.ContractTypeFk = null;
								}
							});

							let modalCreateCalendarConfig = {
								title: title,
								dataItem: {
									Action: action,
									Units: selectedUnits,
									ObjectUnitBill: provideObjectUnitBill()
								},
								formConfiguration: {
									fid: 'object.main.DescriptionInfoModal',
									version: '0.2.4',
									showGrouping: false,
									groups: [
										{
											gid: 'baseGroup',
											attributes: [
												'ObjectUnitBill.RubricCategoryFk',
												'ObjectUnitBill.BillNo',
												'ObjectUnitBill.ClerkFk',
												'ObjectUnitBill.ContractTypeFk'
											]
										}
									],
									rows: [
										{
											gid: 'baseGroup',
											rid: 'RubricCategoryFk',
											model: 'ObjectUnitBill.RubricCategoryFk',
											required: true,
											sortOrder: 1,
											label$tr$: 'object.main.entityBillRubric',
											label: 'Bill Rubric Category',
											validator: validateSelectedRubricCategory,
											type: 'directive',
											directive: 'basics-lookupdata-lookup-composite',
											options: {
												lookupDirective: 'basics-lookupdata-rubric-category-by-rubric-and-company-lookup',
												descriptionMember: 'Description',
												lookupOptions: {
													filterKey: 'object-main-rubric-bill-category-lookup-filter',
													showClearButton: true
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
											rid: 'Code',
											model: 'ObjectUnitBill.BillNo',
											label$tr$: 'sales.billing.entityBillNo',
											type: 'code',
											sortOrder: 2,
											required: true,
											readonly: true
										},
										{
											gid: 'baseGroup',
											rid: 'ClerkFk',
											model: 'ObjectUnitBill.ClerkFk',
											label$tr$: 'sales.common.entityClerkFk',
											type: 'directive',
											directive: 'basics-lookupdata-lookup-composite',
											options: {
												lookupDirective: 'cloud-clerk-clerk-dialog',
												descriptionMember: 'Description',
												lookupOptions: {
													showClearButton: false
												}
											},
											sortOrder: 3,
											required: true
										},
										basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('project.main.contracttype', 'Description', {
											gid: 'baseGroup',
											rid: 'ContractTypeFk',
											model: 'ObjectUnitBill.ContractTypeFk',
											label$tr$: 'sales.common.entityContracttypeFk',
											sortOrder: 4,
											required: true
										}),
										basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.installment', 'Description', {
											gid: 'baseGroup',
											rid: 'InstallmentFk',
											model: 'ObjectUnitBill.InstallmentFk',
											label$tr$: 'object.main.entityInstallmentFk',
											sortOrder: 5,
											required: true,
										},false,
											{
											filterKey: 'basics-installment-filter'
										}
										),
										{
											gid: 'baseGroup',
											rid: 'BilledUnits',
											model: 'ObjectUnitBill.BilledUnits',
											label$tr$: 'object.main.billedUnits',
											type: 'comment',
											sortOrder: 6,
											required: true
										}
									]
								},
								dialogOptions: {
									//disableOkButton: validationCheck()
									disableOkButton: function () {
										return validationCheck(modalCreateCalendarConfig);
									}
								},
								handleOK: handleOK(function () {
								})
							};

							const recorded = 1;
							if (_.isNil(selectedUnitInstallment) && selectedUnits.length >= 1) {
								var data = [];
								_.forEach(selectedUnits, function (unit) {
									data.push({PKey1:unit.Id});
								});
								$http.post(globals.webApiBaseUrl + 'object/main/unitinstallment/listbyparents', data).then(function (response) {
									_.forEach(selectedUnits, function (unit) {
										let unitInstallments = _.filter(response.data, function (item) {
											return item.InstallmentAgreementStateFk === recorded && item.UnitFk === unit.Id;
										});
										let unitInstallment = _.min(unitInstallments, function (item) {
											return item.Id;
										});
										if (!_.isNil(unitInstallment)) {
											modalCreateCalendarConfig.dataItem.ObjectUnitBill.InstallmentFk = unitInstallment.InstallmentFk;
											if(_.isNil(modalCreateCalendarConfig.dataItem.UnitInstallment)){
												modalCreateCalendarConfig.dataItem.UnitInstallment=[];
											}
											modalCreateCalendarConfig.dataItem.UnitInstallment.push(unitInstallment);
										} else {
											modalCreateCalendarConfig.dataItem.ObjectUnitBill.InstallmentFk = null;
											modalCreateCalendarConfig.dataItem.ObjectUnitBill.UnitInstallment = null;
										}
									});
								});
							} else {
								if(selectedUnitInstallment.InstallmentAgreementStateFk === 1){
									modalCreateCalendarConfig.dataItem.ObjectUnitBill.InstallmentFk = selectedUnitInstallment.InstallmentFk;
									modalCreateCalendarConfig.dataItem.UnitInstallment = [selectedUnitInstallment];
								}
							}
							platformTranslateService.translateFormConfig(modalCreateCalendarConfig.formConfiguration);
							platformModalFormConfigService.showDialog(modalCreateCalendarConfig);
						} else {
							// Error MessageText
							let modalErrorOptions = {
								headerText: $translate.instant(title),
								bodyText: $translate.instant('object.main.billNoBusinessPartnerAndCustomer'),
								iconClass: 'ico-info'
							};
							platformModalService.showDialog(modalErrorOptions);
						}
					} else {
						// Error MessageText
						let modalOptions = {
							headerText: $translate.instant(title),
							bodyText: selectedMainUnits().errorMessage,
							iconClass: 'ico-info'
						};
						platformModalService.showDialog(modalOptions);
					}

					function selectedMainUnits(){
						let selectedUnitFlag = true;
						let errorMessage= '';
						_.forEach(selectedUnits, function (unit) {
							_.forEach(selectedUnits, function (item) {
								if(unit.InstallmentAgreementFk !== item.InstallmentAgreementFk){
									selectedUnitFlag = false;
									errorMessage = $translate.instant('object.main.noCurrentSelection');
								}
								if(_.isNil(unit.InstallmentAgreementFk)){
									selectedUnitFlag = false;
									errorMessage = $translate.instant('object.main.selectInstallationAgreement');
								}
								if(_.isNil(item.BusinessPartner02Fk)){
									selectedUnitFlag = false;
									errorMessage = $translate.instant('object.main.billNoBusinessPartnerAndCustomer');
								}
								if(_.isNil(item.Customer02Fk)){
									selectedUnitFlag = false;
									errorMessage = $translate.instant('object.main.billNoBusinessPartnerAndCustomer');
								}
							});
						});
						return { selectedUnitFlag, errorMessage };
					}

				};
				return serviceContainer.service;
			}
		]);
})(angular);
