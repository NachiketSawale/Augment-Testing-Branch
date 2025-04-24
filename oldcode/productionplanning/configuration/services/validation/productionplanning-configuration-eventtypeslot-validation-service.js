(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.configuration';
	var angModule = angular.module(moduleName);

	angModule.factory('productionplanningConfigurationEventTypeSlotValidationService', ValidationService);

	ValidationService.$inject = ['platformDataValidationService', 'productionplanningConfigurationEventTypeSlotDataService'];

	function ValidationService(platformDataValidationService, dataService) {
		var service = {};

		service.validatePpsEventTypeFk = function (entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
		};

		service.validateColumnSelection = function (entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
		};

		return service;
	}
})(angular);
