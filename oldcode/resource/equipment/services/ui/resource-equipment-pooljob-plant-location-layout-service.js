/**
 * Created by shen on 12/15/2021
 */
(function (angular) {
	'use strict';
	let moduleName = 'resource.equipment';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentPoolJobPlantLocationLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  resource equipment  entity.
	 **/
	angular.module(moduleName).service('resourceEquipmentPoolJobPlantLocationLayoutService', ResourceEquipmentPoolJobPlantLocationLayoutService);

	ResourceEquipmentPoolJobPlantLocationLayoutService.$inject = ['platformUIConfigInitService', 'resourceEquipmentContainerInformationService', 'resourceEquipmentTranslationService', 'logisticJobConstantValues'];

	function ResourceEquipmentPoolJobPlantLocationLayoutService(platformUIConfigInitService, resourceEquipmentContainerInformationService, resourceEquipmentTranslationService, logisticJobConstantValues) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: resourceEquipmentContainerInformationService.getResourceEquipmentPlantLocation2Layout(),
			dtoSchemeId: logisticJobConstantValues.schemes.plantAllocation,
			translator: resourceEquipmentTranslationService
		});
	}
})(angular);
