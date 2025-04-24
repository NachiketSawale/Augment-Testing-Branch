(function (angular) {

	/* global angular */
	'use strict';
	 let moduleName = 'logistic.card';

	/***
	 * @description
	 * logisticCardDynamicConfigurationService is the config service for logistic card container.
	 */
	angular.module(moduleName).factory('logisticCardDynamicConfigurationService', [
		'basicsCommonDynamicStructureServiceFactory',
		function (basicsCommonDynamicStructureServiceFactory) {
			return basicsCommonDynamicStructureServiceFactory.getService('logisticCardStructureLayoutService');
		}
	]);
})(angular);
