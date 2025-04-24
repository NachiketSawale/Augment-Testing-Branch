
(function (angular) {

	/* global angular */
	'use strict';
	 let moduleName = 'logistic.settlement';

	/***
	 * @description
	 * logisticSettlementDynamicConfigurationService is the config service for logistic Settlement container.
	 */
	angular.module(moduleName).factory('logisticSettlementDynamicConfigurationService', [
		'basicsCommonDynamicStructureServiceFactory',
		function (basicsCommonDynamicStructureServiceFactory) {
			return basicsCommonDynamicStructureServiceFactory.getService('logisticSettlementStructureLayoutService');
		}
	]);
})(angular);
