
(function (angular) {
	'use strict';
	let moduleName = 'basics.customize';

	angular.module(moduleName).service('basicsCustomizeEstimationParameterValidationService', BasicsCustomizeEstimationParameterValidationService);
	BasicsCustomizeEstimationParameterValidationService.$inject = ['platformDataValidationService', 'platformRuntimeDataService', 'basicsCustomizeInstanceDataService'];

	function BasicsCustomizeEstimationParameterValidationService(platformDataValidationService, platformRuntimeDataService, basicsCustomizeInstanceDataService) {
		let self = this;
		this.validateCode = function validateCode(entity, value, model) {
			let result = {apply: true, valid: true, error: '...'};
			let firstLetter = value.charAt(0);
			if (firstLetter.search(/^[A-Z]+$/) === -1) {
				result = {
					apply: true,
					valid: false,
					error: '...',
					error$tr$: 'basics.customize.capitalizeTheFirstLetter',
					error$tr$param$: {fieldName: ''}
				};
			} else {
				return result;
			}

			platformRuntimeDataService.applyValidationResult(result, entity, model);
			platformDataValidationService.finishValidation(result, entity, value, model, self, basicsCustomizeInstanceDataService);
			return result;
		};
	}
})(angular);
