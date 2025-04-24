// clv
(function (angular) {

	'use strict';
	const moduleName = 'basics.common';

	angular.module(moduleName).factory('basicsEmailValidationFactory', basicsEmailValidationFactory);

	basicsEmailValidationFactory.$inject = ['_', 'platformValidationByDataService', 'platformRuntimeDataService', 'platformDataValidationService'];

	function basicsEmailValidationFactory(_, platformValidationByDataService, platformRuntimeDataService, platformDataValidationService) {

		return {
			getService: factory
		};

		function factory(dataService, field) {

			let validationService = platformValidationByDataService.getValidationServiceByDataService(dataService);
			const validateName = 'validate' + field;
			const asyncValidateName = 'asyncValidate' + field;
			if (validationService === null || validationService === undefined) {
				validationService = {};
			}
			if (!validationService[validateName] && !validationService[asyncValidateName]) {
				validationService[validateName] = validationEmails;
				platformValidationByDataService.registerValidationService(validationService, dataService);
			}

			return validationService;

			function validationEmails(entity, value, model) {
				const result = {
					apply: true,
					valid: true
				};

				const regex1 = /^[\s\S]{1,64}@[\s\S]{1,253}$/;
				const regex2 = /@[\s\S]*@/;
				const isValid = _.isNil(value) || _.isEmpty(value) || regex1.test(value) && !regex2.test(value);
				result.valid = isValid;
				if (!isValid) {
					result.error$tr$ = 'platform.errorMessage.email';
				}

				platformRuntimeDataService.applyValidationResult(result, entity, model);
				platformDataValidationService.finishValidation(result, entity, value, model, validationService, dataService);

				if (result.valid === true && entity.__rt$data && entity.__rt$data.errors) {
					// eslint-disable-next-line no-prototype-builtins
					if (entity.__rt$data.errors.hasOwnProperty(model)) {
						delete entity.__rt$data.errors[model];
					}
				}

				return result;
			}
		}
	}

})(angular);