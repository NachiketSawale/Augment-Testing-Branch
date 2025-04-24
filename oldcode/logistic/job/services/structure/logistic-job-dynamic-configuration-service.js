(function (angular) {

	/* global angular */
	'use strict';
	 let moduleName = 'logistic.job';

	/***
	 * @description
	 * logisticJobDynamicConfigurationService is the config service for logistic job container.
	 */
	angular.module(moduleName).factory('logisticJobDynamicConfigurationService', [
		'basicsCommonDynamicStructureServiceFactory',
		function (basicsCommonDynamicStructureServiceFactory) {
			return basicsCommonDynamicStructureServiceFactory.getService('logisticJobUIStandardService');
		}
	]);
})(angular);
