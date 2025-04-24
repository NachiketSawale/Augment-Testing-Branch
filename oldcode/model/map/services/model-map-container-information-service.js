/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const modelMapModule = angular.module('model.map');

	/**
	 * @ngdoc service
	 * @name modelMapContainerInformationService
	 * @function
	 *
	 * @description
	 *
	 */
	modelMapModule.factory('modelMapContainerInformationService',
		modelMapContainerInformationService);

	modelMapContainerInformationService.$inject = ['$injector'];

	function modelMapContainerInformationService($injector) {
		const service = {};

		service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			let config = {};
			switch (guid) {

				case '5b2eda413a434857848e70df9ba397f9': // modelProjectModelMapDetailController
					config = getProjectModelMapDetailConfig(config);
					break;

				case 'b3283ad1a7424388b03ca5a47fa09d15': // modelProjectModelMapListController
					config = getProjectModelMapListConfig(config);
					break;

				case '795b9b8a7d824f90a0e86802378e3924': // modelProjectModelMapLevelDetailController
					config = getProjectModelMapLevelDetailConfig(config);
					break;

				case '0286f5d963784449a6b145acb4676fe6': // modelProjectModelMapLevelListController
					config = getProjectModelMapLevelListConfig(config);
					break;

				case '12fe6a7a85af40ed8ce3125a3bef7442': // modelProjectModelMapPolygonDetailController
					config = getProjectModelMapPolygonDetailConfig(config);
					break;

				case '87476328055e41ceb232ab1f82a54e8f': // modelProjectModelMapPolygonListController
					config = getProjectModelMapPolygonListConfig(config);
					break;

				case '86480935d53747df8974e5341d9aabb2': // modelProjectModelMapAreaDetailController
					config = getProjectModelMapAreaDetailConfig(config);
					break;

				case 'a8a7ae07b8834324bcc2cee437170d2a': // modelProjectModelMapAreaListController
					config = getProjectModelMapAreaListConfig(config);
					break;
			}

			function getProjectModelMapDetailConfig(config) {
				config.layout = $injector.get('modelMapMapConfigurationService').getStandardConfigForListView();
				config.ContainerType = 'detail';
				config.standardConfigurationService = 'modelMapUIConfig';
				config.dataServiceName = 'modelMapDataService';
				config.listConfig = {initCalled: false, columns: []};
				return config;
			}

			function getProjectModelMapListConfig(config) {
				config.layout = $injector.get('modelMapMapConfigurationService').getStandardConfigForListView();
				config.ContainerType = 'Grid';
				config.standardConfigurationService = 'modelMapUIConfig';
				config.dataServiceName = 'modelMapDataService';
				config.listConfig = {
					initCalled: false,
					grouping: true,
					idProperty: 'compositeId'
				};
				return config;
			}

			function getProjectModelMapLevelDetailConfig(config) {
				config.layout = $injector.get('modelMapLevelConfigurationService').getStandardConfigForListView();
				config.ContainerType = 'detail';
				config.standardConfigurationService = 'modelMapLevelUIConfig';
				config.dataServiceName = 'modelMapLevelDataService';
				config.listConfig = {initCalled: false, columns: []};
				return config;
			}

			function getProjectModelMapLevelListConfig(config) {
				config.layout = $injector.get('modelMapLevelConfigurationService').getStandardConfigForListView();
				config.ContainerType = 'Grid';
				config.standardConfigurationService = 'modelMapLevelUIConfig';
				config.dataServiceName = 'modelMapLevelDataService';
				config.listConfig = {
					initCalled: false,
					grouping: true,
					idProperty: 'Id'
				};
				return config;
			}

			function getProjectModelMapPolygonDetailConfig(config) {
				config.layout = $injector.get('modelMapPolygonConfigurationService').getStandardConfigForListView();
				config.ContainerType = 'detail';
				config.standardConfigurationService = 'modelMapPolygonUIConfig';
				config.dataServiceName = 'modelMapPolygonDataService';
				config.listConfig = {initCalled: false, columns: []};
				return config;
			}

			function getProjectModelMapPolygonListConfig(config) {
				config.layout = $injector.get('modelMapPolygonConfigurationService').getStandardConfigForListView();
				config.ContainerType = 'Grid';
				config.standardConfigurationService = 'modelMapPolygonUIConfig';
				config.dataServiceName = 'modelMapPolygonDataService';
				config.listConfig = {
					initCalled: false,
					grouping: true,
					idProperty: 'Id'
				};
				return config;
			}

			function getProjectModelMapAreaDetailConfig(config) {
				config.layout = $injector.get('modelMapAreaConfigurationService').getStandardConfigForListView();
				config.ContainerType = 'detail';
				config.standardConfigurationService = 'modelMapAreaUIConfig';
				config.dataServiceName = 'modelMapAreaDataService';
				config.listConfig = {initCalled: false, columns: []};
				return config;
			}

			function getProjectModelMapAreaListConfig(config) {
				config.layout = $injector.get('modelMapAreaConfigurationService').getStandardConfigForListView();
				config.ContainerType = 'Grid';
				config.standardConfigurationService = 'modelMapAreaUIConfig';
				config.dataServiceName = 'modelMapAreaDataService';
				config.listConfig = {
					initCalled: false,
					grouping: true,
					idProperty: 'Id'
				};
				return config;
			}

			return config;
		};
		return service;
	}
})(angular);
