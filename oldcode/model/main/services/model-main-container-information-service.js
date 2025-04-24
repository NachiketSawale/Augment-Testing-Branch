/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	// noinspection JSAnnotator
	const schedulingCalendarModule = angular.module('model.main');

	/**
	 * @ngdoc service
	 * @name modelMainContainerInformationService
	 * @function
	 *
	 * @description
	 *
	 */
	schedulingCalendarModule.factory('modelMainContainerInformationService',
		modelMainContainerInformationService);

	modelMainContainerInformationService.$inject = ['$injector'];

	function modelMainContainerInformationService($injector) {
		const service = {};

		const oneTimeOverrides = {};

		service.overrideOnce = function (guid, data) {
			oneTimeOverrides[guid] = data;
		};

		const containerRequestInfoService = $injector.get('projectInfoRequestContainerInformationService');
		let modelEvaluationContainerInformationService = null;
		let layServ = null;
		service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) { // jshint ignore: line
			let config = {};
			let uiService;
			switch (guid) {
				case '765FE63C3E3446C8945AEA76AB584249': // modelMainObjectListController
					config.layout = $injector.get('modelMainObjectConfigurationService').getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'modelMainObjectConfigurationService';
					config.dataServiceName = 'modelMainObjectDataService';
					config.validationServiceName = 'modelMainObjectValidationService';
					config.listConfig = {initCalled: false, grouping: true, idProperty: 'IdString', dragDropService: $injector.get('documentProjectClipboardService')};
					break;
				case 'DF88148725F34267A7E7D9F015331216': // modelMainObjectDetailController
					config = $injector.get('modelMainObjectConfigurationService').getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'modelMainObjectConfigurationService';
					config.dataServiceName = 'modelMainObjectDataService';
					config.validationServiceName = 'modelMainObjectValidationService';
					break;
				case '36abc91df46f4129a78cc26fe79a6fdc': // modelMainObjectInfoListController
					config.layout = $injector.get('modelMainObjectInfoConfigurationService').getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'modelMainObjectInfoConfigurationService';
					config.dataServiceName = 'modelMainObjectInfoDataService';
					// config.listConfig = { initCalled: false, grouping: true, idProperty: 'IdString' };
					break;
				case '114f1a46eaee483d829648e7dd60a63c': // modelMainObjectInfoDetailController
					config = $injector.get('modelMainObjectInfoConfigurationService').getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'modelMainObjectInfoConfigurationService';
					config.dataServiceName = 'modelMainObjectInfoDataService';
					break;
				case '3b5c28631ef44bb293ee05475a9a9513': // modelMainViewerLegendListController
					config.layout = $injector.get('modelMainViewerLegendConfigurationService').getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'modelMainViewerLegendConfigurationService';
					config.dataServiceName = 'modelMainViewerLegendDataService';
					config.listConfig = {
						initCalled: false,
						grouping: true,
						parentProp: 'parentItem',
						childProp: 'subItems'
					};
					break;
				case 'd12461a0826a45f1ab76f53203b48ec6': // modelMainViewerLegendDetailController
					config = $injector.get('modelMainViewerLegendConfigurationService').getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'modelMainViewerLegendConfigurationService';
					config.dataServiceName = 'modelMainViewerLegendDataService';
					break;
				case 'a358f29d65c74a0f955ed5c1a1a57651': // modelMainObjectSetListController
					config.layout = $injector.get('modelMainObjectSetConfigurationService').getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'modelMainObjectSetConfigurationService';
					config.dataServiceName = 'modelMainObjectSetDataService';
					config.listConfig = {
						initCalled: false, grouping: true,
						rowChangeCallBack: $injector.get(config.dataServiceName).rowChangeCallBack
					};
					config.validationServiceName = 'modelMainObjectSetValidationService';
					break;
				case 'afc330272d704407856af51fc68f62c1': // modelMainObjectSetDetailController
					config = $injector.get('modelMainObjectSetConfigurationService').getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'modelMainObjectSetConfigurationService';
					config.dataServiceName = 'modelMainObjectSetDataService';
					config.validationServiceName = 'modelMainObjectSetValidationService';
					break;
				case 'EC7F4AFAE0D24E5296F594A65C8D176E': // modelMainPropertyListController
					config.layout = $injector.get('modelMainPropertyConfigurationService').getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'modelMainPropertyConfigurationService';
					config.dataServiceName = 'modelMainPropertyDataService';
					config.validationServiceName = 'modelMainPropertyValidationService';
					config.listConfig = {
						initCalled: false,
						grouping: true,
						enableColumnReorder: false,
						enableConfigSave: false,
						idProperty: 'idString'
					};
					break;
				case 'A275A7128A6F40AAAF20D27386A4BBF9': // modelMainPropertyDetailController
					config = $injector.get('modelMainPropertyConfigurationService').getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'modelMainPropertyConfigurationService';
					config.dataServiceName = 'modelMainPropertyDataService';
					config.validationServiceName = 'modelMainPropertyValidationService';
					break;
				case '36d21eb2c11b452cac50a62451dfc0ac': // modelMainControllingListController
					uiService = $injector.get('modelMainCommonUIService').createUiService(['Code', 'DescriptionInfo']);
					config.layout = uiService.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = uiService;
					config.dataServiceName = 'modelMainControllingService';
					config.validationServiceName = 'controllingStructureValidationService';
					config.listConfig = {
						initCalled: false,
						columns: [],
						sortOptions: {initialSortColumn: {field: 'Code', id: 'code'}, isAsc: true},
						marker: {
							filterService: $injector.get('modelMainFilterService'),
							filterId: 'modelMainControllingListController',
							dataService: $injector.get('modelMainControllingService'),
							serviceName: 'modelMainControllingService'
						},
						parentProp: 'ControllingunitFk',
						childProp: 'ControllingUnits'
					};
					break;
				case '24c2b0f8d3b146a38f42ad03d4c91b2f': // modelMainLocationListController
					uiService = $injector.get('modelMainCommonUIService').createUiService(['Code', 'DescriptionInfo', 'Quantity']);
					config.layout = uiService.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = uiService;
					config.dataServiceName = 'modelMainLocationService';
					config.validationServiceName = 'projectLocationValidationService';
					config.listConfig = {
						initCalled: false,
						columns: [],
						sortOptions: {initialSortColumn: {field: 'Code', id: 'code'}, isAsc: true},
						marker: {
							filterService: $injector.get('modelMainFilterService'),
							filterId: 'modelMainLocationListController',
							dataService: $injector.get('modelMainLocationService'),
							serviceName: 'modelMainLocationService'
						},
						parentProp: 'LocationParentFk', childProp: 'Locations'
					};
					break;
				case '078db77dd8d54d2f810c4509d43ff34b': // modelMainEstLineItem2ObjectListController
					config.layout = $injector.get('modelMainEstLineItem2ObjectConfigurationService').getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'modelMainEstLineItem2ObjectConfigurationService';
					config.dataServiceName = 'modelMainEstLineItem2ObjectService';
					config.validationServiceName = 'modelMainLineItem2ObjectValidationService';
					config.listConfig = {
						initCalled: false,
						columns: []
					};
					break;
				case 'ba1de7e62142473a862e1d8991b43593': // modelMainEstLineItem2ObjectDetailController
					config = $injector.get('modelMainEstLineItem2ObjectConfigurationService').getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'modelMainEstLineItem2ObjectConfigurationService';
					config.dataServiceName = 'modelMainEstLineItem2ObjectService';
					config.validationServiceName = 'modelMainLineItem2ObjectValidationService';
					break;

				case '281de48b068c443c9b7c62a7f51ac45f': // projectInfoRequestListController
					config = containerRequestInfoService.getRequestForInformationServiceInfos();
					config.layout = containerRequestInfoService.getRequestForInformationLayout();
					config.dataServiceName = 'modelMainInfoRequestDataService';
					config.ContainerType = 'Grid';
					config.listConfig = {initCalled: false, columns: []};
					break;

				case '8b9c47c94f0b4077beaaab998c399048': // projectInfoRequestDetailController
					config = containerRequestInfoService.getRequestForInformationServiceInfos();
					config.layout = containerRequestInfoService.getRequestForInformationLayout();
					config.dataServiceName = 'modelMainInfoRequestDataService';
					config.ContainerType = 'Detail';
					break;

				case '65becece765a419099b148c803a116f5': // projectInfoRequestContributionListController
					config = containerRequestInfoService.getContributionServiceInfos();
					config.layout = containerRequestInfoService.getContributionLayout();
					config.ContainerType = 'Grid';
					config.dataServiceName = 'modelMainInfoRequestContributionDataService';
					config.listConfig = {
						initCalled: false,
						parentProp: 'RequestContributionTypeFk',
						childProp: 'RelatedContributions',
						columns: []
					};
					break;

				case '55f24a16454c4b8ab9fbf2e4fe2e90e6': // projectInfoRequestRelevantToListController
					config = containerRequestInfoService.getRelevantToServiceInfos();
					config.layout = containerRequestInfoService.getRelevantToLayout();
					config.ContainerType = 'Grid';
					config.listConfig = {initCalled: false, columns: []};
					config.dataServiceName = 'modelMainInfoRequestRelevantToDataService';
					break;

				case 'a5779e8fa1d543febfdf92832d44a9e8': // projectInfoRequestRelevantToDetailController
					config = containerRequestInfoService.getRelevantToServiceInfos();
					config.layout = containerRequestInfoService.getRelevantToLayout();
					config.ContainerType = 'Detail';
					config.dataServiceName = 'modelMainInfoRequestRelevantToDataService';
					break;
				case 'da5481eabd71482dbca12c4260eec5bf': // modelMainObjectInfoListController
					config = $injector.get('modelMainContainerInformationService').getContainerInfoByGuid('36abc91df46f4129a78cc26fe79a6fdc');
					break;
				case '086b1d0b9d4e4bc6a80ffddaa668ada7': // modelMainObjectInfoDetailController
					config = $injector.get('modelMainContainerInformationService').getContainerInfoByGuid('114f1a46eaee483d829648e7dd60a63c');
					break;
				case 'de6317b8a309450485e28addd88f3577': // modelMainObjectSet2ObjectListController
					config.layout = $injector.get('modelMainObjectSet2ObjectConfigurationService').getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'modelMainObjectSet2ObjectConfigurationService';
					config.dataServiceName = 'modelMainObjectSet2ObjectDataService';
					config.validationServiceName = 'modelMainObjectSet2ObjectValidationService';
					config.listConfig = {initCalled: false, grouping: true};
					break;
				case '7286433056e94cf18d40390f6d723956': // modelMainObjectSet2ObjectDetailController
					config = $injector.get('modelMainObjectSet2ObjectConfigurationService').getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'modelMainObjectSet2ObjectConfigurationService';
					config.validationServiceName = 'modelMainObjectSet2ObjectValidationService';
					config.dataServiceName = 'modelMainObjectSet2ObjectDataService';
					break;
				case '5ac3e7c43a534136876b9f2b43d5fcb8': // modelMainObject2ObjectSetListController
					config.layout = $injector.get('modelMainObject2ObjectSetConfigurationService').getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'modelMainObject2ObjectSetConfigurationService';
					config.dataServiceName = 'modelMainObject2ObjectSetDataService';
					config.validationServiceName = 'modelMainObject2ObjectSetValidationService';
					config.listConfig = {initCalled: false, grouping: true};
					break;
				case 'f300d21290d6492a963ed4ab07145ff0': // modelMainObject2ObjectSetDetailController
					config = $injector.get('modelMainObject2ObjectSetConfigurationService').getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'modelMainObject2ObjectSetConfigurationService';
					config.dataServiceName = 'modelMainObject2ObjectSetDataService';
					config.validationServiceName = 'modelMainObject2ObjectSetValidationService';
					break;
				case '4EAA47C530984B87853C6F2E4E4FC67E':// documentsProjectDocumentController
					config = $injector.get('documentProjectHeaderUIStandardService').getStandardConfigForDetailView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'documentProjectHeaderUIStandardService';
					config.dataServiceName = 'modelMainDocumentDataService';
					config.validationServiceName = 'documentProjectHeaderValidationService';
					config.listConfig = {initCalled: false, columns: []};
					break;
				case '8BB802CB31B84625A8848D370142B95C':// documentsProjectDocumentDetailController
					config = $injector.get('documentProjectHeaderUIStandardService').getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'documentProjectHeaderUIStandardService';
					config.dataServiceName = 'modelMainDocumentDataService';
					config.validationServiceName = 'documentProjectHeaderValidationService';
					break;
				case '684F4CDC782B495E9E4BE8E4A303D693':// documentsProjectDocumentRevisionController
					config = $injector.get('documentsProjectDocumentRevisionUIStandardService').getStandardConfigForDetailView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'documentsProjectDocumentRevisionUIStandardService';
					config.dataServiceName = 'modelMainDocumentRevisionDataService';
					config.validationServiceName = null;
					config.listConfig = {initCalled: false, columns: []};
					break;
				case 'D8BE3B30FED64AAB809B5DC7170E6219':// documentsProjectDocumentRevisionDetailController
					config = $injector.get('documentsProjectDocumentRevisionUIStandardService').getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'documentsProjectDocumentRevisionUIStandardService';
					config.dataServiceName = 'modelMainDocumentRevisionDataService';
					config.validationServiceName = null;
					break;

				case '47620dd38c874f97b75ee3b6ce342666': // DocumentClerkListController
					layServ = $injector.get('centralQueryClerkConfigurationService');
					config.layout = layServ.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'centralQueryClerkConfigurationService';
					config.dataServiceName = 'centralQueryClerkService';
					config.validationServiceName = 'centralQueryClerkValidationService';
					config.listConfig = {initCalled: false, columns: []};
					break;
				case '7806e7a22b2142f8865ab189efe23c5a': // documentClerkDetailController
					layServ = $injector.get('centralQueryClerkConfigurationService');
					config = layServ.getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'centralQueryClerkConfigurationService';
					config.dataServiceName = 'centralQueryClerkService';
					config.validationServiceName = 'centralQueryClerkValidationService';
					break;
				case 'b4a5c54943ca4209ab746fddedd4a00e': // modelMainObjectHierarchicalListController
					config.layout = $injector.get('modelMainObjectHierarchicalConfigurationService').getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'modelMainObjectHierarchicalConfigurationService';
					config.dataServiceName = 'modelMainObjectHierarchicalDataService';
					config.validationServiceName = 'modelMainObjectHierarchicalValidationService';
					config.listConfig = {
						initCalled: false, grouping: true,
						parentProp: 'ObjectFk',
						childProp: 'Children',
						idProperty: 'IdString',
						marker: {
							filterService: $injector.get('modelMainFilterService'),
							filterId: 'modelMainObjectHierarchicalListController',
							dataService: $injector.get('modelMainObjectHierarchicalDataService'),
							serviceName: 'modelMainObjectHierarchicalDataService'
						},
						columns: []
					};
					break;

				case '722a80284d6843a19d4ec83f5183cbaa': // modelIFCTreeListController
					config = $injector.get('modelFiltertreesContainerInformationService').getContainerInfoByGuid('722a80284d6843a19d4ec83f5183cbaa');
					break;
				case '119fdb6a6c384668b9cc6c9882c14161': // modelMainObject2LocationListController
					config.layout = $injector.get('modelMainObject2LocationConfigurationService').getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'modelMainObject2LocationConfigurationService';
					config.dataServiceName = 'modelMainObject2LocationDataService';
					config.listConfig = {
						initCalled: false,
						grouping: true,
						enableColumnReorder: false,
						enableConfigSave: false
					};
					break;
				case 'fe0d49279eb4464a8e6744816de8ff76': // modelMainObject2LocationDetailController
					config = $injector.get('modelMainObject2LocationConfigurationService').getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'modelMainObject2LocationConfigurationService';
					config.dataServiceName = 'modelMainObject2LocationDataService';
					break;
				case '63e957df0af245a19f9608ac9beced3b': // modelEvaluationRulesetListController (non-master)
				case '5488706fc0b047cc94029e502ecd2bfe': // modelEvaluationRulesetDetailController (non-master)
					if (!modelEvaluationContainerInformationService) {
						modelEvaluationContainerInformationService = $injector.get('modelEvaluationContainerInformationService');
					}
					return modelEvaluationContainerInformationService.getContainerInfoByGuid(guid);
				case '17c46d111cd44732827332315ea206ed': // modelMainViewpointListController
					config.layout = $injector.get('modelMainViewpointConfigurationService').getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'modelMainViewpointConfigurationService';
					config.dataServiceName = 'modelMainViewpointDataService';
					config.listConfig = {
						idProperty: 'NormalizedId'
					};
					break;
				case '10b630738b584731a275fa5dbdf225a3': // modelMainViewpointDetailController
					config.layout = $injector.get('modelMainViewpointConfigurationService').getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'modelMainViewpointConfigurationService';
					config.dataServiceName = 'modelMainViewpointDataService';
					break;
			}

			const overrideData = oneTimeOverrides[guid];
			if (_.isObject(overrideData)) {
				delete oneTimeOverrides[guid];
				_.assign(config, overrideData);
			}

			return config;
		};

		return service;
	}
})(angular);
