(function (angular) {
	'use strict';

	var moduleName = 'object.project';
	
	angular.module(moduleName).factory('objectProjectHeaderValidationProcessor', ObjectProjectHeaderValidationProcessor);
	ObjectProjectHeaderValidationProcessor.$inject = ['$injector'];
	function ObjectProjectHeaderValidationProcessor($injector) {
		var service = {};
		service.validate = function validate(items) {
			if (items.Version === 0) {
				$injector.invoke(['objectProjectHeaderValidationService', function (objectProjectHeaderValidationService) {
					objectProjectHeaderValidationService.validateCode(items, null, 'Code');
				}]);
			}
		};
		return service;
	}
})(angular);