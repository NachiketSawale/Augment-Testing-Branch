(function (angular) {

	'use strict';
	let basicsCompanyModule = angular.module('basics.company');

	/**
	 * @ngdoc service
	 * @name basicsCompanyContainerInformationService
	 * @function
	 *
	 * @description
	 *
	 */
	basicsCompanyModule.service('basicsCompanyContainerInformationService', BasicsCompanyContainerInformationService);

	BasicsCompanyContainerInformationService.$inject = ['$injector', 'platformLayoutHelperService', 'basicsLookupdataConfigGenerator',
		'basicsCompanyConstantValues', 'platformContextService', 'basicsLookupdataLookupFilterService'];

	function BasicsCompanyContainerInformationService($injector, platformLayoutHelperService, basicsLookupdataConfigGenerator, basicsCompanyConstantValues, platformContextService, basicsLookupdataLookupFilterService) {
		let self = this;
		let guids = basicsCompanyConstantValues.uuid.container;

		(function registerFilter(){
			let logisticSettlementRelatedFilter = [
				{
					key: 'logistic-settlement-category-by-rubric-filter',
					fn: function (rubricCategory) {
						return rubricCategory.RubricFk === 36;  // Rubric for Intercompany settlement
					}
				},

			];
			basicsLookupdataLookupFilterService.registerFilter(logisticSettlementRelatedFilter);
		})();

		this.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			let config = {};
			let layServ = null;
			switch (guid) {
				case '60355de3d08848ebaadf73aaeac28f92': // basicsCompany2BasClerkController
					layServ = $injector.get('basicsCompany2BasClerkUIStandardService');
					config.layout = layServ.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'basicsCompany2BasClerkUIStandardService';
					config.dataServiceName = 'basicsCompany2BasClerkService';
					config.validationServiceName = 'basicsCompany2BasClerkValidationService';
					config.listConfig = {initCalled: false, columns: []};
					break;
				case 'd6f4fc0fb41f43e48bcb8976961f5339': // basicsCompany2BasClerkDetailController
					layServ = $injector.get('basicsCompany2BasClerkUIStandardService');
					config = layServ.getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'basicsCompany2BasClerkUIStandardService';
					config.dataServiceName = 'basicsCompany2BasClerkService';
					config.validationServiceName = 'basicsCompany2BasClerkValidationService';
					break;
				case 'D006FFC4E4764CF68E2DF6865DC5F04E': // basicsCompanyCategoryController
					layServ = $injector.get('basicsCompanyCategoryUIStandardService');
					config.layout = layServ.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'basicsCompanyCategoryUIStandardService';
					config.dataServiceName = 'basicsCompanyCategoryService';
					config.validationServiceName = 'basicsCompanyCategoryValidationService';
					config.listConfig = {initCalled: false, columns: []};
					break;
				case 'E8B8B6571FE64C90925A0FC49486AC64': // basicsCompanyCategoryDetailController
					layServ = $injector.get('basicsCompanyCategoryUIStandardService');
					config = layServ.getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'basicsCompanyCategoryUIStandardService';
					config.dataServiceName = 'basicsCompanyCategoryService';
					config.validationServiceName = 'basicsCompanyCategoryValidationService';
					break;
				case '1ED887BEC41F43CEA694ADA8C4C25254': // basicsCompanyClerkController
					layServ = $injector.get('basicsCompanyClerkUIStandardService');
					config.layout = layServ.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'basicsCompanyClerkUIStandardService';
					config.dataServiceName = 'basicsCompanyClerkService';
					config.validationServiceName = 'basicsCompanyClerkValidationService';
					config.listConfig = {initCalled: false, columns: []};
					break;
				case '0a559d46ddd94140832c7e36e2adbf0f': // basicsCompanyClerkDetailController
					layServ = $injector.get('basicsCompanyClerkUIStandardService');
					config = layServ.getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'basicsCompanyClerkUIStandardService';
					config.dataServiceName = 'basicsCompanyClerkService';
					config.validationServiceName = 'basicsCompanyClerkValidationService';
					break;
				case '50593FEEA9FE4280B36F72E27C8DFDA1': // basicsCompanyTreeController
					layServ = $injector.get('basicsCompanyUIStandardService');
					config.layout = layServ.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'basicsCompanyUIStandardService';
					config.dataServiceName = 'basicsCompanyMainService';
					config.validationServiceName = 'basicsCompanyValidationService';
					config.listConfig = {initCalled: false, columns: [], parentProp: 'CompanyFk', childProp: 'Companies'};
					break;
				case '44c2c0adb0c9408fb873b8c395aa5e08': // basicsCompanyDetailController
					layServ = $injector.get('basicsCompanyUIStandardService');
					config = layServ.getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'basicsCompanyUIStandardService';
					config.dataServiceName = 'basicsCompanyMainService';
					config.validationServiceName = 'basicsCompanyValidationService';
					break;
				// basicsCompanyNumberController //basicsCompanyNumberDetailController //Missing!!!!
				case 'EC18C54522AA46FE9848F466875AA03C': // basicsCompanyPeriodsController
					layServ = $injector.get('basicsCompanyPeriodsUIStandardService');
					config.layout = layServ.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'basicsCompanyPeriodsUIStandardService';
					config.dataServiceName = 'basicsCompanyPeriodsService';
					config.validationServiceName = 'basicsCompanyPeriodsValidationService';
					config.listConfig = {initCalled: false, columns: []};
					break;
				case '0d38d21d14d8475c9206c3eb346f63be': // basicsCompanyPeriodsDetailController
					layServ = $injector.get('basicsCompanyPeriodsUIStandardService');
					config = layServ.getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'basicsCompanyPeriodsUIStandardService';
					config.dataServiceName = 'basicsCompanyPeriodsService';
					config.validationServiceName = 'basicsCompanyPeriodsValidationService';
					break;
				case '041F24C6D4B34C0B9C56869B2B4D9E46': // basicsCompanySurchargeController
					layServ = $injector.get('basicsCompanySurchargeUIStandardService');
					config.layout = layServ.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'basicsCompanySurchargeUIStandardService';
					config.dataServiceName = 'basicsCompanySurchargeService';
					config.validationServiceName = 'basicsCompanySurchargeValidationService';
					config.listConfig = {initCalled: false, columns: []};
					break;
				case 'fadeac1901cc49589626297a0ee5cd42': // basicsCompanySurchargeDetailController
					layServ = $injector.get('basicsCompanySurchargeUIStandardService');
					config = layServ.getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'basicsCompanySurchargeUIStandardService';
					config.dataServiceName = 'basicsCompanySurchargeService';
					config.validationServiceName = 'basicsCompanySurchargeValidationService';
					break;
				case 'E94283E1A1764BD1AEF87344095773FA': // basicsCompanyTextModuleController
					layServ = $injector.get('basicsCompanyTextModuleUIStandardService');
					config.layout = layServ.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'basicsCompanyTextModuleUIStandardService';
					config.dataServiceName = 'basicsCompanyTextModuleService';
					config.validationServiceName = 'basicsCompanyTextModuleValidationService';
					config.listConfig = {initCalled: false, columns: []};
					break;
				case 'b22a1b0792e44782848001641da08ceb': // basicsCompanyTextModuleDetailController
					layServ = $injector.get('basicsCompanyTextModuleUIStandardService');
					config = layServ.getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'basicsCompanyTextModuleUIStandardService';
					config.dataServiceName = 'basicsCompanyTextModuleService';
					config.validationServiceName = 'basicsCompanyTextModuleValidationService';
					break;
				case 'd61ab24bcd2b4985a86d129e1a172747': // basicsCompanyUrlListController
					layServ = $injector.get('basicsCompanyUrlUIStandardService');
					config.layout = layServ.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'basicsCompanyUrlUIStandardService';
					config.dataServiceName = 'basicsCompanyUrlService';
					config.validationServiceName = 'basicsCompanyUrlValidationService';
					config.listConfig = {initCalled: false, columns: []};
					break;
				case '94bdf16eaa544517805a0c02a9d584b4': // basicsCompanyUrlDetailController
					layServ = $injector.get('basicsCompanyUrlUIStandardService');
					config = layServ.getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'basicsCompanyUrlUIStandardService';
					config.dataServiceName = 'basicsCompanyUrlService';
					config.validationServiceName = 'basicsCompanyUrlValidationService';
					break;
				case 'B13485C47DE64239B64A9D573E03ABA4': // basicsCompanyYearController
					layServ = $injector.get('basicsCompanyYearUIStandardService');
					config.layout = layServ.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'basicsCompanyYearUIStandardService';
					config.dataServiceName = 'basicsCompanyYearService';
					config.validationServiceName = 'basicsCompanyYearValidationService';
					config.listConfig = {initCalled: false, columns: []};
					break;
				case '268efaf3c6a6485eb1bb03a6d989ef43': // basicsCompanyYearDetailController
					layServ = $injector.get('basicsCompanyYearUIStandardService');
					config = layServ.getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'basicsCompanyYearUIStandardService';
					config.dataServiceName = 'basicsCompanyYearService';
					config.validationServiceName = 'basicsCompanyYearValidationService';
					break;
				case 'a6c699f919384122bcce8540f67602c1': // basicsCompanyUtilisableGroupListController
					layServ = $injector.get('basicsCompanyUtilisableGroupUIStandardService');
					config.layout = layServ.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'basicsCompanyUtilisableGroupUIStandardService';
					config.dataServiceName = 'basicsCompanyUtilisableGroupService';
					config.validationServiceName = 'basicsCompanyUtilisableGroupValidationService';
					config.listConfig = {initCalled: false, columns: []};
					break;
				case '76063ce5e89f4c9bbb571b1c431244bc': // basicsCompanyUtilisableGroupDetailController
					layServ = $injector.get('basicsCompanyUtilisableGroupUIStandardService');
					config = layServ.getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'basicsCompanyUtilisableGroupUIStandardService';
					config.dataServiceName = 'basicsCompanyUtilisableGroupService';
					config.validationServiceName = 'basicsCompanyUtilisableGroupValidationService';
					break;
				case '4b65cdfbf33b45e683d06779a5e05574': // basicsCompanyTransheaderController
					layServ = $injector.get('basicsCompanyTransheaderUIStandardService');
					config.layout = layServ.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'basicsCompanyTransheaderUIStandardService';
					config.dataServiceName = 'basicsCompanyTransheaderService';
					config.validationServiceName = 'basicsCompanyTransheaderValidationService';
					config.listConfig = {initCalled: false, columns: []};
					break;
				case 'a7f63cb15a8e4820a0dd673e457360c6': // basicsCompanyTransheaderDetailController
					layServ = $injector.get('basicsCompanyTransheaderUIStandardService');
					config = layServ.getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'basicsCompanyTransheaderUIStandardService';
					config.dataServiceName = 'basicsCompanyTransheaderService';
					config.validationServiceName = 'basicsCompanyTransheaderValidationService';
					break;
				case 'a47073dd69804cd2947d6a218433f6fb': // basicsCompanyTransactionController
					layServ = $injector.get('basicsCompanyTransactionUIStandardService');
					config.layout = layServ.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'basicsCompanyTransactionUIStandardService';
					config.dataServiceName = 'basicsCompanyTransactionService';
					config.validationServiceName = 'basicsCompanyTransactionValidationService';
					config.listConfig = {initCalled: false, columns: []};
					break;
				case 'd8758247b1a1461b8bf7d801bf019863': // basicsCompanyTransactionDetailController
					layServ = $injector.get('basicsCompanyTransactionUIStandardService');
					config = layServ.getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'basicsCompanyTransactionUIStandardService';
					config.dataServiceName = 'basicsCompanyTransactionService';
					config.validationServiceName = 'basicsCompanyTransactionValidationService';
					break;
				case 'd2e263bf9a1240f3bcf041c4fcad67dc': // basicsCompanyDeferaltypeController
					layServ = $injector.get('basicsCompanyDeferaltypeUIStandardService');
					config.layout = layServ.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'basicsCompanyDeferaltypeUIStandardService';
					config.dataServiceName = 'basicsCompanyDeferaltypeService';
					config.validationServiceName = 'basicsCompanyDeferaltypeValidationService';
					config.listConfig = {initCalled: false, columns: []};
					break;
				case '29f12eb12f6f4f639569f812c24cc282': // basicsCompanyDeferaltypeDetailController
					layServ = $injector.get('basicsCompanyDeferaltypeUIStandardService');
					config = layServ.getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'basicsCompanyDeferaltypeUIStandardService';
					config.dataServiceName = 'basicsCompanyDeferaltypeService';
					config.validationServiceName = 'basicsCompanyDeferaltypeValidationService';
					break;
				case '53ce3acd0703462abe01e899b4b9c4fa': // basicsCompanyCreateRoleController
					layServ = $injector.get('basicsCompanyCreateRoleUIStandardService');
					config.layout = layServ.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'basicsCompanyCreateRoleUIStandardService';
					config.dataServiceName = 'basicsCompanyCreateRoleService';
					config.validationServiceName = 'basicsCompanyCreateRoleValidationService';
					config.listConfig = {initCalled: false, columns: []};
					break;
				case '26a0309eaa0843ccab4eb2f60c1ac508': // basicsCompanyCreateRoleDetailController
					layServ = $injector.get('basicsCompanyCreateRoleUIStandardService');
					config = layServ.getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'basicsCompanyCreateRoleUIStandardService';
					config.dataServiceName = 'basicsCompanyCreateRoleService';
					config.validationServiceName = 'basicsCompanyCreateRoleValidationService';
					break;
				case '05639a870ca24107b71b7b7501851c93': // basicsCompanyControllingGroupListController
					layServ = $injector.get('basicsCompanyControllingGroupUIStandardService');
					config.layout = layServ.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'basicsCompanyControllingGroupUIStandardService';
					config.dataServiceName = 'basicsCompanyControllingGroupService';
					config.validationServiceName = 'basicsCompanyControllingGroupValidationService';
					config.listConfig = {initCalled: false, columns: []};
					break;
				case 'bed9a6d24ff846feb25ff940c56f5778': // basicsCompanyControllingGroupDetailController
					layServ = $injector.get('basicsCompanyControllingGroupUIStandardService');
					config = layServ.getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'basicsCompanyControllingGroupUIStandardService';
					config.dataServiceName = 'basicsCompanyControllingGroupService';
					config.validationServiceName = 'basicsCompanyControllingGroupValidationService';
					break;
				case 'a855590680c442409dff5ee324e97071': // basicsCompanyTrsConfigListController
					layServ = $injector.get('basicsCompanyTrsConfigUIStandardService');
					config.layout = layServ.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'basicsCompanyTrsConfigUIStandardService';
					config.dataServiceName = 'basicsCompanyTrsConfigService';
					config.validationServiceName = 'basicsCompanyTrsConfigValidationService';
					config.listConfig = {initCalled: false, columns: []};
					break;
				case '6100bba551854fbcb1f2570b02a1405d': // basicsCompanyTrsConfigDetailController
					layServ = $injector.get('basicsCompanyTrsConfigUIStandardService');
					config = layServ.getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'basicsCompanyTrsConfigUIStandardService';
					config.dataServiceName = 'basicsCompanyTrsConfigService';
					config.validationServiceName = 'basicsCompanyTrsConfigValidationService';
					break;
				case guids.companyCreditorList: // basicsCompanyCreditorListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getCreditorServiceInfo(), self.getCreditorLayout);
					break;
				case guids.companyCreditorDetails: // basicsCompanyCreditorDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getCreditorServiceInfo(), self.getCreditorLayout);
					break;
				case guids.companyDebtorList: // basicsCompanyDebtorListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getDebtorServiceInfo(), self.getDebtorLayout);
					break;
				case guids.companyDebtorDetails: // basicsCompanyDebtorDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getDebtorServiceInfo(), self.getDebtorLayout);
					break;
				case guids.timekeepingGroupList: // basicsCompanyTimekeepingGroupListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getTimekeepingGroupServiceInfo(), self.getTimekeepingGroupLayout);
					break;
				case guids.timekeepingGroupDetails: // basicsCompanyTimekeepingGroupDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getTimekeepingGroupServiceInfo(), self.getTimekeepingGroupLayout);
					break;
				case guids.companyICCuList: // basicsCompanyTimekeepingGroupListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getCompanyICCuServiceInfo(), self.getCompanyICCuLayout);
					break;
				case guids.companyICCuDetails: // basicsCompanyTimekeepingGroupDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getCompanyICCuServiceInfo(), self.getCompanyICCuLayout);
					break;
				case '5f2c8f5b4d24470f8ff69e81a129f5b8': // basicsCompanyProjectGroupListController
					config = platformLayoutHelperService.getGridConfig(self.getProjectGroupServiceInfos(),
						self.getProjectGroupLayout,
						{
							initCalled: false,
							columns: [],
							parentProp: 'ProjectGroupFk',
							childProp: 'ProjectGroupChildren'
						});
					break;
				case 'c1592f6e58514d3e904e9e5a4a046e35': // basicsCompanyProjectGroupDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getProjectGroupServiceInfos(), self.getProjectGroupLayout);
					break;
				case '3b739717fa8e4a04941a5824a1f606de': // basicsCompanyStockEvaluationRuleController
					config = platformLayoutHelperService.getStandardGridConfig(self.getStockEvaluationRuleServiceInfo(), self.getStockEvaluationRuleLayout);
					break;
				case '5b80291b17714d7dab952bcd22ca5b26': // basicsCompanyStockEvaluationRuleDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getStockEvaluationRuleServiceInfo(), self.getStockEvaluationRuleLayout);
					break;
			}

			return config;
		};

		this.getCreditorServiceInfo = function getCreditorServiceInfo() {
			return {
				standardConfigurationService: 'basicsCompanyCreditorLayoutService',
				dataServiceName: 'basicsCompanyCreditorDataService',
				validationServiceName: 'basicsCompanyCreditorValidationService'
			};
		};

		this.getCreditorLayout = function getCreditorLayout() {
			let res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'basics.company.creditor',
				['subledgercontextfk', 'ledgercontextfk', 'supplierfk', 'taxcodefk', 'comment']);
			res.overloads = platformLayoutHelperService.getOverloads(['subledgercontextfk', 'ledgercontextfk', 'supplierfk', 'taxcodefk'], self);

			return res;
		};

		this.getDebtorServiceInfo = function getDebtorServiceInfo() {
			return {
				standardConfigurationService: 'basicsCompanyDebtorLayoutService',
				dataServiceName: 'basicsCompanyDebtorDataService',
				validationServiceName: 'basicsCompanyDebtorValidationService'
			};
		};

		this.getDebtorLayout = function getDebtorLayout() {
			let res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'basics.company.debtor',
				['subledgercontextfk', 'ledgercontextfk', 'customerfk', 'taxcodefk', 'comment']);
			res.overloads = platformLayoutHelperService.getOverloads(['subledgercontextfk', 'ledgercontextfk', 'customerfk', 'taxcodefk'], self);

			return res;
		};

		this.getTimekeepingGroupServiceInfo = function getTimekeepingGroupServiceInfo() {
			return {
				standardConfigurationService: 'basicsCompanyTimekeepingGroupLayoutService',
				dataServiceName: 'basicsCompanyTimekeepingGroupDataService',
				validationServiceName: 'basicsCompanyTimekeepingGroupValidationService'
			};
		};

		this.getTimekeepingGroupLayout = function getTimekeepingGroupLayout() {
			let res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'basics.company.timekeepinggroup',
				['code', 'descriptioninfo', 'isdefault', 'sorting', 'icon','clerkfk', 'roundingconfigfk','isreportverification']);
			res.overloads = platformLayoutHelperService.getOverloads(['icon','clerkfk', 'roundingconfigfk'], self);

			return res;
		};

		this.getCompanyICCuServiceInfo = function getCompanyICCuServiceInfo() {
			return {
				standardConfigurationService: 'basicsCompanyICCuLayoutService',
				dataServiceName: 'basicsCompanyICCuDataService',
				validationServiceName: 'basicsCompanyICCuValidationService'
			};
		};

		this.getCompanyICCuLayout = function getCompanyICCuLayout() {
			let res = platformLayoutHelperService.getTwoGroupsBaseLayout('1.0.0', 'basics.company.ICCu',
				['companyreceivingfk', 'controllingunitfk', 'commenttext'],
				platformLayoutHelperService.getUserDefinedTextGroup(5, 'userDefTextGroup', 'userdefined', ''));
			res.overloads = platformLayoutHelperService.getOverloads(['companyreceivingfk', 'controllingunitfk'], self);
			return res;
		};


		this.getProjectGroupServiceInfos = function getProjectGroupServiceInfos() {
			return {
				standardConfigurationService: 'projectGroupProjectGroupLayoutService',
				dataServiceName: 'basicsProjectGroupDataService',
				validationServiceName: ''
			};
		};


		this.getStockEvaluationRuleServiceInfo = function getStockEvaluationRuleServiceInfo() {
			return {
				standardConfigurationService: 'basicsCompanyStockEvaluationRuleLayoutService',
				dataServiceName: 'basicsCompanyStockEvaluationRuleDataService',
				validationServiceName: 'basicsCompanyStockEvaluationRuleValidationService'
			};
		};

		this.getStockEvaluationRuleLayout = function getStockEvaluationRuleLayout() {
			let res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'basics.company.StockEvaluationRule',
				['stockvaluationrulefk']);
			res.overloads = platformLayoutHelperService.getOverloads(['stockvaluationrulefk'], self);

			return res;
		};




		function getCustomerOverload() {
			return {
				grid: {
					editor: 'lookup',
					editorOptions: {
						directive: 'business-partner-main-customer-lookup',
						lookupOptions: {
							filterKey: 'basics-company-main-customer-filter',
							showClearButton: true,
							additionalColumns: true,
							addGridColumns: [{
								id: 'description',
								field: 'Description',
								name: 'Description',
								name$tr$: 'cloud.common.entityDescription',
								formatter: 'description',
								readonly: true
							}]
						}
					},
					formatter: 'lookup',
					formatterOptions: {'lookupType': 'customer', 'displayMember': 'Code'},
					width: 125
				},
				detail: {
					type: 'directive',
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'business-partner-main-customer-lookup',
						descriptionField: 'CustomerDescription',
						descriptionMember: 'Description',
						lookupOptions: {
							filterKey: 'basics-company-main-customer-filter',
							showClearButton: true
						}
					}
				}
			};
		}

		function getSupplierOverload() {
			return {
				detail: {
					type: 'directive',
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'business-partner-main-supplier-dialog',
						descriptionMember: 'Description',
						lookupOptions: {
							filterKey: 'basics-company-main-supplier-filter',
							showClearButton: true
						}
					}
				},
				grid: {
					editor: 'lookup',
					editorOptions: {
						directive: 'business-partner-main-supplier-dialog',
						lookupOptions: {
							filterKey: 'basics-company-main-supplier-filter',
							showClearButton: true,
							additionalColumns: true,
							addGridColumns: [{
								id: 'description',
								field: 'Description',
								name: 'Description',
								name$tr$: 'cloud.common.entityDescription',
								formatter: 'description',
								readonly: true
							}]
						}
					},
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'Supplier',
						displayMember: 'Code'
					},
					width: 100
				}
			};
		}

		function getTaxCodeOverload() {
			return basicsLookupdataConfigGenerator.provideGenericLookupConfig(
				'basics.company.internal.taxcode',
				'Description',
				{
					required: true,
					field: 'LedgerContextFk',
					filterKey: 'basics-company-main-taxcode-filter',
					customIntegerProperty: 'MDC_LEDGER_CONTEXT_FK'
				});
		}

		function getGenericOverload(ident) {
			return basicsLookupdataConfigGenerator.provideGenericLookupConfig(ident);
		}

		basicsLookupdataLookupFilterService.registerFilter([{
			key: 'basics-con-controlling-by-prj-filter',
			serverKey: 'prc.con.controllingunit.by.prj.filterkey',
			serverSide: true,
			fn: function (entity) {
				return {
					ByStructure: true,
					ExtraFilter: false,
					PrjProjectFk: null,
					IsCompanyReadonly: function () {
						return true;
					},
					CompanyFk: (entity === undefined || entity === null) ? platformContextService.getContext().clientId : entity.CompanyFk
				};
			}
		}]);

		function getControllingUnitLookupOverload() {
			return {
				'detail': {
					'type': 'directive',
					'directive': 'basics-lookupdata-lookup-composite',
					'options': {
						lookupDirective: 'controlling-structure-dialog-lookup',
						descriptionMember: 'DescriptionInfo.Translated',
						lookupOptions: {
							filterKey: 'basics-con-controlling-by-prj-filter',
							showClearButton: false
						}
					}
				},
				'grid': {
					editor: 'lookup',
					editorOptions: {
						lookupOptions: {
							filterKey: 'basics-con-controlling-by-prj-filter',
							showClearButton: false,
							additionalColumns: true,
							addGridColumns: [{
								id: 'description',
								field: 'DescriptionInfo',
								name: 'Description',
								name$tr$: 'cloud.common.entityDescription',
								formatter: 'translation',
								readonly: true
							}]
						},
						directive: 'controlling-structure-dialog-lookup'
					},
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'Controllingunit',
						displayMember: 'Code'
					},
					width: 130
				}
			};
		}

		function getClerkOverload(){
			return {
				grid: {
					editor: 'lookup',
					directive: 'basics-lookupdata-lookup-composite',
					editorOptions: {
						lookupDirective: 'cloud-clerk-clerk-dialog',
						lookupOptions: {
							displayMember: 'Code',
							addGridColumns: [{
								id: 'Description',
								field: 'Description',
								name: 'Description',
								width: 200,
								formatter: 'description',
								name$tr$: 'cloud.common.entityDescription'
							}],
							additionalColumns: true
						}
					},
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'Clerk',
						displayMember: 'Code'
					}
				},
				detail: {
					type: 'directive',
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupOptions: {showClearButton: true},
						lookupDirective: 'cloud-clerk-clerk-dialog',
						descriptionMember: 'Description'
					}
				}
			};
		}

		this.getOverload = function getOverload(overload) {
			let ovl = null;
			switch (overload) {
				case 'customerfk':
					ovl = getCustomerOverload();
					break;
				case 'ledgercontextfk':
					ovl = getGenericOverload('basics.customize.ledgercontext');
					break;
				case 'subledgercontextfk':
					ovl = getGenericOverload('basics.customize.subledgercontext');
					break;
				case 'supplierfk':
					ovl = getSupplierOverload();
					break;
				case 'taxcodefk':
					ovl = getTaxCodeOverload();
					break;

				case 'clerkfk':
					ovl = getClerkOverload();
					break;
				case 'icon':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.resourcereservationtype', null, {
						showIcon: true,
						imageSelectorService: 'basicsCustomizeReservationTypeIconService'
					});
					break;
				case 'controllingunitfk':
					ovl = getControllingUnitLookupOverload();
					break;
				case 'stockvaluationrulefk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.projectstockvaluationrule');
					break;
				case 'companyreceivingfk':
					ovl = platformLayoutHelperService.provideCompanyLookupOverload();
					ovl.grid.editorOptions.lookupOptions = {
						addGridColumns: [{
							afterId: 'companyreceivingfk',
							id: 'companyname',
							field: 'CompanyName',
							name$tr$: 'cloud.common.entityName',
							formatter: 'description',
							width: 150
						}], additionalColumns: true
					};
					break;
				case 'roundingconfigfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'timekeepingRoundingConfigLookupDataService',
						filter: function (item) {
							if (item && item.TimesheetContextFk) {
								return item.TimesheetContextFk;
							}
						}
					});
					break;
			}
			return ovl;
		};
	}
})(angular);
