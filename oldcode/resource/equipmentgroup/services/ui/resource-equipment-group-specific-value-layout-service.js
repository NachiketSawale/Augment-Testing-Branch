/**
 * Created by baf on 20.07.2023
 */

(function (angular) {
	'use strict';
	const moduleName = 'resource.equipmentgroup';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentGroupSpecificValueLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  resource equipmentGroup specificValue entity.
	 **/
	angular.module(moduleName).service('resourceEquipmentGroupSpecificValueLayoutService', ResourceEquipmentGroupSpecificValueLayoutService);

	ResourceEquipmentGroupSpecificValueLayoutService.$inject = ['platformUIConfigInitService', 'resourceEquipmentgroupContainerInformationService', 'resourceEquipmentGroupConstantValues', 'resourceEquipmentGroupTranslationService'];

	function ResourceEquipmentGroupSpecificValueLayoutService(platformUIConfigInitService, resourceEquipmentgroupContainerInformationService, resourceEquipmentGroupConstantValues, resourceEquipmentGroupTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: resourceEquipmentgroupContainerInformationService.getSpecificValueLayout(),
			dtoSchemeId: resourceEquipmentGroupConstantValues.schemes.specificValue,
			translator: resourceEquipmentGroupTranslationService
		});
	}
})(angular);