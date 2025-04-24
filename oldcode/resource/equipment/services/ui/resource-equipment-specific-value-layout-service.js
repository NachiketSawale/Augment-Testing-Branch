/**
 * Created by Nikhil on 07.08.2023
 */

(function (angular) {
	'use strict';
	const moduleName = 'resource.equipment';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentSpecificValueLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  resource equipment specificValue entity.
	 **/
	angular.module(moduleName).service('resourceEquipmentSpecificValueLayoutService', ResourceEquipmentSpecificValueLayoutService);

	ResourceEquipmentSpecificValueLayoutService.$inject = ['platformUIConfigInitService', 'resourceEquipmentContainerInformationService', 'resourceEquipmentConstantValues', 'resourceEquipmentTranslationService'];

	function ResourceEquipmentSpecificValueLayoutService(platformUIConfigInitService, resourceEquipmentContainerInformationService, resourceEquipmentConstantValues, resourceEquipmentTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: resourceEquipmentContainerInformationService.getSpecificValuesLayout(),
			dtoSchemeId: resourceEquipmentConstantValues.schemes.specificValues,
			translator: resourceEquipmentTranslationService
		});
	}
})(angular);