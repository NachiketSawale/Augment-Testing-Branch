(function (angular) {
	'use strict';

	var moduleName = 'basics.clerk';
	
	angular.module(moduleName).factory('basicsClerkValidationProcessor', BasicsClerkValidationProcessor);
	BasicsClerkValidationProcessor.$inject = ['$injector'];
	function BasicsClerkValidationProcessor($injector) {
		var service = {};
		service.validate = function validate(items) {
			if (items.Version === 0) {
				$injector.invoke(['basicsClerkValidationService', function (basicsClerkValidationService) {
					basicsClerkValidationService.validateCode(items, null, 'Code');
					basicsClerkValidationService.validateDescription(items, null, 'Description');
				}]);
			}
		};
		return service;
	}
})(angular);