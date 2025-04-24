/**
 * Created by lcn on 9/20/2021.
 */

(function (angular) {
	'use strict';
	var moduleName = 'project.stock';

	angular.module(moduleName).factory('projectStockDownTimeValidationService', ['platformDataValidationService', '$translate',
		'platformRuntimeDataService',
		function (platformDataValidationService, $translate, platformRuntimeDataService) {
			return function (dataService) {
				var service = {};
				function onEntityCreated(e, item) {
					service.validateBasClerkFk(item, item.BasClerkFk, 'BasClerkFk');
				}

				service.validateBasClerkFk = function (entity, value, field) {
					var result = {apply: true, valid: true};
					if (validationFk(value)) {
						const error = $translate.instant('cloud.common.entityClerk');
						result = {
							apply: true,
							valid: false,
							error: '...',
							error$tr$: 'cloud.common.emptyOrNullValueErrorMessage',
							error$tr$param$: {fieldName: error}
						};
					}
					platformRuntimeDataService.applyValidationResult(result, entity, field);
					platformDataValidationService.finishValidation(result, entity, value, field, service, dataService);
					return result;
				};

				service.validateStartDate = function validateStartDate(entity, value, model) {
					return platformDataValidationService.validatePeriod(value, entity.EndDate, entity, model, service, dataService, 'EndDate');
				};

				service.validateEndDate = function validateEndDate(entity, value, model) {
					return platformDataValidationService.validatePeriod(entity.StartDate, value, entity, model, service, dataService, 'StartDate');
				};

				function validationFk(value) {
					return (angular.isUndefined(value) || value === null || value === '' || value === -1 || value === 0);
				}

				if (angular.isFunction(dataService.registerEntityCreated)) {
					dataService.registerEntityCreated(onEntityCreated);
				}
				return service;
			};
		}]);

})(angular);