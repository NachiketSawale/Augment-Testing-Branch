/**
 * Created by nitsche on 12.02.2020
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.equipment';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentPlantCostVLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  resource equipment  entity.
	 **/
	angular.module(moduleName).service('resourceEquipmentPlantCostVLayoutService', resourceEquipmentPlantCostVLayoutService);

	resourceEquipmentPlantCostVLayoutService.$inject = ['platformUIConfigInitService', 'resourceEquipmentContainerInformationService', 'resourceEquipmentTranslationService', 'resourceEquipmentConstantValues'];

	function resourceEquipmentPlantCostVLayoutService(platformUIConfigInitService, resourceEquipmentContainerInformationService, resourceEquipmentTranslationService, resourceEquipmentConstantValues) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: resourceEquipmentContainerInformationService.getResourceEquipmentPlantCostVLayout(),
			dtoSchemeId: resourceEquipmentConstantValues.schemes.plantCostV,
			translator: resourceEquipmentTranslationService
		});
	}
})(angular);