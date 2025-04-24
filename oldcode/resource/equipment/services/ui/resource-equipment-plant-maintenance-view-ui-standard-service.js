/**
 * Created by nitsche on 01.03.2021
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.equipment';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentMaintenanceViewLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  resource equipment  entity.
	 **/
	angular.module(moduleName).service('resourceEquipmentMaintenanceViewLayoutService', ResourceEquipmentMaintenanceViewLayoutService);

	ResourceEquipmentMaintenanceViewLayoutService.$inject = ['platformUIConfigInitService', 'resourceEquipmentContainerInformationService', 'resourceEquipmentTranslationService'];

	function ResourceEquipmentMaintenanceViewLayoutService(platformUIConfigInitService, resourceEquipmentContainerInformationService, resourceEquipmentTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: resourceEquipmentContainerInformationService.getResourceEquipmentPlantMaintViewLayout(),
			dtoSchemeId: {
				moduleSubModule: 'Resource.Equipment',
				typeName: 'PlantMaintenanceVDto'
			},
			translator: resourceEquipmentTranslationService
		});
	}
})(angular);