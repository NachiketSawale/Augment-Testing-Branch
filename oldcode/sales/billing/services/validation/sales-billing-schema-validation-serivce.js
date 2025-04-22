(function (angular) {
	'use strict';
	var moduleName = 'sales.billing';
	/* jshint -W072 */
	angular.module(moduleName).factory('salesBillingSchemaValidationService',
		['_', 'salesBillingSchemaService', 'salesBillingService', 'prcCommonCalculationHelper',
			function (_, dataService, headerDataService, prcCommonCalculationHelper) {

				var service = {};
				var parentItem, exchangeRate;

				service.validateValue = function validateValue(entity, value) {
					var billingLineTypeFk = [23];
					var isInLineType = _.indexOf(billingLineTypeFk, entity.BillingLineTypeFk) === 0;
					if(isInLineType){
						entity.IsModification = true;
						entity.ResultOc = value;
						parentItem = headerDataService.getSelected();
						exchangeRate = 0;
						if (parentItem && parentItem.Id) {
							exchangeRate = parentItem.ExchangeRate;
						}
						entity.Result = prcCommonCalculationHelper.round(value / exchangeRate);
					}
					return true;
				};
				return service;
			}
		]);
})(angular);