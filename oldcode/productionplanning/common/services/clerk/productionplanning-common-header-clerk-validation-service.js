(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.common';

	angular.module(moduleName).factory('productionplanningCommonHeaderClerkValidationService', ClerkValidationService);

	ClerkValidationService.$inject = ['platformDataValidationService', 'productionplanningItemClerkDataService'];

	function ClerkValidationService(platformDataValidationService, dataService) {
		var service = {};

		service.validateClerkRoleFk = function (entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
		};

		service.validateClerkFk = function (entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
		};

		service.validateValidFrom = function validateValidFrom(entity, value, model) {
			return platformDataValidationService.validatePeriod(value, entity.ValidTo, entity, model, service, dataService, 'ValidTo');
		};

		service.validateValidTo = function validateValidTo(entity, value, model) {
			return platformDataValidationService.validatePeriod(entity.ValidFrom, value, entity, model, service, dataService, 'ValidFrom');
		};

		return service;
	}
})(angular);