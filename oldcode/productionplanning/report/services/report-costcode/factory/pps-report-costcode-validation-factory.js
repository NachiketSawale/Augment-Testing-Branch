/**
 * Created by anl on 3/6/2018.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.report';

	angular.module(moduleName).factory('productionplanningReport2CostCodeValidationFactory', Report2CostCodeValidationFactory);

	Report2CostCodeValidationFactory.$inject = ['platformDataValidationService'];

	function Report2CostCodeValidationFactory(platformDataValidationService) {

		function createValidationService(dataService) {
			var service = {};

			service.validateCostCodeFk = function (entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
			};

			service.validateUomFk = function (entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
			};

			return service;
		}

		return {
			createValidationService: createValidationService
		};
	}

})(angular);