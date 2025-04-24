/**
 * Created by baf on 17.11.2017
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.equipment';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentMaintenanceLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  resource equipment maintenance entity.
	 **/
	angular.module(moduleName).service('resourceEquipmentMaintenanceLayoutService', ResourceEquipmentMaintenanceLayoutService);

	ResourceEquipmentMaintenanceLayoutService.$inject = ['platformUIConfigInitService', 'resourceEquipmentContainerInformationService', 'resourceEquipmentTranslationService'];

	function ResourceEquipmentMaintenanceLayoutService(platformUIConfigInitService, resourceEquipmentContainerInformationService, resourceEquipmentTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: resourceEquipmentContainerInformationService.getResourceEquipmentMaintenanceLayout(),
			dtoSchemeId: {
				moduleSubModule: 'Resource.Equipment',
				typeName: 'MaintenanceDto'
			},
			translator: resourceEquipmentTranslationService
		});
	}
})(angular);