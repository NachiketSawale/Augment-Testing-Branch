/**
 * Created by cakiral on 07.04.2020
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.equipment';

	/**
	 * @ngdoc service
	 * @name resourceEquipmentPlantComponentMaintSchemaValidationService
	 * @description provides validation methods for resource equipment plantComponentMaintSchema entities
	 */
	angular.module(moduleName).service('resourceEquipmentPlantComponentMaintSchemaValidationService', ResourceEquipmentPlantComponentMaintSchemaValidationService);

	ResourceEquipmentPlantComponentMaintSchemaValidationService.$inject = ['platformValidationServiceFactory', 'resourceEquipmentConstantValues', 'resourceEquipmentPlantComponentMaintSchemaDataService'];

	function ResourceEquipmentPlantComponentMaintSchemaValidationService(platformValidationServiceFactory, resourceEquipmentConstantValues, resourceEquipmentPlantComponentMaintSchemaDataService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(resourceEquipmentConstantValues.schemes.plantComponentMaintSchema, {
				mandatory: platformValidationServiceFactory.determineMandatoryProperties(resourceEquipmentConstantValues.schemes.plantComponentMaintSchema),
				periods: [ { from: 'ValidFrom', to: 'ValidTo'} ]
			},
			self,
			resourceEquipmentPlantComponentMaintSchemaDataService);
	}
})(angular);
