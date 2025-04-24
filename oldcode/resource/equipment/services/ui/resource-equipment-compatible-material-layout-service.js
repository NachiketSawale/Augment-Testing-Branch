/**
 * Created by baf on 30.01.2023
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.equipment';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentCompatibleMaterialLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  resource equipment compatibleMaterial entity.
	 **/
	angular.module(moduleName).service('resourceEquipmentCompatibleMaterialLayoutService', ResourceEquipmentCompatibleMaterialLayoutService);

	ResourceEquipmentCompatibleMaterialLayoutService.$inject = ['platformUIConfigInitService', 'resourceEquipmentContainerInformationService', 'resourceEquipmentConstantValues', 'resourceEquipmentTranslationService'];

	function ResourceEquipmentCompatibleMaterialLayoutService(platformUIConfigInitService, resourceEquipmentContainerInformationService, resourceEquipmentConstantValues, resourceEquipmentTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: resourceEquipmentContainerInformationService.getResourceEquipmentCompatibleMaterialLayout(),
			dtoSchemeId: resourceEquipmentConstantValues.schemes.compatibleMaterial,
			translator: resourceEquipmentTranslationService
		});
	}
})(angular);