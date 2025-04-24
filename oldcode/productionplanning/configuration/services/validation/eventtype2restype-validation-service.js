(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.configuration';
	var angModule = angular.module(moduleName);

	/**
     * @ngdoc service
     * @name productionplanningConfigurationEventtype2restypeValidationService
     * @description provides validation methods for eventtype2restype instances
     */
	angModule.factory('productionplanningConfigurationEventtype2restypeValidationService', ValidationService);

	ValidationService.$inject = ['$translate', 'platformDataValidationService','productionplanningConfigurationEventtype2restypeDataService'];

	function ValidationService($translate, platformDataValidationService,dataService) {
		var service = {};
		// validate mandatory for ResTypeFk
		service.validateResTypeFk = function (entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
		};

		// validate mandatory for ResResourceFk
		service.validateResResourceFk = function(entity, value, model) {
			if (!entity.IsLinkedFixToReservation) {
				value = 'no mandatory';
			}

			// the ResResourceFk is mandatory when the IsLinkedFixToReservation is checked.
			let result = platformDataValidationService.validateMandatory(entity, value, model, service, dataService);

			if (result.error$tr$ && result.error$tr$param$) {
				result.error$tr$ = 'productionplanning.configuration.error';
				result.error$tr$param$ = {
					fieldName1: $translate.instant('resource.master.entityResource'),
					fieldName2: $translate.instant('productionplanning.configuration.entityIsLinkedFixToReservation')
				};
			}

			return result;
		};

		// validate mandatory for EventTypeFk
		// service.validateEventTypeFk = function (entity, value, model) {
		//    return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
		// ;
		return service;
	}
})(angular);
