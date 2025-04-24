/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	const moduleName = 'resource.equipmentgroup';

	/**
	 * @ngdoc service
	 * @name resourceEquipmentGroupResourceDynamicConfigurationService
	 * @function
	 *
	 * @description
	 * This is the config service for resource equipment group resources container.
	 */
	angular.module(moduleName).factory('resourceEquipmentGroupResourceDynamicConfigurationService', [
		'estimateCommonDynamicConfigurationServiceFactory',
		function (estimateCommonDynamicConfigurationServiceFactory) {
			return estimateCommonDynamicConfigurationServiceFactory.getService('resourceEquipmentGroupEstimateResourceConfigurationService', 'resourceEquipmentGroupEstimateResourceValidationService');
		}
	]);
})(angular);
