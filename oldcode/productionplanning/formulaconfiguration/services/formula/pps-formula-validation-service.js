(function(angular){
	'use strict';

	const moduleName = 'productionplanning.formulaconfiguration';

	angular.module(moduleName).factory('ppsFormulaValidationService', ValidationService);

	ValidationService.$inject = ['platformDataValidationService', 'ppsFormulaDataService'];

	function ValidationService(platformDataValidationService, dataService) {
		let service = {};
		// service.validateProcessTypeFk = function (entity, value, model) {
		// 	value = value === 0 ? null : value;
		// 	return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
		// };
		return service;
	}
})(angular);