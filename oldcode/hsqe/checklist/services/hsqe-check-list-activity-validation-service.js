/*
 * Created by alm on 01.29.2021.
 */

(function (angular) {
	'use strict';
	var moduleName = 'hsqe.checklist';


	angular.module(moduleName).factory('hsqeCheckListActivityValidationService', ['$translate', 'platformRuntimeDataService', 'platformDataValidationService', 'hsqeCheckListActivityDataService',
		function ($translate, platformRuntimeDataService, platformDataValidationService, dataService) {
			var service = {};

			service.validatePsdScheduleFk = function (entity, value, model) {
				var result = { apply: true, valid: true };
				if (value <= 0) {
					result = {
						apply: true,
						valid: false,
						error: '...',
						error$tr$: 'cloud.common.emptyOrNullValueErrorMessage',
						error$tr$param$: {fieldName: $translate.instant('hsqe.CheckList.activity.entitySchedule')}
					};
				}
				if(entity.PsdScheduleFk !== value){
					entity.PsdActivityFk = null;
					service.validatePsdActivityFk(entity,null,'PsdActivityFk');
				}
				platformRuntimeDataService.applyValidationResult(result, entity, model);
				platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
				return result;
			};

			service.validatePsdActivityFk = function (entity,value, model) {
				var result = { apply: true, valid: true };
				if (value <= 0) {
					result = {
						apply: true,
						valid: false,
						error: '...',
						error$tr$: 'cloud.common.emptyOrNullValueErrorMessage',
						error$tr$param$: {fieldName: $translate.instant('hsqe.CheckList.activity.entityActivity')}
					};
				}
				platformRuntimeDataService.applyValidationResult(result, entity, model);
				platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
				return result;
			};
			return service;
		}
	]);
})(angular);
