(function (angular) {
	'use strict';

	var moduleName = 'basics.country';
	
	angular.module(moduleName).factory('basicsCountryStateValidationProcessor', BasicsCountryStateValidationProcessor);
	BasicsCountryStateValidationProcessor.$inject = ['$injector'];
	function BasicsCountryStateValidationProcessor($injector) {
		var service = {};
		service.validate = function validate(items) {
			if (items.Version === 0) {
				$injector.invoke(['basicsCountryStateValidationService', function (basicsCountryStateValidationService) {
				// basicsCountryStateValidationService.validateCountryFk(items, null, 'CountryFk');
					basicsCountryStateValidationService.validateState(items, null, 'State');
				}]);
			}
		};
		return service;
	}
})(angular);