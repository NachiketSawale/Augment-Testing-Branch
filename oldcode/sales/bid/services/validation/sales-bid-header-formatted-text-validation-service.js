/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	var moduleName = 'sales.bid';

	/**
	 * @ngdoc service
	 * @name salesBidHeaderFormattedTextValidationService
	 * @require $http
	 * @description provides validation methods for a SalesHeaderText
	 */
	angular.module(moduleName).factory('salesBidHeaderFormattedTextValidationService',
		['platformDataValidationService', 'platformRuntimeDataService', '$timeout', '$http', 'globals', 'salesCommonHeaderTextValidationService', 'salesBidService', 'salesBidHeaderFormattedTextDataService',
			function (platformDataValidationService, platformRuntimeDataService, $timeout, $http, globals, salesCommonHeaderTextValidationService, salesBidService, salesBidHeaderFormattedTextDataService) {

				var service = {};

				service.validatePrcTexttypeFk = function validatePrcTexttypeFk(entity, value, model) {
					return salesCommonHeaderTextValidationService.validatePrcTexttypeFkForSales(entity, value, model, false, false, salesBidService, service, salesBidHeaderFormattedTextDataService);
				};

				service.validateBasTextModuleTypeFk = function validateBasTextModuleTypeFk(entity, value, model) {
					var validationObject = salesCommonHeaderTextValidationService.validateTextModuleTypeFkForSales(entity, value, model, salesBidService, service, salesBidHeaderFormattedTextDataService);
					if (value && value !== entity.BasTextModuleTypeFk && validationObject.valid) {
						salesBidHeaderFormattedTextDataService.getContentByModuleTypeFkAsync(entity, value);
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

				salesBidHeaderFormattedTextDataService.registerEntityCreated(onEntityCreated);

				return service;
			}
		]);
})();