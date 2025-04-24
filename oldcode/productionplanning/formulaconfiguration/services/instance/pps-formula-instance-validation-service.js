(function(angular){
	'use strict';

	const moduleName = 'productionplanning.formulaconfiguration';

	angular.module(moduleName).factory('ppsFormulaInstanceValidationService', ValidationService);

	ValidationService.$inject = ['platformDataValidationService', 'ppsFormulaInstanceDataService'];

	function ValidationService(platformDataValidationService, dataService) {
		let service = {};
		service.validateCode = function (entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
		};
		return service;
	}
})(angular);