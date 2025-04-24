/**
 * Created by henkel on 24.11.2015.
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.payment';
	
	angular.module(moduleName).factory('basicsPaymentMainValidationProcessor', basicsPaymentMainValidationProcessor);
	basicsPaymentMainValidationProcessor.$inject = ['$injector'];
	function basicsPaymentMainValidationProcessor($injector) {
		var service = {};
		service.validate = function validate(items) {
			if (items.Version === 0) {
				$injector.invoke(['basicsPaymentValidationService', function (basicsPaymentValidationService) {
					basicsPaymentValidationService.validateCode(items, null, 'Code');
				}]);
			}
		};
		return service;
	}
})(angular);