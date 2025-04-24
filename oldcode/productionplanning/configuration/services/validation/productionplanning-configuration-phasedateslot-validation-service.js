(function (angular) {
	'use strict';
	const moduleName = 'productionplanning.configuration';
	let angModule = angular.module(moduleName);

	angModule.factory('productionplanningConfigurationPhaseDateSlotValidationService', ValidationService);

	ValidationService.$inject = ['platformDataValidationService', 'productionplanningConfigurationPhaseDateSlotDataService'];

	function ValidationService(platformDataValidationService, dataService) {
		let service = {};

		service.validatePpsPhaseTypeFk = function (entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
		};
		service.validatePpsEntityFk = function (entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
		};

		return service;
	}
})(angular);
