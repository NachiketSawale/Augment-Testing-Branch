(function(angular){
	'use strict';

	const moduleName = 'productionplanning.processconfiguration';

	angular.module(moduleName).factory('productionplanningProcessConfigurationProcessTemplateValidationService', processTemplateValidationService);

	processTemplateValidationService.$inject = ['platformDataValidationService', 'productionplanningProcessConfigurationProcessTemplateDataService'];

	function processTemplateValidationService(platformDataValidationService, dataService) {
		let service = {};
		service.validateProcessTypeFk = function (entity, value, model) {
			value = value === 0 ? null : value;
			return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
		};
		return service;
	}
})(angular);