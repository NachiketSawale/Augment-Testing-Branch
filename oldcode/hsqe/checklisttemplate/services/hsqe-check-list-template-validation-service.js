/**
 * Created by alm on 01.27.2021.
 */

(function (angular) {
	/* global globals */
	'use strict';

	var moduleName = 'hsqe.checklisttemplate';

	angular.module(moduleName).factory('hsqeCheckListTemplateValidationService',
		['$translate', 'platformDataValidationService', 'platformRuntimeDataService','hsqeCheckListTemplateHeaderService',
			function ($translate, platformDataValidationService, platformRuntimeDataService,dataService) {

				var service = {};

				function createErrorObject(transMsg, errorParam) {
					return {
						apply: true,
						valid: false,
						error: '...',
						error$tr$: transMsg,
						error$tr$param$: errorParam
					};
				}

				service.validateCode = function validateCode(entity, value, model) {
					var itemList = dataService.getList();
					return platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, itemList, service, dataService);
				};


				service.asyncValidateCode = function (entity, value, model) {
					var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataService);
					asyncMarker.myPromise = platformDataValidationService.isAsyncUnique(globals.webApiBaseUrl + 'hsqe/checklisttemplate/header/isunique', entity, value, model).then(function (response) {
						if (!entity[model] && angular.isObject(response)) {
							response.apply = true;
						}
						return platformDataValidationService.finishAsyncValidation(response, entity, value, model, asyncMarker, service, dataService);
					});
					return asyncMarker.myPromise;
				};

				service.validateHsqCheckListGroupFk = function validateHsqCheckListGroupFk(entity, value, model) {
					var result = { apply: true, valid: true };
					if (value <= 0) {
						result = createErrorObject('cloud.common.emptyOrNullValueErrorMessage', {fieldName: $translate.instant('hsqe.checklisttemplate.entityCheckListGroup')});
					}
					platformRuntimeDataService.applyValidationResult(result, entity, model);
					platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
					return result;
				};


				return service;
			}
		]);
})(angular);
