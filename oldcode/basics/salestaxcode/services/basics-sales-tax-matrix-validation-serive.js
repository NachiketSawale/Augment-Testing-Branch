/*
 * Created by lcn on 11/4/2021.
 */

(function (angular) {
	/*global angular*/
	'use strict';
	var moduleName = 'basics.salestaxcode';
	angular.module(moduleName).factory('basicsSalesTaxMatrixValidationService', ['platformRuntimeDataService', 'platformDataValidationService', 'basicsSalesTaxMatrixService',
		function (platformRuntimeDataService, platformDataValidationService, dataService) {
			var service = {};

			service.validateSalesTaxGroupFk = function (entity, value, model) {
				value = value > 0 ? value : null;

				var items = dataService.getList();
				var result = platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, items, service, dataService);
				platformRuntimeDataService.applyValidationResult(result, entity, model);
				platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);

				return result;
			};

			return service;
		}
	]);
})(angular);
