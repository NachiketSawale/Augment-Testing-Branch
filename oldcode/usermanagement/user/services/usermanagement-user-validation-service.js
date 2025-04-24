/**
 * Created by sandu on 26.08.2015.
 */
(function (angular) {
	'use strict';

	const moduleName = 'usermanagement.user';

	/**
	 * @ngdoc service
	 * @name usermanagementUserValidationService
	 * @description provides validation methods for User entities
	 */
	angular.module(moduleName).factory('usermanagementUserValidationService', usermanagementUserValidationService);

	usermanagementUserValidationService.$inject = ['platformDataValidationService', 'platformRuntimeDataService', 'usermanagementUserMainService'];

	function usermanagementUserValidationService(platformDataValidationService, platformRuntimeDataService, usermanagementUserMainService) {

		const service = {};
		service.validateLogonName = function validateLogonName(entity, value, model) {
			const result = platformDataValidationService.isUniqueAndMandatory(usermanagementUserMainService.getList(), 'LogonName', value, entity.Id);
			result.apply = true;
			platformDataValidationService.finishValidation(result, entity, value, model, service, usermanagementUserMainService);
			return result;
		};

		service.validateConfirmPassword = function validateConfirmPassword(entity, value, model) {
			if (entity.Password !== null) {
				const result = {
					valid: entity.Password === value,
					error$tr$: 'usermanagement.user.validateConfirmPassword',
					apply: true
				};
				platformDataValidationService.finishValidation(result, entity, value, model, service, usermanagementUserMainService);
				return result;
			}
		};

		service.validatePassword = function validatePassword(entity, value, model) {
			var result = {
				valid: true,
				apply: true,
				errors: [{
					valid: value === entity.ConfirmPassword,
					apply: true,
					field: 'ConfirmPassword',
					error$tr$: 'usermanagement.user.validateConfirmPassword'
				}]
			};

			platformDataValidationService.finishValidation(result, entity, value, model, service, usermanagementUserMainService);
			platformDataValidationService.finishValidation(result.errors[0], entity, value, result.errors[0].field, service, usermanagementUserMainService);

			return result;
		};
		service.validateExplicitAccess = function validateExplicitAccess(entity, value/* , model */) {
			const fieldsDefaultFalse = [
				{field: 'Password', readonly: false},
				{field: 'ConfirmPassword', readonly: false},
				{field: 'IsPasswordChangeNeeded', readonly: false}
			];
			const fieldsDefaultTrue = [
				{field: 'Password', readonly: true},
				{field: 'ConfirmPassword', readonly: true},
				{field: 'IsPasswordChangeNeeded', readonly: true}
			];
			if (value) {
				platformRuntimeDataService.readonly(entity, fieldsDefaultFalse);
			}
			if (!value) {
				platformRuntimeDataService.readonly(entity, fieldsDefaultTrue);
			}

			return true;
		};

		return service;
	}
})(angular);
