(function () {
	'use strict';
	/* global _ */
	var moduleName = 'sales.billing';
	var salesCommonModule = angular.module(moduleName);

	salesCommonModule.factory('salesBillingPaymentReadonlyProcessor', [
		'platformRuntimeDataService',
		'salesCommonContextService',
		function (
			platformRuntimeDataService,
			salesCommonContextService
		) {
			var service = {};

			service.processItem = function processItem(item) {
				if (item) {
					if (!item.CurrencyFk) {
						platformRuntimeDataService.readonly(item, [{field: 'ExchangeRate', readonly: true}]);
					}
					else {
						var company = salesCommonContextService.getCompany();
						var isSameCurrency = _.get(company, 'CurrencyFk') === item.CurrencyFk;
						platformRuntimeDataService.readonly(item, [{field: 'ExchangeRate', readonly: isSameCurrency}]);
					}
				}
			};

			return service;
		}]);

})();
