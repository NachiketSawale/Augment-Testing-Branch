(function (angular) {
	/* global globals, $, _ */
	'use strict';

	/**
	 * @ngdoc factory
	 * @name basics.company.services:basicsCompanyCreationService
	 * @description
	 * Provides wizard configuration and implementation of all basics company related functionality.
	 *
	 * @example
	 * <div paltform-layout initial-layout="name of layout", layout-options="options"></div>
	 */
	angular.module('basics.company').service('basicsCompanyCreationService', BasicsCompanyCreationService);


	BasicsCompanyCreationService.$inject = ['$translate', 'platformModalService',
		'platformSidebarWizardCommonTasksService', '$http', 'platformTranslateService', 'platformModalFormConfigService',
		'basicsLookupdataConfigGenerator', 'platformDataValidationService'];

	function BasicsCompanyCreationService($translate, platformModalService,
																				platformSidebarWizardCommonTasksService, $http, platformTranslateService, platformModalFormConfigService, basicsLookupdataConfigGenerator, platformDataValidationService) {

		const service = {};
		let basicsCompanyMainService = null;
		let basicsCompanyMainData = null;

		function assignCompanyAndData(service, data) {
			if (!basicsCompanyMainService) {
				basicsCompanyMainService = service;

				basicsCompanyMainData = data ? data : service.getInternalData();
			}
		}

		function determineChildType(selectedCompany) {
			var parentCompany = basicsCompanyMainService.getItemById(selectedCompany.CompanyFk);
			if(parentCompany && parentCompany.CompanyTypeFk === 2) {
				return 1;
			}

			if(!parentCompany) {
				return 2;
			}

			return 3;
		}

		function determineParentId(selectedCompany, useParent) {
			if(selectedCompany) {
				if(useParent) {
					return selectedCompany.CompanyFk;
				}

				return selectedCompany.Id;
			}

			return null;
		}

		async function provideCreationData(selectedCompany, useParent) {
			if (selectedCompany) {
				return {
					parentid: determineParentId(selectedCompany, useParent),
					parent: !useParent ? selectedCompany : null,
					Code: "",
					clerkfk: null,
					loginallowed: false,
					companyname: null,
					companyname2: null,
					companyname3: null,
					countryfk: selectedCompany.CountryFk,
					CompanyTypeFk: determineChildType(selectedCompany),
					addressfk: null,
					telephonenumberfk: null,
					telephonetelefaxfk: null,
					email: null,
					internet: null,
					currencyfk: selectedCompany.CurrencyFk,
					languagefk: selectedCompany.LanguageFk,
					profitcenter: null,
					dunsno: null,
					externalcode: null,
					islive: true,
					contextfk: selectedCompany.ContextFk,
					schedulingcontextfk: selectedCompany.SchedulingContextFk,
					hsqcontextfk: selectedCompany.HsqContextFk,
					lineitemcontextfk: selectedCompany.LineItemContextFk,
					ledgercontextfk: selectedCompany.LedgerContextFk,
					subledgercontextfk: selectedCompany.SubledgerContextFk,
					modulecontextfk: selectedCompany.ModuleContextFk,
					textmodulecontextfk: selectedCompany.TextModuleContextFk,
					resourcecontextfk: selectedCompany.ResourceContextFk,
					equipmentcontextfk: selectedCompany.EquipmentContextFk,
					defectcontextfk: selectedCompany.DefectContextFk,
					timesheetcontextfk: selectedCompany.TimesheetContextFk,
					logisticcontextfk: selectedCompany.LogisticContextFk,
					projectcontextfk: selectedCompany.ProjectContextFk,
					priceconditionfk: selectedCompany.PriceConditionFk,
					equipmentdivisionfk: selectedCompany.EquipmentDivisionFk,
					isribarchive: selectedCompany.IsRibArchive,
					iscalculateovergross: selectedCompany.IsCalculateOverGross,
					prrmethodfk: selectedCompany.PrrMethodFk,
					isrestrictedtoprofitcenter: selectedCompany.IsRestrictedToProfitCenter,
					issequencebasedonprofitcenter: selectedCompany.IsSequenceBasedOnProfitCenter,
				};
			} else {
				try {
					const response = await $http.get(globals.webApiBaseUrl + "basics/company/logincompany");
					if (response && response.data) {
						return {
							parentid: null,
							parent: null,
							code: "",
							clerkfk: null,
							loginallowed: false,
							companyname: null,
							companyname2: null,
							companyname3: null,
							countryfk: response.data.CountryFk,
							CompanyTypeFk: 2,// Group
							addressfk: null,
							telephonenumberfk: null,
							telephonetelefaxfk: null,
							email: null,
							internet: null,
							currencyfk: response.data.CurrencyFk,
							languagefk: response.data.LanguageFk,
							profitcenter: null,
							dunsNo: null,
							externalcode: null,
							isLive: true,
							contextfk: response.data.ContextFk,
							schedulingcontextfk: response.data.SchedulingContextFk,
							hsqcontextfk: response.data.HsqContextFk,
							lineitemcontextfk: response.data.LineItemContextFk,
							ledgercontextfk: response.data.LedgerContextFk,
							subledgercontextfk: response.data.SubledgerContextFk,
							modulecontextfk: response.data.ModuleContextFk,
							textmodulecontextfk: response.data.TextModuleContextFk,
							resourcecontextfk: response.data.ResourceContextFk,
							equipmentcontextfk: response.data.EquipmentContextFk,
							defectcontextfk: response.data.DefectContextFk,
							timesheetcontextfk: response.data.TimesheetContextFk,
							logisticcontextfk: response.data.LogisticContextFk,
							projectcontextfk: response.data.ProjectContextFk,
							priceconditionfk: response.data.PriceConditionFk,
							equipmentdivisionfk: response.data.EquipmentDivisionFk,
							isribarchive: response.data.IsRibArchive,
							iscalculateovergross: response.data.IsCalculateOverGross,
							prrmethodfk: response.data.PrrMethodFk,
							isrestrictedtoprofitcenter: response.data.IsRestrictedToProfitCenter,
							issequencebasedonprofitcenter: response.data.IsSequenceBasedOnProfitCenter,
						};
					}
				} catch (error) {
					console.error("Error fetching login company data:", error);
					return null; // Handle errors gracefully
				}
			}
		}


		/*Company*/
		async function getCompanyModalCreateConfig(selectedCompany, useParent) {
			return provideCreationData(selectedCompany, useParent).then(function (result) {
				return {
					title: $translate.instant('basics.company.entityCreateCompany'),
					dataItem: result, // Ensure data is ready,
					dialogOptions: {
						disableOkButton: function disableOkButton() {
							const requiredFields = [
								"Code",
								"countryfk",
								"currencyfk",
								"languagefk",
								"contextfk",
								"lineitemcontextfk",
								"ledgercontextfk",
								"subledgercontextfk",
								"modulecontextfk",
								"textmodulecontextfk",
								"equipmentcontextfk",
								"logisticcontextfk",
								"equipmentdivisionfk"
							];

							return requiredFields.some(field => !this.dataItem[field]);
						},
					},
					formConfiguration: {
						fid: 'basics.company.entityCompany',
						version: '1.0.0',
						showGrouping: true,
						groups: [
							{
								gid: 'baseGroup',
								header$tr$: 'cloud.common.entityProperties',
								'isOpen': true,
								'visible': true,
							},
							{
								gid: 'masterDataPool',
								header$tr$: 'basics.company.entitymasterDataPool',
								'isOpen': true,
								'visible': true,
							}
						],
						rows: [
							{
								gid: 'baseGroup',
								rid: 'code',
								label: 'Code',
								label$tr$: 'cloud.common.entityCode',
								type: 'code',
								visible: true,
								sortOrder: 1,
								model: 'Code',
								required: true,
								validator: function (entity, value, model) {
									let items = basicsCompanyMainService.getList();
									let res = platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, items, service, basicsCompanyMainService);
									if (res.valid) {
										if (entity && entity.__rt$data && entity.__rt$data.errors) {
											if (entity.__rt$data.errors.code === null || entity.__rt$data.errors.code) {
												delete entity.__rt$data.errors.code;
												delete entity.__rt$data.errors;
											}
										}
									}
									return res;
								}
							},
							{
								gid: 'baseGroup',
								rid: 'loginallowed',
								label: 'Login Allowed',
								label$tr$: 'basics.common.entityLoginAllowed',
								type: 'boolean',
								visible: true,
								sortOrder: 2,
								model: 'loginallowed',
								required: true,
							},
							{
								gid: 'baseGroup',
								rid: 'clerkFk',
								model: 'clerkfk',
								sortOrder: 3,
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
							},
							basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.company.type', '',
								{
									gid: 'baseGroup',
									rid: 'companytypefk',
									label: 'Company Type',
									label$tr$: 'basics.company.entityCompanyTypeFk',
									type: 'integer',
									model: 'CompanyTypeFk',
									required: true,
									readonly: false,
									sortOrder: 4
								}, false, {
									filterKey: 'basics-company-type-filter',
								}),
							{
								gid: 'baseGroup',
								rid: 'companyname',
								label: 'Company Name',
								label$tr$: 'basics.company.entityName',
								type: 'description',
								visible: true,
								sortOrder: 5,
								model: 'companyname'
							},
							{
								gid: 'baseGroup',
								rid: 'companyname2',
								label: 'Company Name2',
								label$tr$: 'basics.company.entityCompanyName2',
								type: 'description',
								visible: true,
								sortOrder: 6,
								model: 'companyname2'
							},
							{
								gid: 'baseGroup',
								rid: 'companyname3',
								label: 'Company Name3',
								label$tr$: 'basics.company.entityCompanyName3',
								type: 'description',
								visible: true,
								sortOrder: 7,
								model: 'companyname3'
							},
							basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
								dataServiceName: 'basicsCountrySortByDescriptionLookupDataService',
								showClearButton: true
							}, {
								gid: 'baseGroup',
								rid: 'countryfk',
								label: 'Country',
								label$tr$: 'basics.company.entityCountry',
								type: 'integer',
								model: 'countryfk',
								required: true,
								sortOrder: 8,
							}),
							{
								gid: 'baseGroup',
								rid: 'address',
								model: 'AddressFk',
								label: 'Address',
								label$tr$: 'cloud.common.entityAddress',
								type: 'directive',
								directive: 'basics-common-address-dialog',
								options: {
									titleField: 'cloud.common.entityAddress',
									foreignKey: 'AddressFk',
									showClearButton: true
								},
								sortOrder: 9
							},
							{
								gid: 'baseGroup',
								rid: 'telephonenumberfk',
								model: 'TelephoneNumberFk',
								label: 'TelephoneNumber',
								label$tr$: 'cloud.common.telephoneNumber',
								type: 'directive',
								directive: 'basics-common-telephone-dialog',
								options: {
									titleField: 'cloud.common.telephoneNumber',
									foreignKey: 'TelephoneNumberFk',
									showClearButton: true
								},
								sortOrder: 10
							},
							{
								gid: 'baseGroup',
								rid: 'telephonetelefaxfk',
								model: 'TelephoneTelefaxFk',
								label: 'Fax',
								label$tr$: 'cloud.common.fax',
								type: 'directive',
								directive: 'basics-common-telephone-dialog',
								options: {
									titleField: 'cloud.common.fax',
									foreignKey: 'telephoneTelefaxFk',
									showClearButton: true
								},
								sortOrder: 11
							},
							{
								gid: 'baseGroup',
								rid: 'email',
								model: 'Email',
								label: 'Email',
								label$tr$: 'cloud.common.email',
								type: 'directive',
								directive: 'basics-common-email-input',
								options: {
									domainType: 'email'
								},
								sortOrder: 12
							},
							{
								gid: 'baseGroup',
								rid: 'internet',
								label: 'Internet',
								label$tr$: 'basics.company.entityInternet',
								type: 'url',
								visible: true,
								sortOrder: 13,
								model: 'internet'
							},
							basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
								dataServiceName: 'basicsCurrencyLookupDataService',
							}, {
								gid: 'baseGroup',
								rid: 'currencyfk',
								label: 'Currency',
								label$tr$: 'basics.company.entityCurrencyFk',
								type: 'money',
								model: 'currencyfk',
								required: true,
								sortOrder: 14,
							}),
							basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.lookup.language', '',
								{
									gid: 'baseGroup',
									rid: 'languagefk',
									label: 'Language',
									label$tr$: 'basics.company.entityLanguageFk',
									type: 'integer',
									model: 'languagefk',
									required: true,
									sortOrder: 15
								}),
							{
								gid: 'baseGroup',
								rid: 'profitcenter',
								label: 'Profit Center',
								label$tr$: 'basics.company.entityProfitcenter',
								type: 'description',
								visible: true,
								sortOrder: 16,
								model: 'profitcenter'
							},
							{
								gid: 'baseGroup',
								rid: 'dunsno',
								label: 'Duns No',
								label$tr$: 'basics.company.dunsNo',
								type: 'description',
								visible: true,
								sortOrder: 17,
								model: 'dunsno'
							},
							{
								gid: 'baseGroup',
								rid: 'externalcode',
								label: 'External Code',
								label$tr$: 'basics.company.externalCode',
								type: 'description',
								visible: true,
								sortOrder: 18,
								model: 'externalcode',
								maxlength: 252
							},
							{
								gid: 'baseGroup',
								rid: 'islive',
								label: 'Is Live',
								label$tr$: 'cloud.common.entityIsLive',
								type: 'boolean',
								visible: true,
								sortOrder: 19,
								model: 'islive',
								required: true,
							},
							basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.masterdatacontext', '',
								{
									gid: 'masterDataPool',
									rid: 'contextfk',
									label: 'Master Data Context',
									label$tr$: 'basics.company.entityContextFk',
									type: 'integer',
									model: 'contextfk',
									required: true,
									sortOrder: 1
								}),
							basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.schedulecontext', '',
								{
									gid: 'masterDataPool',
									rid: 'schedulingcontextfk',
									label: 'Scheduling Context',
									label$tr$: 'basics.company.entitySchedulingContextFk',
									type: 'integer',
									model: 'schedulingcontextfk',
									sortOrder: 2
								}),
							basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.hsqecontext', '',
								{
									gid: 'masterDataPool',
									rid: 'hsqcontextfk',
									label: 'entityHsqContextFk',
									label$tr$: 'basics.company.entityHsqContextFk',
									type: 'integer',
									model: 'hsqcontextfk',
									sortOrder: 3
								}),
							basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.lineitemcontext', '',
								{
									gid: 'masterDataPool',
									rid: 'lineitemcontextfk',
									label: 'Line Item Context',
									label$tr$: 'basics.company.entityLineItemContextFk',
									type: 'integer',
									model: 'lineitemcontextfk',
									required: true,
									sortOrder: 4
								}),
							basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.ledgercontext', '',
								{
									gid: 'masterDataPool',
									rid: 'ledgercontextfk',
									label: 'Ledger-Context',
									label$tr$: 'basics.company.entityMdcLedgerContextFk',
									type: 'integer',
									model: 'ledgercontextfk',
									required: true,
									sortOrder: 5
								}),
							basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.subledgercontext', '',
								{
									gid: 'masterDataPool',
									rid: 'subledgercontextfk',
									label: 'Subledger-Context',
									label$tr$: 'basics.company.entityBpdSubledgerContextFk',
									type: 'integer',
									model: 'subledgercontextfk',
									required: true,
									sortOrder: 6
								}),
							basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.modulecontext', '',
								{
									gid: 'masterDataPool',
									rid: 'modulecontextfk',
									label: 'Module Context',
									label$tr$: 'basics.company.entityModuleContextFk',
									type: 'integer',
									model: 'modulecontextfk',
									required: true,
									sortOrder: 7
								}),
							basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.textmodulecontext', '',
								{
									gid: 'masterDataPool',
									rid: 'textmodulecontextfk',
									label: 'Textmodule-Context',
									label$tr$: 'basics.company.entityTextModuleContextFk',
									type: 'integer',
									model: 'textmodulecontextfk',
									required: true,
									sortOrder: 8
								}),
							basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.resourcecontext', '',
								{
									gid: 'masterDataPool',
									rid: 'resourcecontextfk',
									label: 'Resource Context',
									label$tr$: 'basics.company.entityResourceContextFk',
									type: 'integer',
									model: 'resourcecontextfk',
									sortOrder: 9
								}),
							basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.equipmentcontext', '',
								{
									gid: 'masterDataPool',
									rid: 'equipmentcontextfk',
									label: 'Plant Context',
									label$tr$: 'basics.company.entityEquipmentContextFk',
									type: 'integer',
									model: 'equipmentcontextfk',
									required: true,
									sortOrder: 10
								}),
							basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.defectcontext', '',
								{
									gid: 'masterDataPool',
									rid: 'defectcontextfk',
									label: 'Defect Context',
									label$tr$: 'basics.company.entityDefectContextFk',
									type: 'integer',
									model: 'defectcontextfk',
									sortOrder: 11
								}),
							basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.timesheetcontext', '',
								{
									gid: 'masterDataPool',
									rid: 'timesheetcontextfk',
									label: 'Timesheet Context',
									label$tr$: 'basics.company.entityTimesheetContextFk',
									type: 'integer',
									model: 'timesheetcontextfk',
									sortOrder: 12
								}),
							basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.logisticscontext', '',
								{
									gid: 'masterDataPool',
									rid: 'logisticcontextfk',
									label: 'Logistic Context',
									label$tr$: 'basics.company.entityLogisticContextFk',
									type: 'integer',
									model: 'logisticcontextfk',
									required: true,
									sortOrder: 13
								}),
							basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.projectcontext', '',
								{
									gid: 'masterDataPool',
									rid: 'projectcontextfk',
									label: 'Project Context',
									label$tr$: 'basics.company.entityProjectContextFk',
									type: 'integer',
									model: 'projectcontextfk',
									sortOrder: 14
								}),
							basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
								dataServiceName: 'logisticPriceConditionByContextLookupDataService',
								filter: function (selRecord) {
									if (selRecord) {
										return selRecord.logisticcontextfk;
									}
									return 0;
								}
							}, {
								gid: 'masterDataPool',
								rid: 'priceconditionfk',
								label: 'Price Condition',
								label$tr$: 'basics.company.entityPriceConditionFk',
								type: 'integer',
								model: 'priceconditionfk',
								sortOrder: 15,
							}),
							basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.equipmentdivision', '',
								{
									gid: 'masterDataPool',
									rid: 'equipmentdivisionfk',
									label: 'Plant Division',
									label$tr$: 'basics.company.equipmentDivision',
									type: 'integer',
									model: 'equipmentdivisionfk',
									required: true,
									sortOrder: 16
								}),
							{
								gid: 'masterDataPool',
								rid: 'isribarchive',
								label: 'Rib Archive',
								label$tr$: 'basics.company.entityIsRibArchive',
								type: 'boolean',
								visible: true,
								sortOrder: 17,
								model: 'isribarchive',
								required: true,
							},
							{
								gid: 'masterDataPool',
								rid: 'iscalculateovergross',
								label: 'Calculate Over Gross',
								label$tr$: 'basics.company.entityIsCalculateOverGross',
								type: 'boolean',
								visible: true,
								sortOrder: 18,
								model: 'iscalculateovergross',
								required: true,
							},
						]
					}
				};
			});
		}

		function handleOK(result) {
			let data = {
				Code: result.data.Code,
				ClerkFk: result.data.clerkfk,
				LoginAllowed: result.data.loginallowed,
				CompanyName: result.data.companyname,
				CompanyName2: result.data.companyname2,
				CompanyName3: result.data.companyname3,
				CountryFk: result.data.countryfk,
				CompanyTypeFk: result.data.CompanyTypeFk,
				AddressFk: result.data.addressfk,
				TelephoneNumberFk: result.data.telephonenumberfk,
				TelephoneTelefaxFk: result.data.telephonetelefaxfk,
				Email: result.data.email,
				Internet: result.data.internet,
				CurrencyFk: result.data.currencyfk,
				LanguageFk: result.data.languagefk,
				Profitcenter: result.data.profitcenter,
				DunsNo: result.data.dunsno,
				ExternalCode: result.data.externalcode,
				IsLive: result.data.islive,
				ContextFk: result.data.contextfk,
				SchedulingContextFk: result.data.schedulingcontextfk,
				HsqContextFk: result.data.hsqcontextfk,
				LineItemContextFk: result.data.lineitemcontextfk,
				LedgerContextFk: result.data.ledgercontextfk,
				SubledgerContextFk: result.data.subledgercontextfk,
				ModuleContextFk: result.data.modulecontextfk,
				TextModuleContextFk: result.data.textmodulecontextfk,
				ResourceContextFk: result.data.resourcecontextfk,
				EquipmentContextFk: result.data.equipmentcontextfk,
				DefectContextFk: result.data.defectcontextfk,
				TimesheetContextFk: result.data.timesheetcontextfk,
				LogisticContextFk: result.data.logisticcontextfk,
				ProjectContextFk: result.data.projectcontextfk,
				PriceConditionFk: result.data.priceconditionfk,
				EquipmentDivisionFk: result.data.equipmentdivisionfk,
				IsRibArchive: result.data.isribarchive,
				IsCalculateOverGross: result.data.iscalculateovergross,
				PrrMethodFk: result.data.prrmethodfk,
				IsRestrictedToProfitCenter: result.data.isrestrictedtoprofitcenter,
				IsSequenceBasedOnProfitCenter: result.data.issequencebasedonprofitcenter,
				ParentId: result.data.parentid
			};

			return $http.post(globals.webApiBaseUrl + 'basics/company/createfrominitialdata', data
			).then(function (response) {
				// platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage(modalCreateConfig.title);
				if (response && response.data) {
					return basicsCompanyMainData.onCreateSucceeded(response.data, basicsCompanyMainData, { parent: result.data.parent })
				}
			});
		}

		service.createCompany = function createCompany(service, data) {
			assignCompanyAndData(service, data);

			const selRecord = service.getSelected();
			return getCompanyModalCreateConfig(selRecord, true).then(function(modalCreateConfig) {
				modalCreateConfig.handleOK = handleOK;

				platformTranslateService.translateFormConfig(modalCreateConfig.formConfiguration);

				return platformModalFormConfigService.showDialog(modalCreateConfig);
			});
		};

		service.createChildCompany = function createChildCompany(service, data) {
			assignCompanyAndData(service, data);

			const selRecord = service.getSelected();
			return getCompanyModalCreateConfig(selRecord, false).then(function(modalCreateConfig) {

				modalCreateConfig.handleOK = handleOK;

				platformTranslateService.translateFormConfig(modalCreateConfig.formConfiguration);

				return platformModalFormConfigService.showDialog(modalCreateConfig);
			});
		}

		return service;
	}
})(angular);
