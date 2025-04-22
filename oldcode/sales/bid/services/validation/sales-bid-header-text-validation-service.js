/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	var moduleName = 'sales.bid';

	/**
	 * @ngdoc service
	 * @name salesBidHeaderTextValidationService
	 * @require $http
	 * @description provides validation methods for a SalesHeaderText
	 */
	angular.module(moduleName).factory('salesBidHeaderTextValidationService',
		['platformDataValidationService', 'platformRuntimeDataService', '$timeout', '$http', 'globals', 'salesCommonHeaderTextValidationService', 'salesBidService', 'salesBidHeaderTextDataService',
			function (platformDataValidationService, platformRuntimeDataService, $timeout, $http, globals, salesCommonHeaderTextValidationService, salesBidService, salesBidHeaderTextDataService) {

				var service = {};

				service.validatePrcTexttypeFk = function validatePrcTexttypeFk(entity, value, model) {
					return salesCommonHeaderTextValidationService.validatePrcTexttypeFkForSales(entity, value, model, false, false, salesBidService, service, salesBidHeaderTextDataService);
				};

				service.validateBasTextModuleTypeFk = function validateBasTextModuleTypeFk(entity, value, model) {
					var validationObject =  salesCommonHeaderTextValidationService.validateTextModuleTypeFkForSales(entity, value, model, salesBidService, service, salesBidHeaderTextDataService);
					if (value && value !== entity.BasTextModuleTypeFk && validationObject.valid) {
						salesBidHeaderTextDataService.getContentByModuleTypeFkAsync(entity, value);
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

				salesBidHeaderTextDataService.registerEntityCreated(onEntityCreated);

				return service;
			}
		]);
})();