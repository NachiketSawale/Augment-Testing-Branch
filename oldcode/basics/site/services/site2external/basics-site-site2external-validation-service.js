(function (angular) {
	'use strict';

	var moduleName = 'basics.site';

	angular.module(moduleName).factory('basicsSite2ExternalValidationService', Site2ExternalValidationService);

	Site2ExternalValidationService.$inject = ['platformDataValidationService', 'basicsSite2ExternalDataService'];

	function Site2ExternalValidationService(platformDataValidationService, dataService) {
		var service = {};

		service.validateBasExternalsourceFk = function (entity, value, model) {
			value = value === 0 ? null : value;
			return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
		};

		service.validateExtCode = function (entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
		};

		return service;
	}
})(angular);