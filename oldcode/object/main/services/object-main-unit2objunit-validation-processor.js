(function (angular) {
	'use strict';

	var moduleName = 'object.main';
	
	angular.module(moduleName).factory('objectMainUnit2ObjUnitValidationProcessor', ObjectObjectMainUnit2ObjUnitValidationProcessor);
	ObjectObjectMainUnit2ObjUnitValidationProcessor.$inject = ['$injector'];
	function ObjectObjectMainUnit2ObjUnitValidationProcessor($injector) {
		var service = {};
		service.validate = function validate(items) {
			if (items.Version === 0) {
				$injector.invoke(['objectMainUnit2ObjUnitValidationService', function (objectMainUnit2ObjUnitValidationService) {
					objectMainUnit2ObjUnitValidationService.validateUnitParkingSpaceFk(items, null, 'UnitParkingSpaceFk');
				}]);
			}
		};

		return service;
	}
})(angular);