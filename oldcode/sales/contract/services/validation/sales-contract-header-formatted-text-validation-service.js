/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	var moduleName = 'sales.contract';

	/**
	 * @ngdoc service
	 * @name salesContractHeaderFormattedTextValidationService
	 * @require $http
	 * @description provides validation methods for a SalesHeaderText
	 */
	angular.module(moduleName).factory('salesContractHeaderFormattedTextValidationService',
		['platformDataValidationService', 'platformRuntimeDataService', '$timeout', '$http', 'globals', 'salesCommonHeaderTextValidationService', 'salesContractService', 'salesContractHeaderFormattedTextDataService',
			function (platformDataValidationService, platformRuntimeDataService, $timeout, $http, globals, salesCommonHeaderTextValidationService, salesContractService, salesContractHeaderFormattedTextDataService) {

				var service = {};

				service.validatePrcTexttypeFk = function validatePrcTexttypeFk(entity, value, model) {
					return salesCommonHeaderTextValidationService.validatePrcTexttypeFkForSales(entity, value, model, false, false, salesContractService, service, salesContractHeaderFormattedTextDataService);
				};

				service.validateBasTextModuleTypeFk = function validatePrcTexttypeFk(entity, value, model) {
					var validationObject = salesCommonHeaderTextValidationService.validateTextModuleTypeFkForSales(entity, value, model, salesContractService, service, salesContractHeaderFormattedTextDataService);
					value = value || -1;
					if (value && value !== entity.BasTextModuleTypeFk && validationObject.valid) {
						salesContractHeaderFormattedTextDataService.getContentByModuleTypeFkAsync(entity, value);
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

				salesContractHeaderFormattedTextDataService.registerEntityCreated(onEntityCreated);

				return service;
			}
		]);
})();