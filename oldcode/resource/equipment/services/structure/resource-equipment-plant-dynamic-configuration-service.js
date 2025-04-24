/**
 * Created by cakiral on 21/01/2021.
 */
(function (angular) {

	/* global angular */
	'use strict';
	 let moduleName = 'resource.equipment';

	/***
	 * @description
	 * resourceEquipmentPlantDynamicConfigurationService is the config service for resource Equipment Plant container.
	 */
	angular.module(moduleName).factory('resourceEquipmentPlantDynamicConfigurationService', [
		'resourceEquipmentPlantDynamicConfigurationServiceFactory',
		function (resourceEquipmentPlantDynamicConfigurationServiceFactory) {
			return resourceEquipmentPlantDynamicConfigurationServiceFactory.getService('resourceEquipmentPlantUIStandardService', 'resourceEquipmentPlantValidationService');
		}
	]);
})(angular);
