/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	const modelMeasurementsModule = angular.module('model.measurements');

	/**
	 * @ngdoc service
	 * @name modelMeasurementsContainerInformationService
	 * @function
	 *
	 * @description
	 * Provides some information on all containers in the module.
	 */

	modelMeasurementsModule.factory('modelMeasurementsContainerInformationService',
		modelMeasurementsContainerInformationService);

	modelMeasurementsContainerInformationService.$inject = ['$injector', '_','modelMeasurementsClipboardService'];

	function modelMeasurementsContainerInformationService($injector, _, modelMeasurementsClipboardService) {
		const service = {};

		service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			let config = {};
			switch (guid) {
				case '1b72a5f32b6646e8b5358653fcc51a77': // modelMeasurementListController
					config.layout = $injector.get('modelMeasurementConfigurationService').getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'modelMeasurementConfigurationService';
					config.dataServiceName = 'modelMeasurementDataService';
					config.validationServiceName = null;
					config.listConfig = {
						initCalled: false,
						grouping: true,
						type: 'model.measurements',
						dragDropService: modelMeasurementsClipboardService
					};
					break;
				case '82a0d97bcd4842d9b2d5460b05473158': // modelMeasurementDetailController
					config.layout = $injector.get('modelMeasurementConfigurationService').getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'modelMeasurementConfigurationService';
					config.dataServiceName = 'modelMeasurementDataService';
					config.validationServiceName = null;
					break;
				case '8c8f48d17387402694b8359bef7bde6d': // modelMeasurementPointListController
					config.layout = $injector.get('modelMeasurementPointConfigurationService').getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'modelMeasurementPointConfigurationService';
					config.dataServiceName = 'modelMeasurementPointDataService';
					config.validationServiceName = null;
					config.listConfig = {
						initCalled: false,
						grouping: true
					};
					break;
				case '4c7ea712d06a42feae5926d17446986c': // modelMeasurementPointDetailController
					config.layout = $injector.get('modelMeasurementPointConfigurationService').getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'modelMeasurementPointConfigurationService';
					config.dataServiceName = 'modelMeasurementPointDataService';
					config.validationServiceName = null;
					break;
				case 'aa43043e0a954d99a8f58c90ef1cb581': // modelMeasurementGroupListController
					config.layout = $injector.get('modelMeasurementGroupConfigurationService').getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'modelMeasurementGroupConfigurationService';
					config.dataServiceName = 'modelMeasurementGroupDataService';
					config.validationServiceName = null;
					config.listConfig = {
						initCalled: false,
						grouping: true
					};
					break;
				case '65195e08535840448858c60b59b44bcf': // modelMeasurementGroupDetailController
					config.layout = $injector.get('modelMeasurementGroupConfigurationService').getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'modelMeasurementGroupConfigurationService';
					config.dataServiceName = 'modelMeasurementGroupDataService';
					config.validationServiceName = null;
					break;
			}

			return config;
		};

		return service;
	}
})(angular);
