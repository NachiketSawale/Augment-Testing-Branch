/**
 * Created by henkel on 24.11.2015.
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.company';	
	
	angular.module(moduleName).factory('basicsCompanyYearValidationProcessor', basicsCompanyYearValidationProcessor);
	basicsCompanyYearValidationProcessor.$inject = ['$injector'];
	function basicsCompanyYearValidationProcessor($injector) {
		var service = {};
		service.validate = function validate(items) {
			if (items.Version === 0) {
				$injector.invoke(['basicsCompanyYearValidationService', function (basicsCompanyYearValidationService) {
					basicsCompanyYearValidationService.validateTradingYear(items, items.TradingYear, 'TradingYear');
					basicsCompanyYearValidationService.validateStartDate(items,  items.StartDate, 'StartDate');
					basicsCompanyYearValidationService.validateEndDate(items, items.EndDate, 'EndDate');
				}]);
			}
		};
		return service;
	}
})(angular);