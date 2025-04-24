/**
 * Created by henkel
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.company';
	
	angular.module(moduleName).factory('basicsCompanyDeferaltypeValidationProcessor', basicsCompanyDeferaltypeValidationProcessor);
	basicsCompanyDeferaltypeValidationProcessor.$inject = ['$injector'];
	function basicsCompanyDeferaltypeValidationProcessor($injector) {
		var service = {};

		service.validate = function validate(items) {
			if (items.Version === 0) {
				$injector.invoke(['basicsCompanyDeferaltypeValidationService', function (basicsCompanyDeferaltypeValidationService) {
					 basicsCompanyDeferaltypeValidationService.validateCodeFinance(items, null, 'CodeFinance');
				}]);
			}
		};
		return service;
	}
})(angular);