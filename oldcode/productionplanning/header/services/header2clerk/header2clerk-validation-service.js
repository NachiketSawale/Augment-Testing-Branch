/**
 * Created by zwz on 10/10/2019.
 */
(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name productionplanningHeader2ClerkValidationService
	 * @description provides validation methods for Header2Clerk
	 */
	var moduleName = 'productionplanning.header';
	angular.module(moduleName).factory('productionplanningHeader2ClerkValidationService', ValidationService);

	ValidationService.$inject = ['platformDataValidationService',
		'productionplanningHeader2ClerkDataService'];

	function ValidationService(platformDataValidationService,
							   dataService) {
		var service = {};

		function validateMandatory (entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
		}

		service.validateClerkFk = validateMandatory;
		service.validateClerkRoleFk = validateMandatory;

		service.validateValidFrom = function validateValidFrom(entity, value, model) {
			return platformDataValidationService.validatePeriod(value, entity.ValidTo, entity, model, service, dataService, 'ValidTo');
		};

		service.validateValidTo = function validateValidTo(entity, value, model) {
			return platformDataValidationService.validatePeriod(entity.ValidFrom, value, entity, model, service, dataService, 'ValidFrom');
		};

		return service;
	}
})();