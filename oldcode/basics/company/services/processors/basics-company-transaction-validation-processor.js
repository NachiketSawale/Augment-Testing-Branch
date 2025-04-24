/**
 * Created by henkel .
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.company';	
	
	angular.module(moduleName).factory('basicsCompanyTransactionValidationProcessor', basicsCompanyTransactionValidationProcessor);
	basicsCompanyTransactionValidationProcessor.$inject = ['$injector'];
	function basicsCompanyTransactionValidationProcessor($injector) {
		var service = {};
		service.validate = function validate(items) {
			if (items.Version === 0) {
				$injector.invoke(['basicsCompanyTransactionValidationService', function (basicsCompanyTransactionValidationService) {
					basicsCompanyTransactionValidationService.validateDocumentType(items, null, 'DocumentType');
					basicsCompanyTransactionValidationService.validateCurrency(items, null, 'Currency');
					basicsCompanyTransactionValidationService.validateVoucherNumber(items, null, 'VoucherNumber');

				}]);
			}
		};


		return service;
	}
})(angular);