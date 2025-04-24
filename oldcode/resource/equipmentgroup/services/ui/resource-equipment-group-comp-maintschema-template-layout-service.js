/**
 * Created by shen on 09.01.2025
 */

(function (angular) {
	'use strict';
	let moduleName = 'resource.equipmentgroup';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentGroupCompMaintSchemaTemplateLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  resource equipmentGroup compmaintschematemplate entity.
	 **/
	angular.module(moduleName).service('resourceEquipmentGroupCompMaintSchemaTemplateLayoutService', ResourceEquipmentGroupCompMaintSchemaTemplateLayoutService);

	ResourceEquipmentGroupCompMaintSchemaTemplateLayoutService.$inject = ['platformUIConfigInitService', 'resourceEquipmentgroupContainerInformationService', 'resourceEquipmentGroupTranslationService'];

	function ResourceEquipmentGroupCompMaintSchemaTemplateLayoutService(platformUIConfigInitService, resourceEquipmentgroupContainerInformationService, resourceEquipmentGroupTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: resourceEquipmentgroupContainerInformationService.getCompMaintSchemaTemplLayout(),
			dtoSchemeId: {
				moduleSubModule: 'Resource.EquipmentGroup',
				typeName: 'PlantGroupCompMaintSchemaTemplateDto'
			},
			translator: resourceEquipmentGroupTranslationService
		});
	}
})(angular);