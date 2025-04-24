(function (angular) {
	'use strict';

	var moduleName = 'resource.equipment';
	/**
	 * @ngdoc service
	 * @name resourceEquipmentPlantClerkRolesValidationDataService
	 * @description provides validation methods for text module entities
	 */
	angular.module(moduleName).service('resourceEquipmentPlantClerkRolesValidationDataService', ResourceEquipmentPlantClerkRolesValidationDataService);

	ResourceEquipmentPlantClerkRolesValidationDataService.$inject = ['_','platformSchemaService', 'platformRuntimeDataService','resourceEquipmentConstantValues','platformValidationServiceFactory','platformDataValidationService','resourceEquipmentPlantClerkRolesDataService'];

	function ResourceEquipmentPlantClerkRolesValidationDataService(_, platformSchemaService, platformRuntimeDataService,resourceEquipmentConstantValues,platformValidationServiceFactory,platformDataValidationService, resourceEquipmentPlantClerkRolesDataService) {
		let service = {};
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(resourceEquipmentConstantValues.schemes.plant2Clerk, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(resourceEquipmentConstantValues.schemes.plant2Clerk),
		},
		self,
		resourceEquipmentPlantClerkRolesDataService);

		service.validateClerkFk = function validateClerkFk (entity, value,model) {
			return platformDataValidationService.validateMandatory(entity, value, model, self, resourceEquipmentPlantClerkRolesDataService);
		};

		service.validateClerkRoleFk = function (entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, self, resourceEquipmentPlantClerkRolesDataService);
		};

		service.validateValidFrom = function validateStartDate(entity, value, model) {
			return platformDataValidationService.validatePeriod(value, entity.ValidTo, entity, model, resourceEquipmentPlantClerkRolesDataService, resourceEquipmentPlantClerkRolesDataService, 'ValidFrom');
		};

		service.validateValidTo = function validateEndDate(entity, value, model) {
			return platformDataValidationService.validatePeriod(entity.ValidFrom, value, entity, model, resourceEquipmentPlantClerkRolesDataService, resourceEquipmentPlantClerkRolesDataService, 'ValidTo');
		};
		return service;
	}

})(angular);