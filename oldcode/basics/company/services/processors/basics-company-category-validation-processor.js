
(function (angular) {
	'use strict';

	var moduleName = 'basics.company';
	
	angular.module(moduleName).factory('basicsCompanyCategoryValidationProcessor', BasicsCompanyCategoryValidationProcessor);
	BasicsCompanyCategoryValidationProcessor.$inject = ['$injector'];
	function BasicsCompanyCategoryValidationProcessor($injector) {
		var service = {};

		service.validate = function validate(items) {
			if (items.Version === 0) {
				$injector.invoke(['basicsCompanyCategoryValidationService', function (basicsCompanyCategoryValidationService) {
					basicsCompanyCategoryValidationService.validateRubricFk(items, null, 'RubricFk');
					basicsCompanyCategoryValidationService.validateRubricCategoryFk(items, null, 'RubricCategoryFk');
				}]);
			}
		};
		return service;
	}
})(angular);