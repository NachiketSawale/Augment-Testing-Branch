(function (angular) {
	'use strict';

	var moduleName = 'resource.equipment';
	/**
	 * @ngdoc service
	 * @name resourceEquipmentPlantAssignmentValidationService
	 * @description provides validation methods for text module entities
	 */
	angular.module(moduleName).service('resourceEquipmentPlantAssignmentValidationService', ResourceEquipmentPlantAssignmentValidationService);

	ResourceEquipmentPlantAssignmentValidationService.$inject = ['resourceEquipmentPlantDataService', 'resourceEquipmentPlantAssignmentDataService', 'platformDataValidationService', 'platformRuntimeDataService'];

	function ResourceEquipmentPlantAssignmentValidationService(resourceEquipmentPlantDataService, resourceEquipmentPlantAssignmentDataService, platformDataValidationService) {

		var self = this;

		self.validatePlant2Fk = function (entity, value, model) {
			if(value === 0) {
				value = null;
			}
			return platformDataValidationService.validateMandatory(entity, value, model, self, resourceEquipmentPlantAssignmentDataService);
		};

		self.asyncValidatePlant2Fk = function asyncValidatePlant2Fk(entity, value, model) {
			return resourceEquipmentPlantDataService.asyncGetById(value).then(function (plant) {
				entity.UomFk = plant.UoMFk;
				return true;
			});
		};
	}

})(angular);