(function () {
	'use strict';

	var moduleName = 'productionplanning.mounting';

	angular.module(moduleName).factory('productionplanningMountingReq2BizPartnerValidationService', ValidationService);

	ValidationService.$inject = ['platformDataValidationService', 'productionplanningMountingReq2BizPartnerDataService'];

	function ValidationService(platformDataValidationService, dataService) {
		var service = {};

		service.validateBusinessPartnerFk = function (entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
		};

		service.validateRoleFk = function (entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
		};

		service.validateSubsidiaryFk = function (entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
		};

		return service;
	}
})();