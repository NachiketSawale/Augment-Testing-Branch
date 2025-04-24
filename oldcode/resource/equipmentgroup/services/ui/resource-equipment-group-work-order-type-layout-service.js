(function () {
	'use strict';
	var moduleName = 'resource.equipmentgroup';

	/**
	 * @ngdoc service
	 * @name resourceEquipmentGroupWorkOrderTypeUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of plant eurolist entities
	 */
	angular.module(moduleName).service('resourceEquipmentGroupWorkOrderTypeLayoutService', ResourceEquipmentGroupWorkOrderTypeLayoutService);

	ResourceEquipmentGroupWorkOrderTypeLayoutService.$inject = ['platformUIConfigInitService', 'resourceEquipmentgroupContainerInformationService',
		'resourceEquipmentGroupConstantValues', 'resourceEquipmentGroupTranslationService'];

	function ResourceEquipmentGroupWorkOrderTypeLayoutService(platformUIConfigInitService, resourceEquipmentgroupContainerInformationService,
	    resourceEquipmentGroupConstantValues, resourceEquipmentGroupTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: resourceEquipmentgroupContainerInformationService.getWorkOrderTypeLayout(),
			dtoSchemeId: resourceEquipmentGroupConstantValues.schemes.groupWoT,
			translator: resourceEquipmentGroupTranslationService
		});
	}
})();
