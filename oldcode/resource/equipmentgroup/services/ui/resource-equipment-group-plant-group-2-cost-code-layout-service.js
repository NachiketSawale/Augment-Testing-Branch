/**
 * Created by nitsche on 15.11.2021
 */

(function (angular) {
	/* global globals _ */
	'use strict';
	let myModule = angular.module('resource.equipmentgroup');

	/**
	 * @ngdoc service
	 * @name resourceEquipmentGroupPlantGroup2CostCodeLayoutService
	 * @description This service provides standard layout for grid / form of  resource equipment PlantGroup2CostCode entity.
	 */
	myModule.service('resourceEquipmentGroupPlantGroup2CostCodeLayoutService', ResourceEquipmentGroupPlantGroup2CostCodeLayoutService);

	ResourceEquipmentGroupPlantGroup2CostCodeLayoutService.$inject = ['resourceEquipmentGroupConstantValues', 'resourceEquipmentGroupTranslationService', 'platformUIConfigInitService', 'resourceEquipmentgroupContainerInformationService'];

	function ResourceEquipmentGroupPlantGroup2CostCodeLayoutService(resourceEquipmentGroupConstantValues, resourceEquipmentGroupTranslationService, platformUIConfigInitService, resourceEquipmentgroupContainerInformationService) {
		let self = this;
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: resourceEquipmentgroupContainerInformationService.getPlantGroup2CostCodeLayout(),
			dtoSchemeId: resourceEquipmentGroupConstantValues.schemes.plantGroup2CostCode,
			translator: resourceEquipmentGroupTranslationService
		});
	}
})(angular);