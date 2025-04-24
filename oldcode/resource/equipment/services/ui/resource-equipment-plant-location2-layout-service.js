/**
 * Created by nitsche on 04.05.2020
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.equipment';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentPlantLocation2LayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  resource equipment  entity.
	 **/
	angular.module(moduleName).service('resourceEquipmentPlantLocation2LayoutService', ResourceEquipmentPlantLocation2LayoutService);

	ResourceEquipmentPlantLocation2LayoutService.$inject = ['platformUIConfigInitService', 'resourceEquipmentContainerInformationService', 'resourceEquipmentTranslationService', 'logisticJobConstantValues'];

	function ResourceEquipmentPlantLocation2LayoutService(platformUIConfigInitService, resourceEquipmentContainerInformationService, resourceEquipmentTranslationService, logisticJobConstantValues) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: resourceEquipmentContainerInformationService.getResourceEquipmentPlantLocation2Layout(),
			dtoSchemeId: logisticJobConstantValues.schemes.plantAllocation,
			translator: resourceEquipmentTranslationService
		});
	}
})(angular);