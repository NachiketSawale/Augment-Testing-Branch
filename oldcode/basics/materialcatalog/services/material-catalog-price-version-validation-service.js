/**
 * Created by chi on 5/25/2017.
 */
(function(angular) {
	'use strict';

	var moduleName = 'basics.materialcatalog';

	angular.module(moduleName).factory('basicsMaterialCatalogPriceVersionValidationService', basicsMaterialCatalogPriceVersionValidationService);
	basicsMaterialCatalogPriceVersionValidationService.$inject = ['$translate', 'platformDataValidationService', 'platformRuntimeDataService'];
	function basicsMaterialCatalogPriceVersionValidationService($translate, platformDataValidationService) {
		return function (dataService) {

			var service = {};

			service.validateValidFrom = validateValidFrom;
			service.validateValidTo = validateValidTo;
			service.validatePriceListFk = validatePriceListFk;
			service.validateWeighting = validateWeighting;

			return service;

			//////////////////////////
			function validatePriceListFk(entity, value, model) {
				var tempValue = value === -1 ? '' : value;
				return platformDataValidationService.validateMandatory(entity, tempValue, model, service, dataService);
			}

			function validateValidFrom(entity, value, model) {
				return platformDataValidationService.validatePeriod(value, entity.ValidTo, entity, model, service, dataService, 'ValidTo');
			}

			function validateValidTo(entity, value, model) {
				return platformDataValidationService.validatePeriod(entity.ValidFrom, value, entity, model, service, dataService, 'ValidFrom');
			}

			function validateWeighting(entity, value, model) {
				var result = {apply: true, valid: true};
				if (value < 0 || value === 0) {
					result = {
						apply: true,
						valid: false,
						error: $translate.instant('basics.materialcatalog.errGreaterThanZero')
					};
				}
				return platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
			}
		};
	}
})(angular);