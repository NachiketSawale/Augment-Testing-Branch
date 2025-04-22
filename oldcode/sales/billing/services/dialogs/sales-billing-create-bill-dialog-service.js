/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'sales.billing';
	var salesBillingModule = angular.module(moduleName);

	salesBillingModule.factory('salesBillingCreateBillDialogService', ['_', 'globals', '$q', '$injector', '$translate', '$http', 'platformRuntimeDataService', 'platformContextService', 'platformTranslateService', 'platformModalFormConfigService', 'basicsLookupdataConfigGenerator', 'platformUserInfoService', 'basicsLookupdataSimpleLookupService', 'basicsClerkUtilitiesService', 'salesBillingFilterService', 'salesBillingValidationService', 'cloudDesktopPinningContextService', 'salesBillingNumberGenerationSettingsService', 'salesCommonDataHelperService', 'salesBillTypeLookupDataService',
		function (_, globals, $q, $injector, $translate, $http, platformRuntimeDataService, platformContextService, platformTranslateService, platformModalFormConfigService, basicsLookupdataConfigGenerator, platformUserInfoService, basicsLookupdataSimpleLookupService, basicsClerkUtilitiesService, salesBillingFilterService, salesBillingValidationService, cloudDesktopPinningContextService, salesBillingNumberGenerationSettingsService, salesCommonDataHelperService, salesBillTypeLookupDataService) {

			function createDialog(modalCreateProjectConfig) {
				platformTranslateService.translateFormConfig(modalCreateProjectConfig.formConfiguration);
				return platformModalFormConfigService.showDialog(modalCreateProjectConfig);
			}

			var service = {},
				// default item init values
				initDataItem = {};
			let customizingData = null;
			let defaultSalesTax = null;
			let defaultContractCondition = null;
			let defaultBank = null;
			let defaultVoucher = null;
			let billInvoiceTypeLookup = $injector.get('salesBillingInvoiceTypeLookupOptions');
			function getDefaultBillingType() {
				return salesBillTypeLookupDataService.getDefaultAsync();
			}

			function suggestPreviousBillId(contractId) {
				return salesCommonDataHelperService.suggestPreviousBillId(contractId);
			}

			function getDefaultCustomerInformationByContract(contractId) {
				return $http.post(globals.webApiBaseUrl + 'sales/contract/getdefaultcustomerinfo?ordHeaderId=' + contractId);

			}

			// lookup configs
			// - Billing Type
			function validateSelectedType(entity, typeId) {
				salesBillTypeLookupDataService.getItemByIdAsync(typeId).then(function (typeEntity) {
					// no previous bill on single invoice (by default, not read only for now)
					if (typeEntity.IsSingle) {
						entity.PreviousBillFk = null;
					} else if (entity.OrdHeaderFk > 0) {
						// if contract selected => suggest previous bill
						suggestPreviousBillId(entity.OrdHeaderFk)
							.then(function successCallback(response) {
								var previousBillId = response.data;
								if (previousBillId > 0) {
									entity.PreviousBillFk = previousBillId;
								}
							}, function errorCallback(/* response */) {
								/* insert error handling here */
							});
					}
					// populate related values like rubric category
					var rubricCategoryId = typeEntity.RubricCategoryFk;
					entity.RubricCategoryFk = rubricCategoryId;
					onRubricCategoryChanged(entity, rubricCategoryId);
				});
			}

			service.validateSelectedType = validateSelectedType;

			// - Configuration
			function setDefaultConfigurationByRubricCategory(rubricCat) {
				$injector.get('salesCommonDataHelperService').getSalesConfigurations().then(function (data) {
					var items = _.filter(data, {RubricCategoryFk: rubricCat});
					if (_.size(items) > 0) {
						initDataItem.ConfigurationFk = _.get(_.find(items, {IsDefault: true}), 'Id') || _.first(items).Id;
						validateSelectedConfiguration(initDataItem, initDataItem.ConfigurationFk);
						//Todo :  When Configurable dialog is activated
						if ($injector.get('salesBillingService').isConfigurableDialog()) {
							configuredDataItem.ConfigurationFk = _.get(_.find(items, {IsDefault: true}), 'Id') || _.first(items).Id;
						}
					}
				});
			}

			// - Rubric Category
			function onRubricCategoryChanged(entity, value) {
				var hasToBeGenerated = salesBillingNumberGenerationSettingsService.hasToGenerateForRubricCategory(value);
				// TODO: better if validation method will be triggered instead and includes this case "is generated" as a valid case
				$injector.get('salesCommonUtilsService').deleteFromErrorList(entity, 'BillNo');
				platformRuntimeDataService.readonly(entity, [{
					field: 'BillNo',
					readonly: hasToBeGenerated
				}]);
				entity.BillNo = salesBillingNumberGenerationSettingsService.provideNumberDefaultText(value, entity.BillNo);

				// reset configuration id
				setDefaultConfigurationByRubricCategory(value);
			}
			service.onRubricCategoryChanged = onRubricCategoryChanged;

			// Configuration
			function validateSelectedConfiguration(entity, value) {
				var lookupItem = $injector.get('basicsLookupdataLookupDescriptorService').getLookupItem('prcconfiguration', value);
				let defaultBilInvoiceFromCustomizing = null;
				let billInvoiceTypeLookup = $injector.get('salesBillingInvoiceTypeLookupOptions');
				basicsLookupdataSimpleLookupService.getDefault(billInvoiceTypeLookup).then(function (defaultInvoiceTypeItem) {
					defaultBilInvoiceFromCustomizing = _.get(defaultInvoiceTypeItem, 'Id') || null;
				});
				platformRuntimeDataService.readonly(entity, [{field: 'ContractTypeFk', readonly: lookupItem !== null}]);
				// approach if we un-select configuration then it will take contract type from selected project
				entity.ContractTypeFk = lookupItem ? lookupItem.PrjContractTypeFk !== null ? lookupItem.PrjContractTypeFk : (customizingData.project ? customizingData.project.ContractTypeFk !== null ? customizingData.project.ContractTypeFk:customizingData.defaultContractTypeId : customizingData.defaultContractTypeId): (customizingData.project ? customizingData.project.ContractTypeFk !== null ? customizingData.project.ContractTypeFk:customizingData.defaultContractTypeId : customizingData.defaultContractTypeId);
				entity.PaymentTermFk = lookupItem ? lookupItem.PaymentTermPaFk !== null ? lookupItem.PaymentTermPaFk : (customizingData.project ? customizingData.project.PaymentTermPaFk !== null ? customizingData.project.PaymentTermPaFk:null:null):(customizingData.project ? customizingData.project.PaymentTermPaFk !== null ? customizingData.project.PaymentTermPaFk:null : null);
				entity.InvoiceTypeFk = !_.isNull(lookupItem.BilInvoiceTypeFk) ? lookupItem.BilInvoiceTypeFk : defaultBilInvoiceFromCustomizing;
				if (!_.isNull(value)) {
					$injector.get('$http').get(globals.webApiBaseUrl + 'basics/billingschema/common/getdefaultbillingschema', {params: {configurationFk: value}}).then(function(response) {
						entity.BillingSchemaFk = response.data;
					});
				}
				else if(_.isNull(value) && !_.isNull(customizingData.project)) {
					if (!_.isNull(customizingData.project.BillingSchemaFk)) {
						entity.BillingSchemaFk = customizingData.project.BillingSchemaFk;
					}
				}
				else {
					entity.BillingSchemaFk = null;
				}
			}
			service.validateSelectedConfiguration = validateSelectedConfiguration;

			var billingTypeLookupConfig = basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm(
				'basics.customize.billtype',
				'Description',
				{
					gid: 'baseGroup',
					rid: 'typeFk',
					model: 'TypeFk',
					required: true,
					sortOrder: 2,
					label$tr$: 'sales.billing.entityBillTypeFk',
					validator: validateSelectedType
					// asyncValidator: salesBillingValidationService.asyncValidateRubricCategoryFk
				},
				false, // caution: this parameter is ignored by the function
				{
					required: true,
					customIntegerProperty: 'BAS_RUBRIC_CATEGORY_FK',
					filterKey: 'sales-billing-type-with-rubric-filter'
				}
			);

			service.resetToDefault = function (dataItem) {
				var context = platformContextService.getContext(),
					userId = _.get(platformUserInfoService.getCurrentUserInfo(), 'UserId', -1),
					// project id from pinning context if available
					pinnedProjectId = $injector.get('projectMainPinnableEntityService').getPinned();

				// default item init values
				initDataItem = {
					// company defaulted with the login company, never shown in the ui
					CompanyFk: context.clientId,
					// ui fields
					OrdHeaderFk: null,
					PreviousBillFk: null,
					BillNo: '',
					Description: '',
					TypeFk: 0,
					RubricCategoryFk: 0,
					ResponsibleCompanyFk: context.signedInClientId,
					ClerkFk: 0,
					ProjectFk: null,
					ContractTypeFk: 0,
					BusinesspartnerFk: null,
					SubsidiaryFk: null,
					CustomerFk: null,
					InvoiceTypeFk:null
				};
				// make rubric category readonly (after billing type was introduced)
				platformRuntimeDataService.readonly(initDataItem, [{field: 'RubricCategoryFk', readonly: true}]);

				if (_.isObject(dataItem)) {
					initDataItem = angular.extend(dataItem, initDataItem);
				}

				if (_.isObject(configuredDataItem) && $injector.get('salesContractService').isConfigurableDialog()) {
					initDataItem = angular.extend(initDataItem, configuredDataItem);
				}

				return $q.all({
					clerkByUserId: salesCommonDataHelperService.getClerkIdByUserId(userId),
					defaultRubricCatId: salesCommonDataHelperService.getDefaultRubricCategoryId(7),   // 7 = Customer Billing ([BAS_RUBRIC])
					salesConfigs: salesCommonDataHelperService.getSalesConfigurations(),
					project: salesCommonDataHelperService.getProjectById(pinnedProjectId),
					defaultContractTypeId: salesCommonDataHelperService.getDefaultContractTypeId(),
					typeEntity: getDefaultBillingType(),
					defaultBilInvoiceFromCustomizing: basicsLookupdataSimpleLookupService.getDefault(billInvoiceTypeLookup).then(defaultInvoiceTypeItem => _.get(defaultInvoiceTypeItem, 'Id', null))
				}).then(function (data) {

					var items = _.filter(data.salesConfigs, {RubricCategoryFk: data.defaultRubricCatId});
					var configId = (_.size(items) > 0) ? _.get(_.find(items, {IsDefault: true}), 'Id') || _.first(items).Id : null;
					initDataItem.ConfigurationFk = configId;
					var salesConfigLookupItem = configId ? $injector.get('basicsLookupdataLookupDescriptorService').getLookupItem('prcconfiguration', configId) : null;
					customizingData = data;
					let BilInvoiceType = !_.isNil(items[0]) ? items[0].BilInvoiceTypeFk : null;
					if (data.project) {
						// take over basics settings from project when project available
						angular.extend(initDataItem, {
							ProjectFk: data.project.Id,
							// Set Company Responsible from Project ---> "Profit Center"
							ResponsibleCompanyFk: data.project.CompanyResponsibleFk,
							// Set Value for Congigured Dialog
							CompanyResponsibleFk: data.project.CompanyResponsibleFk,
							BusinesspartnerFk: data.project.BusinessPartnerFk,
							SubsidiaryFk: data.project.SubsidiaryFk,
							CustomerFk: data.project.CustomerFk,
							BillingSchemaFk:data.project.BillingSchemaFk,
							CurrencyFk:data.project.CurrencyFk,
							DateEffective:data.project.DateEffective,
							LanguageFk:data.project.LanguageContractFk,
							ClerkFk : data.project.ClerkFk,
							ContractTypeFk: salesConfigLookupItem ? salesConfigLookupItem.PrjContractTypeFk !== null ? salesConfigLookupItem.PrjContractTypeFk : (data.project ? data.project.ContractTypeFk !== null ? data.project.ContractTypeFk:data.defaultContractTypeId : data.defaultContractTypeId): data.defaultContractTypeId
						});
					}
					if ($injector.get('salesBillingService').isConfigurableDialog()) {

						// todo: Set Default Billing Schema from config if not then from Project
						if (!_.isNull(initDataItem.ConfigurationFk)) {
							$http.get(globals.webApiBaseUrl + 'basics/billingschema/common/getdefaultbillingschema', {params: {configurationFk: initDataItem.ConfigurationFk}}).then(function(response) {
								configuredDataItem.BillingSchemaFk = response.data;
							});
						}
						else if(_.isNull(initDataItem.ConfigurationFk) && !_.isNull(data.project)) {
							if (!_.isNull(data.project.BillingSchemaFk)) {
								configuredDataItem.BillingSchemaFk = data.project.BillingSchemaFk;
							}
						}

						// todo: Set Default TaxCodeFk Schema from Company
						$http.get(globals.webApiBaseUrl + 'basics/company/getCompanyById', {params: {companyId: initDataItem.CompanyFk}}).then(function(response) {
							configuredDataItem.TaxCodeFk = _.get(response, 'data.TaxCodeFk') || null;
						});

						// todo: Set Default VatGroupFk Schema from customer
						$injector.get('$http').get(globals.webApiBaseUrl + 'businesspartner/main/customer/list?mainItemId=' + initDataItem.BusinesspartnerFk).then(function (resp){
							configuredDataItem.VatGroupFk = _.get(resp, 'data.Main[0].VatGroupFk') || null;
						});

						// todo: Set Default SalesTaxMethodFk from customizing
						$http.post(globals.webApiBaseUrl + 'basics/customize/SalesTaxMethod/list' + '').then(function (result) {
							defaultSalesTax =_.find(result.data,{IsDefault:true,IsLive:true});
							configuredDataItem.BasSalesTaxMethodFk = _.get(defaultSalesTax, 'Id') || null;
						});

						// todo: Set Default Contractual Condition from customizing
						$http.post(globals.webApiBaseUrl + 'basics/customize/OrderCondition/list' + '').then(function (res) {
							defaultContractCondition =_.find(res.data,{IsDefault:true,IsLive:true});
							configuredDataItem.OrdConditionFk = _.get(defaultContractCondition, 'Id') || null;
						});

						// todo: Set Default ExchangeRate as 1
						$http.get(globals.webApiBaseUrl + 'sales/common/exchangerate/rate', {params: {companyId: initDataItem.CompanyFk,currencyForeignId:initDataItem.CurrencyFk,projectId:initDataItem.ProjectFk,throwException:''}}).then(function(response) {
							configuredDataItem.ExchangeRate = response.data;
						});

						// todo: Set Default Bank
						$http.get(globals.webApiBaseUrl + 'businesspartner/main/bank/list?mainItemId=' + configuredDataItem.BusinesspartnerFk ).then(function (res) {
							defaultBank = _.find(res.data.Main,{IsDefault:true,IsLive:true});
							configuredDataItem.BankFk = _.get(defaultBank, 'Id') || null;
						});

						// get default billing/invoice type
						configuredDataItem.InvoiceTypeFk = data.defaultBilInvoiceFromCustomizing;

						// todo: Set current date as Default BillDate & DatePosted
						configuredDataItem.BillDate = $injector.get('moment').utc(Date.now());
						configuredDataItem.DatePosted = $injector.get('moment').utc(Date.now());

						// todo: Set Default payment data from config otherwise from project if no config
						configuredDataItem.PaymentTermFk = salesConfigLookupItem ? salesConfigLookupItem.PaymentTermPaFk !== null ? salesConfigLookupItem.PaymentTermPaFk : (data.project ? data.project.PaymentTermPaFk !== null ? data.project.PaymentTermPaFk:null:null):null;
					}

					// BIL_INVOICE_TYPE from selected configuration -> default from customizing
					initDataItem.InvoiceTypeFk = !_.isNil(BilInvoiceType) ? BilInvoiceType : data.defaultBilInvoiceFromCustomizing;

					// config? -> project? -> default (from customizing)
					initDataItem.ContractTypeFk = salesConfigLookupItem ? salesConfigLookupItem.PrjContractTypeFk !== null ? salesConfigLookupItem.PrjContractTypeFk : (data.project ? data.project.ContractTypeFk !== null ? data.project.ContractTypeFk:data.defaultContractTypeId : data.defaultContractTypeId): data.defaultContractTypeId;

					// project clerk? => user id -> clerk
					initDataItem.ClerkFk = (data.project) ? data.project.ClerkFk : data.clerkByUserId;

					// set default rubric category
					if (data.typeEntity) {
						initDataItem.RubricCategoryFk = data.defaultRubricCatId;
						onRubricCategoryChanged(initDataItem, initDataItem.RubricCategoryFk);
					}

					// set default billing type
					initDataItem.TypeFk = _.get(data, 'typeEntity.Id') || initDataItem.TypeFk;

					return initDataItem;
				});
			};

			service.resetToDefault();

			salesBillingFilterService.registerBillingFilters();

			service.getCopyOfInitDataItem = function getCopyOfInitDataItem() {
				if ($injector.get('salesBillingService').isConfigurableDialog()) {
					return angular.copy(configuredDataItem);
				} else {
					return angular.copy(initDataItem);
				}
			};

			var configuredDataItem = {};

			service.extendDataItem = function extendDataItem(extendedDataItem) {
				configuredDataItem = extendedDataItem;
			};

			service.getCreationDataFromDataItem = function getCreationDataFromDataItem(dataItem) {
				var newBill = dataItem;
				var creationData = {
					BillNo: newBill.BillNo,
					Description: newBill.DescriptionInfo ? newBill.DescriptionInfo.Translated : newBill.Description,
					OrdHeaderFk: newBill.OrdHeaderFk,
					PreviousBillFk: newBill.PreviousBillFk,
					TypeFk: newBill.TypeFk,
					RubricCategoryFk: newBill.RubricCategoryFk,
					ResponsibleCompanyFk: newBill.ResponsibleCompanyFk,
					ClerkFk: newBill.ClerkFk,
					ProjectFk: newBill.ProjectFk,
					ContractTypeFk: newBill.ContractTypeFk,
					BusinesspartnerFk: newBill.BusinesspartnerFk,
					SubsidiaryFk: newBill.SubsidiaryFk,
					CustomerFk: newBill.CustomerFk,
					CompanyFk: newBill.CompanyFk,
					ConfigurationId: newBill.ConfigurationFk,
					ControllingUnitFk: newBill.ControllingUnitFk,
					InvoiceTypeFk: newBill.InvoiceTypeFk,
					BankFk: newBill.BankFk,
					PerformedTo: newBill.PerformedTo,
					PerformedFrom: newBill.PerformedFrom,
					BillingSchemaFk: newBill.BillingSchemaFk,
					ReferenceStructured: newBill.ReferenceStructured,
					BookingText: newBill.BookingText,
					RelatedBillHeaderFk: newBill.RelatedBillHeaderFk,
					ObjUnitFk: newBill.ObjUnitFk,
					OrdConditionFk: newBill.OrdConditionFk,
					PrcStructureFk: newBill.PrcStructureFk,
					ContactFk: newBill.ContactFk,
					BusinesspartnerBilltoFk: newBill.BusinesspartnerBilltoFk,
					ContactBilltoFk: newBill.ContactBilltoFk,
					SubsidiaryBilltoFk: newBill.SubsidiaryBilltoFk,
					CustomerBilltoFk: newBill.CustomerBilltoFk,
					DateNetpayable: newBill.DateNetpayable,
					DateDiscount: newBill.DateDiscount,
					PaymentTermFk: newBill.PaymentTermFk,
					Remark: newBill.Remark,
					CommentText: newBill.CommentText,
					UserDefined1: newBill.UserDefined1,
					UserDefined2: newBill.UserDefined2,
					UserDefined3: newBill.UserDefined3,
					UserDefined4: newBill.UserDefined4,
					UserDefined5: newBill.UserDefined5,
					UserDefinedDate01: newBill.UserDefinedDate01,
					UserDefinedDate02: newBill.UserDefinedDate02,
					UserDefinedDate03: newBill.UserDefinedDate03,
					UserDefinedDate04: newBill.UserDefinedDate04,
					UserDefinedDate05: newBill.UserDefinedDate05
				};
				return creationData;
			};

			service.init = function init(dataItem) {
				angular.extend(initDataItem, dataItem);
			};

			service.ordHeaderChangedHandler = function ordHeaderChangedHandler(e, args,value) {
				var selectedItem = args.entity;
				var selectedLookupItem = args.selectedItem;
				let salesCommonCreateDialogService = $injector.get('salesCommonCreateDialogService');

				// pre-assign project from selected contract
				if (selectedItem && selectedLookupItem) {
					selectedItem.ProjectFk = selectedLookupItem.ProjectFk;
					selectedItem.ContractTypeFk = selectedLookupItem.ContractTypeFk;

					// populate previous bill if possible
					if (selectedLookupItem.Id > 0) {
						salesBillTypeLookupDataService.getItemByIdAsync(selectedItem.TypeFk).then(function (typeEntity) {
							if (!typeEntity.IsSingle) {
								suggestPreviousBillId(selectedLookupItem.Id)
									.then(function successCallback(response) {
										var previousBillId = response.data;
										if (previousBillId > 0) {
											selectedItem.PreviousBillFk = previousBillId;
										}
									}, function errorCallback(/* response */) {
										/* insert error handling here */
									});
							}
						});

						getDefaultCustomerInformationByContract(selectedLookupItem.Id)
							.then(function successCallback(response) {
								var responseData = response.data;
								selectedItem.BusinesspartnerFk = responseData.BusinesspartnerFk;
								selectedItem.SubsidiaryFk = responseData.SubsidiaryFk;
								selectedItem.CustomerFk = responseData.CustomerFk;

								if (!responseData.IsDiverseDebitorsAllowed) {
									setCustomerInfoReadonly(selectedItem);
								}
							}, function errorCallback(/* response */) {
								/* insert error handling here */
							});
					}
				}
				if (_.isNull(selectedLookupItem)) {
					let lookupItem = $injector.get('basicsLookupdataLookupDescriptorService').getLookupItem('prcconfiguration', value);
					selectedItem.ContractTypeFk = lookupItem ? lookupItem.PrjContractTypeFk !== null ? lookupItem.PrjContractTypeFk : (customizingData.project ? customizingData.project.ContractTypeFk !== null ? customizingData.project.ContractTypeFk:customizingData.defaultContractTypeId : customizingData.defaultContractTypeId): (customizingData.project ? customizingData.project.ContractTypeFk !== null ? customizingData.project.ContractTypeFk:customizingData.defaultContractTypeId : customizingData.defaultContractTypeId);
				}
				let salesCommonFunctionalRoleService = $injector.get('salesCommonFunctionalRoleService');
				salesCommonFunctionalRoleService.hasExecutePermission(selectedLookupItem, getDescriptor()).then(function (hasPermission) {
					salesCommonFunctionalRoleService.updateFunctionalRoleRestrictionInfo(hasPermission);
				});
			};

			service.projectSelectedItemChangedHandler = function onSelectedItemChangedHandler(e, args) {
				var projectId = _.get(args, 'selectedItem.Id');
				var _configFk = initDataItem.ConfigurationFk;
				if (_configFk === null || _configFk === '' || _configFk === undefined) {
					salesCommonDataHelperService.getProjectById(projectId).then(function (project) {
						if (_.has(project, 'ContractTypeFk') && _.has(args, 'entity.ContractTypeFk') && _.get(project, 'ContractTypeFk') !== null) {
							customizingData.project = project;
							args.entity.ContractTypeFk = _.get(project, 'ContractTypeFk');
						} else {
							$injector.get('salesCommonStatusHelperService').getDefaultContractType(args.entity);
						}
					});
				}
				salesCommonDataHelperService.getProjectById(projectId).then(function (project) {
					let items = _.filter(customizingData.salesConfigs, {RubricCategoryFk: customizingData.defaultRubricCatId});
					let configId = (_.size(items) > 0) ? _.get(_.find(items, {IsDefault: true}), 'Id') || _.first(items).Id : null;
					let salesConfigLookupItem = configId ? $injector.get('basicsLookupdataLookupDescriptorService').getLookupItem('prcconfiguration', configId) : null;
					if (_.has(project, 'BusinessPartnerFk') && _.has(args, 'entity.BusinesspartnerFk')) {
						args.entity.BusinesspartnerFk = _.get(project, 'BusinessPartnerFk');
					}
					if (_.has(project, 'SubsidiaryFk') && _.has(args, 'entity.SubsidiaryFk')) {
						args.entity.SubsidiaryFk = _.get(project, 'SubsidiaryFk');
					}
					if (_.has(project, 'CustomerFk') && _.has(args, 'entity.CustomerFk')) {
						args.entity.CustomerFk = _.get(project, 'CustomerFk');
					}
					if (_.has(project, 'ContractTypeFk') && _.has(args, 'entity.ContractTypeFk')) {
						customizingData.project = project;
						args.entity.ContractTypeFk = _.get(project, 'ContractTypeFk');
					}
					if (_.has(project, 'PaymentTermFiFk') && _.has(args, 'entity.PaymentTermFk')) {
						args.entity.PaymentTermFk = salesConfigLookupItem ? salesConfigLookupItem.PaymentTermFiFk !== null ? salesConfigLookupItem.PaymentTermFiFk : (customizingData.project ? customizingData.project.PaymentTermFiFk !== null ? customizingData.project.PaymentTermFiFk:null:null):null;
					}
					if (_.has(project, 'BillingSchemaFk') && _.has(args, 'entity.BillingSchemaFk')) {
						if (!_.isNull(args.entity.ConfigurationFk)) {
							$injector.get('$http').get(globals.webApiBaseUrl + 'basics/billingschema/common/getdefaultbillingschema', {params: {configurationFk: args.entity.ConfigurationFk}}).then(function(response) {
								args.entity.BillingSchemaFk = response.data;
							});
						}
						else if(_.isNull(args.entity.ConfigurationFk) && !_.isNull(customizingData.project)) {
							if (!_.isNull(customizingData.project.BillingSchemaFk)) {
								args.entity.BillingSchemaFk = customizingData.project.BillingSchemaFk;
							}
						}
					}
					if (_.has(project, 'CompanyResponsibleFk') && _.has(args, 'entity.CompanyResponsibleFk')) {
						args.entity.CompanyResponsibleFk = _.get(project, 'CompanyResponsibleFk');
					}
					if (_.has(project, 'CurrencyFk') && _.has(args, 'entity.CurrencyFk')) {
						args.entity.CurrencyFk = _.get(project, 'CurrencyFk');
					}
					if (_.has(project, 'DateEffective') && _.has(args, 'entity.DateEffective')) {
						args.entity.DateEffective = _.get(project, 'DateEffective');
					}
					if (_.has(project, 'LanguageContractFk') && _.has(args, 'entity.LanguageFk')) {
						args.entity.LanguageFk = _.get(project, 'LanguageContractFk');
					}
					if (_.has(project, 'ClerkFk') && _.has(args, 'entity.ClerkFk')) {
						args.entity.ClerkFk = _.get(project, 'ClerkFk');
					}
				});
			};

			service.getFormConfig = function getFormConfig() {
				return {

					fid: 'sales.billing.createBillModal',
					version: '0.1.0',
					showGrouping: false,
					groups: [
						{
							gid: 'baseGroup',
							attributes: [
								'ordheaderfk', 'previousbillfk', 'typefk', 'rubriccategoryfk', 'companyresponsiblefk', 'projectfk', 'ordstatusfk',
								'billno', 'clerkfk', 'businesspartnerfk', 'subsidiaryfk', 'customerfk', 'billingschemafk', 'paymenttermfk', 'billingtypefk'
							]
						}
					],
					rows: [

						// Contract
						{
							gid: 'baseGroup',
							rid: 'ordheaderfk',
							model: 'OrdHeaderFk',
							sortOrder: 0,
							label: 'Contract',
							label$tr$: 'sales.common.Contract',
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'sales-common-contract-dialog-v2',
								descriptionMember: 'DescriptionInfo.Translated',
								lookupOptions: {
									filterKey: 'sales-billing-contract-filter-by-server',
									showClearButton: true,
									events: [
										{
											name: 'onSelectedItemChanged',
											handler: service.ordHeaderChangedHandler
										}
									],
									dialogOptions: {
										alerts: [{
											theme: 'info',
											message: $injector.get('salesCommonStatusHelperService').getInfoMsgOnlyOrderedContracts()
										}]
									}
								}
							}
						},
						// (previous) Bill
						{
							gid: 'baseGroup',
							rid: 'bilheaderfk',
							model: 'PreviousBillFk',
							sortOrder: 1,
							label: 'Previous Bill',
							label$tr$: 'sales.common.PreviousBill',
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'sales-common-bill-dialog-v2',
								descriptionMember: 'DescriptionInfo.Translated',
								lookupOptions: {
									filterKey: 'sales-billing-previousbill-filter-by-server',
									showClearButton: true,
									events: [
										{
											name: 'onSelectedItemChanged',
											handler: function (e, args) {
												var selectedItem = args.entity;
												var selectedLookupItem = args.selectedItem;

												// pre-assign project from selected bill
												if (selectedItem && selectedLookupItem) {
													selectedItem.ProjectFk = selectedLookupItem.ProjectFk;
													selectedItem.OrdHeaderFk = selectedLookupItem.OrdHeaderFk;
												}
											}
										}
									]
								}
							}
						},
						// Billing Type
						billingTypeLookupConfig,
						// Rubric Category
						{
							gid: 'baseGroup',
							rid: 'rubricCategoryFk',
							model: 'RubricCategoryFk',
							required: true,
							sortOrder: 3,
							label$tr$: 'project.main.entityRubric',
							label: 'Category',
							validator: onRubricCategoryChanged,
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
						// Sales Configuration
						{
							gid: 'baseGroup',
							rid: 'configurationfk',
							label: 'Configuration',
							label$tr$: 'sales.common.entityConfigurationFk',
							type: 'directive',
							model: 'ConfigurationFk',
							directive: 'basics-configuration-configuration-combobox',
							options: {
								filterKey: 'sales-billing-configuration-filter',
								showClearButton: true
							},
							validator: validateSelectedConfiguration
						},
						// BillNo
						{
							gid: 'baseGroup',
							rid: 'billno',
							label$tr$: 'sales.billing.entityBillNo',
							model: 'BillNo',
							required: true,
							type: 'code',
							sortOrder: 4,
							asyncValidator: function (entity, value) {
								return $injector.get('salesBillingValidationHelperService').asyncValidateBillNo(entity.CompanyFk, value);
							}
						},
						// Description
						{
							gid: 'baseGroup',
							rid: 'description',
							label$tr$: 'cloud.common.entityDescription',
							model: 'Description',
							type: 'description',
							sortOrder: 5
						},
						// company Responsible
						basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm(
							{
								dataServiceName: 'salesBidCompanyLookupDataService',
								enableCache: true,
								filter: function (item) {
									return item.CompanyFk;
								}
							},
							{
								gid: 'baseGroup',
								rid: 'responsibleCompanyFk',
								model: 'ResponsibleCompanyFk',
								required: true,
								sortOrder: 6,
								label$tr$: 'sales.common.entityCompanyResponsibleFk',
								validator: salesBillingValidationService.validateCompanyResponsibleFk
							}
						),
						// Clerk
						{
							gid: 'baseGroup',
							rid: 'clerkFk',
							model: 'ClerkFk',
							required: true,
							sortOrder: 7,
							label: 'Clerk',
							label$tr$: 'basics.clerk.entityClerk',
							validator: salesBillingValidationService.validateClerkFk,
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
						// Project
						{
							gid: 'baseGroup',
							rid: 'projectfk',
							model: 'ProjectFk',
							required: true,
							sortOrder: 8,
							label: 'Project Name',
							label$tr$: 'cloud.common.entityProjectName',
							type: 'directive',
							validator: salesBillingValidationService.validateProjectFk,
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'basics-lookup-data-project-project-dialog',
								descriptionMember: 'ProjectName',
								lookupOptions: {
									initValueField: 'ProjectNo',
									showClearButton: false,
									filterKey: 'sales-common-project-filterkey',
									events: [{
										name: 'onSelectedItemChanged',
										handler: service.projectSelectedItemChangedHandler
									}]
								}
							}
						},
						// Contract Type
						basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
							dataServiceName: 'basicContractTypeLookupDataService',
							filterKey: 'sales-common-project-contract-type-lookup-filter',
							enableCache: true
						},
						{
							gid: 'baseGroup',
							rid: 'contractTypeFk',
							model: 'ContractTypeFk',
							required: true,
							sortOrder: 9,
							label$tr$: 'sales.common.entityContracttypeFk',
							validator: salesBillingValidationService.validateContractTypeFk
						}),
						// Businesspartner
						$injector.get('salesCommonLookupConfigsService').BusinessPartnerLookUpConfigForForm('salesBillingService', 'salesBillingValidationService'),
						// Subsidiary
						basicsLookupdataConfigGenerator.provideElaboratedLookupConfigForForm('business-partner-main-subsidiary-lookup', 'Subsidiary', 'AddressLine', false,
							{
								gid: 'baseGroup',
								rid: 'subsidiaryfk',
								model: 'SubsidiaryFk',
								required: true,
								validator: salesBillingValidationService.validateBusinesspartnerFk,
								sortOrder: 11,
								label: 'Subsidiary',
								label$tr$: 'cloud.common.entitySubsidiary'
							}, 'sales-common-subsidiary-filter'
						),
						// Customer
						{
							gid: 'baseGroup',
							rid: 'customerfk',
							model: 'CustomerFk',
							sortOrder: 12,
							required: true,
							label: 'Customer',
							label$tr$: 'sales.common.entityCustomerFk',
							type: 'directive',
							validator: salesBillingValidationService.validateCustomerFk,
							asyncValidator: salesBillingValidationService.asyncValidateCustomerFk,
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'business-partner-main-customer-lookup',
								descriptionMember: 'BusinessPartnerName1',
								lookupOptions: {
									showClearButton: true,
									filterKey: 'sales-common-customer-filter'
								}
							}
						}
					]
				};
			};

			service.validateDataItem = function validateDataItem(dataItem) {
				// is valid?
				return dataItem.TypeFk !== 0 && dataItem.TypeFk !== null &&
					dataItem.RubricCategoryFk !== 0 && dataItem.RubricCategoryFk !== null &&
					dataItem.BillNo !== null && dataItem.BillNo !== '' && !$injector.get('platformRuntimeDataService').hasError(dataItem, 'BillNo') &&
					dataItem.ProjectFk !== null && dataItem.ProjectFk !== 0 &&
					dataItem.ClerkFk !== null && dataItem.ClerkFk !== 0 &&
					dataItem.ContractTypeFk !== null && dataItem.ContractTypeFk !== 0 &&
					dataItem.BusinesspartnerFk !== null && dataItem.BusinesspartnerFk !== 0 &&
					dataItem.SubsidiaryFk !== null && dataItem.SubsidiaryFk !== 0 &&
					dataItem.CustomerFk !== null && dataItem.CustomerFk !== 0;
			};

			service.showDialog = function createBill(onCreateFn, readOnlyRows) {

				var isValid = function () {
					var dataItem = modalCreateBillConfig.dataItem;
					return service.validateDataItem(dataItem);
				};

				var modalCreateBillConfig = {
					title: $translate.instant('sales.billing.createBillTitle'),
					dataItem: initDataItem,
					dialogOptions: {
						disableOkButton: function disableOkButton(/* modelOptions */) {
							return !isValid();
						}
					},
					formConfiguration: service.getFormConfig(),
					handleOK: function handleOK(result) {
						var newBill = result.data;
						var creationData = service.getCreationDataFromDataItem(newBill);

						if (_.isFunction(onCreateFn)) {
							onCreateFn(creationData);
						}
					}
				};

				// apply field read only extensions, if available
				var rows = modalCreateBillConfig.formConfiguration.rows;
				_.each(readOnlyRows, function (rowName) {
					var row = _.find(rows, {rid: rowName});
					if (row) {
						row.readonly = true;
					}
				});

				return createDialog(modalCreateBillConfig);
			};

			function setCustomerInfoReadonly(selectedItem) {
				var fields = [{field: 'BusinesspartnerFk', readonly: true}, {field: 'SubsidiaryFk', readonly: true}];
				platformRuntimeDataService.readonly(selectedItem, fields);
				if (selectedItem.CustomerFk && selectedItem.CustomerFk > 0) {
					platformRuntimeDataService.readonly(selectedItem, [{field: 'CustomerFk', readonly: true}]);
				}
			}
			function getDescriptor() {
				return 'b812ea3d7dd64b3aa97387395d70b82d';
			}
			return service;

		}]);
})();
