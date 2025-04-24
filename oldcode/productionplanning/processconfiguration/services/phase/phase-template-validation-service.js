(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.processconfiguration';

	angular.module(moduleName).factory('ppsProcessConfigurationPhaseTemplateValidationService', ValidationService);

	ValidationService.$inject = ['platformDataValidationService',
		'ppsProcessConfigurationPhaseTemplateDataService'];

	function ValidationService(platformDataValidationService,
		phaseTemplateDataService) {

		var service = {};

		service.validatePhaseTypeFk = function (entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, service, phaseTemplateDataService);
		};


		service.validatePsdRelationkindFk = function (entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, service, phaseTemplateDataService);
		};

		return service;
	}

})(angular);