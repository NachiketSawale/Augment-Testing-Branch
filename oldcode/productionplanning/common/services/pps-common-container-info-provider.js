/**
 * Created by lav on 5/9/2020.
 */
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.common';

	angular.module(moduleName).factory('ppsCommonContainerInfoProvider',
		containerInfoProvider);

	containerInfoProvider.$inject = ['$injector'];

	function containerInfoProvider($injector) {

		function getService(service) {
			return angular.isString(service) ? $injector.get(service) : service;
		}

		function getContainerInfo(options) {
			options.key = options.key || options.moduleName;
			var dataService = getService(options.dataServiceName);
			var UIStandardService = getService(options.standardConfigurationService);
			var validationService = getService(options.validationServiceName);
			var config = {};
			config.dataServiceName = dataService.getService(options.key, options);
			config.standardConfigurationService = UIStandardService.getService(options.key, config.dataServiceName);
			config.validationServiceName = validationService.getService(options.key, config.dataServiceName);
			if (options.isGrid) {
				config.listConfig = {initCalled: false, columns: []};
				config.ContainerType = 'Grid';
			} else {
				config.ContainerType = 'Detail';
			}
			return config;
		}

		function getContainerInfoA(options) {
			var dataServiceFactory = getService(options.dataServiceFactory);
			var UIStandardServiceFactory = getService(options.UIStandardServiceFactory);
			var validationServiceFactory = getService(options.validationServiceFactory);
			options.parentService = getService(options.parentService);
			var config = {};
			config.dataServiceName = dataServiceFactory.getService(options);
			config.standardConfigurationService = UIStandardServiceFactory.getService(config.dataServiceName);
			config.validationServiceName = validationServiceFactory.getService(config.dataServiceName);
			if (options.isGrid) {
				config.listConfig = {initCalled: false, columns: []};
				config.ContainerType = 'Grid';
			} else {
				config.ContainerType = 'Detail';
			}
			return config;
		}

		return {
			getContainerInfo: getContainerInfo,
			getContainerInfoA: getContainerInfoA
		};
	}
})(angular);