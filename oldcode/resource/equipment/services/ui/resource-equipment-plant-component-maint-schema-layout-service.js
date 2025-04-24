/**
 * Created by cakiral on 07.04.2020
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.equipment';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentPlantComponentMaintSchemaLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  resource equipment plantComponentMaintSchema entity.
	 **/
	angular.module(moduleName).service('resourceEquipmentPlantComponentMaintSchemaLayoutService', ResourceEquipmentPlantComponentMaintSchemaLayoutService);

	ResourceEquipmentPlantComponentMaintSchemaLayoutService.$inject = ['platformUIConfigInitService', 'resourceEquipmentContainerInformationService', 'resourceEquipmentConstantValues', 'resourceEquipmentTranslationService'];

	function ResourceEquipmentPlantComponentMaintSchemaLayoutService(platformUIConfigInitService, resourceEquipmentContainerInformationService, resourceEquipmentConstantValues, resourceEquipmentTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: resourceEquipmentContainerInformationService.getResourceEquipmentPlantComponentMaintSchemaLayout(),
			dtoSchemeId: resourceEquipmentConstantValues.schemes.plantComponentMaintSchema,
			translator: resourceEquipmentTranslationService
		});
	}
})(angular);