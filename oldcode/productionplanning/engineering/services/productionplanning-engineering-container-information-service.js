/**
 * Created by lav on 7/11/2019.
 */

(function (angular) {
	/* global angular */
	'use strict';
	var moduleName = 'productionplanning.engineering';

	/**
	 * @ngdoc service
	 * @name productionplanningEngineeringContainerInformationService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).factory('productionplanningEngineeringContainerInformationService', PPSItemContainerInformationService);

	PPSItemContainerInformationService.$inject = ['$injector', 'basicsCommonContainerInformationServiceUtil', 'productionplanningEngineeringMainService', 'ppsCommonLoggingHelper'];

	function PPSItemContainerInformationService($injector, basicsCommonContainerInformationServiceUtil, engMainService, ppsCommonLoggingHelper) {

		var service = {};
		$injector.get('ppsCommonBizPartnerOwnerService').setModule(moduleName);

		service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			var config = {};
			var layServ = null, dataServ = null, listLayout = null, lookupOpts = null, uiService = null, validationService = null;
			var bizPartnerService = $injector.get('ppsCommonBizPartnerServiceFactory').getService({
				serviceKey: 'productionplanning.engineering.bizpartner',
				parentService: engMainService,
				projectFk: 'PPSItem_ProjectFk',
				ppsHeaderFk: 'PPSItem_PpsHeaderFk'
			});
			var bizPartnerVilidationService = $injector.get('ppsCommonBizPartnerValidationServiceFactory').getService(bizPartnerService);
			var bizPartnerContactService = $injector.get('ppsCommonBizPartnerContactServiceFactory').getService({
				serviceKey: 'productionplanning.engineering.bizpartnercontact',
				parentService: bizPartnerService
			});
			var bizPartnerContactVilidationService = $injector.get('ppsCommonBizPartnerContactValidationServiceFactory').getService(bizPartnerContactService);
			switch (guid) {
				case 'a9d9591baf2d4e58b5d21cd8a6048dd1': // engineer task list container
					config = basicsCommonContainerInformationServiceUtil.createCfgForGrid({
						cfgSvc: 'productionplanningEngineeringTaskUIStandardService',
						dataSvc: 'productionplanningEngineeringMainService',
						validationSvc: 'productionplanningEngineeringTaskValidationService'
					});
					dataServ = $injector.get('productionplanningEngineeringMainService');
					uiService = $injector.get('productionplanningEngineeringTaskUIStandardService');
					validationService = $injector.get('productionplanningEngineeringTaskValidationService');
					var configService = $injector.get('basicsCommonCharacteristicColDynamicConfigServiceFactory')
						.getService(dataServ, uiService, validationService, guid);
					config.standardConfigurationService = configService;
					break;
				case 'eaf809020ac948a0b5cbb05f6bd4ed13': // engineer task detail container
					config = basicsCommonContainerInformationServiceUtil.createCfgForDetail({
						cfgSvc: 'productionplanningEngineeringTaskUIStandardService',
						dataSvc: 'productionplanningEngineeringMainService',
						validationSvc: 'productionplanningEngineeringTaskValidationService'
					});
					dataServ = $injector.get('productionplanningEngineeringMainService');
					uiService = $injector.get('productionplanningEngineeringTaskUIStandardService');
					validationService = $injector.get('productionplanningEngineeringTaskValidationService');
					var detailConfigService = $injector.get('basicsCommonCharacteristicColDynamicConfigServiceFactory')
						.getService(dataServ, uiService, validationService, 'a9d9591baf2d4e58b5d21cd8a6048dd1');
					config.standardConfigurationService = detailConfigService;
					break;
				case '4c8866b319f74459994d1595a56fcc3e'://project businesspartner
					var dataSer = $injector.get('ppsCommonProjectBPService').getService(
						{
							serviceKey: 'productionplanning.engineering.projectbp',
							parentService: 'productionplanningEngineeringMainService',
							parentFk: 'ProjectId'
						});
					layServ = $injector.get('projectPrj2BPConfigurationService');
					config.layout = layServ.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'projectPrj2BPConfigurationService';
					config.dataServiceName = dataSer;
					config.validationServiceName = $injector.get('ppsCommonProjectBPValidationService').getService(dataSer);
					config.listConfig = {initCalled: false, columns: [], enableConfigSave: false};
					break;
				case '59b000cdd4bf4vvfb4bc7d28ff8bf1c9': //projectPrj2BPContactListController
					var dataService = $injector.get('ppsCommonProjectBPContactService').getService(
						{
							serviceKey: 'productionplanning.engineering.projectbp.contact',
							parentService: service.getContainerInfoByGuid('4c8866b319f74459994d1595a56fcc3e').dataServiceName
						});
					layServ = $injector.get('projectPrj2BPContactConfigurationService');
					config.layout = layServ.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'projectPrj2BPContactConfigurationService';
					config.dataServiceName = dataService;
					config.validationServiceName = $injector.get('ppsCommonProjectBPContactValidationService').getService(dataService);
					config.listConfig = {initCalled: false, columns: []};
					break;
				case 'ebc3f90b8cf04ddaac0b78fd95df0af0': // ppsCommonBizPartnerController
					layServ = $injector.get('ppsCommonBizPartnerUIStandardService');
					listLayout = layServ.getStandardConfigForListView();
					config.layout = listLayout;
					lookupOpts = _.find(listLayout.columns, {id: 'businesspartnerfk'}).editorOptions.lookupOptions;
					lookupOpts.showDetailButton = true;
					lookupOpts.detailOptions = $injector.get('businessPartnerDetailOptions');
					lookupOpts.showAddButton = true;
					lookupOpts.createOptions = _.clone($injector.get('businessPartnerCreateOptions'));
					lookupOpts.createOptions.creationData = function () {};
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'ppsCommonBizPartnerUIStandardService';
					config.dataServiceName = bizPartnerService;
					config.validationServiceName = bizPartnerVilidationService;
					config.listConfig = { initCalled: false, columns: [] };
					break;
				case 'c2950440ad254e338ded260b788a8672': // ppsCommonBizPartnerContactController
					layServ = $injector.get('ppsCommonBizPartnerContactUIStandardService');
					listLayout = layServ.getStandardConfigForListView();
					lookupOpts = _.find(listLayout.columns, {id: 'contactfk'}).editorOptions.lookupOptions;
					lookupOpts.showDetailButton = true;
					lookupOpts.detailOptions = $injector.get('businessPartnerContactDetailOptions');
					lookupOpts.showAddButton = true;
					lookupOpts.createOptions = _.clone($injector.get('businessPartnerContactCreateOptions'));
					lookupOpts.createOptions.creationData = function () {
						var selectedItem = bizPartnerContactService.getSelected();
						if (selectedItem) {
							return {mainItemId: selectedItem.BusinessPartnerFk};
						}
					};
					config.layout = listLayout;
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'ppsCommonBizPartnerContactUIStandardService';
					config.dataServiceName = bizPartnerContactService;
					config.validationServiceName = bizPartnerContactVilidationService;
					config.listConfig = { initCalled: false, columns: [] };
					break;
				case '33edab57edgb492d84r2gv47e734fh8u'://upstream item
					dataServ = getPpsUpstreamService();
					layServ = $injector.get('ppsUpstreamItemUIStandardService').getService(dataServ);
					config.layout = layServ.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = layServ;
					config.dataServiceName = dataServ;
					config.validationServiceName = $injector.get('ppsUpstreamItemValidationService').getService(dataServ);
					config.listConfig = {
						initCalled: false,
						columns: []
					};
					break;
				case '047ac127d3cc41fca3221b897c5bb93f':// split upstream item
					dataServ = getPpsSplitUpstreamService();
					layServ = $injector.get('ppsUpstreamItemUIStandardService').getService(dataServ);
					config.layout = layServ.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = layServ;
					config.dataServiceName = dataServ;
					config.validationServiceName = $injector.get('ppsUpstreamItemValidationService').getService(dataServ);
					config.listConfig = {
						initCalled: false,
						columns: []
					};
					break;
				case 'yde4fbd7edsb345dfdr24v55e65ffgcu'://upstream item material
					dataServ = getMaterialService();
					layServ = $injector.get('ppsItem2MdcMaterialUIStandardService');
					config.layout = layServ.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'ppsItem2MdcMaterialUIStandardService';
					config.dataServiceName = dataServ;
					config.validationServiceName = $injector.get('ppsItem2MdcMaterialValidationService').getService(dataServ);
					config.listConfig = {
						initCalled: false,
						columns: []
					};
					break;
				case '411110394b224dd392b69c5b60fe4e80':
					dataServ = getMdcProductDescService();
					layServ = $injector.get('productionplanningPpsMaterialProductDescUIStandardService');
					config = layServ.getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'productionplanningPpsMaterialProductDescUIStandardService';
					config.dataServiceName = dataServ;
					config.validationServiceName = $injector.get('productionplanningPpsMaterialProductDescValidationService').getService(dataServ);
					break;
				case '5a0ff92d9fc74bc691845427bf566bd3'://productionplanningPpsmaterialProductdescParameterListController
					dataServ = getMdcProductDesParaService();
					layServ = $injector.get('productionplanningPpsMaterialProductDescParameterUIStandardService');
					config = layServ.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'productionplanningPpsMaterialProductDescParameterUIStandardService';
					config.dataServiceName = dataServ;
					config.validationServiceName = $injector.get('productionplanningPpsMaterialProductDescParameterValidationService').getService(dataServ);
					config.listConfig = {
						initCalled: false,
						enableConfigSave: false
					};
					break;
				case 'ad6b8c6ce05b451d8d22cb2541237558': // ppsEngTask2ClerkListController
					dataServ = $injector.get('ppsEngTask2ClerkDataService');
					layServ = $injector.get('ppsEngTask2ClerkUIStandardService');
					config.layout = layServ.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'ppsEngTask2ClerkUIStandardService';
					config.dataServiceName = dataServ;
					config.validationServiceName = $injector.get('ppsEngTask2ClerkValidationService');
					config.listConfig = {
						initCalled: false,
						columns: []
					};
					break;
				case '286bb281a68e4ca19e7f6e333b4f97bc': // productionplanningEngineeringPpsItemListController
					dataServ = $injector.get('productionplanningEngineeringPpsItemDataService');
					layServ = $injector.get('productionplanningItemUIStandardService');
					config.layout = layServ.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'productionplanningItemUIStandardService';
					config.dataServiceName = dataServ;
					config.validationServiceName = $injector.get('productionplanningItemValidationService');
					config.listConfig = {
						initCalled: false,
						columns: []
					};
					extendValidation4Logging(config); // extend validation for logging
					break;
			}
			return config;
		};
		return service;

		function getPpsUpstreamService() {
			return $injector.get('ppsUpstreamItemDataService').getService({
				serviceKey: 'productionplanning.engineering.ppsitem.upstreamitem',
				parentService: 'productionplanningEngineeringMainService',
				ppsItemColumn: 'PPSItemFk',
				ppsHeaderColumn: 'PPSItem_PpsHeaderFk'
			});
		}

		function getPpsSplitUpstreamService() {
			return $injector.get('ppsUpstreamItemDataService').getService({
				serviceKey: 'productionplanning.engineering.ppsitem.splitupstreamitem',
				parentService: getPpsUpstreamService(),
				mainItemColumn: 'Id',
				ppsItemColumn: 'PPSItemFk',
				endRead: 'listsplitupstreamitems',
				canCreate: false,
				canDelete: false,
			});
		}

		function getMaterialService() {
			return $injector.get('ppsItem2MdcMaterialDataService').getService({
				serviceKey: 'productionplanning.engineering.ppsitem.upstreamitem.material',
				parentService: getPpsUpstreamService(),
				module: moduleName
			});
		}

		function getMdcProductDescService() {
			return $injector.get('productionplanningPpsMaterialProductDescDataService').getService(
				{
					serviceKey: 'productionplanning.item.ppsupstreamitem.material.productDesc',
					parentService: getMaterialService(),
					materialIdColumn: 'MdcMaterialFk',
					moduleName: moduleName
				});
		}

		function getMdcProductDesParaService() {
			return $injector.get('productionplanningPpsMaterialProductDescParameterDataService').getService(
				{
					serviceKey: 'productionplanning.item.ppsupstreamitem.material.productDesc.parameter',
					parentService: getMdcProductDescService(),
					moduleName: moduleName
				});
		}

		function extendValidation4Logging(config) {
			ppsCommonLoggingHelper.extendValidationIfNeeded(
				config.dataServiceName,
				config.validationServiceName,
				{
					typeName: 'PPSItemDto',
					moduleSubModule: 'ProductionPlanning.Item'
				}
			);
		}
	}
})(angular);