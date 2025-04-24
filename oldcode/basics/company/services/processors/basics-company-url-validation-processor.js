/**
 * Created by henkel on 24.11.2015.
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.company';	
	
	angular.module(moduleName).factory('basicsCompanyUrlValidationProcessor', basicsCompanyUrlValidationProcessor);
	basicsCompanyUrlValidationProcessor.$inject = ['$injector'];
	function basicsCompanyUrlValidationProcessor($injector) {
		var service = {};
		service.validate = function validate(items) {
			if (items.Version === 0) {
				$injector.invoke(['basicsCompanyUrlValidationService', function (basicsCompanyUrlValidationService) {
					basicsCompanyUrlValidationService.validateCompanyUrltypeFk(items, null, 'CompanyUrltypeFk');
				}]);
			}
		};
		return service;
	}
})(angular);