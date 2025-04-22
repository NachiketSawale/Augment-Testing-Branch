/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	var moduleName = 'sales.contract';

	/**
	 * @ngdoc service
	 * @name salesContractHeaderTextValidationService
	 * @require $http
	 * @description provides validation methods for a SalesHeaderText
	 */
	angular.module(moduleName).factory('salesContractHeaderTextValidationService',
		['platformDataValidationService', 'platformRuntimeDataService', '$timeout', '$http', 'globals', 'salesCommonHeaderTextValidationService', 'salesContractService', 'salesContractHeaderTextDataService',
			function (platformDataValidationService, platformRuntimeDataService, $timeout, $http, globals, salesCommonHeaderTextValidationService, salesContractService, salesContractHeaderTextDataService) {

				var service = {};

				service.validatePrcTexttypeFk = function validatePrcTexttypeFk(entity, value, model) {
					return salesCommonHeaderTextValidationService.validatePrcTexttypeFkForSales(entity, value, model, false, false, salesContractService, service, salesContractHeaderTextDataService);
				};

				service.validateBasTextModuleTypeFk = function validatePrcTexttypeFk(entity, value, model) {
					var validationObject = salesCommonHeaderTextValidationService.validateTextModuleTypeFkForSales(entity, value, model, salesContractService, service, salesContractHeaderTextDataService);
					if (value && value !== entity.BasTextModuleTypeFk && validationObject.valid) {
						salesContractHeaderTextDataService.getContentByModuleTypeFkAsync(entity, value);
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

				salesContractHeaderTextDataService.registerEntityCreated(onEntityCreated);

				return service;
			}
		]);
})();