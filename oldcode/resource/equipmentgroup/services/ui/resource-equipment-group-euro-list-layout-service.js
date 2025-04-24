/**
 * Created by baf on 26.09.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.equipmentgroup';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentGroupEuroListLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  resource equipmentGroup euroList entity.
	 **/
	angular.module(moduleName).service('resourceEquipmentGroupEuroListLayoutService', ResourceEquipmentGroupEuroListLayoutService);

	ResourceEquipmentGroupEuroListLayoutService.$inject = ['platformUIConfigInitService', 'resourceEquipmentgroupContainerInformationService', 'resourceEquipmentGroupTranslationService'];

	function ResourceEquipmentGroupEuroListLayoutService(platformUIConfigInitService, resourceEquipmentgroupContainerInformationService, resourceEquipmentGroupTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: resourceEquipmentgroupContainerInformationService.getEuroListLayout(),
			dtoSchemeId: {
				moduleSubModule: 'Resource.EquipmentGroup',
				typeName: 'EquipmentGroupEurolistDto'
			},
			translator: resourceEquipmentGroupTranslationService
		});
	}
})(angular);