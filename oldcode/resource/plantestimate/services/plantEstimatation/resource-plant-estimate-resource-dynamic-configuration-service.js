/**
 * $Id: resource-equipment-resource-dynamic-configuration-service.js 21982 2021-12-10 16:29:21Z joshi $
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	const moduleName = 'resource.plantestimate';

	/**
	 * @ngdoc service
	 * @name resourcePlantEstimateResourceDynamicConfigurationService
	 * @function
	 *
	 * @description
	 * resourcePlantEstimateResourceDynamicConfigurationService is the config service for resource plant estimate resources container.
	 */
	angular.module(moduleName).factory('resourcePlantEstimateResourceDynamicConfigurationService', [
		'estimateCommonDynamicConfigurationServiceFactory',
		function (estimateCommonDynamicConfigurationServiceFactory) {

			return estimateCommonDynamicConfigurationServiceFactory.getService('resourcePlantEstimateResourceConfigurationService', 'resourcePlantEstimateResourceValidationService');
		}
	]);
})(angular);
