(function (angular) {
	'use strict';

	var moduleName = 'resource.equipmentgroup';
	
	angular.module(moduleName).factory('resourceEquipmentGroupWorkOrderTypeValidationProcessor', ResourceEquipmentGroupWorkOrderTypeValidationProcessor);
	ResourceEquipmentGroupWorkOrderTypeValidationProcessor.$inject = ['$injector'];
	function ResourceEquipmentGroupWorkOrderTypeValidationProcessor($injector ) {
		var service = {};
		service.validate = function validate(items) {
			if (items.Version === 0) {
				$injector.invoke(['resourceEquipmentGroupWorkOrderTypeValidationService', function (resourceEquipmentGroupWorkOrderTypeValidationService) {
					resourceEquipmentGroupWorkOrderTypeValidationService.validateWorkOperationTypeFk(items, null, 'WorkOperationTypeFk');
				}]);
			}
		};
		return service;
	}
})(angular);