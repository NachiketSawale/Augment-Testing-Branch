/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'sales.wip';
	var salesWipModule = angular.module(moduleName);

	salesWipModule.factory('salesWipCreateWipDialogService', ['globals','PlatformMessenger', '$http', '_', '$injector', '$translate', 'platformModalService', 'platformDataValidationService', 'platformRuntimeDataService', 'platformContextService', 'platformTranslateService', 'platformModalFormConfigService', 'cloudDesktopPinningContextService', 'basicsLookupdataConfigGenerator', 'platformUserInfoService', 'basicsClerkUtilitiesService', 'basicsLookupdataLookupFilterService', 'salesWipValidationService', 'salesWipNumberGenerationSettingsService', 'salesBillingFilterService', 'salesBillingNumberGenerationSettingsService', 'salesCommonRubric', 'salesCommonDataHelperService',
		function (globals, PlatformMessenger, $http, _, $injector, $translate, platformModalService, platformDataValidationService, platformRuntimeDataService, platformContextService, platformTranslateService, platformModalFormConfigService, cloudDesktopPinningContextService, basicsLookupdataConfigGenerator, platformUserInfoService, basicsClerkUtilitiesService, basicsLookupdataLookupFilterService, salesWipValidationService, salesWipNumberGenerationSettingsService, salesBillingFilterService, salesBillingNumberGenerationSettingsService, salesCommonRubric, salesCommonDataHelperService) {

			// TODO: check in history why this function is unused, for now we comment this part
			// function createDialog(modalCreateProjectConfig) {
			//    platformTranslateService.translateFormConfig(modalCreateProjectConfig.formConfiguration);
			//    return platformModalFormConfigService.showDialog(modalCreateProjectConfig);
			// }

			var service = {},
				// default item init values
				initDataItem = {},
				rubricCategoryList = [],
				qtoHeaderId = -1,
				purposeType = null,
				isUpdate = false;
			let customizingData = null;
			let defaultSalesTax = null;

			// lookup configs
			// sales configuration
			function setDefaultConfigurationByRubricCategory(rubricCat) {
				$injector.get('salesCommonDataHelperService').getSalesConfigurations().then(function (data) {
					var items = _.filter(data, {RubricCategoryFk: rubricCat});
					if (_.size(items) > 0) {
						initDataItem.ConfigurationFk = _.get(_.find(items, {IsDefault: true}), 'Id') || _.first(items).Id;
						validateSelectedConfiguration(initDataItem, initDataItem.ConfigurationFk);
					}
				});
			}
			// Rubric Category
			function onRubricCategoryChanged(entity, value) {
				var hasToCreate = false;
				if (service.getPurposeType() === 'bill') { // bill is 7 ,wip is 17
					hasToCreate = salesBillingNumberGenerationSettingsService.hasToGenerateForRubricCategory(value);
					platformRuntimeDataService.readonly(entity, [{
						field: 'Code',
						readonly: hasToCreate
					}]);
					entity.Code = salesBillingNumberGenerationSettingsService.provideNumberDefaultText(value, entity.Code);

				} else {
					hasToCreate = salesWipNumberGenerationSettingsService.hasToGenerateForRubricCategory(value);
					platformRuntimeDataService.readonly(entity, [{
						field: 'Code',
						readonly: hasToCreate
					}]);
					entity.Code = salesWipNumberGenerationSettingsService.provideNumberDefaultText(value, entity.Code);
				}

				// reset configuration id
				setDefaultConfigurationByRubricCategory(value);
			}

			// Configuration
			function validateSelectedConfiguration(entity, value) {
				var lookupItem = $injector.get('basicsLookupdataLookupDescriptorService').getLookupItem('prcconfiguration', value);
				// approach if we un-select configuration then it will take contract type from selected project
				entity.ContractTypeFk = lookupItem ? lookupItem.PrjContractTypeFk !== null ? lookupItem.PrjContractTypeFk : (customizingData.project ? customizingData.project.ContractTypeFk !== null ? customizingData.project.ContractTypeFk:customizingData.defaultContractTypeId : customizingData.defaultContractTypeId): (customizingData.project ? customizingData.project.ContractTypeFk !== null ? customizingData.project.ContractTypeFk:customizingData.defaultContractTypeId : customizingData.defaultContractTypeId);
				entity.PaymentTermPaFk = lookupItem ? lookupItem.PaymentTermPaFk !== null ? lookupItem.PaymentTermPaFk : (customizingData.project ? customizingData.project.PaymentTermPaFk !== null ? customizingData.project.PaymentTermPaFk:null:null):(customizingData.project ? customizingData.project.PaymentTermPaFk !== null ? customizingData.project.PaymentTermPaFk:null : null);
				entity.PaymentTermFiFk = lookupItem ? lookupItem.PaymentTermFiFk !== null ? lookupItem.PaymentTermFiFk : (customizingData.project ? customizingData.project.PaymentTermFiFk !== null ? customizingData.project.PaymentTermFiFk:null:null):(customizingData.project ? customizingData.project.PaymentTermFiFk !== null ? customizingData.project.PaymentTermFiFk:null : null);
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

			service.onCodeChage = new PlatformMessenger();

			service.getPurposeType = function getPurposeType() {
				return purposeType;
			};
			service.setPurposeType = function setPurposeType(value) {
				purposeType = value;
			};
			service.getRubricCategoryList = function getRubricCategoryList() {
				return rubricCategoryList;
			};
			service.setRubricCategoryList = function setRubricCategoryList(value) {
				rubricCategoryList = value;
			};

			service.getQtoHeaderId = function getQtoHeaderId() {
				return qtoHeaderId;
			};

			service.setQtoHeaderId = function setQtoHeaderId(value) {
				qtoHeaderId = value;
			};

			service.cancelCodeFieldReadonly = function (entity) {
				platformRuntimeDataService.readonly(entity, [{
					field: 'Code',
					readonly: false
				}]);
				entity.Code = '';
			};

			service.getListByQtoHeaderId = function getListByQtoHeaderId() {
				let qtoHeaderFk = service.getQtoHeaderId();
				return $http.get(globals.webApiBaseUrl + 'qto/main/detail/GetListByQtoHeaderId?qtoHeaderId=' + qtoHeaderFk+'&type=wiporbill');
			};


			service.getQtoCountByWipId = function getQtoCountByWipId(wipId) {
				let qtoHeaderFk = service.getQtoHeaderId();
				return $http.get(globals.webApiBaseUrl + 'qto/main/detail/getQtoCountByWipId?qtoHeaderId=' + qtoHeaderFk+'&wipHeaderFk='+wipId);
			};


			service.setCodeFieldReadOnlyByRubricCategory = function (entity, rubricCatagoryId) {
				onRubricCategoryChanged(entity, rubricCatagoryId);
			};

			service.resetToDefault = function (dataItem) {
				var $q = $injector.get('$q'),
					context = platformContextService.getContext(),
					userId = _.get(platformUserInfoService.getCurrentUserInfo(), 'UserId', -1),
					// project id from pinning context if available
					pinnedProjectId = $injector.get('projectMainPinnableEntityService').getPinned();

				// default item init values
				initDataItem = {
					// company defaulted with the login company, never shown in the ui
					CompanyFk: context.clientId,
					// ui fields
					Code: '',
					Description: '',
					OrdHeaderFk: null,
					RubricCategoryFk: 0,
					ResponsibleCompanyFk: context.signedInClientId,
					ClerkFk: null,
					ProjectFk: null,
					ContractTypeFk: 0,
					updateWith: 1,
					TypeFk: 0
				};

				if (_.isObject(dataItem)) {
					initDataItem = angular.extend(dataItem, initDataItem);
				}

				if (_.isObject(configuredDataItem) && $injector.get('salesWipService').isConfigurableDialog()) {
					if (_.isObject(dataItem)) {
						initDataItem = angular.extend(dataItem, configuredDataItem);
					} else {
						initDataItem = angular.extend(initDataItem, configuredDataItem);
					}
				}

				return $q.all({
					clerkByUserId: salesCommonDataHelperService.getClerkIdByUserId(userId),
					defaultRubricCatId: salesCommonDataHelperService.getDefaultRubricCategoryId((service.getPurposeType() === 'bill') ? $injector.get('salesCommonRubric').Billing : $injector.get('salesCommonRubric').Wip),
					salesConfigs: salesCommonDataHelperService.getSalesConfigurations(),
					project: salesCommonDataHelperService.getProjectById(pinnedProjectId),
					defaultContractTypeId: salesCommonDataHelperService.getDefaultContractTypeId()
				}).then(function (data) {

					var items = _.filter(data.salesConfigs, {RubricCategoryFk: data.defaultRubricCatId});
					var configId = (_.size(items) > 0) ? _.get(_.find(items, {IsDefault: true}), 'Id') || _.first(items).Id : null;
					initDataItem.ConfigurationFk = configId;
					var salesConfigLookupItem = configId ? $injector.get('basicsLookupdataLookupDescriptorService').getLookupItem('prcconfiguration', configId) : null;
					customizingData = data;
					if (data.project) {
						// take over basics settings from project when project available
						angular.extend(initDataItem, {
							ProjectFk: data.project.Id,
							// Set Company Responsible from Project ---> "Profit Center"
							ResponsibleCompanyFk: data.project.CompanyResponsibleFk,
							// Set Value for Configured Dialog
							CompanyResponsibleFk: data.project.CompanyResponsibleFk,
							BusinesspartnerFk: data.project.BusinessPartnerFk,
							SubsidiaryFk: data.project.SubsidiaryFk,
							CustomerFk: data.project.CustomerFk,
							BillingSchemaFk:data.project.BillingSchemaFk,
							CurrencyFk:data.project.CurrencyFk,
							DateEffective:data.project.DateEffective,
							LanguageFk:data.project.LanguageContractFk,
							ClerkFk : data.project.ClerkFk,
							PaymentTermPaFk:data.project.PaymentTermPaFk,
							PaymentTermFiFk:data.project.PaymentTermFiFk,
							ContractTypeFk: salesConfigLookupItem ? salesConfigLookupItem.PrjContractTypeFk !== null ? salesConfigLookupItem.PrjContractTypeFk : (data.project ? data.project.ContractTypeFk !== null ? data.project.ContractTypeFk:data.defaultContractTypeId : data.defaultContractTypeId): data.defaultContractTypeId
						});
					}
					if ($injector.get('salesWipService').isConfigurableDialog()) {
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

						// todo: Set Default ExchangeRate as 1
						$http.get(globals.webApiBaseUrl + 'sales/common/exchangerate/rate', {params: {companyId: initDataItem.CompanyFk,currencyForeignId:initDataItem.CurrencyFk,projectId:initDataItem.ProjectFk,throwException:''}}).then(function(response) {
							configuredDataItem.ExchangeRate = response.data;
						});

						// todo: Set current date as Default Document date
						configuredDataItem.DocumentDate = $injector.get('moment').utc(Date.now());

						// todo: Set Default payment data from config otherwise from project if no config
						configuredDataItem.PaymentTermPaFk = salesConfigLookupItem ? salesConfigLookupItem.PaymentTermPaFk !== null ? salesConfigLookupItem.PaymentTermPaFk : (data.project ? data.project.PaymentTermPaFk !== null ? data.project.PaymentTermPaFk:null:null):null;
						configuredDataItem.PaymentTermFiFk = salesConfigLookupItem ? salesConfigLookupItem.PaymentTermFiFk !== null ? salesConfigLookupItem.PaymentTermFiFk : (data.project ? data.project.PaymentTermFiFk !== null ? data.project.PaymentTermFiFk:null:null):null;
					}

					// config? -> project? -> default (from customizing)
					initDataItem.ContractTypeFk = salesConfigLookupItem ? salesConfigLookupItem.PrjContractTypeFk !== null ? salesConfigLookupItem.PrjContractTypeFk : (data.project ? data.project.ContractTypeFk !== null ? data.project.ContractTypeFk:data.defaultContractTypeId : data.defaultContractTypeId): data.defaultContractTypeId;

					// project clerk? => user id -> clerk
					initDataItem.ClerkFk = (data.project) ? data.project.ClerkFk : data.clerkByUserId;

					// set default rubric category
					initDataItem.RubricCategoryFk = data.defaultRubricCatId;
					onRubricCategoryChanged(initDataItem, initDataItem.RubricCategoryFk);

					// check if default rubric cat is available in company category settings (If settings are available)
					var companyWipType = $injector.get('salesWipService').getCompanyCategoryList();
					if (companyWipType.length > 0) {
						var filteredData = _.filter(companyWipType, {'RubricCategoryFk': data.defaultRubricCatId});
						if (filteredData.length === 0) {
							initDataItem.RubricCategoryFk = null;
						}
					}

					return initDataItem;
				});
			};

			service.resetToDefault();

			var configuredDataItem = {};

			service.extendDataItem = function extendDataItem(extendedDataItem) {
				configuredDataItem = extendedDataItem;
			};
			service.getInitDataItem = function getInitDataItem() {
				return initDataItem;
			};
			salesBillingFilterService.registerBillingFilters();

			// additional helper
			var orderedList = [];

			service.getOrderedList = function getOrderedList() {
				return orderedList;
			};

			basicsLookupdataLookupFilterService.registerFilter([
				{
					key: 'sales-wip-contract-filter-by-server',
					serverKey: 'sales-wip-contract-filter-by-server',
					serverSide: true,
					fn: function (wip) {
						return {
							ProjectId: wip.ProjectFk
						};
					}
				},
				{
					key: 'sales-wip-rubric-category-by-rubric-filter',
					serverKey: 'rubric-category-by-rubric-company-lookup-filter',
					serverSide: true,
					fn: function () {
						if (service.getPurposeType() === 'bill') {
							return { Rubric: salesCommonRubric.Billing };
						}
						return { Rubric: salesCommonRubric.Wip };
					}
				},
				{
					key: 'sales-wip-configuration-filter',
					serverSide: true,
					fn: function (entity) {
						var rubricCat = entity.RubricCategoryFk > 0 ? ' AND RubricCategoryFk=' + entity.RubricCategoryFk : '';
						return `RubricFk=${salesCommonRubric.Wip}${rubricCat}`;
					}
				},
				{
					key: 'sales-wip-create-wip-previouswip-filter',
					serverKey: 'sales-wip-previouswip-filter-by-server',
					serverSide: true,
					fn: function (dlgEntity  /*, state */) {
						var param = {};
						if (dlgEntity.ProjectFk > 0) {
							param.ProjectId = dlgEntity.ProjectFk;
						}
						if (dlgEntity.OrdHeaderFk > 0) {
							param.ContractId = dlgEntity.OrdHeaderFk;
						}
						return param;
					}
				}
			]);

			service.init = function init(dataItem) {
				angular.extend(initDataItem, dataItem);
			};

			service.getCopyOfInitDataItem = function getCopyOfInitDataItem() {
				if ($injector.get('salesWipService').isConfigurableDialog()) {
					return angular.copy(configuredDataItem);
				} else {
					return angular.copy(initDataItem);
				}
			};

			service.getCodeConfig = function getCodeConfig() {
				if (isUpdate) {
					return {
						gid: 'baseGroup',
						rid: 'code',
						label$tr$: 'cloud.common.entityCode',
						type: 'code', // set this as code type first, and it will be changed by option user check
						directive: 'sales-wip-code-grid-selector',
						// type: 'inputselect',
						options: {
							filterKey: 'qto-sales-wip-code-filter',
							valueMember: 'Code',
							displayMember: 'Code',
						},
						model: 'Code',
						sortOrder: 8,
						validator: salesWipValidationService.validateCode
					};
				} else {
					return {
						gid: 'baseGroup',
						rid: 'code',
						label$tr$: 'cloud.common.entityCode',
						model: 'Code',
						type: 'code',
						sortOrder: 8,
						asyncValidator: function (entity, value) {
							return $injector.get('salesWipValidationHelperService').asyncValidateCode(entity.CompanyFk, value);
						}
					};
				}
			};

			service.getBusinessPartnerConfig = function getBusinessPartnerConfig() {
				if (isUpdate) {
					return {
						gid: 'baseGroup',
						rid: 'businesspartnerfk',
						model: 'BusinessPartnerFk',
						label: 'Business Partner',
						label$tr$: 'sales.common.entityBusinesspartnerFk',
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'business-partner-main-business-partner-dialog',
							descriptionMember: 'Description',
							lookupOptions: {
								showClearButton: false
							}
						},
						sortOrder: 3,
						readonly: true
					};
				} else {
					return {};
				}
			};

			service.getBranchConfig = function getBranchConfig() {
				if (isUpdate) {
					return basicsLookupdataConfigGenerator.provideElaboratedLookupConfigForForm('business-partner-main-subsidiary-lookup', 'Subsidiary',
						'AddressLine', false, {
							gid: 'baseGroup',
							rid: 'subsidiaryfk',
							model: 'SubsidiaryFk',
							sortOrder: 4,
							label: 'Subsidiary',
							label$tr$: 'cloud.common.entitySubsidiary',
							readonly: true
						});
				} else {
					return {};
				}
			};

			service.getCustomerConfig = function getCustomerConfig() {
				if (isUpdate) {
					return {
						gid: 'baseGroup',
						rid: 'customerfk',
						model: 'CustomerFk',
						label: 'Customer',
						label$tr$: 'sales.common.entityCustomerFk',
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'business-partner-main-customer-lookup',
							descriptionField: 'BusinessPartnerName1',
							descriptionMember: 'BusinessPartnerName1',
							lookupOptions: {
								showClearButton: false
							}
						},
						sortOrder: 5,
						readonly: true
					};
				} else {
					return {};
				}
			};

			service.getIsOrdQuantityOnlyConfig = function getIsOrdQuantityOnlyConfig() {
				if (isUpdate) {
					return {
						gid: 'baseGroup',
						rid: 'isOrdQuantityOnly',
						label: 'Contract Quantities Only',
						label$tr$: 'qto.main.wizard.create.wip.IsOrdQuantityOnly',
						type: 'boolean',
						model: 'IsOrdQuantityOnly',
						sortOrder: 6
					};
				} else {
					return {};
				}
			};

			// grid contracts
			initDataItem.gridContracts = [];
			service.getContractsFromServer = function getContractsFromServer() {
				var $q = $injector.get('$q');
				var contractId = initDataItem.OrdHeaderFk;
				if (contractId > 0) {
					var defer = $q.defer();
					$http.get(globals.webApiBaseUrl + 'sales/contract/relatedcontracts?contractId=' + contractId).then(function (response) {
						initDataItem.gridContracts = response.data;
						_.each(initDataItem.gridContracts, $injector.get('SalesContractDocumentTypeProcessor').processItem);
						defer.resolve(response.data);
					});
					return defer.promise;
				} else {
					return $q.when([]);
				}
			};

			service.projectFkOnSelectedItemChangeHandler = function onSelectedItemChangedHandler(e, args) {
				var projectId = _.get(args, 'selectedItem.Id');
				var _configFk = initDataItem.ConfigurationFk;
				let items = _.filter(customizingData.salesConfigs, {RubricCategoryFk: customizingData.defaultRubricCatId});
				let configId = (_.size(items) > 0) ? _.get(_.find(items, {IsDefault: true}), 'Id') || _.first(items).Id : null;
				let salesConfigLookupItem = configId ? $injector.get('basicsLookupdataLookupDescriptorService').getLookupItem('prcconfiguration', configId) : null;
				if (_configFk === null || _configFk === '' || _configFk === undefined) {
					salesCommonDataHelperService.getProjectById(projectId).then(function (project) {
						if (_.has(project, 'ContractTypeFk') && _.has(args, 'entity.ContractTypeFk') && _.get(project, 'ContractTypeFk') !== null) {
							customizingData.project = project;
							args.entity.ContractTypeFk = _.get(project, 'ContractTypeFk');
						}
						else {
							$injector.get('salesCommonStatusHelperService').getDefaultContractType(args.entity);
						}
					});
				}
				salesCommonDataHelperService.getProjectById(projectId).then(function (project) {
					if (_.has(project, 'ContractTypeFk') && _.has(args, 'entity.ContractTypeFk') && _.get(project, 'ContractTypeFk') !== null) {
						customizingData.project = project;
						args.entity.ContractTypeFk = _.get(project, 'ContractTypeFk');
					}
					if (_.has(project, 'PaymentTermPaFk') && _.has(args, 'entity.PaymentTermPaFk')) {
						args.entity.PaymentTermPaFk = salesConfigLookupItem ? salesConfigLookupItem.PaymentTermFiFk !== null ? salesConfigLookupItem.PaymentTermFiFk : (customizingData.project ? customizingData.project.PaymentTermFiFk !== null ? customizingData.project.PaymentTermFiFk:null:null):null;
					}
					if (_.has(project, 'PaymentTermFiFk') && _.has(args, 'entity.PaymentTermFiFk')) {
						args.entity.PaymentTermFiFk = salesConfigLookupItem ? salesConfigLookupItem.PaymentTermFiFk !== null ? salesConfigLookupItem.PaymentTermFiFk : (customizingData.project ? customizingData.project.PaymentTermFiFk !== null ? customizingData.project.PaymentTermFiFk:null:null):null;
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
					fid: 'sales.wip.createWipModal',
					version: '0.0.1',
					showGrouping: false,
					groups: [
						{
							gid: 'baseGroup',
							attributes: [
								'ordheaderfk', 'previouswipfk', 'rubriccategoryfk', 'code', 'description', 'companyresponsiblefk',
								'clerkfk', 'projectfk', 'contracttypefk', 'performedfrom', 'performedto', 'typefk', 'previousbillfk'
							]
						}
					],
					rows: [
						// Contract
						{
							gid: 'baseGroup',
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
												initDataItem.OrdHeaderFk = selectedLookupItem.Id;
												// pre-assign project from selected contract
												if (selectedItem && selectedLookupItem) {
													selectedItem.ProjectFk = selectedLookupItem.ProjectFk;
													selectedItem.ContractTypeFk = selectedLookupItem.ContractTypeFk;
													selectedItem.BusinessPartnerFk = selectedLookupItem.BusinesspartnerFk;
													selectedItem.SubsidiaryFk = selectedLookupItem.SubsidiaryFk;
													selectedItem.CustomerFk = selectedLookupItem.CustomerFk;

													// suggest the previous wip
													$injector.get('salesCommonDataHelperService').suggestPreviousWipId(selectedLookupItem.Id).then(function (response) {
														if (response && response.data) {
															if (response.data > 0) {
																selectedItem.PrevWipHeaderFk = response.data;
															}
														}
													});
												}
												let salesCommonFunctionalRoleService = $injector.get('salesCommonFunctionalRoleService');
												salesCommonFunctionalRoleService.hasExecutePermission(selectedLookupItem, getDescriptor()).then(function (hasPermission) {
													salesCommonFunctionalRoleService.updateFunctionalRoleRestrictionInfo(hasPermission);
												});
											}
										}
									],
									dialogOptions: {
										alerts: [{
											theme: 'info',
											message: $translate.instant('sales.wip.assignContractStatusInfo',
												{statuslist: orderedList.length > 0 ? _.join(_.map(orderedList, 'DescriptionInfo.Translated'), '" ' + $translate.instant('cloud.common.conjunctionOr') + ' "') : $translate.instant('sales.contract.entityStatusContarcted') })
										}]
									}
								}
							}
						},
						// adding grid
						{
							gid: 'baseGroup',
							rid: 'contractsGrid',
							label: 'Contracts',
							label$tr$: 'sales.contract.wizardCWCreateWipContractsGridLabel',
							type: 'directive',
							directive: 'sales-contract-select-contracts',
							options: {
								contractServiceName: 'salesWipCreateWipDialogService',
								getListName: 'getContractsFromServer',
								gridStyle: 'height:150px;'
							},
							sortOrder: 2,
							readonly: true, disabled: false, maxlength: 1000, rows: 10, visible: true
						},
						// Previous WIP Header
						{
							gid: 'baseGroup',
							rid: 'prevwipheaderfk',
							model: 'PrevWipHeaderFk',
							label: 'Previous WIP',
							label$tr$: 'sales.wip.previousWip',
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'sales-common-wip-dialog-v2',
								descriptionMember: 'DescriptionInfo.Translated',
								lookupOptions: {
									filterKey: 'sales-wip-create-wip-previouswip-filter',
									showClearButton: true
								}
							},
							sortOrder: 2, // TODO: check all sortOrder
							visible: true
						},
						service.getBusinessPartnerConfig(), // BusinessPartner Config
						service.getBranchConfig(), // Branch Config
						service.getCustomerConfig(), // Customer Config
						service.getIsOrdQuantityOnlyConfig(),
						// Rubric Category
						{
							gid: 'baseGroup',
							rid: 'rubricCategoryFk',
							model: 'RubricCategoryFk',
							required: true,
							sortOrder: 7,
							label$tr$: 'project.main.entityRubric',
							label: 'Rubric Category',
							validator: onRubricCategoryChanged,
							asyncValidator: salesWipValidationService.asyncValidateRubricCategoryFk,
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'basics-lookupdata-rubric-category-by-rubric-and-company-lookup',
								descriptionMember: 'Description',
								lookupOptions: {
									filterKey: 'sales-wip-rubric-category-by-rubric-filter',
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
								filterKey: 'sales-wip-configuration-filter',
								showClearButton: true
							},
							sortOrder: 8,
							validator: validateSelectedConfiguration
						},
						service.getCodeConfig(),
						// Description
						{
							gid: 'baseGroup',
							rid: 'description',
							label: 'Description',
							label$tr$: 'cloud.common.entityDescription',
							model: 'Description',
							type: 'description',
							sortOrder: 9
						},
						{
							rid: 'UpdateWith',
							gid: 'baseGroup',
							label: 'Update With',
							label$tr$: 'qto.main.wizard.create.wip.updateWith',
							type: 'radio', model: 'updateWith',
							visible:true,
							options: {
								labelMember: 'Description',
								valueMember: 'Value',
								items: [
									{
										Id: 1,
										Description: $translate.instant('qto.main.wizard.create.wip.allQtoSelected'),
										Value: '1'
									},
									{
										Id: 3,
										Description: $translate.instant('qto.main.wizard.create.wip.allAbove'),
										Value: '3'
									}]
							},
							change: function () {
								service.onCodeChage.fire('updatewith');
							},
							sortOrder: 10
						},
						// bill type
						basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm(
							'basics.customize.billtype',
							'Description',
							{
								gid: 'baseGroup',
								rid: 'typefk',
								model: 'TypeFk',
								label: 'Type',
								label$tr$: 'sales.billing.entityBillTypeFk',
								visible:true,
								sortOrder: 6
							},
							false,
							{
								required: true,
								customIntegerProperty: 'BAS_RUBRIC_CATEGORY_FK'
							}
						),
						{
							gid: 'baseGroup',
							rid: 'previousbillfk',
							model: 'PreviousBillFk',
							sortOrder: 1,
							label: 'Previous Bill',
							label$tr$: 'sales.common.PreviousBill',
							type: 'directive',
							visible:true,
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
						// company Responsible
						basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
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
							sortOrder: 11,
							label: 'Company Responsible',
							label$tr$: 'sales.common.entityCompanyResponsibleFk',
							validator: salesWipValidationService.validateCompanyResponsibleFk
						}),
						// Clerk
						{
							gid: 'baseGroup',
							rid: 'clerkFk',
							model: 'ClerkFk',
							required: true,
							sortOrder: 12,
							label: 'Clerk',
							label$tr$: 'basics.clerk.entityClerk',
							validator: salesWipValidationService.validateClerkFk,
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
							sortOrder: 13,
							label: 'Project Name',
							label$tr$: 'cloud.common.entityProjectName',
							type: 'directive',
							validator: salesWipValidationService.validateProjectFk,
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
										handler: service.projectFkOnSelectedItemChangeHandler
									}]
								}
							}
						},
						// Contract Type
						basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('project.main.contracttype', 'Description', {
							gid: 'baseGroup',
							rid: 'contractTypeFk',
							model: 'ContractTypeFk',
							required: true,
							sortOrder: 8,
							label: 'Contract Type',
							label$tr$: 'sales.common.entityContracttypeFk',
							validator: salesWipValidationService.validateContract,
							readonly: true
						}, undefined, {
							filterKey: 'sales-common-project-contract-type-lookup-filter'
						}),
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

			};

			service.getCreationDataFromDataItem = function getCreationDataFromDataItem(dataItem) {
				var newWip = dataItem;
				var creationData = {
					_contracts: newWip.gridContracts,
					BidHeaderFk: newWip.BidHeaderFk,
					Code: newWip.Code,
					Description: newWip.DescriptionInfo ? newWip.DescriptionInfo.Translated : newWip.Description,
					OrdHeaderFk: newWip.OrdHeaderFk,
					RubricCategoryFk: newWip.RubricCategoryFk,
					ResponsibleCompanyFk: newWip.ResponsibleCompanyFk,
					ClerkFk: newWip.ClerkFk,
					ProjectFk: newWip.ProjectFk,
					ContractTypeFk: newWip.ContractTypeFk,
					CompanyFk: newWip.CompanyFk,
					PerformedFrom: newWip.PerformedFrom,
					PerformedTo: newWip.PerformedTo,
					QtoHeaderFk: newWip.QtoHeaderFk,
					BoqHeaderFk: newWip.BoqHeaderFk,
					UpdateWith: newWip.updateWith - 0,
					IsOrdQuantityOnly: newWip.IsOrdQuantityOnly,
					HasOrdHeaderFk: newWip.HasOrdHeaderFk,
					GenerateType: newWip.GenerateType,
					PurposeType: newWip.PurposeType,
					BilHeaderFk: newWip.BilHeaderFk,
					TypeFk: newWip.TypeFk,
					PreviousBillFk: newWip.PreviousBillFk,
					PrevWipHeaderFk: newWip.PrevWipHeaderFk,
					QtoScope: newWip.QtoScope,
					QtoDetailIds:newWip.QtoDetailIds,
					ConfigurationId: newWip.ConfigurationFk,
					CurrencyFk: newWip.CurrencyFk,
					ControllingUnitFk: newWip.ControllingUnitFk,
					LanguageFk: newWip.LanguageFk,
					ObjUnitFk: newWip.ObjUnitFk,
					PaymentTermAdFk: newWip.PaymentTermAdFk,
					PaymentTermFiFk: newWip.PaymentTermFiFk,
					PaymentTermPaFk: newWip.PaymentTermPaFk,
					PrcStructureFk: newWip.PrcStructureFk,
					Remark: newWip.Remark,
					CommentText: newWip.CommentText,
					BusinesspartnerFk: newWip.BusinesspartnerFk,
					CustomerFk: newWip.CustomerFk,
					SubsidiaryFk: newWip.SubsidiaryFk,
					ContactFk: newWip.ContactFk,
					TaxCodeFk: newWip.TaxCodeFk,
					UserDefined1: newWip.UserDefined1,
					UserDefined2: newWip.UserDefined2,
					UserDefined3: newWip.UserDefined3,
					UserDefined4: newWip.UserDefined4,
					UserDefined5: newWip.UserDefined5,
					UserDefinedDate01: newWip.UserDefinedDate01,
					UserDefinedDate02: newWip.UserDefinedDate02,
					UserDefinedDate03: newWip.UserDefinedDate03,
					UserDefinedDate04: newWip.UserDefinedDate04,
					UserDefinedDate05: newWip.UserDefinedDate05,
					VatGroupFk: newWip.VatGroupFk
				};
				return creationData;
			};

			service.validateDataItem = function validateDataItem(dataItem) {
				// TODO: replace with framework method (from runtime data service) as soon as available
				// check if validation errors are present
				if (_.some(_.values(_.get(dataItem, '__rt$data.errors')))) {
					return false;
				}

				// is valid?
				return dataItem.RubricCategoryFk !== 0 && dataItem.RubricCategoryFk !== null &&
					dataItem.ProjectFk !== null && dataItem.ProjectFk !== 0 &&
					dataItem.ClerkFk !== null && dataItem.ClerkFk !== 0 &&
					dataItem.ContractTypeFk !== null && dataItem.ContractTypeFk !== 0 &&
					dataItem.OrdHeaderFk !== null && dataItem.OrdHeaderFk !== 0;
			};
			service.showDialog = function createWip(onCreateFn, isUpdateWizard, readOnlyRows, unvisibleRows, purposeType) {

				$injector.get('salesContractStatusLookupDataService').getList({dataServiceName: 'salesContractStatusLookupDataService'}).then(function (list) {
					orderedList = _.filter(list, {IsOrdered: true});
					isUpdate = isUpdateWizard;
					var isValid = function () {
						var dataItem = modalCreateWipConfig.dataItem;
						service.validateDataItem(dataItem);
					};

					var modalCreateWipConfig = {
						title: purposeType === 'bill' ? $translate.instant('qto.main.wizard.create.wip.createBillTitle') : $translate.instant('sales.wip.createWipTitle'),
						dataItem: initDataItem,
						dialogOptions: {
							disableOkButton: function disableOkButton(/* modelOptions */) {
								return !isValid();
							}
						},
						formConfiguration: service.getFormConfig(),
						handleOK: function handleOK(result) {
							var newWip = result.data;
							var creationData = service.getCreationDataFromDataItem(newWip);

							if (_.isFunction(onCreateFn)) {
								onCreateFn(creationData);
							}
						}
					};

					platformTranslateService.translateFormConfig(modalCreateWipConfig.formConfiguration);
					var headerText = isUpdateWizard ? (purposeType === 'bill' ? 'qto.main.wizard.create.wip.createBillTitle' : 'qto.main.wizard.create.wip.createWipTitle') : 'sales.wip.createWipTitle';

					platformModalService.showDialog({
						headerText: $translate.instant(headerText),
						dataItem: initDataItem,
						templateUrl: globals.appBaseUrl + 'sales.wip/templates/sales-wip-create-dialog-template.html',
						backdrop: false,
						width: '700px',
						uuid: '6c18ea9b7f7e496ea0f34afdb38b6ce2',   // grid id (uuid)
						unvisibleRows: unvisibleRows,
						readOnlyRows: readOnlyRows

					}).then(function (result) {
						if (result.ok) {
							modalCreateWipConfig.handleOK(result);
						} else {
							if (modalCreateWipConfig.handleCancel) {
								modalCreateWipConfig.handleCancel(result);
							}
						}
					}
					);
				});
			};

			service.getDataFromMainContract = function getDataFromMainContract(selectedItem, selectedLookupItem) {
				if (selectedItem && selectedLookupItem && selectedItem.ProjectFk === null) {
					selectedItem.ProjectFk = selectedLookupItem.ProjectFk;
				}

				if (selectedItem) {
					// assignment needed for method call below
					selectedItem.OrdHeaderFk = selectedLookupItem !== null ? selectedLookupItem.Id : null;
					if (selectedLookupItem !== null) {
						selectedItem.BusinesspartnerFk = selectedLookupItem.BusinesspartnerFk;
						selectedItem.SubsidiaryFk = selectedLookupItem.SubsidiaryFk;
						selectedItem.CustomerFk = selectedLookupItem.CustomerFk;
					}
				}
			};
			function getDescriptor() {
				return 'c3eeedbc977049b08cb321a3d574b39c';
			};
			return service;

		}]);
})();
