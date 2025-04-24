/**
 * Created by baf on 03.05.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.equipment';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentControllingUnitLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  resource equipment controllingUnit entity.
	 **/
	angular.module(moduleName).service('resourceEquipmentControllingUnitLayoutService', ResourceEquipmentControllingUnitLayoutService);

	ResourceEquipmentControllingUnitLayoutService.$inject = ['platformUIConfigInitService', 'resourceEquipmentContainerInformationService', 'resourceEquipmentConstantValues', 'resourceEquipmentTranslationService'];

	function ResourceEquipmentControllingUnitLayoutService(platformUIConfigInitService, resourceEquipmentContainerInformationService, resourceEquipmentConstantValues, resourceEquipmentTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: resourceEquipmentContainerInformationService.getControllingUnitLayout(),
			dtoSchemeId: resourceEquipmentConstantValues.schemes.controllingUnit,
			translator: resourceEquipmentTranslationService
		});
	}
})(angular);