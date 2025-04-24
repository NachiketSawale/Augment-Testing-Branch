(function (angular) {
	'use strict';

	var moduleName = 'object.main';

	angular.module(moduleName).factory('objectMainUnitValidationProcessor', ObjectObjectMainUnitValidationProcessor);
	ObjectObjectMainUnitValidationProcessor.$inject = ['$injector', 'platformRuntimeDataService'];
	function ObjectObjectMainUnitValidationProcessor($injector, platformRuntimeDataService) {
		var service = {};
		service.validate = function validate(items) {
			if (items.Version === 0) {
				$injector.invoke(['objectMainUnitValidationService', function (objectMainUnitValidationService) {
					objectMainUnitValidationService.validateCode(items, null, 'Code');
					objectMainUnitValidationService.validateUnitSubTypeFk(items, 0, 'UnitSubTypeFk');
					objectMainUnitValidationService.validateUnitSubTypeFk(items, 0, 'UnitTypeSpecFk');
				}]);
			}
		};
		return service;
	}
})(angular);