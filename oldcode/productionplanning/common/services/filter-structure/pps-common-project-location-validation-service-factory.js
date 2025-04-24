(function () {
	/*global angular*/
	'use strict';

	var moduleName = 'productionplanning.common';
	angular.module(moduleName).factory('ppsCommonProjectLocationValidationServiceFactory', ValidationServiceFactory);
	ValidationServiceFactory.$inject = ['platformDataValidationService'];

	function ValidationServiceFactory(platformDataValidationService) {

		var create = function (dataService) {
			var service = {};
			service.validateCode = function (entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
			};
			return service;
		};

		return {
			create: create
		};
	}
})();