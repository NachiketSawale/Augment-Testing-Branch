/**
 * Created by anl on 8/04/2022.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.processconfiguration';

	angular.module(moduleName).factory('productionplanningPhaseValidationServiceFactory', ValidationService);

	ValidationService.$inject = ['platformDataValidationService', 'productionplanningCommonActivityDateshiftService'];

	function ValidationService(platformDataValidationService, productionplanningCommonActivityDateshiftService) {

		return function (dataService) {

			let service = {};

			service.validatePpsPhaseTypeFk = function (entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
			};

			service.validateActualstart = function (entity, value, model) {
				let relModel = 'ActualFinish';
				return service.validateDate(entity, value, model, value, entity[relModel], relModel);
			};
			service.validateActualfinish = function (entity, value, model) {
				let relModel = 'ActualStart';
				return service.validateDate(entity, value, model, entity[relModel], value, relModel);
			};

			service.validateEarlieststart = function (entity, value, model) {
				let relModel = 'EarliestFinish';
				return service.validateDate(entity, value, model, value, entity[relModel], relModel);
			};
			service.validateEarliestfinish = function (entity, value, model) {
				let relModel = 'EarliestStart';
				return service.validateDate(entity, value, model, entity[relModel], value, relModel);
			};

			service.validateLateststart = function (entity, value, model) {
				let relModel = 'LatestFinish';
				return service.validateDate(entity, value, model, value, entity[relModel], relModel);
			};
			service.validateLatestfinish = function (entity, value, model) {
				let relModel = 'LatestStart';
				return service.validateDate(entity, value, model, entity[relModel], value, relModel);
			};

			service.validateDate = function (entity, value, model, startDate, endDate, relModel) {
				return platformDataValidationService.validatePeriod(startDate, endDate, entity, model, service, dataService, relModel);
			};

			productionplanningCommonActivityDateshiftService.extendDateshiftActivityValidation(service, dataService, 'productionplanning.phase', 'productionplanning.phase');

			return service;
		};
	}

})(angular);