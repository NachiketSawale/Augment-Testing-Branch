(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name resourceEquipmentPlantAccessoryValidationService
	 * @description provides validation methods for requisition
	 */
	var moduleName='resource.equipment';
	angular.module(moduleName).service('resourceEquipmentPlantAcessoryValidationService', ResourceEquipmentPlantAcessoryValidationService);

	ResourceEquipmentPlantAcessoryValidationService.$inject = [ 'platformDataValidationService','resourceEquipmentPlantAccessoryDataService'];

	function ResourceEquipmentPlantAcessoryValidationService(platformDataValidationService, resourceEquipmentPlantAccessoryDataService) {
		var self = this;

		self.validateAccessoryTypeFk = function (entity, value) {
			return platformDataValidationService.validateMandatory(entity, value, 'AccessoryTypeFk', self, resourceEquipmentPlantAccessoryDataService);
		};
		self.validatePlant2Fk = function (entity, value) {
			return platformDataValidationService.validateMandatory(entity, value, 'Plant2Fk', self, resourceEquipmentPlantAccessoryDataService);
		};
	}

})(angular);
