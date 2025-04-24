/**
 * Created by zwz on 2019/12/18
 */
(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.configuration';
	var angModule = angular.module(moduleName);

	angModule.factory('productionplanningConfigurationEventTypeQtySlotValidationService', ValidationService);

	ValidationService.$inject = ['platformDataValidationService', 'productionplanningConfigurationEventTypeQtySlotDataService'];

	function ValidationService(platformDataValidationService, dataService) {
		var service = {};

		service.validatePpsEventTypeFk = function (entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
		};

		return service;
	}
})(angular);
