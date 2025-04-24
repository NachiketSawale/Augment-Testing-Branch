/**
 * Created by alm on 1/21/2021.
 */
(function (angular) {
	'use strict';
	/* global globals */

	var moduleName = 'hsqe.checklisttemplate';
	angular.module(moduleName).factory('hsqeCheckListGroupValidationService', [
		'platformRuntimeDataService',
		'platformDataValidationService',
		'hsqeCheckListGroupService',
		function (
			platformRuntimeDataService,
			platformDataValidationService,
			dataService
		) {
			var service={};
			service.validateCode = function validateCode(entity, value, model) {
				var itemList = dataService.getList();
				return platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, itemList, service, dataService);
			};

			service.asyncValidateCode = function (entity, value, model) {
				var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataService);
				asyncMarker.myPromise = platformDataValidationService.isAsyncUnique(globals.webApiBaseUrl + 'hsqe/checklisttemplate/group/isunique', entity, value, model).then(function (response) {
					if (!entity[model] && angular.isObject(response)) {
						response.apply = true;
					}
					platformRuntimeDataService.applyValidationResult(response, entity, model);
					return platformDataValidationService.finishAsyncValidation(response, entity, value, model, asyncMarker, service, dataService);
				});

				return asyncMarker.myPromise;
			};

			return service;
		}]);

})(angular);