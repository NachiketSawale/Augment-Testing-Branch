/**
 * $Id: sales-wip-header-text-validation-service.js 68296 2023-01-13 14:16:02Z postic $
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	var moduleName = 'sales.wip';

	/**
	 * @ngdoc service
	 * @name salesWipHeaderTextValidationService
	 * @require $http
	 * @description provides validation methods for a SalesHeaderText
	 */
	angular.module(moduleName).factory('salesWipHeaderTextValidationService',
		['platformDataValidationService', 'platformRuntimeDataService', '$timeout', '$http', 'globals', 'salesCommonHeaderTextValidationService', 'salesWipService', 'salesWipHeaderTextDataService',
			function (platformDataValidationService, platformRuntimeDataService, $timeout, $http, globals, salesCommonHeaderTextValidationService, salesWipService, salesWipHeaderTextDataService) {

				var service = {};

				service.validatePrcTexttypeFk = function validatePrcTexttypeFk(entity, value, model) {
					return salesCommonHeaderTextValidationService.validatePrcTexttypeFkForSales(entity, value, model, false, false, salesWipService, service, salesWipHeaderTextDataService);
				};

				service.validateBasTextModuleTypeFk = function validateBasTextModuleTypeFk(entity, value, model) {
					var validationObject = salesCommonHeaderTextValidationService.validateTextModuleTypeFkForSales(entity, value, model, salesWipService, service, salesWipHeaderTextDataService);
					if (value && value !== entity.BasTextModuleTypeFk && validationObject.valid) {
						salesWipHeaderTextDataService.getContentByModuleTypeFkAsync(entity, value);
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

				salesWipHeaderTextDataService.registerEntityCreated(onEntityCreated);

				return service;
			}
		]);
})();