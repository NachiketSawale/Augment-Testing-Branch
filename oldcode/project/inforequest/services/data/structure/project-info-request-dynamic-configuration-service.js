(function (angular) {

	/* global angular */
	'use strict';
	 let moduleName = 'project.inforequest';

	/***
	 * @description
	 * projectInfoRequestDynamicConfigurationService is the config service.
	 */
	angular.module(moduleName).factory('projectInfoRequestDynamicConfigurationService', [
		'projectInfoRequestDynamicConfigurationServiceFactory',
		function (projectInfoRequestDynamicConfigurationServiceFactory) {
			return projectInfoRequestDynamicConfigurationServiceFactory.getService('projectInfoRequestUIStandardService', 'projectInfoRequestValidationService');
		}
	]);
})(angular);
