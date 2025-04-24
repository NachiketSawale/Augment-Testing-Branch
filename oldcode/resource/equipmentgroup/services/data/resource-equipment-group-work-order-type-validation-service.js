(function (angular) {
	'use strict';

	var moduleName = 'resource.equipmentgroup';
	/**
	 * @ngdoc service
	 * @name resourceEquipmentGroupWorkOrderTypeValidationService
	 * @description provides validation methods for text module entities
	 */
	angular.module(moduleName).service('resourceEquipmentGroupWorkOrderTypeValidationService', ResourceEquipmentGroupWorkOrderTypeValidationService);

	ResourceEquipmentGroupWorkOrderTypeValidationService.$inject = ['resourceEquipmentGroupWorkOrderTypeDataService', 'platformDataValidationService'];

	function ResourceEquipmentGroupWorkOrderTypeValidationService(resourceEquipmentGroupWorkOrderTypeDataService, platformDataValidationService) {
		var self = this;
		self.validateWorkOperationTypeFk = function validateWorkOperationTypeFk(entity, value, model) {
			return platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, resourceEquipmentGroupWorkOrderTypeDataService.getList(), self, resourceEquipmentGroupWorkOrderTypeDataService);
		};
	}

})(angular);