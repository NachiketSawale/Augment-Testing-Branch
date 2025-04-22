/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {



	'use strict';
	var salesCommonModule = angular.module('sales.common');

	/**
	 * @ngdoc service
	 * @name salesCommonContainerInformationHelperService
	 * @function
	 * @description
	 */
	salesCommonModule.factory('salesCommonContainerInformationHelperService',
		['_', '$injector', function (_, $injector) {

			var service = {};

			service.createConfigFunc = function createConfigFunc(containerType, standardConfigurationServiceName, dataServiceName, validationServiceName) {
				return function () {
					return service.createConfig(containerType, standardConfigurationServiceName, dataServiceName, validationServiceName);
				};
			};

			service.createConfig = function createConfig(containerType, standardConfigurationServiceName, dataServiceName, validationServiceName) {
				var layServ = $injector.get(standardConfigurationServiceName);
				var config = {};
				config.layout = containerType === 'Grid' ? layServ.getStandardConfigForListView() : layServ.getStandardConfigForDetailView();
				config.ContainerType = containerType;
				config.standardConfigurationService = standardConfigurationServiceName;
				config.dataServiceName = dataServiceName;
				config.validationServiceName = validationServiceName;
				if (containerType === 'Grid') {
					config.listConfig = {
						initCalled: false,
						columns: []
					};
				}
				return config;
			};

			service.getContainerInfoByGuid = function getContainerInfoByGuid(guid, guid2Config) {
				return (_.isFunction(guid2Config[guid]) ? guid2Config[guid]() : guid2Config[guid]) || {};
			};

			/**
			 * @ngdoc function
			 * @name initMasterDataFilter
			 * @function
			 * @methodOf salesCommonContainerInformationHelperService
			 * @description init master data filter
			 */
			service.initMasterDataFilter = function initMasterDataFilter(dataServiceName){
				var estimateProjectRateBookConfigDataService = $injector.get('estimateProjectRateBookConfigDataService');
				var dataService = $injector.get(dataServiceName);
				estimateProjectRateBookConfigDataService.clearData();
				if(estimateProjectRateBookConfigDataService && dataService) {
					var selectedProject = dataService.getSelected();
					var projectId = selectedProject ? selectedProject.ProjectFk : null;
					if(projectId) {
						estimateProjectRateBookConfigDataService.initData(projectId);
					}
				}
			};

			return service;
		}
		]);
})();
