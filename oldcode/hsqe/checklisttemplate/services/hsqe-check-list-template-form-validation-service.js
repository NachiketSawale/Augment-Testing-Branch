/*
 * Created by alm on 01.22.2021.
 */

(function (angular) {
	'use strict';
	var moduleName = 'hsqe.checklisttemplate';

	/* global _ */
	angular.module(moduleName).factory('hsqeCheckListTemplate2FromValidationService', ['$translate', 'platformRuntimeDataService', 'platformDataValidationService', 'hsqeCheckListTemplate2FormService',
		'platformModuleStateService',
		function ($translate, platformRuntimeDataService, platformDataValidationService, dataService,
			platformModuleStateService) {
			var service = {};

			service.validateCode = function (entity, value, model) {
				var items = dataService.getList();
				return platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, items, service, dataService);
			};

			service.validateBasFormFk = function (entity,value, model) {
				var result = { apply: true, valid: true };
				if (value <= 0) {
					result = {
						apply: true,
						valid: false,
						error: '...',
						error$tr$: 'cloud.common.emptyOrNullValueErrorMessage',
						error$tr$param$: {fieldName: $translate.instant('hsqe.checklisttemplate.entityBasForm')}
					};
				}
				platformRuntimeDataService.applyValidationResult(result, entity, model);
				platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
				return result;
			};

			service.validateTemporaryCheckListId = function validateTemporaryCheckListId(entity,value, model) {
				var modState = platformModuleStateService.state(moduleName);
				if (modState.validation && modState.validation.asyncCalls && modState.validation.asyncCalls.length) {
					modState.validation.asyncCalls = _.filter(modState.validation.asyncCalls, function (c) {
						return !(c.filed === model);
					});
				}
				return true;
			};

			return service;
		}
	]);
})(angular);
