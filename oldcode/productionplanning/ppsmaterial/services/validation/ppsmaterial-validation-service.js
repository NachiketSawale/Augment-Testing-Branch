(function (angular) {
	'use strict';

	/**
	 * @ngdoc factory
	 * @name productionplanningPpsMaterialValidationService
	 * @description provides validation methods for PpsMaterial of MaterialNewDto
	 */
	var moduleName = 'productionplanning.ppsmaterial';
	angular.module(moduleName).factory('productionplanningPpsMaterialValidationService', ValidationService);

	ValidationService.$inject = ['platformDataValidationService', 'productionplanningPpsMaterialRecordMainService'];

	function ValidationService(platformDataValidationService, dataService) {

		function validateFieldMandatory(entity, value, model) {
			// eslint-disable-next-line no-console
			console.log('do validation of '+model); // testing code, will be removed later
			return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
		}

		var service = {};

		service.validatePpsMaterial$ProdMatGroupFk = validateFieldMandatory;

		service.validatePpsMaterial$BasClobsPqtyContent = validateFieldMandatory;

		service.validatePpsMaterial$BasClobsBqtyContent = validateFieldMandatory;

		return service;
	}
})(angular);
