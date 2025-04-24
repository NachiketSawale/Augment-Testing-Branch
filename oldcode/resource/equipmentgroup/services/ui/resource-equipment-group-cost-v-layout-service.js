/**
 * Created by nitsche on 12.02.2020
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.equipmentgroup';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentGroupCostVLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  resource equipment  entity.
	 **/
	angular.module(moduleName).service('resourceEquipmentGroupCostVLayoutService', resourceEquipmentGroupCostVLayoutService);

	resourceEquipmentGroupCostVLayoutService.$inject = ['platformUIConfigInitService', 'resourceEquipmentgroupContainerInformationService', 'resourceEquipmentTranslationService', 'resourceEquipmentConstantValues'];

	function resourceEquipmentGroupCostVLayoutService(platformUIConfigInitService, resourceEquipmentgroupContainerInformationService, resourceEquipmentTranslationService, resourceEquipmentConstantValues) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: resourceEquipmentgroupContainerInformationService.getResourceEquipmentGroupCostVLayout(),
			dtoSchemeId: resourceEquipmentConstantValues.schemes.plantCostV,
			translator: resourceEquipmentTranslationService
		});
	}
})(angular);