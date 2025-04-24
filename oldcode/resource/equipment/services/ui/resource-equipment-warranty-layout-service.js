/**
 * Created by baf on 15.07.2022
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.equipment';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentWarrantyLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  resource equipment warranty entity.
	 **/
	angular.module(moduleName).service('resourceEquipmentWarrantyLayoutService', ResourceEquipmentWarrantyLayoutService);

	ResourceEquipmentWarrantyLayoutService.$inject = ['platformUIConfigInitService', 'resourceEquipmentContainerInformationService', 'resourceEquipmentConstantValues', 'resourceEquipmentTranslationService'];

	function ResourceEquipmentWarrantyLayoutService(platformUIConfigInitService, resourceEquipmentContainerInformationService, resourceEquipmentConstantValues, resourceEquipmentTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: resourceEquipmentContainerInformationService.getResourceEquipmentWarrantyLayout(),
			dtoSchemeId: resourceEquipmentConstantValues.schemes.plantWarranty,
			translator: resourceEquipmentTranslationService
		});
	}
})(angular);