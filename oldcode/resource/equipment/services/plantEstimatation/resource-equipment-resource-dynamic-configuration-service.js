/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	const moduleName = 'resource.equipment';

	/**
	 * @ngdoc service
	 * @name resourceEquipmentResourceDynamicConfigurationService
	 * @function
	 *
	 * @description
	 * resourceEquipmentResourceDynamicConfigurationService is the config service for resource equipment resources container.
	 */
	angular.module(moduleName).factory('resourceEquipmentResourceDynamicConfigurationService', [
		'estimateCommonDynamicConfigurationServiceFactory',
		function (estimateCommonDynamicConfigurationServiceFactory) {

			return estimateCommonDynamicConfigurationServiceFactory.getService('resourceEquipmentEstimateResourceConfigurationService', 'resourceEquipmentEstimateResourceValidationService');
		}
	]);
})(angular);
