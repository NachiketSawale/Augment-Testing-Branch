/**
 * Created by baf on 12.04.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.equipmentgroup';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentGroupAccountLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  resource equipmentGroup account entity.
	 **/
	angular.module(moduleName).service('resourceEquipmentGroupAccountLayoutService', ResourceEquipmentGroupAccountLayoutService);

	ResourceEquipmentGroupAccountLayoutService.$inject = ['platformUIConfigInitService', 'resourceEquipmentgroupContainerInformationService', 'resourceEquipmentGroupConstantValues', 'resourceEquipmentGroupTranslationService'];

	function ResourceEquipmentGroupAccountLayoutService(platformUIConfigInitService, resourceEquipmentgroupContainerInformationService, resourceEquipmentGroupConstantValues, resourceEquipmentGroupTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: resourceEquipmentgroupContainerInformationService.getAccountLayout(),
			dtoSchemeId: resourceEquipmentGroupConstantValues.schemes.groupAccount,
			translator: resourceEquipmentGroupTranslationService
		});
	}
})(angular);