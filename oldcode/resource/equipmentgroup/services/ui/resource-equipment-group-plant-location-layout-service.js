/**
 * Created by nitsche on 04.05.2020
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.equipmentgroup';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentGroupPlantLocationLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  resource equipment  entity.
	 **/
	angular.module(moduleName).service('resourceEquipmentGroupPlantLocationLayoutService', ResourceEquipmentGroupPlantLocationLayoutService);

	ResourceEquipmentGroupPlantLocationLayoutService.$inject = ['platformUIConfigInitService', 'resourceEquipmentgroupContainerInformationService', 'resourceEquipmentGroupTranslationService', 'logisticJobConstantValues'];

	function ResourceEquipmentGroupPlantLocationLayoutService(platformUIConfigInitService, resourceEquipmentgroupContainerInformationService, resourceEquipmentGroupTranslationService, logisticJobConstantValues) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: resourceEquipmentgroupContainerInformationService.getResourceEquipmentGroupPlantLocationLayout(),
			dtoSchemeId: logisticJobConstantValues.schemes.plantAllocation,
			translator: resourceEquipmentGroupTranslationService
		});
	}
})(angular);