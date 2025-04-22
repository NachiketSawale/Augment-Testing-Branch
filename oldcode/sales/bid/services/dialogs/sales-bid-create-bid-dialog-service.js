/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'sales.bid';
	var salesBidModule = angular.module(moduleName);

	salesBidModule.factory('salesBidCreateBidDialogService', ['_', 'globals', '$q', '$injector', '$translate', 'platformRuntimeDataService', 'platformContextService', 'platformTranslateService', 'platformModalFormConfigService', 'projectMainPinnableEntityService', 'basicsLookupdataConfigGenerator', 'platformUserInfoService', 'basicsClerkUtilitiesService', 'basicsLookupdataLookupFilterService', 'salesBidValidationService', 'salesBidNumberGenerationSettingsService', 'salesCommonBusinesspartnerSubsidiaryCustomerService', 'salesCommonRubric', 'salesCommonDataHelperService', 'salesBidTypeLookupDataService',
		function (_, globals, $q, $injector, $translate, platformRuntimeDataService, platformContextService, platformTranslateService, platformModalFormConfigService, projectMainPinnableEntityService, basicsLookupdataConfigGenerator, platformUserInfoService, basicsClerkUtilitiesService, basicsLookupdataLookupFilterService, salesBidValidationService, salesBidNumberGenerationSettingsService, salesCommonBusinesspartnerSubsidiaryCustomerService, salesCommonRubric, salesCommonDataHelperService, salesBidTypeLookupDataService) {

			var service = {},
				// default item init values
				initDataItem = {},
				urpDefault = {};
			let customizingData = null;
			let defaultSalesTax = null;
			let defaultContractCondition = null;
			function suggestMainBidForChangeOrSide(entity) {
				if (_.isNil(_.get(entity, 'ProjectFk'))) {
					return $q.when(null);
				}
				if (_.isObject(_.get(entity, 'TypeEntity'))) {
					if (!(entity.TypeEntity.IsChange || entity.TypeEntity.IsSide)) {
						return $q.when(null);
					}
				}

				return $injector.get('$http').post(globals.webApiBaseUrl + 'sales/bid/suggestmainbid?projectId=' + entity.ProjectFk).then(function (response) {
					var mainBidHeader = response.data;
					if (_.isObject(mainBidHeader) && _.has(mainBidHeader, 'Id')) {
						entity.BidHeaderFk = mainBidHeader.Id;
						onMainBidChanged(entity, mainBidHeader);
					}
				});
			}

			function getDefaultBidType() {
				return salesBidTypeLookupDataService.getDefaultAsync();
			}

			function setContractType(entity, configId, projectId) {
				// config? -> project? -> default (from customizing)
				var helper = salesCommonDataHelperService;
				var contractTypePromise = configId ? helper.getContractTypeIdByConfig(configId) : (projectId ? helper.getContractTypeIdByProject(projectId) : helper.getDefaultContractTypeId());
				var salesConfigLookupItem = configId ? $injector.get('basicsLookupdataLookupDescriptorService').getLookupItem('prcconfiguration', configId) : null;
				contractTypePromise.then((contractTypeId) => {
					entity.ContractTypeFk = contractTypeId ? contractTypeId !== null ? contractTypeId : (customizingData.project ? customizingData.project.ContractTypeFk !== null ? customizingData.project.ContractTypeFk:customizingData.defaultContractTypeId : customizingData.defaultContractTypeId): (customizingData.project ? customizingData.project.ContractTypeFk !== null ? customizingData.project.ContractTypeFk:customizingData.defaultContractTypeId : customizingData.defaultContractTypeId);
					entity.PaymentTermPaFk = salesConfigLookupItem ? salesConfigLookupItem.PaymentTermPaFk !== null ? salesConfigLookupItem.PaymentTermPaFk : (customizingData.project ? customizingData.project.PaymentTermPaFk !== null ? customizingData.project.PaymentTermPaFk:null:null):(customizingData.project ? customizingData.project.PaymentTermPaFk !== null ? customizingData.project.PaymentTermPaFk:null : null);
					entity.PaymentTermFiFk = salesConfigLookupItem ? salesConfigLookupItem.PaymentTermFiFk !== null ? salesConfigLookupItem.PaymentTermFiFk : (customizingData.project ? customizingData.project.PaymentTermFiFk !== null ? customizingData.project.PaymentTermFiFk:null:null):(customizingData.project ? customizingData.project.PaymentTermFiFk !== null ? customizingData.project.PaymentTermFiFk:null : null);
					if (!_.isNull(entity.ConfigurationFk)) {
						$injector.get('$http').get(globals.webApiBaseUrl + 'basics/billingschema/common/getdefaultbillingschema', {params: {configurationFk: entity.ConfigurationFk}}).then(function(response) {
							entity.BillingSchemaFk = response.data;
						});
					}
					else if(_.isNull(entity.ConfigurationFk) && !_.isNull(customizingData.project)) {
						if (!_.isNull(customizingData.project.BillingSchemaFk)) {
							entity.BillingSchemaFk = customizingData.project.BillingSchemaFk;
						}
					}
					else {
						entity.BillingSchemaFk = null;
					}
				});
			}

			// sales configuration
			function setDefaultConfigurationByRubricCategory(rubricCat, entity) {
				salesCommonDataHelperService.getDefaultOrFirstSalesConfig(rubricCat).then(function (configurationId) {
					entity.ConfigurationFk = configurationId;
					onConfigurationChanged(entity, entity.ConfigurationFk);
				});
			}

			// <editor-fold desc="[event handlers]">
			function onBidTypeChanged(entity, typeId) {
				salesBidTypeLookupDataService.getItemByIdAsync(typeId).then(function (typeEntity) {
					// populate related values like rubric category
					var rubricCategoryId = typeEntity.RubricCategoryFk;
					entity.TypeEntity = typeEntity; // more convenient

					let isConfigurableDialog = $injector.get('salesBidService').isConfigurableDialog();
					if (!isConfigurableDialog) {
						// handle read only state of project change and main bid
						platformRuntimeDataService.readonly(entity, [{field: 'PrjChangeFk', readonly: typeEntity.IsMain || typeEntity.IsSide }]);
						platformRuntimeDataService.readonly(entity, [{field: 'BidHeaderFk', readonly: typeEntity.IsMain}]);
					}

					// if type has change we have to reset some fields
					if (typeEntity.IsMain) {
						entity.BidHeaderFk = null;
						entity.SelectMainBidEntity = null;
						entity.PrjChangeFk = null;
					} else if (typeEntity.IsSide) {
						entity.PrjChangeFk = null;
					}

					suggestMainBidForChangeOrSide(entity);

					entity.RubricCategoryFk = rubricCategoryId;
					onRubricCategoryChanged(entity, rubricCategoryId);
				});
			}

			service.onMainBidChanged = function (entity, selectBid){
				onMainBidChanged(entity, selectBid);
			};

			function onMainBidChanged(entity, selectedItem) {
				if (selectedItem && entity && selectedItem.ProjectFk === entity.ProjectFk) {
					entity.BusinesspartnerFk = selectedItem.BusinesspartnerFk;
					entity.SubsidiaryFk = selectedItem.SubsidiaryFk;
					entity.CustomerFk = selectedItem.CustomerFk;
					entity.SelectMainBidEntity = selectedItem;
					entity.PrcStructureFk = entity.updateModel ? (entity.PrcStructureFk ? entity.PrcStructureFk : selectedItem.PrcStructureFk) : selectedItem.PrcStructureFk;
				}
				var isChange = (entity.TypeEntity !== null && entity.TypeEntity.IsChange);
				platformRuntimeDataService.readonly(entity, [
					{field: 'BusinesspartnerFk', readonly: isChange},
					{field: 'SubsidiaryFk', readonly: isChange},
					{field: 'CustomerFk', readonly: isChange}
				]);
			}

			function onRubricCategoryChanged(entity, value) {
				salesBidNumberGenerationSettingsService.assertLoaded().then(function () {
					// for update model, always need to select a target BID to update, so can't set to readonly
					let codeReadonly = !entity.updateModel && salesBidNumberGenerationSettingsService.hasToGenerateForRubricCategory(value);
					platformRuntimeDataService.readonly(entity, [{field: 'Code', readonly: codeReadonly}]);
					entity.Code = entity.updateModel ? entity.Code : salesBidNumberGenerationSettingsService.provideNumberDefaultText(value, entity.Code);
				});
				// reset configuration id
				setDefaultConfigurationByRubricCategory(value, entity);
			}
			service.onRubricCategoryChanged = onRubricCategoryChanged;

			function onConfigurationChanged(entity, value) {
				var isConfigurableDialog = $injector.get('salesBidService').isConfigurableDialog();
				var salesConfigLookupItem = $injector.get('basicsLookupdataLookupDescriptorService').getLookupItem('prcconfiguration', value);
				if (!isConfigurableDialog) {
					platformRuntimeDataService.readonly(entity, [{field: 'ContractTypeFk', readonly: salesConfigLookupItem !== null}]);
				}
				setContractType(entity, _.get(salesConfigLookupItem, 'Id'), entity.ProjectFk);
			}
			service.onConfigurationChanged = onConfigurationChanged;
			// </editor-fold">

			service.resetToDefault = function (dataItem, updateModeInitValues) {

				initDataItem = {}; // reset

				var context = platformContextService.getContext(),
					userId = _.get(platformUserInfoService.getCurrentUserInfo(), 'UserId', -1),
					// project id from pinning context if available
					pinnedProjectId = projectMainPinnableEntityService.getPinned();

				urpDefault = {
					// ui fields for urp
					EstUppUsingURP: true,
					CalculateHours: false,
					SplitPerStructure: false,// default true
					CreationType: null,
					MainItemId: -1,// structure fk
					SourceInfo: '',
					EstUppStructure: null,// structures lookup value
					EstUppEditType: false,// edit type
					EstUppConfigFk: null,
					EstUppConfigtypeFk: null,
					estUppConfigDesc: '',
					CalcFromUrb: false,
					NameUrb1: '',
					NameUrb2: '',
					NameUrb3: '',
					NameUrb4: '',
					NameUrb5: '',
					NameUrb6: '',
					EstUpp2Costcode: []
				};

				// default item init values
				var defaultValues = {
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
					PrjChangeFk: null,
					ContractTypeFk: 0,
					StructureType: 0,
					ProjectChangeGenerateMode: 2,
					AssignChangeToEachBid: false,
					AssignChangeToBidHeader: false,
					StructureURPAssignments: [],
					estimateScope: 0,
					BusinesspartnerFk: null,
					SubsidiaryFk: null,
					CustomerFk: null,
					BidHeaderFk: null,
					PrcStructureFk: null
				};

				if (_.isObject(dataItem)) {
					defaultValues = angular.extend(dataItem, defaultValues);
				} else {
					defaultValues = angular.extend(initDataItem, defaultValues);
					// set the default for the urp configuration
					defaultValues = angular.extend(defaultValues, urpDefault);
				}

				if (_.isObject(configuredDataItem) && $injector.get('salesBidService').isConfigurableDialog()) {
					if (_.isObject(dataItem)) {
						defaultValues = angular.extend(dataItem, configuredDataItem);
					} else {
						defaultValues = angular.extend(initDataItem, configuredDataItem);
					}
				}

				// make rubric category readonly (after bid type was introduced)
				platformRuntimeDataService.readonly(initDataItem, [{field: 'RubricCategoryFk', readonly: true}]);

				return $q.all({
					clerkByUserId: salesCommonDataHelperService.getClerkIdByUserId(userId),
					defaultRubricCatId: salesCommonDataHelperService.getDefaultRubricCategoryId(4), // 4 = Customer Quotation ([BAS_RUBRIC])
					salesConfigs: salesCommonDataHelperService.getSalesConfigurations(),
					project: salesCommonDataHelperService.getProjectById(pinnedProjectId),
					defaultContractTypeId: salesCommonDataHelperService.getDefaultContractTypeId(),
					typeEntity: getDefaultBidType(),
					numberGeneration: salesBidNumberGenerationSettingsService.assertLoaded()
				}).then(function (data) {

					var items = _.filter(data.salesConfigs, {RubricCategoryFk: data.defaultRubricCatId});
					var configId = (_.size(items) > 0) ? _.get(_.find(items, {IsDefault: true}), 'Id') || _.first(items).Id : null;
					defaultValues.ConfigurationFk = configId;
					var salesConfigLookupItem = configId ? $injector.get('basicsLookupdataLookupDescriptorService').getLookupItem('prcconfiguration', configId) : null;
					customizingData = data;
					if (data.project) {
						// take over basics settings from project when project available
						angular.extend(defaultValues, {
							ProjectFk: data.project.Id,
							ResponsibleCompanyFk: data.project.CompanyResponsibleFk, // Company Responsible from Project --> "Profit Center"
							CompanyResponsibleFk: data.project.CompanyResponsibleFk, // For Configured Dialog
							BusinesspartnerFk: data.project.BusinessPartnerFk,
							SubsidiaryFk: data.project.SubsidiaryFk,
							CustomerFk: data.project.CustomerFk,
							DefaultBusinesspartnerFk: data.project.BusinessPartnerFk,
							DefaultSubsidiaryFk: data.project.SubsidiaryFk,
							DefaultCustomerFk: data.project.CustomerFk,
							BillingSchemaFk:data.project.BillingSchemaFk,
							CurrencyFk:data.project.CurrencyFk,
							DateEffective:data.project.DateEffective,
							LanguageFk:data.project.LanguageContractFk,
							ClerkFk : data.project.ClerkFk,
							ContractTypeFk: salesConfigLookupItem ? salesConfigLookupItem.PrjContractTypeFk !== null ? salesConfigLookupItem.PrjContractTypeFk : (data.project ? data.project.ContractTypeFk !== null ? data.project.ContractTypeFk:data.defaultContractTypeId : data.defaultContractTypeId): data.defaultContractTypeId
						});
					}

					// todo: set some default values in case of Configurable dialog
					if ($injector.get('salesBidService').isConfigurableDialog()) {
						// todo: Set Default Billing Schema from customizing if no Billing Schema in Project
						if (!_.isNull(defaultValues.ConfigurationFk)) {
							$injector.get('$http').get(globals.webApiBaseUrl + 'basics/billingschema/common/getdefaultbillingschema', {params: {configurationFk: defaultValues.ConfigurationFk}}).then(function(response) {
								defaultValues.BillingSchemaFk = response.data;
							});
						}
						else if(_.isNull(defaultValues.ConfigurationFk) && !_.isNull(data.project)) {
							if (!_.isNull(data.project.BillingSchemaFk)) {
								defaultValues.BillingSchemaFk = data.project.BillingSchemaFk;
							}
						}

						// todo: Set Default TaxCodeFk Schema from Company
						$injector.get('$http').get(globals.webApiBaseUrl + 'basics/company/getCompanyById', {params: {companyId: defaultValues.CompanyFk}}).then(function(response) {
							defaultValues.TaxCodeFk = _.get(response, 'data.TaxCodeFk') || null;
						});

						// todo: Set Default VatGroupFk Schema from customer
						$injector.get('$http').get(globals.webApiBaseUrl + 'businesspartner/main/customer/list?mainItemId=' + defaultValues.BusinesspartnerFk).then(function (resp){
							defaultValues.VatGroupFk = _.get(resp, 'data.Main[0].VatGroupFk') || null;
						});

						// todo: Set Default SalesTaxMethodFk from customizing
						$injector.get('$http').post(globals.webApiBaseUrl + 'basics/customize/SalesTaxMethod/list' + '').then(function (result) {
							defaultSalesTax =_.find(result.data,{IsDefault:true,IsLive:true});
							defaultValues.BasSalesTaxMethodFk = _.get(defaultSalesTax, 'Id') || null;
						});

						// todo: Set Default Contractual Condition from customizing
						$injector.get('$http').post(globals.webApiBaseUrl + 'basics/customize/OrderCondition/list' + '').then(function (res) {
							defaultContractCondition =_.find(res.data,{IsDefault:true,IsLive:true});
							defaultValues.OrdConditionFk = _.get(defaultContractCondition, 'Id') || null;
						});

						// todo: Set Default ExchangeRate as 1
						$injector.get('$http').get(globals.webApiBaseUrl + 'sales/common/exchangerate/rate', {params: {companyId: defaultValues.CompanyFk,currencyForeignId:defaultValues.CurrencyFk,projectId:defaultValues.ProjectFk,throwException:''}}).then(function(response) {
							defaultValues.ExchangeRate = response.data;
						});

						// todo: Set current date as Default QuoteDate
						defaultValues.QuoteDate = $injector.get('moment').utc(Date.now());

						// todo: Set Default payment data from config otherwise from project if no config
						defaultValues.PaymentTermPaFk = salesConfigLookupItem ? salesConfigLookupItem.PaymentTermPaFk !== null ? salesConfigLookupItem.PaymentTermPaFk : (data.project ? data.project.PaymentTermPaFk !== null ? data.project.PaymentTermPaFk:null:null):null;
						defaultValues.PaymentTermFiFk = salesConfigLookupItem ? salesConfigLookupItem.PaymentTermFiFk !== null ? salesConfigLookupItem.PaymentTermFiFk : (data.project ? data.project.PaymentTermFiFk !== null ? data.project.PaymentTermFiFk:null:null):null;
					}
					// config? -> project? -> default (from customizing)
					defaultValues.ContractTypeFk = salesConfigLookupItem ? salesConfigLookupItem.PrjContractTypeFk !== null ? salesConfigLookupItem.PrjContractTypeFk : (data.project ? data.project.ContractTypeFk !== null ? data.project.ContractTypeFk:data.defaultContractTypeId : data.defaultContractTypeId): data.defaultContractTypeId;

					// project clerk? => user id -> clerk
					defaultValues.ClerkFk = (data.project) ? data.project.ClerkFk : data.clerkByUserId;

					// set default bid type
					defaultValues.TypeFk = _.get(data, 'typeEntity.Id') || defaultValues.TypeFk;
					defaultValues.TypeEntity = _.has(data, 'typeEntity.Id') ? data.typeEntity : null; // more convenient
					if(defaultValues.TypeEntity){
						defaultValues.DefaultTypeFk = defaultValues.TypeFk;
					}
					onBidTypeChanged(defaultValues, defaultValues.TypeFk);

					// default rubric category or based on bid type
					if (data.typeEntity) {
						defaultValues.RubricCategoryFk = _.get(data, 'typeEntity.RubricCategoryFk') || data.defaultRubricCatId;
						onRubricCategoryChanged(defaultValues, defaultValues.RubricCategoryFk);
					}

					if (updateModeInitValues) {
						updateModeInitValues.codeIsAutoGenerated = salesBidNumberGenerationSettingsService.hasToGenerateForRubricCategory(defaultValues.RubricCategoryFk);

						updateModeInitValues.entity.Code = defaultValues.Code;
						updateModeInitValues.entity.Description = defaultValues.Description;
						updateModeInitValues.entity.RubricCategoryFk = defaultValues.RubricCategoryFk;
						updateModeInitValues.entity.ResponsibleCompanyFk = defaultValues.ResponsibleCompanyFk;
						updateModeInitValues.entity.ProjectFk = defaultValues.ProjectFk;
						updateModeInitValues.entity.ClerkFk = defaultValues.ClerkFk;
						updateModeInitValues.entity.ContractTypeFk = defaultValues.ContractTypeFk;
					}

					return defaultValues;
				});
			};

			service.projectSelectedItemChangedHandler = function onSelectedItemChangedHandler(e, args) {
				var projectId = _.get(args, 'selectedItem.Id');
				setContractType(initDataItem, initDataItem.ConfigurationFk, projectId);

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

					// TODO: take over from project (see also take over logic from resetToDefault())

					// reset and suggest for current project a main bid
					args.entity.BidHeaderFk = null;
					suggestMainBidForChangeOrSide(args.entity);
				});
			};

			service.getFormConfig = function getFormConfig() {
				return {
					fid: 'sales.bid.createBidModal',
					version: '0.3.0',
					showGrouping: false,
					groups: [
						{
							gid: 'baseGroup',
							attributes: [
								'typefk', 'rubriccategoryfk', 'configurationfk', 'code', 'description', 'companyresponsiblefk',
								'clerkfk', 'projectfk', 'contracttypefk',
								'businesspartnerfk', 'subsidiaryfk', 'customerfk', 'bidheaderfk', 'prcstructurefk', 'prjchangefk'
							]
						}
					],
					rows: [
						// Bid Type
						basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm(
							'basics.customize.bidtype',
							'Description',
							{
								gid: 'baseGroup',
								rid: 'typeFk',
								model: 'TypeFk',
								required: true,
								sortOrder: 0,
								label$tr$: 'sales.bid.entityBidTypeFk',
								validator: onBidTypeChanged
							},
							false, // caution: this parameter is ignored by the function
							{
								required: true,
								customIntegerProperty: 'BAS_RUBRIC_CATEGORY_FK',
								filterKey: 'sales-bid-type-with-rubric-filter'
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
							asyncValidator: salesBidValidationService.asyncValidateRubricCategoryFk,
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'basics-lookupdata-rubric-category-by-rubric-and-company-lookup',
								descriptionMember: 'Description',
								lookupOptions: {
									filterKey: 'sales-bid-rubric-category-by-rubric-filter',
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
								filterKey: 'sales-bid-configuration-filter',
								showClearButton: true
							},
							validator: onConfigurationChanged
						},
						// Code
						{
							gid: 'baseGroup',
							rid: 'code',
							label$tr$: 'cloud.common.entityCode',
							model: 'Code',
							required: true,
							type: 'code',
							sortOrder: 2,
							validator: salesBidValidationService.validateCodeOnMode,
							asyncValidator: function (entity, value) {
								return $injector.get('salesBidValidationHelperService').asyncValidateCode(entity.CompanyFk, value);
							}
						},
						// Description
						{
							gid: 'baseGroup',
							rid: 'description',
							label$tr$: 'cloud.common.entityDescription',
							model: 'Description',
							type: 'description',
							sortOrder: 3
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
							sortOrder: 4,
							label$tr$: 'sales.common.entityCompanyResponsibleFk',
							validator: salesBidValidationService.validateCompanyResponsibleFk
						}
						),
						// Clerk
						{
							gid: 'baseGroup',
							rid: 'clerkFk',
							model: 'ClerkFk',
							sortOrder: 5,
							required: true,
							label: 'Clerk',
							label$tr$: 'basics.clerk.entityClerk',
							validator: salesBidValidationService.validateClerkFk,
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
							sortOrder: 6,
							required: true,
							label: 'Project Name',
							label$tr$: 'cloud.common.entityProjectName',
							type: 'directive',
							validator: salesBidValidationService.validateProjectFk,
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
							sortOrder: 7,
							required: true,
							label$tr$: 'sales.common.entityContracttypeFk',
							validator: salesBidValidationService.validateContractTypeFk
						}
						),
						// Businesspartner
						$injector.get('salesCommonLookupConfigsService').BusinessPartnerLookUpConfigForForm('salesBidService', 'salesBidValidationService'),
						// Subsidiary
						basicsLookupdataConfigGenerator.provideElaboratedLookupConfigForForm('business-partner-main-subsidiary-lookup', 'Subsidiary', 'AddressLine', false, {
							gid: 'baseGroup',
							rid: 'subsidiaryfk',
							model: 'SubsidiaryFk',
							required: true,
							validator: salesBidValidationService.validateBusinesspartnerFk,
							sortOrder: 9,
							label: 'Subsidiary',
							label$tr$: 'cloud.common.entitySubsidiary'
						}, 'sales-common-subsidiary-filter'
						),
						// Customer
						{
							gid: 'baseGroup',
							rid: 'customerfk',
							model: 'CustomerFk',
							sortOrder: 10,
							required: false,
							label: 'Customer',
							label$tr$: 'sales.common.entityCustomerFk',
							type: 'directive',
							validator: salesBidValidationService.validateCustomerFk,
							asyncValidator: salesBidValidationService.asyncValidateCustomerFk,
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
						// Main Bid
						overloadBidHeaderFk(),
						{
							gid: 'baseGroup',
							rid: 'prcstructurefk',
							type: 'directive',
							model: 'PrcStructureFk',
							required: false,
							label: 'Procurement Structure',
							label$tr$: 'basics.common.entityPrcStructureFk',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'basics-procurementstructure-structure-dialog',
								descriptionMember: 'DescriptionInfo.Translated',
								lookupOptions: {
									initValueField: 'StructureCode',
									showClearButton: true
								}
							},
							sortOrder: 12
						},
						// Project Change
						{
							gid: 'baseGroup',
							rid: 'prjchangefk',
							model: 'PrjChangeFk',
							required: false,
							sortOrder: 13,
							label: 'Project Change',
							label$tr$: 'sales.common.entityPrjChange',
							validator: function onPrjChangeChanged(entity /* , prjChangeFk */) {
								var isChangeOrSideQuote = (entity.BidHeaderFk !== null);
								platformRuntimeDataService.readonly(entity, [
									{field: 'BusinesspartnerFk', readonly: isChangeOrSideQuote},
									{field: 'SubsidiaryFk', readonly: isChangeOrSideQuote},
									{field: 'CustomerFk', readonly: isChangeOrSideQuote}
								]);
							},
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
											isProjectChange: true
										}
									},
									filterKey: 'sales-bid-project-change-common-filter'
								}
							}
						}
					]
				};
			};

			function overloadBidHeaderFk() {
				var ret;
				ret = basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
					dataServiceName: 'salesBidHeaderRefLookupDataService',
					filter: function (item) {
						if (item && item.ProjectChangeGenerateMode === 2) {
							return {
								Id: -1,
								ProjectFk: item.ProjectFk
							};
						} else if (item.BidId) {
							return item.BidId;// should set the bid code when using in "update bid"
						} else {
							return {
								Id: -1,
								ProjectFk: item.ProjectFk
							};
						}
					},
					showClearButton: true,
					events: [{
						name: 'onSelectedItemChanged',
						handler: function onSelectedItemChangedHandler(e, args) {
							onMainBidChanged(args.entity, args.selectedItem);
						}
					}]
				},
					{
						gid: 'baseGroup',
						rid: 'bidheaderfk',
						model: 'BidHeaderFk',
						required: false,
						visible: true,
						sortOrder: 11,
						label: 'Main Bid',
						label$tr$: 'sales.billing.entityBidHeaderFk'
					});

				ret.required = true;
				// adding bid status column
				ret.options.lookupOptions.columns.push({
					id: 'Status',
					field: 'BidStatusFk',
					name: 'Status',
					formatter: "lookup",
					name$tr$: 'entityBidStatusFk',
					formatterOptions: {
						displayMember: "Description",
						imageSelector: "platformStatusIconService",
						lookupModuleQualifier: "basics.customize.bidstatus",
						lookupSimpleLookup: true,
						valueMember: "Id"
					}
				});
				return ret;
			}

			function isValid(entity) {
				// TODO: replace with framework method (from runtime data service) as soon as available
				// check if validation errors are present
				if (_.some(_.values(_.get(entity, '__rt$data.errors')))) {
					return false;
				}

				let isTypeSettingsValid = true;
				if (_.get(entity, 'TypeEntity.IsChange') === true) {
					isTypeSettingsValid = entity.BidHeaderFk > 0;
				} else if (_.get(entity, 'TypeEntity.IsSide') === true) {
					isTypeSettingsValid = entity.BidHeaderFk > 0;
				}
				return isTypeSettingsValid && entity.TypeFk > 0 &&
					entity.RubricCategoryFk > 0 && entity.RubricCategoryFk !== null &&
					entity.ProjectFk !== null && entity.ProjectFk !== 0 &&
					entity.ClerkFk !== null && entity.ClerkFk !== 0 &&
					entity.ContractTypeFk !== null && entity.ContractTypeFk !== 0 &&
					entity.BusinesspartnerFk !== null && entity.BusinesspartnerFk !== 0 &&
					entity.SubsidiaryFk !== null && entity.SubsidiaryFk !== 0 &&
					entity.Code !== null && entity.Code !== '' && entity.Code !== 0;
			}

			service.validateDataItem = function validateDataItem(dataItem) {
				return isValid(dataItem);
			};

			service.showDialog = function createBid(onCreateFn, readOnlyRows) {
				var modalCreateBidConfig = {
					title: $translate.instant('sales.bid.createBidTitle'),
					dataItem: initDataItem,
					dialogOptions: {
						disableOkButton: function disableOkButton() {
							return !isValid(initDataItem);
						}
					},
					formConfiguration: service.getFormConfig(),
					handleOK: function handleOK(result) {
						var newBid = result.data;
						var creationData = service.getCreationDataFromDataItem(newBid);

						if (_.isFunction(onCreateFn)) {
							onCreateFn(creationData);
						}
					}
				};

				// apply field read only extensions, if available
				// and tranlate config
				$injector.get('salesCommonUtilsService').applyReadOnlyRows(readOnlyRows, modalCreateBidConfig.formConfiguration.rows);
				platformTranslateService.translateFormConfig(modalCreateBidConfig.formConfiguration);
				return platformModalFormConfigService.showDialog(modalCreateBidConfig);
			};

			// <editor-fold desc="[definition of filters]">
			basicsLookupdataLookupFilterService.registerFilter([
				{
					key: 'sales-bid-rubric-category-by-rubric-filter',
					serverKey: 'rubric-category-by-rubric-company-lookup-filter',
					serverSide: true,
					fn: function () {
						return { Rubric: salesCommonRubric.Bid };
					}
				},
				{
					key: 'sales-bid-configuration-filter',
					serverSide: true,
					fn: function (entity) {
						var rubricCat = entity.RubricCategoryFk > 0 ? ' AND RubricCategoryFk=' + entity.RubricCategoryFk : '';
						return `RubricFk=${salesCommonRubric.Bid}${rubricCat}`;
					}
				},
				{
					key: 'sales-bid-project-change-common-filter',
					serverSide: true,
					serverKey: 'sales-bid-project-change-common-filter',
					fn: function (item) {
						if (item.ProjectFk) {
							return {ProjectFk: item.ProjectFk};
						}
					}
				},
				{
					key: 'sales-bid-type-with-rubric-filter',
					fn: function (types) {
						var companyBidType = $injector.get('salesBidService').getCompanyCategoryList();
						if (companyBidType !== null && companyBidType.length > 0) {
							var filterData = _.filter(companyBidType, { 'RubricCategoryFk': types.BasRubricCategoryFk });
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

			salesCommonBusinesspartnerSubsidiaryCustomerService.registerFilters();
			// </editor-fold>

			service.resetToDefault();

			var configuredDataItem = {};

			service.extendDataItem = function extendDataItem(extendedDataItem) {
				configuredDataItem = extendedDataItem;
			};

			// <editor-fold desc="[public api (used e.g. in estimate)]">
			service.isValid = isValid;

			service.setBasicSettingsByProject = function setBasicSettingsByProject(projectId, entity) {
				return salesCommonDataHelperService.getProjectById(projectId).then(function (project) {
					if (project) {
						angular.extend(entity, {
							ClerkFk: project.ClerkFk,
							ProjectFk: project.Id,
							ContractTypeFk: project.ContractTypeFk,
							BusinesspartnerFk: project.BusinessPartnerFk,
							SubsidiaryFk: project.SubsidiaryFk,
							CustomerFk: project.CustomerFk
						});
					}
				});
			};

			service.getBidCreationSettings = function getBidCreationSettings(bidHeaderId, structureType) {
				return $injector.get('$http').get(globals.webApiBaseUrl + 'sales/bid/boq/getbidboqsettings?bidHeaderFk=' + bidHeaderId + '&structureType=' + structureType);
			};

			service.getCopyOfInitDataItem = function getCopyOfInitDataItem() {
				if ($injector.get('salesBidService').isConfigurableDialog()) {
					return angular.copy(configuredDataItem);
				} else {
					return angular.copy(initDataItem);
				}
			};

			service.getCreationDataFromDataItem = function getCreationDataFromDataItem(dataItem) {
				var newBid = dataItem;
				var creationData = {
					TypeFk: newBid.TypeFk,
					Code: newBid.Code,
					Description: newBid.DescriptionInfo ? newBid.DescriptionInfo.Translated : newBid.Description,
					RubricCategoryFk: newBid.RubricCategoryFk,
					ResponsibleCompanyFk: newBid.ResponsibleCompanyFk,
					ClerkFk: newBid.ClerkFk,
					ProjectFk: newBid.ProjectFk,
					ContractTypeFk: newBid.ContractTypeFk,
					CompanyFk: newBid.CompanyFk,
					BusinesspartnerFk: newBid.BusinesspartnerFk,
					SubsidiaryFk: newBid.SubsidiaryFk,
					CustomerFk: newBid.CustomerFk,
					BpdContactFk: newBid.BpdContactFk ? newBid.BpdContactFk : null,
					BusinesspartnerBilltoFk: newBid.BusinesspartnerBilltoFk ? newBid.BusinesspartnerBilltoFk : null,
					CustomerBilltoFk: newBid.CustomerBilltoFk ? newBid.CustomerBilltoFk : null,
					ContactBilltoFk: newBid.ContactBilltoFk ? newBid.ContactBilltoFk : null,
					SubsidiaryBilltoFk: newBid.SubsidiaryBilltoFk ? newBid.SubsidiaryBilltoFk : null,
					BidHeaderFk: !newBid.TypeEntity.IsMain ? newBid.BidHeaderFk : null,
					ConfigurationId: newBid.ConfigurationFk,
					PrcStructureFk: newBid.PrcStructureFk,
					PrjChangeFk: newBid.TypeEntity.IsChange ? newBid.PrjChangeFk : null,
					PlannedEnd: newBid.PlannedEnd ? newBid.PlannedEnd : null,
					PlannedStart: newBid.PlannedStart ? newBid.PlannedStart : null,
					PrcIncotermFk: newBid.PrcIncotermFk ? newBid.PrcIncotermFk : null,
					PriceFixingDate: newBid.PriceFixingDate ? newBid.PriceFixingDate : null,
					OrdPrbltyPercent: newBid.OrdPrbltyPercent ? newBid.OrdPrbltyPercent : null,
					ObjUnitFk: newBid.ObjUnitFk ? newBid.ObjUnitFk : null,
					ControllingUnitFk: newBid.ControllingUnitFk ? newBid.ControllingUnitFk : null,
					CommentText: newBid.CommentText ? newBid.CommentText : null,
					Remark: newBid.Remark ? newBid.Remark : null,
					UserDefined1: newBid.UserDefined1 ? newBid.UserDefined1 : null,
					UserDefined2: newBid.UserDefined2 ? newBid.UserDefined2 : null,
					UserDefined3: newBid.UserDefined3 ? newBid.UserDefined3 : null,
					UserDefined4: newBid.UserDefined4 ? newBid.UserDefined4 : null,
					UserDefined5: newBid.UserDefined5 ? newBid.UserDefined5 : null,
					UserDefinedDate01: newBid.UserDefinedDate01 ? newBid.UserDefinedDate01 : null,
					UserDefinedDate02: newBid.UserDefinedDate02 ? newBid.UserDefinedDate02 : null,
					UserDefinedDate03: newBid.UserDefinedDate03 ? newBid.UserDefinedDate03 : null,
					UserDefinedDate04: newBid.UserDefinedDate04 ? newBid.UserDefinedDate04 : null,
					UserDefinedDate05: newBid.UserDefinedDate05 ? newBid.UserDefinedDate05 : null
				};
				return creationData;
			};

			service.getCopyOfInitUrpDataItem = function getCopyOfInitUrpDataItem() {
				return angular.copy(urpDefault);
			};

			service.init = function init(dataItem) {
				angular.extend(initDataItem, dataItem);
			};
			// </editor-fold>

			return service;

		}]);
})();
