/**
 * Created by anl on 5/3/2017.
 */

(function (angular) {

	'use strict';
	var moduleName = 'productionplanning.item';

	/**
	 * @ngdoc service
	 * @name ppsItemContainerInformationService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).factory('productionplanningItemContainerInformationService', PPSItemContainerInformationService);

	PPSItemContainerInformationService.$inject = ['$injector', 'basicsCommonContainerInformationServiceUtil', 'ppsCommonLoggingHelper', 'ppsCommonContainerInfoProvider'];

	function PPSItemContainerInformationService($injector, containerInformationServiceUtil, ppsCommonLoggingHelper, containerInfoProvider) {

		var service = {};
		const mainService = $injector.get('productionplanningItemDataService');
		const uiService = $injector.get('productionplanningItemUIStandardService');
		const validationService = $injector.get('productionplanningItemValidationService');

		$injector.get('ppsCommonBizPartnerOwnerService').setModule(moduleName);
		var headerBpService = $injector.get('productionplanningHeader2BpDataService').getServiceForItem(mainService);
		var headerBpContactService = $injector.get('productionplanningHeader2ContactDataService').getServiceForItem(headerBpService);
		var bizPartnerService = $injector.get('ppsCommonBizPartnerServiceFactory').getService({
			serviceKey: 'productionplanning.item.bizpartner',
			parentService: mainService,
			projectFk: 'ProjectFk',
			ppsHeaderFk: 'PPSHeaderFk'
		});
		var bizPartnerVilidationService = $injector.get('ppsCommonBizPartnerValidationServiceFactory').getService(bizPartnerService);
		var bizPartnerContactService = $injector.get('ppsCommonBizPartnerContactServiceFactory').getService({
			serviceKey: 'productionplanning.item.bizpartnercontact',
			parentService: bizPartnerService
		});
		var bizPartnerContactVilidationService = $injector.get('ppsCommonBizPartnerContactValidationServiceFactory').getService(bizPartnerContactService);

		service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			var config = {};
			var layServ = null, dataServ = null, listLayout = null, lookupOpts = null;
			var prjBpService = $injector.get('ppsCommonProjectBPService').getService({
				serviceKey: 'productionplanning.item.projectbp',
				parentService: 'productionplanningItemDataService',
				parentFk: 'ProjectFk'
			});
			switch (guid) {
				case '3598514b62bc409ab6d05626f7ce304b': // pps item list controller
					config = containerInformationServiceUtil.createCfgForGrid({
						cfgSvc: 'productionplanningItemUIStandardService',
						dataSvc: 'productionplanningItemDataService',
						validationSvc: 'productionplanningItemValidationService'
					});
					var configService = $injector.get('basicsCommonCharacteristicColDynamicConfigServiceFactory')
						.getService(mainService, uiService, validationService, guid);
					config.standardConfigurationService = configService;
					extendValidation4Logging(config); // extend validation for logging
					break;
				case '2ded3fea233f40f4a00a5d9636297df8': // pps item detail controller
					config = containerInformationServiceUtil.createCfgForDetail({
						cfgSvc: 'productionplanningItemUIStandardService',
						dataSvc: 'productionplanningItemDataService',
						validationSvc: 'productionplanningItemValidationService'
					});
					var detailConfigService = $injector.get('basicsCommonCharacteristicColDynamicConfigServiceFactory')
						.getService(mainService, uiService, validationService, '3598514b62bc409ab6d05626f7ce304b');
					config.standardConfigurationService = detailConfigService;
					extendValidation4Logging(config); // extend validation for logging
					break;
				case '0df56a341a8e48808dd929dc8c2ed88f': // pps item list by job controller
					config = containerInformationServiceUtil.createCfgForGrid({
						cfgSvc: 'productionplanningItemUIStandardService',
						dataSvc: 'productionplanningItemDataService',
						validationSvc: 'productionplanningItemValidationService'
					});
					var listByJobConfigService = $injector.get('basicsCommonCharacteristicColDynamicConfigServiceFactory')
						.getService(mainService, uiService, validationService, guid);
					config.standardConfigurationService = listByJobConfigService;
					break;
				case '5907fffe0f9b44588254c79a70ba3af1': // pps item tree controller
					config = containerInformationServiceUtil.createCfgForGrid({
						cfgSvc: 'productionplanningItemUIStandardService',
						dataSvc: 'productionplanningItemDataService',
						validationSvc: 'productionplanningItemValidationService'
					});
					var treeConfigService = $injector.get('basicsCommonCharacteristicColDynamicConfigServiceFactory')
						.getService(mainService, uiService, validationService, guid);
					config.standardConfigurationService = treeConfigService;
					break;
				case '475a5d3fec674e2dbe4675e0f935c20e': // pps item tree by job controller
					config = containerInformationServiceUtil.createCfgForGrid({
						cfgSvc: 'productionplanningItemUIStandardService',
						dataSvc: 'productionplanningItemDataService',
						validationSvc: 'productionplanningItemValidationService'
					});
					var treeByJobConfigService = $injector.get('basicsCommonCharacteristicColDynamicConfigServiceFactory')
						.getService(mainService, uiService, validationService, guid);
					config.standardConfigurationService = treeByJobConfigService;
					break;
				case '4ddf9e9220f44a22b29c97ecd41c7ab2': // pps item child list controller
					config = containerInformationServiceUtil.createCfgForGrid({
						cfgSvc: 'productionplanningItemUIStandardService',
						dataSvc: 'productionplanningItemDataService',
						validationSvc: 'productionplanningItemValidationService'
					});
					var childListConfigService = $injector.get('basicsCommonCharacteristicColDynamicConfigServiceFactory')
						.getService(mainService, uiService, validationService, guid);
					config.standardConfigurationService = childListConfigService;
					break;
				case '2c8866b319f74459994d1595a56fcc3e':// project business partner
					layServ = $injector.get('projectPrj2BPConfigurationService');
					listLayout = layServ.getStandardConfigForListView();
					lookupOpts = _.find(listLayout.columns, {id: 'businesspartnerfk'}).editorOptions.lookupOptions;
					lookupOpts.showDetailButton = true;
					lookupOpts.detailOptions = $injector.get('businessPartnerDetailOptions');
					lookupOpts.showAddButton = true;
					lookupOpts.createOptions = _.clone($injector.get('businessPartnerCreateOptions'));
					lookupOpts.createOptions.creationData = function () {

					};
					config.layout = listLayout;
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'projectPrj2BPConfigurationService';
					config.dataServiceName = prjBpService;
					config.validationServiceName = $injector.get('ppsCommonProjectBPValidationService').getService(prjBpService);
					config.listConfig = {initCalled: false, columns: [], enableConfigSave: false};
					break;
				case '09b000cdd4bf4vvfb4bc7d28ff8bf1c9': // projectPrj2BPContactListController
					dataServ = $injector.get('ppsCommonProjectBPContactService').getService({
						serviceKey: 'productionplanning.item.projectbp.contact',
						parentService: service.getContainerInfoByGuid('2c8866b319f74459994d1595a56fcc3e').dataServiceName
					});
					layServ = $injector.get('projectPrj2BPContactConfigurationService');
					listLayout = layServ.getStandardConfigForListView();
					lookupOpts = _.find(listLayout.columns, {id: 'contactfk'}).editorOptions.lookupOptions;
					lookupOpts.showDetailButton = true;
					lookupOpts.detailOptions = $injector.get('businessPartnerContactDetailOptions');
					lookupOpts.showAddButton = true;
					lookupOpts.createOptions = _.clone($injector.get('businessPartnerContactCreateOptions'));
					lookupOpts.createOptions.creationData = function () {
						var selectedItem = prjBpService.getSelected();
						if (selectedItem) {
							return {mainItemId: selectedItem.BusinessPartnerFk};
						}
					};
					config.layout = listLayout;
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'projectPrj2BPContactConfigurationService';
					config.dataServiceName = dataServ;
					config.validationServiceName = $injector.get('ppsCommonProjectBPContactValidationService').getService(dataServ);
					config.listConfig = {initCalled: false, columns: []};
					break;
				case '801b2d34b66f4c3bac0520ce4fea0cc2':// PPS header business partner
					layServ = $injector.get('productionplanningHeader2BpUIStandardService');
					listLayout = layServ.getStandardConfigForListView();
					lookupOpts = _.find(listLayout.columns, {id: 'businesspartnerfk'}).editorOptions.lookupOptions;
					lookupOpts.showDetailButton = true;
					lookupOpts.detailOptions = $injector.get('businessPartnerDetailOptions');
					lookupOpts.showAddButton = true;
					lookupOpts.createOptions = _.clone($injector.get('businessPartnerCreateOptions'));
					lookupOpts.createOptions.creationData = function () {

					};
					config.layout = listLayout;
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'productionplanningHeader2BpUIStandardService';
					config.dataServiceName = headerBpService;
					config.validationServiceName = $injector.get('productionplanningHeader2BpValidationService');
					config.listConfig = {initCalled: false, columns: [], enableConfigSave: false};
					break;
				case '362417e0fd18435ca56376ae393acb53':// PPS header business partner contact
					layServ = $injector.get('productionplanningHeader2ContactUIStandardService');
					listLayout = layServ.getStandardConfigForListView();
					lookupOpts = _.find(listLayout.columns, {id: 'contactfk'}).editorOptions.lookupOptions;
					lookupOpts.showDetailButton = true;
					lookupOpts.detailOptions = $injector.get('businessPartnerContactDetailOptions');
					lookupOpts.showAddButton = true;
					lookupOpts.createOptions = _.clone($injector.get('businessPartnerContactCreateOptions'));
					lookupOpts.createOptions.creationData = function () {
						var selectedItem = headerBpService.getSelected();
						if (selectedItem) {
							return {mainItemId: selectedItem.BusinessPartnerFk};
						}
					};
					config.layout = listLayout;
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'productionplanningHeader2ContactUIStandardService';
					config.dataServiceName = headerBpContactService;
					config.validationServiceName = $injector.get('productionplanningHeader2ContactValidationService');
					config.listConfig = {initCalled: false, columns: []};
					break;
				case '9dc39ef566304eda9cf33463fbbe828a': // ppsCommonBizPartnerController
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
				case '5f2ff1ee49ec4959b16a1ee6466b3b9b': // ppsCommonBizPartnerContactController
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
				case '9dc128cfe2284f109942385f725724b2': // productionplanningUnassignedProductController
					var clipboardService = $injector.get('productionplanningItemReassignedProductClipboardService');
					layServ = $injector.get('productionplanningItemReassignedProductUIStandardService');
					config.layout = layServ.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'productionplanningItemReassignedProductUIStandardService';
					config.dataServiceName = 'productionplanningItemReassignedProductDataService';
					config.listConfig = {
						initCalled: false,
						columns: [],
						parentProp: 'ParentId',
						childProp: 'Children',
						dragDropService: clipboardService,
						type: 'ReassignedProduct'
					};
					break;
				case '12343a4867a34c5ebe4d2ee1cb534321':
					var serviceOptions1 = {
						serviceName: 'ProductionplanningItemDetailerTaskDataService',
						parentServiceName: 'ppsItemDetailersDataService',
						endRead: 'detailertasks',
						parentFilter: 'clerkId',
						initReadData: function (readData) {
							var selectedClerk = $injector.get('ppsItemDetailersDataService').getSelected();
							var clerkId = selectedClerk ? selectedClerk.Id : null;
							var roleId = $injector.get('ppsItemDetailersFilterService').entity.roleId;
							var date = $injector.get('ppsItemDetailerTaskFilterService').entity.startingDate;
							if (date) {
								date = date.format('YYYY-MM-DD');
							}
							readData.filter = '?clerkId=' + clerkId + '&roleId=' + roleId + '&date=' + date;
						}
					};
					dataServ = $injector.get('productionplanningEngineeringTaskReadonlyDataServiceFactory').getService(serviceOptions1);
					dataServ.getSelectedFilter = function (filter) {
						return $injector.get('ppsItemDetailerTaskFilterService').entity[filter];
					};
					dataServ.setSelectedFilter = function (filter) {
						if (filter === 'startingDate') {
							var entity = $injector.get('ppsItemDetailerTaskFilterService').entity;
							var endDate = _.cloneDeep(entity.startingDate);
							if (endDate) {
								endDate.add(7 - endDate.format('E'), 'days');
							}
							entity.endDate = endDate;
						}
						dataServ.load();
					};
					layServ = $injector.get('productionplanningEngineeringTaskDetailerUIStandardService');
					config.layout = layServ.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'productionplanningEngineeringTaskDetailerUIStandardService';
					config.dataServiceName = dataServ;
					config.listConfig = {
						initCalled: false,
						columns: []
					};
					break;
				case '99993a4867a34c5ebe4d2ee1cb539999':
					layServ = $injector.get('ppsDetailerTaskSummaryUIStandardService');
					config.layout = layServ.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'ppsDetailerTaskSummaryUIStandardService';
					config.dataServiceName = $injector.get('ppsItemDetailerTaskSummaryDataService');
					config.listConfig = {
						initCalled: false,
						columns: []
					};
					break;
				case '23453a4867a34c5ebe4d2ee1cb535432':
					dataServ = $injector.get('ppsItemDetailersDataService');
					layServ = $injector.get('basicsClerkUIStandardService');
					config.layout = layServ.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'basicsClerkUIStandardService';
					config.dataServiceName = dataServ;
					config.listConfig = {initCalled: false, columns: [], enableSkeletonLoading: false};
					break;
				case '23edab57edgb492d84r2gv47e734fh8u':// upstream item
					dataServ = $injector.get('ppsUpstreamItemDataService').getService();
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
				case 'a8ed3da9952f456b9becb49949cae4c2':// split upstream item
					dataServ = $injector.get('ppsUpstreamItemDataService').getService({
						serviceKey: 'productionplanning.item.splitupstreamitem',
						parentService: $injector.get('ppsUpstreamItemDataService').getService(),
						mainItemColumn: 'Id',
						ppsItemColumn: 'PpsItemFk',
						endRead: 'listsplitupstreamitems',
						canCreate: false,
						canDelete: false
					});
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
				case 'sde4fbd7edsb345dfdr24v55e65ffgcu':// upstream item material
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
				case '311110394b224dd392b69c5b60fe4e80':
					dataServ = getMdcProductDescService();
					layServ = $injector.get('productionplanningPpsMaterialProductDescUIStandardService');
					config = layServ.getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'productionplanningPpsMaterialProductDescUIStandardService';
					config.dataServiceName = dataServ;
					config.validationServiceName = $injector.get('productionplanningPpsMaterialProductDescValidationService').getService(dataServ);
					break;
				case '4a0ff92d9fc74bc691845427bf566bd3':// productionplanningPpsmaterialProductdescParameterListController
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
				case '51382a64b3f34d09b18150df3bf8f22b': // ppsItemDocumentListController
					layServ = $injector.get('ppsItemDocumentUIStandardService');
					config = layServ.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'ppsItemDocumentUIStandardService';
					config.dataServiceName = 'ppsItemDocumentDataService';
					config.listConfig = {initCalled: false, columns: []};
					break;
				case 'e9c82a5e44364d638aece068ed7b8a39': // ppsItemProductTemplateParameterListController
					layServ = $injector.get('productionplanningProducttemplateProductDescParamUIStandardService');
					config = layServ.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'productionplanningProducttemplateProductDescParamUIStandardService';
					config.dataServiceName = 'ppsItemProductTemplateParameterService';
					config.listConfig = {initCalled: false, columns: []};
					break;
				case '75be0fd1a18944e3826023c1bfc88ddb':
					layServ = $injector.get('ppsItemSourceUIStandardService');
					config = layServ.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'ppsItemSourceUIStandardService';
					config.dataServiceName = 'ppsItemSourceDataService';
					config.listConfig = {initCalled: false, columns: []};
					break;
				case 'df5tg7b1928777c4a65cee89c7779tyg':
					config = getTrsGoodsContainerInfo(true);
					break;
				case '131ad1f9e074488abe78703eec0245ab':
					config.ContainerType= 'Grid';
					config.dataServiceName= $injector.get('productionplanningItemProductLookupDataService');
					config.standardConfigurationService= $injector.get('productionplanningCommonProductItemUIStandardService');
					config.validationServiceName= $injector.get('productionplanningCommonProductValidationFactory').getValidationService(config.dataServiceName, '"productionplanning.common.item.product.event"');
					config.listConfig= {
						initCalled: false,
						columns: [],
						dragDropService: $injector.get('productionplanningItemProductLookupClipBoardService'),
						type: 'Product'
					};
					break;
			}
			return config;
		};
		return service;

		function extendValidation4Logging(config) {
			ppsCommonLoggingHelper.extendValidationIfNeeded(
				$injector.get(config.dataServiceName),
				$injector.get(config.validationServiceName),
				{
					typeName: 'PPSItemDto',
					moduleSubModule: 'ProductionPlanning.Item'
				}
			);
		}

		function getMaterialService() {
			return $injector.get('ppsItem2MdcMaterialDataService').getService();
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

		function getTrsGoodsContainerInfo(isGrid) {
			return containerInfoProvider.getContainerInfoA({
				isGrid: isGrid,
				moduleName: moduleName,
				parentService: 'productionplanningItemDataService',
				dataServiceFactory: 'transportplanningRequisitionTrsGoodDataServiceFactory',
				UIStandardServiceFactory: 'transportplanningRequisitionTrsGoodsUIStandardServiceFactory',
				validationServiceFactory: 'transportplanningRequisitionTrsGoodValidationFactory',
				identification: 'forPPSItem',
				additionalUIConfigs: {
					editableColumns: ['trsplannedstart', 'uomfk', 'quantity'],
					combineUIConfigs: [{
						UIService: 'transportplanningRequisitionUIStandardService',
						columns: [{
							id: 'code', overload: {id: 'trscode', field: 'TrsCode', name$tr$: 'transportplanning.requisition.entityRequisition'}
						}, {
							id: 'lgmjobfk', overload: {id: 'trslgmjobfk', field: 'TrsLgmJobFk'}
						}, {
							id: 'plannedstart', overload: {id: 'trsplannedstart', field: 'TrsPlannedStart', name$tr$: 'transportplanning.requisition.entityRequisitionDate'}
						}, {
							id: 'trsreqstatusfk', overload: {name$tr$: 'transportplanning.requisition.entityRequisitionStatus'}
						}, {
							id: 'ispickup', overload: {id: 'trsispickup', field: 'TrsIsPickup'}
						}],
					}]
				}
			});
		}
	}
})(angular);