(function (angular) {
	'use strict';

	var moduleName = 'resource.catalog';
	
	angular.module(moduleName).factory('resourceCatalogValidationProcessor', ResourceCatalogValidationProcessor);

	ResourceCatalogValidationProcessor.$inject = ['$injector'];

	function ResourceCatalogValidationProcessor($injector) {
		var service = {};
		service.validate = function validate(items) {
			if (items.Version === 0) {
				$injector.invoke(['resourceCatalogValidationService', function (resourceCatalogValidationService) {
					resourceCatalogValidationService.validateCode(items, null, 'Code');
				}]);
			}
		};
		return service;
	}
})(angular);