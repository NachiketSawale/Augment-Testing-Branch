(function (angular) {
	'use strict';

	var moduleName = 'resource.equipment';

	angular.module(moduleName).factory('resourceEquipmentPlantEurolistValidationProcessor', ResourceEquipmentPlantEurolistValidationProcessor);
	ResourceEquipmentPlantEurolistValidationProcessor.$inject = ['$injector'];
	function ResourceEquipmentPlantEurolistValidationProcessor($injector ) {
		var service = {};
		service.validate = function validate(items) {
			if (items.Version === 0) {}
		};
		return service;
	}
})(angular);