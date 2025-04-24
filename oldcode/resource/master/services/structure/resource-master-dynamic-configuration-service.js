/**
 * Created by cakiral on 06/10/2021.
 */
(function (angular) {

	/* global angular */
	'use strict';
	 var moduleName = 'resource.master';

	/***
	 * @description
	 * resourceMasterDynamicConfigurationService is the config service for resource Master container.
	 */
	angular.module(moduleName).factory('resourceMasterDynamicConfigurationService', [
		'resourceMasterDynamicConfigurationServiceFactory',
		function (resourceMasterDynamicConfigurationServiceFactory) {
			return resourceMasterDynamicConfigurationServiceFactory.getService('resourceMasterUIStandardService', 'resourceMasterValidationService');
		}
	]);
})(angular);
