/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	const modelAnnotationModule = angular.module('model.annotation');

	/**
	 * @ngdoc service
	 * @name modelAnnotationContainerInformationService
	 * @function
	 *
	 * @description
	 * Provides some information on all containers in the module.
	 */
	modelAnnotationModule.factory('modelAnnotationContainerInformationService',
		modelAnnotationContainerInformationService);

	modelAnnotationContainerInformationService.$inject = ['$injector', '_','modelAnnotationClipboardService'];

	function modelAnnotationContainerInformationService($injector, _, modelAnnotationClipboardService) {
		const service = {};

		const oneTimeOverrides = {};

		service.overrideOnce = function (guid, data) {
			oneTimeOverrides[guid] = data;
		};

		service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			let config = {};
			switch (guid) {
				case '0a5454bc99c24a539dc1264262096b8c': // modelAnnotationListController
					config.layout = $injector.get('modelAnnotationConfigurationService').getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'modelAnnotationConfigurationService';
					config.dataServiceName = 'modelAnnotationDataService';
					config.validationServiceName = 'modelAnnotationValidationService';
					config.listConfig = {
						initCalled: false,
						grouping: true,
						type: 'model.annotation',
						dragDropService: modelAnnotationClipboardService
					};
					break;
				case '67e8894374e74eb29664b1182253323c': // modelAnnotationDetailController
					config.layout = $injector.get('modelAnnotationConfigurationService').getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'modelAnnotationConfigurationService';
					config.dataServiceName = 'modelAnnotationDataService';
					config.validationServiceName = 'modelAnnotationValidationService';
					break;

				case '86d0e1fe63d24c1eb25c05a7ad470844': // modelAnnotationReferenceListController
					config.layout = $injector.get('modelAnnotationReferenceConfigurationService').getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'modelAnnotationReferenceConfigurationService';
					config.dataServiceName = 'modelAnnotationReferenceDataService';
					config.validationServiceName = 'modelAnnotationReferenceValidationService';
					config.listConfig = {
						initCalled: false,
						grouping: true
					};
					break;
				case '5ead9a293b23439e9a668298ed75d438': // modelAnnotationReferenceDetailController
					config.layout = $injector.get('modelAnnotationReferenceConfigurationService').getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'modelAnnotationReferenceConfigurationService';
					config.dataServiceName = 'modelAnnotationReferenceDataService';
					config.validationServiceName = 'modelAnnotationReferenceValidationService';
					break;

				case '26110cbc14374f7895d1d7934efd0a63': // modelAnnotationObjectLinkListController
					config.layout = $injector.get('modelAnnotationObjectLinkConfigurationService').getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'modelAnnotationObjectLinkConfigurationService';
					config.dataServiceName = 'modelAnnotationObjectLinkDataService';
					config.validationServiceName = null;
					config.listConfig = {
						initCalled: false,
						grouping: true,
						idProperty: 'globalId'
					};
					break;
				case 'de29ed7ffa5d415fb38138f7eda5922e': // modelAnnotationObjectLinkDetailController
					config.layout = $injector.get('modelAnnotationObjectLinkConfigurationService').getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'modelAnnotationObjectLinkConfigurationService';
					config.dataServiceName = 'modelAnnotationObjectLinkDataService';
					config.validationServiceName = null;
					break;

				case '1278a2ca11f947bb8e02eab65e815a7d': // modelAnnotationCameraListController
					config.layout = $injector.get('modelAnnotationCameraConfigurationService').getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'modelAnnotationCameraConfigurationService';
					config.dataServiceName = 'modelAnnotationCameraDataService';
					config.validationServiceName = null;
					config.listConfig = {
						initCalled: false,
						grouping: true,
						idProperty: 'globalId'
					};
					break;
				case 'dfb06f32f92744358eee5d8b88496786': // modelAnnotationCameraDetailController
					config.layout = $injector.get('modelAnnotationCameraConfigurationService').getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'modelAnnotationCameraConfigurationService';
					config.dataServiceName = 'modelAnnotationCameraDataService';
					config.validationServiceName = null;
					break;

				case '437ca6a2a0c64fe79f90ec3f9b3dc3f0': // modelAnnotationDocumentListController
					config.layout = $injector.get('modelAnnotationDocumentConfigurationService').getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'modelAnnotationDocumentConfigurationService';
					config.dataServiceName = 'modelAnnotationDocumentDataService';
					config.validationServiceName = 'modelAnnotationDocumentValidationService';
					config.listConfig = {
						initCalled: false,
						grouping: true
					};
					break;
				case 'ac73e76de2924220a46956319d4d424c': // modelAnnotationDocumentDetailController
					config.layout = $injector.get('modelAnnotationDocumentConfigurationService').getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'modelAnnotationDocumentConfigurationService';
					config.dataServiceName = 'modelAnnotationDocumentDataService';
					config.validationServiceName = 'modelAnnotationDocumentValidationService';
					break;

				case 'cf264c9dbb51466cb147e1a7f7f5d888': // modelAnnotationMarkerListController
					config.layout = $injector.get('modelAnnotationMarkerConfigurationService').getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'modelAnnotationMarkerConfigurationService';
					config.dataServiceName = 'modelAnnotationMarkerDataService';
					config.validationServiceName = null;
					config.listConfig = {
						initCalled: false,
						grouping: true,
						idProperty: 'globalId'
					};
					break;
				case 'b162c7c601ce4c6da794e49140ace8a7': // modelAnnotationMarkerDetailController
					config.layout = $injector.get('modelAnnotationMarkerConfigurationService').getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'modelAnnotationMarkerConfigurationService';
					config.dataServiceName = 'modelAnnotationMarkerDataService';
					config.validationServiceName = null;
					break;

				case 'da5481eabd71482dbca12c4260eec5bf': // modelMainObjectInfoListController
				case '086b1d0b9d4e4bc6a80ffddaa668ada7': // modelMainObjectInfoDetailController
				case '3b5c28631ef44bb293ee05475a9a9513': // modelMainViewerLegendListController
				case 'd12461a0826a45f1ab76f53203b48ec6': // modelMainViewerLegendDetailController
					config = $injector.get('modelMainContainerInformationService').getContainerInfoByGuid(guid);
					break;
				case '63e957df0af245a19f9608ac9beced3b': // modelEvaluationRulesetListController (non-master)
				case '5488706fc0b047cc94029e502ecd2bfe': // modelEvaluationRulesetDetailController (non-master)
				case '3a0e7703abd140febba420db01e72c88': // modelEvaluationRuleListController (non-master)
				case '5a4d078143764838ac5d8e7dcfa5ca9b': // modelEvaluationRuleDetailController (non-master)
					config = $injector.get('modelEvaluationContainerInformationService').getContainerInfoByGuid(guid);
					break;
				case '17c46d111cd44732827332315ea206ed': // modelMainViewpointListController
				case '10b630738b584731a275fa5dbdf225a3': // modelMainViewpointDetailController
					config = $injector.get('modelMainContainerInformationService').getContainerInfoByGuid(guid);
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
