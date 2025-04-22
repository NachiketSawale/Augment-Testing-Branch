/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	var moduleName = 'sales.billing';

	/**
	 * @ngdoc service
	 * @name salesBillingHeaderFormattedTextValidationService
	 * @require $http
	 * @description provides validation methods for a SalesHeaderText
	 */
	angular.module(moduleName).factory('salesBillingHeaderFormattedTextValidationService',
		['platformDataValidationService', 'platformRuntimeDataService', '$timeout', '$http', 'globals', 'salesCommonHeaderTextValidationService', 'salesBillingService', 'salesBillingHeaderFormattedTextDataService',
			function (platformDataValidationService, platformRuntimeDataService, $timeout, $http, globals, salesCommonHeaderTextValidationService, salesBillingService, salesBillingHeaderFormattedTextDataService) {

				var service = {};

				service.validatePrcTexttypeFk = function validatePrcTexttypeFk(entity, value, model) {
					return salesCommonHeaderTextValidationService.validatePrcTexttypeFkForSales(entity, value, model, false, false, salesBillingService, service, salesBillingHeaderFormattedTextDataService);
				};

				service.validateBasTextModuleTypeFk = function validatePrcTexttypeFk(entity, value, model) {
					var validationObject = salesCommonHeaderTextValidationService.validateTextModuleTypeFkForSales(entity, value, model, salesBillingService, service, salesBillingHeaderFormattedTextDataService);
					if (value && value !== entity.BasTextModuleTypeFk && validationObject.valid) {
						salesBillingHeaderFormattedTextDataService.getContentByModuleTypeFkAsync(entity, value);
					}
					return validationObject;
				};

				// Validate default value when create new record

				function onEntityCreated(e, item) {
					if (item && item.PrcTexttypeFk) {
						service.validatePrcTexttypeFk(item, item.PrcTexttypeFk, 'PrcTexttypeFk');
					}

					if (item && item.BasTextModuleTypeFk) {
						service.validateBasTextModuleTypeFk(item, item.BasTextModuleTypeFk, 'BasTextModuleTypeFk');
					}
				}

				salesBillingHeaderFormattedTextDataService.registerEntityCreated(onEntityCreated);

				return service;
			}
		]);
})();