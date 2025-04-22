/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'sales.contract';
	var salesContractModule = angular.module(moduleName);

	salesContractModule.factory('salesContractCreateContractDialogService', ['$http', 'globals', '_', '$q', '$injector', '$translate', 'platformRuntimeDataService', 'platformContextService', 'platformTranslateService', 'platformModalFormConfigService', 'cloudDesktopPinningContextService', 'basicsLookupdataConfigGenerator', 'platformUserInfoService', 'basicsClerkUtilitiesService', 'basicsLookupdataLookupFilterService', 'salesContractValidationService', 'salesContractNumberGenerationSettingsService', 'salesCommonRubric', 'salesCommonDataHelperService', 'salesContractTypeLookupDataService',
		function ($http, globals, _, $q, $injector, $translate, platformRuntimeDataService, platformContextService, platformTranslateService, platformModalFormConfigService, cloudDesktopPinningContextService, basicsLookupdataConfigGenerator, platformUserInfoService, basicsClerkUtilitiesService, basicsLookupdataLookupFilterService, salesContractValidationService, salesContractNumberGenerationSettingsService, salesCommonRubric, salesCommonDataHelperService, salesContractTypeLookupDataService) {

			let salesCommonCreateDialogService = $injector.get('salesCommonCreateDialogService');
			function createDialog(modalCreateProjectConfig) {
				platformTranslateService.translateFormConfig(modalCreateProjectConfig.formConfiguration);
				return platformModalFormConfigService.showDialog(modalCreateProjectConfig);
			}

			var service = {},
			// default item init values
			initDataItem = {};
			service.customerDataSource = '';
			let customizingData = null;
			let defaultSalesTax = null;
			let defaultContractCondition = null;
			function suggestMainContractForChangeOrSide(entity) {
				if (_.isNil(_.get(entity, 'ProjectFk'))) {
					return $q.when(null);
				}
				if (_.isObject(_.get(entity, 'TypeEntity'))) {
					if (!(entity.TypeEntity.IsChange || entity.TypeEntity.IsSide)) {
						return $q.when(null);
					}
				}

				return $injector.get('$http').post(globals.webApiBaseUrl + 'sales/contract/suggestmaincontract?projectId=' + entity.ProjectFk).then(function (response) {
					var mainContractHeader = response.data;
					if (_.isObject(mainContractHeader) && _.has(mainContractHeader, 'Id')) {
						entity.OrdHeaderFk = mainContractHeader.Id;
						onMainContractChanged(entity, mainContractHeader);
					}
				});
			}

			function getDefaultType() {
				return salesContractTypeLookupDataService.getDefaultAsync();
			}

			// lookup configs

			// sales configuration
			function setDefaultConfigurationByRubricCategory(rubricCat) {
				$injector.get('salesCommonDataHelperService').getSalesConfigurations().then(function (data) {
					var items = _.filter(data, {RubricCategoryFk: rubricCat});
					if (_.size(items) > 0) {
						initDataItem.ConfigurationFk = _.get(_.find(items, {IsDefault: true}), 'Id') || _.first(items).Id;
						onConfigurationChanged(initDataItem, initDataItem.ConfigurationFk);
					}
				});
			}

			function getRubricIndex(entity) {
				const RubricIndexSideOrder = 6;
				const RubricIndexChangeOrder = 7;
				// ignore main contracts
				if (entity.OrdHeaderFk !== null) {
					return (entity.PrjChangeFk !== null ? RubricIndexChangeOrder : RubricIndexSideOrder);
				} else {
					// for main contracts
					return 0;
				}
			}

			function setCodeByRubricCategory(entity, rubricCat) {
				var rubricIndex = getRubricIndex(entity);
				var rubricIndexSideOrder = 6;
				var changeOrderIndex = 7;
				platformRuntimeDataService.readonly(entity, [{
					field: 'Code',
					readonly: salesContractNumberGenerationSettingsService.hasToGenerateForRubricCategory(rubricCat, rubricIndex)
				}]);
				if (rubricIndex !== changeOrderIndex && rubricIndex !== rubricIndexSideOrder) {
					entity.Code = salesContractNumberGenerationSettingsService.provideNumberDefaultText(rubricCat, entity.Code, rubricIndex);
				}
			}
			function onTypeChanged(entity, typeId) {
				salesContractTypeLookupDataService.getItemByIdAsync(typeId).then(function (typeEntity) {
					// populate related values like rubric category
					var rubricCategoryId = typeEntity.RubricCategoryFk;

					entity.TypeEntity = typeEntity; // more convenient

					let isConfigurableDialog = $injector.get('salesContractService').isConfigurableDialog();
					if (!isConfigurableDialog) {
						// handle read only state of project change and main bid
						platformRuntimeDataService.readonly(entity, [{field: 'PrjChangeFk', readonly: typeEntity.IsMain || typeEntity.IsSide }]);
						platformRuntimeDataService.readonly(entity, [{field: 'BidHeaderFk', readonly: typeEntity.IsMain}]);
					}

					// if type has change we have to reset some fields
					if (typeEntity.IsMain) {
						entity.OrdHeaderFk = null;
						entity.PrjChangeFk = null;
					} else if (typeEntity.IsSide) {
						entity.PrjChangeFk = null;
					}

					suggestMainContractForChangeOrSide(entity);

					entity.RubricCategoryFk = rubricCategoryId;
					onRubricCategoryChanged(entity, rubricCategoryId);
				});
			}
	
			function onMainContractChanged(entity, selectedLookupItem) {
				service.getDataFromMainContract(entity, selectedLookupItem);

				// handle readonly state
				var isChangeOrder = (selectedLookupItem !== null && entity.PrjChangeFk !== null);
				platformRuntimeDataService.readonly(entity, [
					{field: 'BusinesspartnerFk', readonly: isChangeOrder},
					{field: 'SubsidiaryFk', readonly: isChangeOrder},
					{field: 'CustomerFk', readonly: isChangeOrder}
				]);
				let salesCommonFunctionalRoleService = $injector.get('salesCommonFunctionalRoleService');
				salesCommonFunctionalRoleService.hasExecutePermission(selectedLookupItem, getDescriptor()).then(function (hasPermission) {
					salesCommonFunctionalRoleService.updateFunctionalRoleRestrictionInfo(hasPermission);
				});
			}
			// Rubric Category
			function onRubricCategoryChanged(entity, value) {
				setCodeByRubricCategory(entity, value);
				// reset configuration id
				setDefaultConfigurationByRubricCategory(value);
			}

			// Configuration
			function onConfigurationChanged(entity, value) {
				var lookupItem = $injector.get('basicsLookupdataLookupDescriptorService').getLookupItem('prcconfiguration', value);
				platformRuntimeDataService.readonly(entity, [{field: 'ContractTypeFk', readonly: lookupItem !== null}]);
				let selectedItem = _.filter(customizingData.salesConfigs, { Id: value });
				// approach if we un-select configuration then it will take contract type from selected project
				entity.ContractTypeFk = lookupItem ? lookupItem.PrjContractTypeFk !== null ? lookupItem.PrjContractTypeFk : (customizingData.project ? customizingData.project.ContractTypeFk !== null ? customizingData.project.ContractTypeFk:customizingData.defaultContractTypeId : customizingData.defaultContractTypeId): (customizingData.project ? customizingData.project.ContractTypeFk !== null ? customizingData.project.ContractTypeFk:customizingData.defaultContractTypeId : customizingData.defaultContractTypeId);
				entity.PaymentTermPaFk = lookupItem ? lookupItem.PaymentTermPaFk !== null ? lookupItem.PaymentTermPaFk : (customizingData.project ? customizingData.project.PaymentTermPaFk !== null ? customizingData.project.PaymentTermPaFk:null:null):(customizingData.project ? customizingData.project.PaymentTermPaFk !== null ? customizingData.project.PaymentTermPaFk:null : null);
				entity.PaymentTermFiFk = lookupItem ? lookupItem.PaymentTermFiFk !== null ? lookupItem.PaymentTermFiFk : (customizingData.project ? customizingData.project.PaymentTermFiFk !== null ? customizingData.project.PaymentTermFiFk:null:null):(customizingData.project ? customizingData.project.PaymentTermFiFk !== null ? customizingData.project.PaymentTermFiFk:null : null);
				entity.BillingMethodFk = entity.BillingMethodFk ? entity.BillingMethodFk !== null ? entity.BillingMethodFk : selectedItem.BillingMethodFk : null;
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

			service.onConfigurationChanged = onConfigurationChanged;

			service.setContractTypeByProjectId = function (projectId) {
				if (projectId) {
					var projectLookupService = 'projectLookupDataService';
					var projectLookupDataService = $injector.get(projectLookupService);
					projectLookupDataService.getItemByIdAsync(projectId, {dataServiceName: projectLookupService}).then(function (project) {
						initDataItem.ContractTypeFk = project.ContractTypeFk;
					});
				}
			};

			service.setContractTypeByDefault = function () {
				$injector.get('basicsLookupdataSimpleLookupService').getList({
					lookupModuleQualifier: 'project.main.contracttype',
					displayMember: 'Description',
					valueMember: 'Id'
				}).then(function (data) {
					var defaultItem = _.find(data, {isDefault: true});
					initDataItem.ContractTypeFk = _.get(defaultItem, 'Id') || 0;
				});
			};

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
					Code: '',
					Description: '',
					TypeFk: null,
					RubricCategoryFk: 0,
					ResponsibleCompanyFk: context.signedInClientId,
					ClerkFk: 0,
					ProjectFk: null,
					ContractTypeFk: 0,
					BidHeaderFk: null,
					OrdHeaderFk: null,
					PrjChangeFk: null,
					BusinesspartnerFk: null,
					SubsidiaryFk: null,
					CustomerFk: null,
					BoqWicCatFk: null,
					BoqWicCatBoqFk : null
				};

				if (_.isObject(dataItem)) {
					initDataItem = angular.extend(dataItem, initDataItem);
				}

				if (_.isObject(configuredDataItem) && $injector.get('salesContractService').isConfigurableDialog()) {
					initDataItem = angular.extend(initDataItem, configuredDataItem);
				}

				// make rubric category readonly (after contract type was introduced)
				platformRuntimeDataService.readonly(initDataItem, [{field: 'RubricCategoryFk', readonly: true}]);

				return $q.all({
					clerkByUserId: salesCommonDataHelperService.getClerkIdByUserId(userId),
					defaultRubricCatId: salesCommonDataHelperService.getDefaultRubricCategoryId(5),  // 5 = Order Confirmation ([BAS_RUBRIC])
					salesConfigs: salesCommonDataHelperService.getSalesConfigurations(),
					project: salesCommonDataHelperService.getProjectById(pinnedProjectId),
					defaultContractTypeId: salesCommonDataHelperService.getDefaultContractTypeId(),
					typeEntity: getDefaultType()
				}).then(function (data) {

					// TODO: extend salesconfigs object
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
							// taken BusinessPartner along with customer and branch from project
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
					if ($injector.get('salesContractService').isConfigurableDialog()) {
						// todo: Set Default Billing Schema from config if not then from Project
						if (!_.isNull(initDataItem.ConfigurationFk)) {
							$http.get(globals.webApiBaseUrl + 'basics/billingschema/common/getdefaultbillingschema', {params: {configurationFk: initDataItem.ConfigurationFk}}).then(function(response) {
								// initDataItem.BillingSchemaFk = response.data;
								configuredDataItem.BillingSchemaFk = response.data;
							});
						}
						else if(_.isNull(initDataItem.ConfigurationFk) && !_.isNull(data.project)) {
							if (!_.isNull(data.project.BillingSchemaFk)) {
								// initDataItem.BillingSchemaFk = data.project.BillingSchemaFk;
								configuredDataItem.BillingSchemaFk = data.project.BillingSchemaFk;
							}
						}

						// todo: Set Default TaxCodeFk Schema from Company
						$http.get(globals.webApiBaseUrl + 'basics/company/getCompanyById', {params: {companyId: initDataItem.CompanyFk}}).then(function(response) {
							// initDataItem.TaxCodeFk = response.data.TaxCodeFk;
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

						// todo: Set current date as Default QuoteDate
						configuredDataItem.QuoteDate = $injector.get('moment').utc(Date.now());

						// todo: Set Default payment data from config otherwise from project if no config
						configuredDataItem.PaymentTermPaFk = salesConfigLookupItem ? salesConfigLookupItem.PaymentTermPaFk !== null ? salesConfigLookupItem.PaymentTermPaFk : (data.project ? data.project.PaymentTermPaFk !== null ? data.project.PaymentTermPaFk:null:null):null;
						configuredDataItem.PaymentTermFiFk = salesConfigLookupItem ? salesConfigLookupItem.PaymentTermFiFk !== null ? salesConfigLookupItem.PaymentTermFiFk : (data.project ? data.project.PaymentTermFiFk !== null ? data.project.PaymentTermFiFk:null:null):null;
					}

					// config? -> project? -> default (from customizing)
					initDataItem.ContractTypeFk = salesConfigLookupItem ? salesConfigLookupItem.PrjContractTypeFk !== null ? salesConfigLookupItem.PrjContractTypeFk : (data.project ? data.project.ContractTypeFk !== null ? data.project.ContractTypeFk:data.defaultContractTypeId : data.defaultContractTypeId): data.defaultContractTypeId;

					// project clerk? => user id -> clerk
					initDataItem.ClerkFk = (data.project) ? data.project.ClerkFk : data.clerkByUserId;

					// set default  type
					initDataItem.TypeFk = _.get(data, 'typeEntity.Id') || initDataItem.TypeFk;
					initDataItem.TypeEntity = _.has(data, 'typeEntity.Id') ? data.typeEntity : null; // more convenient
					onTypeChanged(initDataItem, initDataItem.TypeFk);

					// set default rubric category or based on type
					if (data.typeEntity) {
						initDataItem.RubricCategoryFk = _.get(data, 'typeEntity.RubricCategoryFk') || data.defaultRubricCatId;
						onRubricCategoryChanged(initDataItem, initDataItem.RubricCategoryFk);
					}

					return initDataItem;
				});
			};

			// <editor-fold desc="[definition of filters]">
			basicsLookupdataLookupFilterService.registerFilter([
				{
					key: 'sales-contract-project-change-common-filter',
					serverSide: true,
					serverKey: 'sales-contract-project-change-common-filter',
					fn: function (item) {
						if (item.ProjectFk) {
							return {ProjectFk: item.ProjectFk};
						}
					}
				}
			]);
			// </editor-fold>

			service.resetToDefault();

			var configuredDataItem = {};

			service.extendDataItem = function extendDataItem(extendedDataItem) {
				configuredDataItem = extendedDataItem;
			};

			// additional helper functions
			var quotedStatusIds = [];
			var quotedList = [];
			function checkIsQuotedById(statusId) {
				return _.includes(quotedStatusIds, statusId);
			}

			basicsLookupdataLookupFilterService.registerFilter([
				{
					key: 'sales-contract-bid-filter',
					fn: function (bid, entity) {
						// show only bids with status of type 'quoted'
						if (!checkIsQuotedById(bid.BidStatusFk)) {
							return false;
						}

						// if project already selected, show only bids from project, otherwise all
						return entity.ProjectFk ? bid.ProjectFk === entity.ProjectFk : !!bid;
					}
				},
				{
					key: 'sales-contract-main-contract-filter-by-server',
					serverKey: 'sales-contract-main-contract-filter-by-server',
					serverSide: true,
					fn: function (contract) {
						return {
							// if project already selected, show only contracts from project, otherwise all [server side check]
							ProjectId: contract.ProjectFk
							// only contracts allowed which do not reference other contracts => this is done on server
							// TODO: also do not allow self reference [Q: needed here?]
						};
					}
				},
				{
					key: 'sales-contract-rubric-category-by-rubric-filter',
					serverKey: 'rubric-category-by-rubric-company-lookup-filter',
					serverSide: true,
					fn: function () {
						return { Rubric: salesCommonRubric.Contract };
					}
				},
				{
					key: 'sales-contract-configuration-filter',
					serverSide: true,
					fn: function (entity) {
						var rubricCat = entity.RubricCategoryFk > 0 ? ' AND RubricCategoryFk=' + entity.RubricCategoryFk : '';
						return `RubricFk=${salesCommonRubric.Contract}${rubricCat}`;
					}
				},
				{
					key: 'sales-contract-type-with-rubric-filter',
					fn: function (types) {
						var companyOrdType = $injector.get('salesContractService').getCompanyCategoryList();
						if (companyOrdType !== null && companyOrdType.length > 0) {
							var filterData = _.filter(companyOrdType, { 'RubricCategoryFk': types.BasRubricCategoryFk });
							if (filterData.length > 0) {
								return types;
							}
							else {
								return null;
							}
						}
						else {
							return types;
						}
					}
				}
			]);

			service.init = function init(dataItem) {
				angular.extend(initDataItem, dataItem);
			};
	
			service.getCopyOfInitDataItem = function getCopyOfInitDataItem() {
				if ($injector.get('salesContractService').isConfigurableDialog()) {
					return angular.copy(configuredDataItem);
				} else {
					return angular.copy(initDataItem);
				}
			};

			service.getDataFromProject = function getDataFromProject(e, args) {

				// TODO: check "take over from project" logic, something missing? (see also take over logic from resetToDefault())

				// reset selected bid and main contract if project changes
				var createContractEntity = args.entity;
				var selectedProjectId = _.get(args, 'selectedItem.Id');
				if (_.get(args, 'entity.ProjectFk') !== selectedProjectId) {
					createContractEntity.BidHeaderFk = null;
					createContractEntity.OrdHeaderFk = null;
				}

				var projectId = _.get(args, 'selectedItem.Id');
				var _configFk = initDataItem.ConfigurationFk;
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
					suggestMainContractForChangeOrSide(args.entity);
				}
				salesCommonDataHelperService.getProjectById(projectId).then(function (project) {
					let items = _.filter(customizingData.salesConfigs, {RubricCategoryFk: customizingData.defaultRubricCatId});
					let configId = (_.size(items) > 0) ? _.get(_.find(items, {IsDefault: true}), 'Id') || _.first(items).Id : null;
					let salesConfigLookupItem = configId ? $injector.get('basicsLookupdataLookupDescriptorService').getLookupItem('prcconfiguration', configId) : null;
					// restrict ovverride customerdata in case of framework-call-off contract creation
					if (args.entity.BoqWicCatBoqFk === null) {
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
					}
				});
			};

			// pre-assign data from selected bid
			service.getDataFromBid = function getDataFromBid(e, args) {
				var selectedItem = args.entity;
				var selectedBidLookupItem = args.selectedItem;
				if (selectedItem && selectedBidLookupItem && service.customerDataSource !== 'Contract') {
					selectedItem.ProjectFk = selectedBidLookupItem.ProjectFk;
					selectedItem.ContractTypeFk = selectedBidLookupItem.ContractTypeFk;
					selectedItem.BusinesspartnerFk = selectedBidLookupItem.BusinesspartnerFk;
					selectedItem.SubsidiaryFk = selectedBidLookupItem.SubsidiaryFk;
					selectedItem.CustomerFk = selectedBidLookupItem.CustomerFk;
					service.customerDataSource = 'Bid';
					selectedItem.BillingSchemaFk = selectedBidLookupItem.BillingSchemaFk;
					selectedItem.PaymentTermFiFk = selectedBidLookupItem.PaymentTermFiFk;
					selectedItem.PaymentTermPaFk = selectedBidLookupItem.PaymentTermPaFk;

				}
			};

			// pre-assign data from selected Main contract
			service.getDataFromMainContract = function getDataFromMainContract(selectedItem, selectedLookupItem) {
				// only take over if was not set yet // TODO: otherwise causes issues and projectfk will not be updated on entity ->2bchecked
				if (selectedItem && selectedLookupItem && selectedItem.ProjectFk === null) {
					selectedItem.ProjectFk = selectedLookupItem.ProjectFk;
				}

				if (selectedItem) {
					// assignment needed for method call below
					selectedItem.OrdHeaderFk = selectedLookupItem !== null ? selectedLookupItem.Id : null;
					setCodeByRubricCategory(selectedItem, selectedItem.RubricCategoryFk);
					if (selectedLookupItem !== null) {
						selectedItem.BusinesspartnerFk = selectedLookupItem.BusinesspartnerFk;
						selectedItem.SubsidiaryFk = selectedLookupItem.SubsidiaryFk;
						selectedItem.CustomerFk = selectedLookupItem.CustomerFk;
					}
					service.customerDataSource = 'Contract';
				}
			};

			service.getCreationDataFromDataItem = function getCreationDataFromDataItem(dataItem) {
				var newContract = dataItem;
				var creationData = {
					BidHeaderFk: newContract.BidHeaderFk,
					OrdHeaderFk: !newContract.TypeEntity.IsMain ? newContract.OrdHeaderFk : null,
					Code: newContract.Code,
					Description: newContract.DescriptionInfo ? newContract.DescriptionInfo.Translated : newContract.Description,
					TypeFk: newContract.TypeFk,
					RubricCategoryFk: newContract.RubricCategoryFk,
					ResponsibleCompanyFk: newContract.ResponsibleCompanyFk,
					ClerkFk: newContract.ClerkFk,
					ProjectFk: newContract.ProjectFk,
					ContractTypeFk: newContract.ContractTypeFk,
					CompanyFk: newContract.CompanyFk,
					ConfigurationId: newContract.ConfigurationFk,
					PrjChangeFk: newContract.TypeEntity.IsChange ? newContract.PrjChangeFk : null,
					BusinesspartnerFk: newContract.BusinesspartnerFk,
					SubsidiaryFk: newContract.SubsidiaryFk,
					CustomerFk: newContract.CustomerFk,
					BoqWicCatFk : newContract.BoqWicCatFk,
					BoqWicCatBoqFk: newContract.BoqWicCatBoqFk,
					BillToFk: newContract.BillToFk,
					OrderNoCustomer : newContract.OrderNoCustomer,
					ProjectnoCustomer : newContract.ProjectnoCustomer,
					ObjUnitFk : newContract.ObjUnitFk,
					ControllingUnitFk : newContract.ControllingUnitFk,
					PrcStructureFk : newContract.PrcStructureFk,
					ContactFk : newContract.ContactFk,
					BusinesspartnerBilltoFk : newContract.BusinesspartnerBilltoFk,
					ContactBilltoFk : newContract.ContactBilltoFk,
					SubsidiaryBilltoFk : newContract.SubsidiaryBilltoFk,
					CustomerBilltoFk : newContract.CustomerBilltoFk,
					PlannedStart : newContract.PlannedStart,
					PlannedEnd : newContract.PlannedEnd,
					Remark : newContract.Remark,
					CommentText : newContract.CommentText,
					PrcIncotermFk : newContract.PrcIncotermFk,
					PaymentTermAdFk : newContract.PaymentTermAdFk,
					BankFk: newContract.BankFk,
					UserDefined1 : newContract.UserDefined1,
					UserDefined2 : newContract.UserDefined2,
					UserDefined3 : newContract.UserDefined3,
					UserDefined4 : newContract.UserDefined4,
					UserDefined5 : newContract.UserDefined5,
					UserDefinedDate01 : newContract.UserDefinedDate01,
					UserDefinedDate02 : newContract.UserDefinedDate02,
					UserDefinedDate03 : newContract.UserDefinedDate03,
					UserDefinedDate04 : newContract.UserDefinedDate04,
					UserDefinedDate05: newContract.UserDefinedDate05,
					BillingMethodFk: newContract.BillingMethodFk
				};
				return creationData;
			};

			service.getFormConfig = function getFormConfig() {

				return {

					fid: 'sales.contract.createContractModal',
					version: '0.3.0',
					showGrouping: false,
					groups: [
						{
							gid: 'baseGroup',
							attributes: [
								'typefk', 'bidheaderfk', 'ordheaderfk', 'rubriccategoryfk', 'configurationfk', 'billingmethodFk', 'companyresponsiblefk', 'projectfk', 'billtofk', 'ordstatusfk',
								'code', 'clerkfk', 'businesspartnerfk', 'subsidiaryfk', 'customerfk', 'billingschemafk',
								'paymenttermfifk', 'paymenttermpafk', 'contracttypefk', 'prjchangefk', 'boqwiccatfk', 'boqwiccatboqfk'
							]
						}
					],
					rows: [
						// Bid
						{
							gid: 'baseGroup',
							rid: 'bidheaderfk',
							model: 'BidHeaderFk',
							sortOrder: 3,
							label: 'Bid',
							label$tr$: 'sales.common.Bid',
							type: 'directive',
							// validator: salesContractValidationService.validateBidHeaderFk,
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'sales-bid-bid-dialog',
								descriptionMember: 'DescriptionInfo.Translated',
								lookupOptions: {
									filterKey: 'sales-contract-bid-filter',
									showClearButton: true,
									events: [
										{
											name: 'onSelectedItemChanged',
											handler: service.getDataFromBid
										}
									],
									dialogOptions: {
										alerts: [{
											theme: 'info',
											message: $translate.instant('sales.contract.assignBidStatusInfo',
												{statuslist: _.join(_.map(quotedList, 'DescriptionInfo.Translated'), '" ' + $translate.instant('cloud.common.conjunctionOr') + ' "')})
										}]
									}
								}
							}
						},
						// Contract
						{
							gid: 'baseGroup',
							rid: 'ordheaderfk',
							model: 'OrdHeaderFk',
							sortOrder: 4,
							label: 'Main Contract',
							required: false,
							label$tr$: 'sales.common.MainContract',
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'sales-common-contract-dialog-v2',
								descriptionMember: 'DescriptionInfo.Translated',
								lookupOptions: {
									filterKey: 'sales-contract-main-contract-filter-by-server',
									showClearButton: true,
									events: [
										{
											name: 'onSelectedItemChanged',
											handler: function onSelectedItemChangedHandler(e, args) {
												onMainContractChanged(args.entity, args.selectedItem);
											}
										}
									]
								}
							}
						},
						// Contract Type
						basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm(
							'basics.customize.ordertype',
							'Description',
							{
								gid: 'baseGroup',
								rid: 'typeFk',
								model: 'TypeFk',
								required: true,
								sortOrder: 0,
								label: 'Type',
								label$tr$: 'sales.contract.entityContractTypeFk',
								validator: onTypeChanged
							},
							false, // caution: this parameter is ignored by the function
							{
								required: true,
								customIntegerProperty: 'BAS_RUBRIC_CATEGORY_FK',
								filterKey: 'sales-contract-type-with-rubric-filter'
							}
						),
						// Rubric Category
						{
							gid: 'baseGroup',
							rid: 'rubricCategoryFk',
							model: 'RubricCategoryFk',
							required: true,
							sortOrder: 1,
							label$tr$: 'project.main.entityRubric',
							label: 'Category',
							validator: onRubricCategoryChanged,
							asyncValidator: salesContractValidationService.asyncValidateRubricCategoryFk,
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'basics-lookupdata-rubric-category-by-rubric-and-company-lookup',
								descriptionMember: 'Description',
								lookupOptions: {
									filterKey: 'sales-contract-rubric-category-by-rubric-filter',
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
								filterKey: 'sales-contract-configuration-filter',
								showClearButton: true
							},
							sortOrder: 2,
							validator: onConfigurationChanged
						},
						// billing method
						basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm(
							'basics.customize.salesbillingmethod',
							'Description',
							{
								gid: 'baseGroup',
								rid: 'billingMethodFk',
								model: 'BillingMethodFk',
								required: false,
								sortOrder: 3,
								label: 'Billing Method',
								label$tr$: 'sales.common.entityBillingMethodFk',
							},
						
						),
						// Code
						{
							gid: 'baseGroup',
							rid: 'code',
							label$tr$: 'cloud.common.entityCode',
							model: 'Code',
							required: true,
							type: 'code',
							sortOrder: 5,
							validator: salesContractValidationService.validateCode,
							asyncValidator: function (entity, value) {
								return $injector.get('salesContractValidationHelperService').asyncValidateCode(entity.CompanyFk, value);
							}
						},
						// Description
						{
							gid: 'baseGroup',
							rid: 'description',
							label$tr$: 'cloud.common.entityDescription',
							model: 'Description',
							type: 'description',
							sortOrder: 6
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
							sortOrder: 7,
							label: 'Company Responsible',
							label$tr$: 'sales.common.entityCompanyResponsibleFk',
							validator: salesContractValidationService.validateCompanyResponsibleFk
						}
						),
						// Clerk
						{
							gid: 'baseGroup',
							rid: 'clerkFk',
							model: 'ClerkFk',
							required: true,
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
						// Project
						{
							gid: 'baseGroup',
							rid: 'projectfk',
							model: 'ProjectFk',
							required: true,
							sortOrder: 9,
							label: 'Project Name',
							label$tr$: 'cloud.common.entityProjectName',
							type: 'directive',
							validator: salesContractValidationService.validateProjectFk,
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'basics-lookup-data-project-project-dialog',
								descriptionMember: 'ProjectName',
								lookupOptions: {
									initValueField: 'ProjectNo',
									showClearButton: false,
									filterKey: 'sales-common-project-filterkey',
									events: [
										{
											name: 'onSelectedItemChanged',
											handler: service.getDataFromProject
										}
									]
								}
							}
						},

						// bill to
						basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
							dataServiceName: 'projectBilltoLookupDataService',
							filter: function (item) {
								return item.ProjectFk;
							},
							events: [{
								name: 'onSelectedItemChanged',
								handler: function (e, args) {
									let selectedItem = args.entity;
									let selectedLookupItem = args.selectedItem;
									salesContractTypeLookupDataService.getItemByIdAsync(selectedItem.TypeFk).then(function (typeEntity) {
										if (selectedItem && typeEntity.IsMain) {
											selectedItem.BusinesspartnerFk = selectedLookupItem.BusinessPartnerFk;
											selectedItem.SubsidiaryFk = selectedLookupItem.SubsidiaryFk;
											selectedItem.CustomerFk = selectedLookupItem.CustomerFk;
										}
										else if (selectedItem && (typeEntity.IsSide || typeEntity.IsChange)) {
											service.getDataFromMainContract();
										}
									});
								}
							}],
							showClearButton: true,
						}, {
							gid: 'baseGroup',
							rid: 'billtofk',
							label: 'Bill To',
							label$tr$: 'project.main.billToEntity',
							model: 'BillToFk',
							type: 'lookup',
							sortOrder: 10,
							required: false,
							visible: true
						}),
						// Project Change
						{
							gid: 'baseGroup',
							rid: 'prjchangefk',
							model: 'PrjChangeFk',
							required: false,
							readonly: false,
							sortOrder: 11,
							label: 'Change Order',
							label$tr$: 'sales.common.entityChangeOrder',
							// validator: TODO: add validator
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'project-change-dialog',
								descriptionMember: 'Description',
								lookupOptions: {
									showClearButton: true,
									createOptions: {
										typeOptions: {
											isSales: true,
											isChangeOrder: true
										}
									},
									filterKey: 'sales-contract-project-change-common-filter',
									events: [{
										name: 'onSelectedItemChanged',
										handler: function (e, args) {
											var selectedItem = args.entity;
											var selectedLookupItem = args.selectedItem;

											if (selectedItem) {
												// assignment needed for method call below
												selectedItem.PrjChangeFk = selectedLookupItem !== null ? selectedLookupItem.Id : null;
												setCodeByRubricCategory(selectedItem, selectedItem.RubricCategoryFk);
											}

											var isChangeOrder = (selectedItem.OrdHeaderFk !== null && selectedLookupItem !== null);
											platformRuntimeDataService.readonly(selectedItem, [
												{field: 'BusinesspartnerFk', readonly: isChangeOrder},
												{field: 'SubsidiaryFk', readonly: isChangeOrder},
												{field: 'CustomerFk', readonly: isChangeOrder}
											]);
										}
									}]
								}
							}
						},
						// Contract Type
						basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
							dataServiceName: 'basicContractTypeLookupDataService',
							filterKey: 'sales-common-project-contract-type-lookup-filter',
							enableCache: true
						},{
							gid: 'baseGroup',
							rid: 'contractTypeFk',
							model: 'ContractTypeFk',
							required: true,
							sortOrder: 12,
							label: 'Contract Type',
							label$tr$: 'sales.common.entityContracttypeFk',
							validator: salesContractValidationService.validateContracttypeFk
						}),
						// Businesspartner
						$injector.get('salesCommonLookupConfigsService').BusinessPartnerLookUpConfigForForm('salesContractService', 'salesContractValidationService'),
						// Subsidiary
						basicsLookupdataConfigGenerator.provideElaboratedLookupConfigForForm('business-partner-main-subsidiary-lookup', 'Subsidiary', 'AddressLine', false, {
							gid: 'baseGroup',
							rid: 'subsidiaryfk',
							model: 'SubsidiaryFk',
							required: true,
							sortOrder: 13,
							label: 'Subsidiary',
							label$tr$: 'cloud.common.entitySubsidiary'
						}, 'sales-common-subsidiary-filter'
						),
						// Customer
						{
							gid: 'baseGroup',
							rid: 'customerfk',
							model: 'CustomerFk',
							sortOrder: 14,
							required: false,
							label: 'Customer',
							label$tr$: 'sales.common.entityCustomerFk',
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'business-partner-main-customer-lookup',
								descriptionMember: 'BusinessPartnerName1',
								lookupOptions: {
									showClearButton: true,
									filterKey: 'sales-common-customer-filter'
								}
							}
						},
						// WIC Group
						{
							gid: 'baseGroup',
							rid: 'boqwiccatfk',
							model: 'BoqWicCatFk',
							label: 'WIC Group',
							label$tr$: 'sales.contract.entityFwBoqWicCatFk',
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							required: true,
							visible: false,
							sortOrder: 15,
							options: {
								lookupDirective: 'basics-lookup-data-by-custom-data-service',
								descriptionMember: 'DescriptionInfo.Translated',
								lookupOptions: {
									valueMember: 'Id',
									displayMember: 'Code',
									lookupModuleQualifier: 'estimateAssembliesWicGroupLookupDataService',
									dataServiceName: 'estimateAssembliesWicGroupLookupDataService',
									showClearButton: false,
									lookupType: 'estimateAssembliesWicGroupLookupDataService',
									columns: [
										{
											id: 'Code',
											field: 'Code',
											name: 'Code',
											formatter: 'code',
											name$tr$: 'cloud.common.entityCode'
										},
										{
											id: 'Description',
											field: 'DescriptionInfo',
											name: 'Description',
											formatter: 'translation',
											name$tr$: 'cloud.common.entityDescription'
										}
									],
									events: [{
										name: 'onSelectedItemChanged',
										handler: function (e, args) {
											var selectedItem = args.entity;
											if (selectedItem) {
												$injector.get('salesCommonBaseBoqLookupService').setCurrentProject(selectedItem.ProjectFk);
											}
										}
									}],
									uuid: 'aee374374c634e27ba45e6e145f872ae',
									isTextEditable: false,
									treeOptions: {
										parentProp: 'WicGroupFk',
										childProp: 'WicGroups',
										initialState: 'expanded',
										inlineFilters: true,
										hierarchyEnabled: true
									}
								}
							}
						},
						// WIC BoQ
						{
							gid: 'baseGroup',
							rid: 'boqwiccatboqfk',
							model: 'BoqWicCatBoqFk',
							label: 'WIC BoQ',
							label$tr$: 'sales.contract.wicCatBoqFk',
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							visible: false,
							sortOrder: 16,
							lookupDirective: 'prc-common-wic-cat-boq-lookup',
							descriptionMember: 'BoqRootItem.BriefInfo.Translated',
							options: {
								lookupDirective: 'prc-common-wic-cat-boq-lookup',
								descriptionMember: 'BoqRootItem.BriefInfo.Translated',
								lookupOptions: {
									additionalColumns: true,
									displayMember: 'BoqRootItem.Reference',
									descriptionMember: 'BoqRootItem.BriefInfo.Translated',
									showClearButton: true,
									addGridColumns: [
										{
											id: 'briefinfo',
											field: 'BoqRootItem.BriefInfo.Translated',
											name: 'Description',
											formatter: 'description',
											width: 150,
											name$tr$: 'cloud.common.entityDescription',
										},
									],
									events: [{
										name: 'onSelectedItemChanged',
										handler: function (e, args) {
											var selectedItem = args.entity;
											var selectedLookupItem = args.selectedItem;

											if (selectedItem) {
												$http.get(globals.webApiBaseUrl + 'boq/wic/boq/list?wicGroupId=' + selectedItem.BoqWicCatFk).then(function (response) {
													let filterWicBoqDataFromGroup = _.find(response.data, {Id: selectedLookupItem.Id});
													selectedItem.BusinesspartnerFk = filterWicBoqDataFromGroup.WicBoq.BpdBusinessPartnerFk;
													selectedItem.SubsidiaryFk = filterWicBoqDataFromGroup.WicBoq.BpdSubsidiaryFk;
													selectedItem.CustomerFk = filterWicBoqDataFromGroup.WicBoq.BpdCustomerFk;
												});
											}
										}
									}],
									filterKey: 'prc-con-wic-cat-boq-filter',
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'PrcWicCatBoqs',
									displayMember: 'BoqRootItem.Reference',
									descriptionMember: 'BoqRootItem.BriefInfo.Translated',
									pKeyMaps: [
										{pkMember: 'BoqWicCatFk', fkMember: 'BoqWicCatFk'},
									],
								},

							},
						},
					]
				};

			};

			// helper
			service.initQuotedStatusList = function initQuotedStatusList() {
				return $injector.get('salesBidStatusLookupDataService').getList({dataServiceName: 'salesBidStatusLookupDataService'}).then(function (list) {
					quotedList = _.filter(list, {IsQuoted: true});
					quotedStatusIds = _.map(quotedList, 'Id');
				});
			};

			service.validateDataItem = function validateDataItem(dataItem) {
				// TODO: replace with framework method (from runtime data service) as soon as available
				// check if validation errors are present
				if (_.some(_.values(_.get(dataItem, '__rt$data.errors')))) {
					return false;
				}

				var isTypeSettingsValid = true;
				if (_.get(dataItem, 'TypeEntity.IsChange') === true) {
					isTypeSettingsValid = dataItem.OrdHeaderFk > 0 && dataItem.PrjChangeFk > 0;
				} else if (_.get(dataItem, 'TypeEntity.IsSide') === true) {
					isTypeSettingsValid = dataItem.OrdHeaderFk > 0;
				} else if (_.get(dataItem, 'TypeEntity.IsFrameworkCallOff') === true) {
					isTypeSettingsValid = dataItem.BoqWicCatFk !== null;
				}

				return _.isString(dataItem.Code) && _.size(dataItem.Code) > 0 &&
					isTypeSettingsValid &&
					dataItem.TypeFk > 0 &&
					dataItem.RubricCategoryFk !== 0 && dataItem.RubricCategoryFk !== null &&
					dataItem.ProjectFk !== null && dataItem.ProjectFk !== 0 &&
					dataItem.ClerkFk !== null && dataItem.ClerkFk !== 0 &&
					dataItem.ContractTypeFk !== null && dataItem.ContractTypeFk !== 0 &&
					dataItem.BusinesspartnerFk !== null && dataItem.BusinesspartnerFk !== 0 &&
					dataItem.SubsidiaryFk !== null && dataItem.SubsidiaryFk !== 0;
			};

			service.showDialog = function createContract(onCreateFn, readOnlyRows) {
				return new Promise(function (resolve, reject) {
					service.initQuotedStatusList().then(function () {
						var isValid = function () {
							var dataItem = modalCreateContractConfig.dataItem;
							return service.validateDataItem(dataItem);
						};

						var modalCreateContractConfig = {
							title: $translate.instant('sales.contract.createContractTitle'),
							dataItem: initDataItem,
							dialogOptions: {
								disableOkButton: function disableOkButton(){
									return !isValid();
								}
							},
							formConfiguration: service.getFormConfig(),
							handleOK: function handleOK(result) {
								var newContract = result.data;
								var creationData = service.getCreationDataFromDataItem(newContract);

								if (_.isFunction(onCreateFn)) {
									onCreateFn(creationData);
								}
							}
						};

						// apply field read only extensions, if available
						var rows = modalCreateContractConfig.formConfiguration.rows;
						_.each(readOnlyRows, function (rowName) {
							var row = _.find(rows, {rid: rowName});
							if (row) {
								row.readonly = true;
							}
						});

						var dialogPromise = createDialog(modalCreateContractConfig);
						dialogPromise.then(resolve).catch(reject);
					}).catch(reject);
				});
			};
			function getDescriptor() {
				//TODO: check again
				return 'c3eeedbc977049b08cb321a3d574b39c';
			};
			return service;

		}]);
})();
