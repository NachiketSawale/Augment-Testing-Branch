
/**
 * Created by cakiral on 23.07.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.equipment';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentPlantCertificateLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  resource certificate plant entity.
	 **/
	angular.module(moduleName).service('resourceEquipmentPlantCertificateLayoutService', ResourceEquipmentPlantCertificateLayoutService);

	ResourceEquipmentPlantCertificateLayoutService.$inject = ['platformUIConfigInitService', 'resourceEquipmentContainerInformationService', 'resourceEquipmentConstantValues', 'resourceEquipmentTranslationService'];

	function ResourceEquipmentPlantCertificateLayoutService(platformUIConfigInitService, resourceEquipmentContainerInformationService, resourceEquipmentConstantValues, resourceEquipmentTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: resourceEquipmentContainerInformationService.getResourceEquipmentPlantCertificateLayout(),
			dtoSchemeId: resourceEquipmentConstantValues.schemes.plantCertificate,
			translator: resourceEquipmentTranslationService


		});
	}
})(angular);