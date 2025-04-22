(function () {
	'use strict';

	var moduleName = 'sales.contract';
	angular.module(moduleName).factory('ordMandatoryDeadlineValidationFactory', [
		'platformDataValidationService',
		'salesCommonServiceCache',
		function(
			platformDataValidationService,
			salesCommonServiceCache
		) {
			function constructorFn(dataService) {
				var service = {};

				service.validateStart = function validateStart(entity, value, model) {
					return platformDataValidationService.validatePeriod(value, entity.End, entity, model, service, dataService, 'End');
				};

				service.validateEnd = function validateEnd(entity, value, model) {
					return platformDataValidationService.validatePeriod(entity.Start, value, entity, model, service, dataService, 'Start');
				};

				return service;
			}

			return salesCommonServiceCache.registerService(constructorFn, 'ordMandatoryDeadlineValidationFactory');
		}
	]);
})();