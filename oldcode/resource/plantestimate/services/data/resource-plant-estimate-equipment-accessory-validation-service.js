(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name resourcePlantEstimateEquipmentAccessoryValidationService
	 * @description provides validation methods for requisition
	 */
	var moduleName='resource.equipment';
	angular.module(moduleName).service('resourcePlantEstimateEquipmentAccessoryValidationService', ResourcePlantEstimateEquipmentAccessoryValidationService);

	ResourcePlantEstimateEquipmentAccessoryValidationService.$inject = [ 'platformDataValidationService','resourcePlantEstimateEquipmentAccessoryDataService'];

	function ResourcePlantEstimateEquipmentAccessoryValidationService(platformDataValidationService, resourcePlantEstimateEquipmentAccessoryDataService) {
		var self = this;

		self.validateAccessoryTypeFk = function (entity, value) {
			return platformDataValidationService.validateMandatory(entity, value, 'AccessoryTypeFk', self, resourcePlantEstimateEquipmentAccessoryDataService);
		};
		self.validatePlant2Fk = function (entity, value) {
			return platformDataValidationService.validateMandatory(entity, value, 'Plant2Fk', self, resourcePlantEstimateEquipmentAccessoryDataService);
		};
	}

})(angular);
