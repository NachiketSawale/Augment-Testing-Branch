/**
 * Created by baf on 31.08.2017
 */
(function () {
	'use strict';
	var modName = 'resource.equipment';
	var module = angular.module(modName);

	/**
	 * @ngdoc service
	 * @name resourceEquipmentPlantLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of project stock entity
	 */
	module.service('resourceEquipmentPlantLayoutService', ResourceEquipmentPlantLayoutService);

	ResourceEquipmentPlantLayoutService.$inject = ['platformSchemaService', 'platformUIConfigInitService', 'platformUIStandardExtentService',
		'resourceEquipmentContainerInformationService', 'resourceEquipmentTranslationService', 'resourceEquipmentConstantValues'];

	function ResourceEquipmentPlantLayoutService(platformSchemaService, platformUIConfigInitService, platformUIStandardExtentService,
		resourceEquipmentContainerInformationService, resourceEquipmentTranslationService, resourceEquipmentConstantValues) {

		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: resourceEquipmentContainerInformationService.getResourceEquipmentPlantLayout(),
			dtoSchemeId: resourceEquipmentConstantValues.schemes.plant,
			translator: resourceEquipmentTranslationService,
			entityInformation: { module: angular.module(modName), moduleName: 'Resource.Equipment', entity: 'EquipmentPlant' },
			standardExtentService: platformUIStandardExtentService
		});
	}
})();
