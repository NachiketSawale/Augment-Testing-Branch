/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	var moduleName = 'hsqe.checklist';

	/**
	 * @ngdoc service
	 * @name hsqeCheckListFormValidationService
	 */
	angular.module(moduleName).factory('hsqeCheckListFormValidationService', ['$translate','platformRuntimeDataService',
		'platformDataValidationService', 'hsqeCheckListFormDataService',
		function ($translate, platformRuntimeDataService, platformDataValidationService, dataService) {
			var service = {};
			angular.extend(service,
				{
					validateCode: validateCode,
					validateFormFk: validateFormFk
				});

			function validateCode(entity, value, model) {
				var items = dataService.getList();
				return platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, items, service, dataService);
			}

			function validateFormFk(entity, value, model) {
				var result = {apply: true, valid: true};
				if (value <= 0) {
					result = {
						apply: true,
						valid: false,
						error: '...',
						error$tr$: 'cloud.common.emptyOrNullValueErrorMessage',
						error$tr$param$: {fieldName: $translate.instant('hsqe.checklist.form.userForm')}
					};
				}
				platformRuntimeDataService.applyValidationResult(result, entity, model);
				platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
				return result;
			}

			return service;
		}
	]);
})(angular);
