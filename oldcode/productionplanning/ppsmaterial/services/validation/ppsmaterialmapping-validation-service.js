(function (angular) {
	'use strict';

	/**
	 * @ngdoc factory
	 * @name productionplanningPpsMaterialMappingValidationService
	 * @description provides validation methods for PpsMaterialMapping of PpsMaterialMappingDto
	 */
	var moduleName = 'productionplanning.ppsmaterial';
	angular.module(moduleName).factory('productionplanningPpsMaterialMappingValidationService', ValidationService);

	ValidationService.$inject = ['platformDataValidationService', 'productionplanningPpsMaterialMappingDataService'];

	function ValidationService(platformDataValidationService, dataService) {

		function validateFieldMandatory(entity, value, model) {
			// eslint-disable-next-line no-console
			console.log('do validation of '+model); // testing code, will be removed later
			return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
		}

		var service = {};

		service.validateMappingCode = validateFieldMandatory;

		service.validatePpsMaterialFk = validateFieldMandatory;

		service.validateBasExternalsourcetypeFk = validateFieldMandatory;

		return service;
	}
})(angular);

