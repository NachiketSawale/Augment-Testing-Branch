/*
 * Created by alm on 01.29.2021.
 */

(function (angular) {
	'use strict';
	var moduleName = 'hsqe.checklist';


	angular.module(moduleName).factory('hsqeCheckListLocationValidationService', ['$translate', 'platformRuntimeDataService', 'platformDataValidationService', 'hsqeCheckListLocationDataService',
		function ($translate, platformRuntimeDataService, platformDataValidationService, dataService) {
			var service = {};

			service.validatePrjLocationFk = function (entity, value, model) {
				var result = { apply: true, valid: true };
				if (value <= 0) {
					result = {
						apply: true,
						valid: false,
						error: '...',
						error$tr$: 'cloud.common.emptyOrNullValueErrorMessage',
						error$tr$param$: {fieldName: $translate.instant('hsqe.CheckList.location.entityLocation')}
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
