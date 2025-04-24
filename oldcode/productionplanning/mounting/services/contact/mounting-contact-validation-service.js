(function () {
	'use strict';

	var moduleName = 'productionplanning.mounting';

	angular.module(moduleName).factory('productionplanningMountingReq2ContactValidationService', ValidationService);

	ValidationService.$inject = ['platformDataValidationService', 'productionplanningMountingReq2ContactDataService'];

	function ValidationService(platformDataValidationService, dataService) {
		var service = {};

		service.validateContactFk = function (entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
		};

		service.validateContactRoleTypeFk = function (entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
		};

		return service;
	}
})();