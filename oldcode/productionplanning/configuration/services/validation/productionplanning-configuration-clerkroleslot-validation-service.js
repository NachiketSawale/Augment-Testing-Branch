(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.configuration';
	var angModule = angular.module(moduleName);

	angModule.factory('productionplanningConfigurationClerkRoleSlotValidationService', ValidationService);

	ValidationService.$inject = ['platformDataValidationService', 'productionplanningConfigurationClerkRoleSlotDataService'];

	function ValidationService(platformDataValidationService, dataService) {
		var service = {};

		service.validateClerkRoleFk = function (entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
		};

		service.validatePpsEntityFk = function (entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
		};

		return service;
	}
})(angular);
