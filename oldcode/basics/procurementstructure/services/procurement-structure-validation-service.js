(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsProcurementStructureValidationService
	 * @description provides validation methods for materialGroupsItem
	 */
	var moduleName = 'basics.procurementstructure';
	angular.module(moduleName).factory('basicsProcurementStructureValidationService',
		['$translate', 'validationService', 'platformDataValidationService', 'basicsProcurementStructureService',
			function ($translate, validationService, platformDataValidationService, dataService) {
				var service = validationService.create('materialGroupsItem', 'basics/procurementstructure/schema');

				service.validateCode = function (entity, value, model,apply) {
					//return platformDataValidationService.isUnique(dataService.getList(), model, value, entity.Id);
					// check the list, for bulk validate
					var result = { apply: true, valid: true };
					var items = _.filter(dataService.getList(), function (item) {
						return value === item.Code && item.Id !== entity.Id;
					});
					if (items.length && items.length > 0) {
						result.apply = false;
						result.valid = false;
						result.error = $translate.instant('cloud.common.uniqueValueErrorMessage', {object: model});
						return result;
					}
					result = platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
					if (apply) {
						result.apply = true;
					}
					platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
					return result;
				};

				service.asyncValidateCode = function (entity, value, model) {
					//return platformDataValidationService.isAsyncUnique(globals.webApiBaseUrl + 'basics/procurementstructure/isunique', entity, value, model);

					var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataService);

					asyncMarker.myPromise = platformDataValidationService.isAsyncUnique(globals.webApiBaseUrl + 'basics/procurementstructure/isunique', entity, value, model).then(function (response) {
						if (!entity[model] && angular.isObject(response)) {
							response.apply = true;
						}
						return platformDataValidationService.finishAsyncValidation(response, entity, value, model, asyncMarker, service, dataService);
					});
					return asyncMarker.myPromise;
				};

				return service;
			}
		]);
})(angular);
