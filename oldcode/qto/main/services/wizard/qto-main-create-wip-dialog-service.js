(function () {
	'use strict';
	let moduleName = 'qto.main';

	angular.module(moduleName).factory('qtoMainCreateWipDialogService', ['globals','PlatformMessenger', '$http', '_', '$injector', '$translate', 'platformModalService', 'platformDataValidationService',
		'platformRuntimeDataService', 'platformContextService', 'platformTranslateService', 'platformModalFormConfigService', 'cloudDesktopPinningContextService',
		'basicsLookupdataConfigGenerator', 'platformUserInfoService', 'basicsClerkUtilitiesService', 'basicsLookupdataLookupFilterService', 'salesWipValidationService',
		'salesWipNumberGenerationSettingsService', 'salesBillingFilterService', 'salesBillingNumberGenerationSettingsService','platformGridAPI',
		function (globals, PlatformMessenger,$http, _, $injector, $translate, platformModalService, platformDataValidationService,
				  platformRuntimeDataService, platformContextService, platformTranslateService, platformModalFormConfigService,
				  cloudDesktopPinningContextService, basicsLookupdataConfigGenerator, platformUserInfoService, basicsClerkUtilitiesService,
				  basicsLookupdataLookupFilterService, salesWipValidationService, salesWipNumberGenerationSettingsService, salesBillingFilterService, salesBillingNumberGenerationSettingsService,platformGridAPI) {


			let service = {},
				// default item init values
				initDataItem = {},
				rubricCategoryList = [],
				qtoHeaderId = -1,
				purposeType = null,
				isUpdate = false,
				isCollectiveWip = false,
				contractGridId = null,
				salesConIds =[];

			let projectContext = _.find(cloudDesktopPinningContextService.getContext(), {token: 'project.main'});

			// lookup configs
			// sales configuration
			function setDefaultConfigurationByRubricCategory(rubricCat) {
				$injector.get('basicsLookupdataLookupDescriptorService').loadData('prcconfiguration').then(function (data) {
					let items = _.filter(data, {RubricCategoryFk: rubricCat});
					if (_.size(items) > 0) {
						initDataItem.ConfigurationFk = _.get(_.find(items, {IsDefault: true}), 'Id') || _.first(items).Id;
						validateSelectedConfiguration(initDataItem, initDataItem.ConfigurationFk);
					}
				});
			}
			// Rubric Category
			function validateSelectedRubricCategory(entity, value) {
				let hasToCreate = false;
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
				let lookupItem = $injector.get('basicsLookupdataLookupDescriptorService').getLookupItem('prcconfiguration', value);
				platformRuntimeDataService.readonly(entity, [{field: 'ContractTypeFk', readonly: lookupItem !== null}]);
				entity.ContractTypeFk = _.get(lookupItem, 'PrjContractTypeFk') || null;
			}

			service.onCodeChage = new PlatformMessenger();
			service.loadSalesContracts = new PlatformMessenger();
			service.salesContractIsMarkedChanged = new PlatformMessenger();

			service.setCollectiveWIP = function(value){
				isCollectiveWip = value;
			};

			service.getCollectiveWIP = function() {
				return isCollectiveWip;
			};

			service.getContractsFromServer = function getContractsFromServer(params){
				return $http.post(globals.webApiBaseUrl + 'qto/main/createwip/getsalescontractsbyproject', params);
			};

			service.getPrjContractTypeByConfiguration = function getPrjContractTypeByConfiguration(entity) {
				$injector.get('basicsLookupdataLookupDescriptorService').loadData('prcconfiguration').then(function (data) {
					let item = _.find(data, {Id: entity.ConfigurationFk});
					if(item){
						entity.ContractTypeFk = item.PrjContractTypeFk;
					}
				});
			};


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

			service.getListByQtoHeaderId = function getListByQtoHeaderId(type) {
				let qtoHeaderFk = service.getQtoHeaderId();
				return $http.get(globals.webApiBaseUrl + 'qto/main/detail/GetListByQtoHeaderId?qtoHeaderId=' + qtoHeaderFk+'&type=' + type);
			};


			service.getQtoCountByWipId = function getQtoCountByWipId(wipId) {
				let qtoHeaderFk = service.getQtoHeaderId();
				return $http.get(globals.webApiBaseUrl + 'qto/main/detail/getQtoCountByWipId?qtoHeaderId=' + qtoHeaderFk+'&wipHeaderFk='+wipId);
			};

			service.getQtoCountByBillId = function getQtoCountByBillId(bilId) {
				let qtoHeaderFk = service.getQtoHeaderId();
				return $http.get(globals.webApiBaseUrl + 'qto/main/detail/getQtoCountByBillId?qtoHeaderId=' + qtoHeaderFk+'&bilHeaderFk='+bilId);
			};

			service.setCodeFieldReadOnlyByRubricCategory = function (entity, rubricCatagoryId) {
				validateSelectedRubricCategory(entity, rubricCatagoryId);
			};

			let rubricCatLookupConfig = basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm(
				'basics.customize.rubriccategory',
				'Description',
				{
					gid: 'baseGroup',
					rid: 'rubricCategoryFk',
					model: 'RubricCategoryFk',
					required: true,
					sortOrder: 7,
					label: 'Rubric Category',
					label$tr$: 'project.main.entityRubric',
					validator: validateSelectedRubricCategory,
					asyncValidator: salesWipValidationService.asyncValidateRubricCategoryFk
				},
				false,
				{
					required: true,
					field: 'RubricFk',
					filterKey: 'sales-wip-rubric-category-by-rubric-filter2',
					customIntegerProperty: 'BAS_RUBRIC_FK'
				}
			);

			let previousWiplookupConfig = function (purposeType) {
				if (purposeType === 'wip') {
					return {
						gid: 'baseGroup',
						rid: 'PreviousWipFk',
						model: 'PreviousWipFk',
						label: 'Previous WIP',
						label$tr$: 'sales.wip.previousWip',
						sortOrder: 8,
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'sales-common-wip-dialog-v2',
							descriptionMember: 'DescriptionInfo.Translated',
							lookupOptions: {
								filterKey: 'sales-wip-set-previous-wip-wizard-filter',
								showClearButton: true,
								events: [
									{
										name: 'onSelectedItemChanged',
										handler: function (e, args) {
											let selectedItem = args.entity;
											let selectedLookupItem = args.selectedItem;

											// pre-assign project from selected wip
											if (selectedItem && selectedLookupItem) {
												selectedItem.ProjectFk = selectedLookupItem.ProjectFk;
												selectedItem.OrdHeaderFk = selectedLookupItem.OrdHeaderFk;
											}
										}
									}
								]
							}
						}
					};
				} else {
					return {};
				}
			};

			let previousBilllookupConfig = function (purposeType){
				if(purposeType === 'bill'){
					return {
						gid: 'baseGroup',
						rid: 'PreviousBillFk',
						model: 'PreviousBillFk',
						label: 'Previous Bill',
						label$tr$: 'sales.common.PreviousBill',
						sortOrder: 8,
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'sales-common-bill-dialog-v2',
							descriptionMember: 'DescriptionInfo.Translated',
							lookupOptions: {
								filterKey: 'sales-billing-set-previous-bill-wizard-filter',
								showClearButton: true,
								events: [
									{
										name: 'onSelectedItemChanged',
										handler: function (e, args) {
											let selectedItem = args.entity;
											let selectedLookupItem = args.selectedItem;

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
					};
				}else{
					return {};
				}
			};

			service.resetToDefault = function () {
				let context = platformContextService.getContext(),
					userId = _.get(platformUserInfoService.getCurrentUserInfo(), 'UserId', -1);
				isCollectiveWip = false;
				contractGridId =  null;

				// default item init values
				initDataItem = {
					// company defaulted with the login company, never shown in the ui
					CompanyFk: context.clientId,
					// ui fields
					Code: '',
					DescriptionInfo: '',
					OrdHeaderFk: null,
					RubricCategoryFk: 0,
					ResponsibleCompanyFk: context.signedInClientId,
					ClerkFk: null,
					ProjectFk: null,
					ContractTypeFk: 0,
					updateWith: 1,
					TypeFk: 0
				};

				// user id -> clerk
				basicsClerkUtilitiesService.getClerkByUserId(userId).then(function (clerk) {
					initDataItem.ClerkFk = clerk && clerk.IsLive ? clerk.Id : null;
				});

				$injector.get('basicCustomizeSystemoptionLookupDataService').getParameterValueAsync(10128).then(function(value) {
					initDataItem.AllowCUWipBillWithoutWipBillAssginment = value && (value === '1' || value.toLowerCase() === 'true');
				});

				// project id from pinning context if available
				if (projectContext) {
					initDataItem.ProjectFk = projectContext.id;
				}

				// set default contract type
				$injector.get('basicsLookupdataSimpleLookupService').getList({
					lookupModuleQualifier: 'project.main.contracttype',
					displayMember: 'Description',
					valueMember: 'Id'
				}).then(function (data) {
					let defaultItem = _.find(data, {isDefault: true});
					initDataItem.ContractTypeFk = _.get(defaultItem, 'Id') || 0;
				});

				// set default rubric category
				let lookupService = 'basicsMasterDataRubricCategoryLookupDataService';
				let rubricCategoryDataService = $injector.get(lookupService);

				let filterRubricFk = (service.getPurposeType() === 'bill') ? 7 : 17; // bill is 7 ,wip is 17

				rubricCategoryDataService.setFilter(filterRubricFk); // WIP ([BAS_RUBRIC])
				rubricCategoryDataService.getList({lookupType: lookupService}).then(function (data) {
					service.setRubricCategoryList(data);
					let defaultItem = _.find(data, {IsDefault: true, RubricFk: filterRubricFk});
					initDataItem.RubricCategoryFk = _.get(defaultItem, 'Id') || 0;
					validateSelectedRubricCategory(initDataItem, initDataItem.RubricCategoryFk);
				});

			};

			service.resetToDefault();
			salesBillingFilterService.registerBillingFilters();

			// additional helper functions
			let orderedList = [];
			let contractStatus =[];

			basicsLookupdataLookupFilterService.registerFilter([
				{
					key: 'sales-wip-contract-filter2',
					serverKey: 'sales-wip-contract-filter2',
					serverSide: true,
					fn: function (contract) {
						return {
							ContractIds: salesConIds,
							ProjectId: contract.ProjectFk
						};
					}
				},
				{
					key: 'sales-wip-rubric-category-by-rubric-filter2',
					fn: function (rubricCategory /* , entity */) {
						if (service.getPurposeType() === 'bill') {
							return rubricCategory.RubricFk === 7;  // BILL ([BAS_RUBRIC])
						}
						return rubricCategory.RubricFk === 17;  // WIP ([BAS_RUBRIC])
					}
				},
				{
					key: 'sales-wip-configuration-filter2',
					serverSide: true,
					fn: function (entity) {
						let rubricCat = entity.RubricCategoryFk > 0 ? 'RubricCategoryFk=' + entity.RubricCategoryFk : '';
						return  rubricCat;   // Order Confirmation ([BAS_RUBRIC])
					}
				},
				{
					key: 'sales-wip-set-previous-wip-wizard-filter',
					serverKey: 'sales-wip-previouswip-filter-by-server-in-qto',
					serverSide: true,
					fn: function (dlgEntity /* , state */) {
						let param = {};
						param.ProjectId = dlgEntity.ProjectFk;
						param.ContractIds = [];
						param.ContractId = dlgEntity.OrdHeaderFk;
						param.PrjBoqHeaderFk = dlgEntity.BoqHeaderFk;

						param.ContractIds = [];
						if (dlgEntity.OrdHeaderFk > 0) {
							param.ContractIds.push(dlgEntity.OrdHeaderFk);
						}

						let contractGridId = service.getContractGridId();
						if(contractGridId) {
							let contractGrid = platformGridAPI.grids.element('id',contractGridId);
							if (contractGrid) {
								let contracts = contractGrid.dataView.getItems();
								if (contracts && contracts.length) {
									let isMarkedCons = _.filter(contracts, {'IsMarked': true});
									if (isMarkedCons.length > 0) {
										param.ContractIds = _.map(isMarkedCons, 'Id');

										_.filter(isMarkedCons, function (d) {
											if (d.OrdHeaderFk) {
												param.ContractIds.push(d.OrdHeaderFk);
											}
										});
									}
								}
							}
						}
						return param;
					}
				},
				{
					key: 'sales-billing-set-previous-bill-wizard-filter',
					serverKey: 'sales-billing-previous-bill-from-contract-in-qto',
					serverSide: true,
					fn: function (dlgEntity) {
						return {
							ContractId: dlgEntity.OrdHeaderFk,
							ProjectFk:dlgEntity.ProjectFk,
							PrjBoqHeaderFk:dlgEntity.BoqHeaderFk
						};
					}
				}

			]);

			service.init = function init(dataItem) {
				angular.extend(initDataItem, dataItem);
			};

			service.getContractGridId = function(){
				return contractGridId;
			};

			service.setContractGridId = function(value){
				contractGridId = value;
			};

			service.setSalesConIds = function(value){
				salesConIds = value;
			};
			service.getCodeConfig = function getCodeConfig() {
				if (isUpdate) {
					return {
						gid: 'baseGroup',
						rid: 'code',
						label$tr$: 'cloud.common.entityCode',
						type: 'code', // set this as code type first, and it will be changed by option user check
						directive: 'qto-main-wip-code-grid-selector',
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
						asyncValidator: salesWipValidationService.asyncValidateCode
					};
				}
			};

			service.getBusinessPartnerConfig = function getBusinessPartnerConfig(purposeType) {
				if (isUpdate && purposeType !=='wip') {
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

			service.getBranchConfig = function getBranchConfig(purposeType) {
				if (isUpdate && purposeType !=='wip') {
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

			service.getCustomerConfig = function getCustomerConfig(purposeType) {
				if (isUpdate && purposeType !=='wip') {
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
						sortOrder: 6,
						readonly: true
					};
				} else {
					return {};
				}
			};

			service.getIsOrdQuantityOnlyConfig = function getIsOrdQuantityOnlyConfig() {
				let sortOrder = purposeType === 'wip' ? 3 : 1;
				if (isUpdate) {
					return {
						gid: 'baseGroup',
						rid: 'isOrdQuantityOnly',
						label: 'Contract Quantities Only',
						label$tr$: 'qto.main.wizard.create.wip.IsOrdQuantityOnly',
						type: 'boolean',
						model: 'IsOrdQuantityOnly',
						readonly: false,
						sortOrder: sortOrder
					};
				} else {
					return {};
				}
			};

			service.getIsCollectiveWipConfig = function (purposeType){
				if(purposeType ==='wip') {
					return {
						gid: 'baseGroup',
						rid: 'iscollectivewip',
						label: 'Collective WIP',
						label$tr$: 'qto.main.wizardCWCreateWipContractsCollectiveWIPOption',
						type: 'boolean',
						model: 'IsCollectiveWip',
						checked: false,
						disabled: false,
						visible: true,
						readonly:false,
						sortOrder: 4,
						change: function (item) {
							service.loadSalesContracts.fire(item.IsCollectiveWip);
						}
					};
				}else{
					return {};
				}
			};

			service.getSaleContractsGrid = function(purposeType) {
				let sortOrder = purposeType === 'wip' ? 5 : 2;
				return {
					gid: 'baseGroup',
					rid: 'contractsGrid',
					label: 'Contracts',
					label$tr$: 'qto.main.wizardCWCreateWipContractsGridLabel',
					type: 'directive',
					directive: 'qto-main-wip-wizard-sales-contract-grid',
					options: {
						contractServiceName: 'qtoMainCreateWipDialogService',
						getListName: 'getContractsFromServer'
					},
					readonly: true, disabled: false, maxlength: 5000, rows: 20, visible: true,
					sortOrder: sortOrder
				};
			};

			service.getSingleSaleContracts = function(purposeType){
				if(purposeType ==='bill'){
					return {
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
								filterKey: 'sales-wip-contract-filter2',
								showClearButton: false,
								events: [
									{
										name: 'onSelectedItemChanged',
										handler: function (e, args) {
											let selectedItem = args.entity;
											let selectedLookupItem = args.selectedItem;
											selectedItem.PreviousBillFk = null;

											// pre-assign project from selected contract
											if (selectedItem && selectedLookupItem) {
												selectedItem.ProjectFk = selectedLookupItem.ProjectFk;
												selectedItem.ContractTypeFk = selectedLookupItem.ContractTypeFk;
												selectedItem.BusinessPartnerFk = selectedLookupItem.BusinesspartnerFk;
												selectedItem.SubsidiaryFk = selectedLookupItem.SubsidiaryFk;
												selectedItem.CustomerFk = selectedLookupItem.CustomerFk;
												selectedItem.ResponsibleCompanyFk = selectedLookupItem.CompanyResponsibleFk;

												// set default PreviousBillFk
												$injector.get('salesCommonDataHelperService').suggestPreviousBillId(selectedLookupItem.Id).then(function (response) {
													if (response && response.data && response.data > 0) {
														selectedItem.PreviousBillFk = response.data;
													}
												});
											}
										}
									}
								],
								dialogOptions: {
									alerts: [{
										theme: 'info',
										message: $translate.instant('sales.wip.assignContractStatusInfo',
											{statuslist: _.join(contractStatus, '" ' + $translate.instant('cloud.common.conjunctionOr') + ' "')})
									}]
								}
							}
						}
					};
				}else{
					return {};
				}
			};

			service.getFormConfig = function getFormConfig(purposeType) {
				return {
					fid: 'sales.wip.createWipModal',
					version: '0.0.1',
					showGrouping: false,
					groups: [
						{
							gid: 'baseGroup',
							attributes: [
								'ordheaderfk', 'rubriccategoryfk', 'code', 'descriptioninfo', 'companyresponsiblefk',
								'clerkfk', 'projectfk', 'contracttypefk', 'performedfrom', 'performedto', 'typefk', 'previouswipfk', 'previousbillfk'
							]
						}
					],
					rows: [
						// Contract

						// service.getBusinessPartnerConfig(purposeType), // BusinessPartner Config
						// service.getBranchConfig(purposeType), // Branch Config
						// service.getCustomerConfig(purposeType), // Customer Config
						service.getIsOrdQuantityOnlyConfig(),

						// service.getSingleSaleContracts(purposeType),

						service.getIsCollectiveWipConfig(purposeType),
						service.getSaleContractsGrid(purposeType),

						rubricCatLookupConfig, // Rubric Category
						previousWiplookupConfig(purposeType), // previous wip for create wip
						previousBilllookupConfig(purposeType), // previous bill for create bill
						{
							gid: 'baseGroup',
							rid: 'configurationfk',
							label: 'Configuration',
							label$tr$: 'sales.common.entityConfigurationFk',
							type: 'directive',
							model: 'ConfigurationFk',
							directive: 'basics-configuration-configuration-combobox',
							options: {
								filterKey: 'sales-wip-configuration-filter2',
								showClearButton: true
							},
							sortOrder: 8,
							validator: validateSelectedConfiguration
						}, // Sales Configuration
						service.getCodeConfig(),
						// Description
						{
							gid: 'baseGroup',
							rid: 'descriptioninfo',
							label: 'Description',
							label$tr$: 'cloud.common.entityDescription',
							model: 'DescriptionInfo',
							type: 'translation',
							sortOrder: 9
						},
						{
							rid: 'UpdateWith',
							gid: 'baseGroup',
							label: 'Update With',
							label$tr$: 'qto.main.wizard.create.wip.updateWith',
							type: 'radio', model: 'updateWith',
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
								sortOrder: 6
							},
							false,
							{
								required: true,
								customIntegerProperty: 'BAS_RUBRIC_CATEGORY_FK'
							}
						),
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
									filterKey: 'sales-common-project-filterkey'
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
							validator: salesWipValidationService.validateContract
						}),
						{
							gid: 'baseGroup',
							rid: 'performedFrom',
							label: 'Performed From',
							label$tr$: 'sales.common.entityPerformedFrom',
							validator: salesWipValidationService.validatePerformedFrom,
							model: 'PerformedFrom',
							type: 'dateutc',
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
							sortOrder: 15
						}
					]
				};

			};

			service.showDialog = function createWip(onCreateFn, isUpdateWizard, readOnlyRows, unvisibleRows, purposeType) {

				$injector.get('salesContractStatusLookupDataService').getList({dataServiceName: 'salesContractStatusLookupDataService'}).then(function (list) {
					orderedList = _.filter(list, {IsOrdered: true});
					contractStatus = _.uniq(_.map(orderedList, 'DescriptionInfo.Translated'));

					isUpdate = isUpdateWizard;

					let modalCreateWipConfig = {
						title: purposeType === 'bill' ? $translate.instant('qto.main.wizard.create.wip.createBillTitle') : $translate.instant('sales.wip.createWipTitle'),
						dataItem: initDataItem,
						formConfiguration: service.getFormConfig(purposeType),
						handleOK: function handleOK(result) {
							let newWip = result.data;
							let creationData = {
								BidHeaderFk: newWip.BidHeaderFk,
								Code: newWip.Code,
								BaseOrdHeaderFk: newWip.OrdHeaderFk,
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
								PrevWipHeaderFk: newWip.PreviousWipFk,
								PreviousBillFk: newWip.PreviousBillFk,
								QtoScope: newWip.QtoScope,
								QtoDetailIds:newWip.QtoDetailIds,
								RelatedOrdHeaderFks: newWip.OrdHeaderFks,
								ConfigurationId: newWip.ConfigurationFk,
								SubsidiaryFk:newWip.SubsidiaryFk,
								BusinessPartnerFk:newWip.BusinessPartnerFk,
								CustomerFk:newWip.CustomerFk,
								WipHeaderFk:newWip.WipHeaderFk,
								IsCollectiveWip:newWip.IsCollectiveWip,
								DescriptionInfo :newWip.DescriptionInfo
							};

							if (_.isFunction(onCreateFn)) {
								onCreateFn(creationData);
							}
						}
					};

					platformTranslateService.translateFormConfig(modalCreateWipConfig.formConfiguration);
					let headerText = isUpdateWizard ? (purposeType === 'bill' ? 'qto.main.wizard.create.wip.createBillTitle' : 'qto.main.wizard.create.wip.createWipTitle') : 'sales.wip.createWipTitle';

					platformModalService.showDialog({
						headerText: $translate.instant(headerText),
						dataItem: initDataItem,
						templateUrl: globals.appBaseUrl + 'qto.main/templates/qto-main-create-wizard-dialog-template.html',
						backdrop: false,
						width: '1000px',
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

			return service;

		}]);
})();
