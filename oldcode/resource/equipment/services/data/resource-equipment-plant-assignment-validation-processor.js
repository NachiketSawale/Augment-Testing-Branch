(function (angular) {
	'use strict';

	var moduleName = 'resource.equipment';
	
	angular.module(moduleName).factory('resourceEquipmentPlantAssignmentValidationProcessor', ResourceEquipmentPlantAssignmentValidationProcessor);
	ResourceEquipmentPlantAssignmentValidationProcessor.$inject = ['$injector'];
	function ResourceEquipmentPlantAssignmentValidationProcessor($injector) {
		var service = {};
		service.validate = function validate(items) {
			if (items.Version === 0) {
				$injector.invoke(['resourceEquipmentPlantAssignmentValidationService', function (resourceEquipmentPlantAssignmentValidationService) {

					resourceEquipmentPlantAssignmentValidationService.validatePlant2Fk(items, null, 'Plant2Fk');
				}]);
			}
		};
		return service;
	}
})(angular);