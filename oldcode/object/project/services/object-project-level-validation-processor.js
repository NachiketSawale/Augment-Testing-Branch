
(function (angular) {
	'use strict';

	var moduleName = 'object.project';
	
	angular.module(moduleName).factory('objectProjectLevelValidationProcessor', ObjectProjectLevelValidationProcessor);
	ObjectProjectLevelValidationProcessor.$inject = ['$injector'];
	function ObjectProjectLevelValidationProcessor($injector) {
		var service = {};
		service.validate = function validate(items) {
			if (items.Version === 0) {
				$injector.invoke(['objectProjectLevelValidationService', function (objectProjectLevelValidationService) {
					objectProjectLevelValidationService.validateCode(items, null, 'Code');
				}]);
			}
		};
		return service;
	}
})(angular);