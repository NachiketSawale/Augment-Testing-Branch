(function (angular) {
	/* global angular */
	'use strict';

	var moduleName = 'basics.config';

	/**
	 * @ngdoc service
	 * @name basicsConfigGenWizardValidationService
	 * @description provides validation methods for all generic wizards entities which does not need validation
	 */
	BasicsConfigGenWizardValidationService.$inject = ['platformDataValidationService', 'genericWizardNamingParameterConstantService'];
	angular.module(moduleName).service('basicsConfigGenWizardValidationService', BasicsConfigGenWizardValidationService);

	function BasicsConfigGenWizardValidationService(platformValidationService, genericWizardNamingParameterConstantService) {

		this.validateTitle = function validateTitle(item, value, model) {
			var result = platformValidationService.isMandatory(value, model);
			return platformValidationService.finishValidation(result, item, value, model, this, 'basicsConfigGenWizardStepDataService');
		};

		this.validateGenericWizardStepTypeFk = function validateGenericWizardStepTypeFk(item, value, model) {
			var result = platformValidationService.isMandatory(value, model);
			return platformValidationService.finishValidation(result, item, value, model, this, 'basicsConfigGenWizardStepDataService');
		};

		this.validateContainerUuid = function validateContainerUuid(item, value, model) {
			var result = platformValidationService.isMandatory(value, model);
			return platformValidationService.finishValidation(result, item, value, model, this, 'basicsConfigGenWizardContainerDataService');
		};

		this.validatePropertyid = function validatePropertyid(item, value, model) {
			var result = platformValidationService.isMandatory(value, model);
			return platformValidationService.finishValidation(result, item, value, model, this, 'basicsConfigGenWizardContainerPropertyDataService');
		};

		this.validateNamingType = function validateNamingType(item, value, model) {
			var result = platformValidationService.isMandatory(value, model);
			return platformValidationService.finishValidation(result, item, value, model, this, 'basicsConfigGenWizardNamingParameterDataService');
		};

		this.validatePattern = function validatePattern(item, value, model) {
			let useCaseUuid = item.GenericWizardInstanceEntity.WizardConfiGuuid;
			let allowedPatternIdList = _.map(genericWizardNamingParameterConstantService.getAllowedNamingParameters(useCaseUuid), 'id');
			let allowedPatternCharList = [];
			let result;

			_.forEach(genericWizardNamingParameterConstantService.getGenericWizardNamingParameterConstant(), function (param) {
				if (allowedPatternIdList.includes(param.id)) {
					allowedPatternCharList.push(param.pattern.match(new RegExp('[a-z]+', 'i'))[0]);
				}
			});
			const incorrectPatternError = {
				apply: true,
				valid: false,
				error: '',
				error$tr$: ''
			};
			if (!_.isEmpty(value) && !_.isEmpty(allowedPatternCharList)) {
				let regString = '\\{(';
				_.forEach(allowedPatternCharList, function (char, counter) {
					if (counter !== 0) {
						regString += '|';
					}
					regString += char + '*';
				});

				regString += ')?\\}';
				const checkAllPatternsRegExp = new RegExp('\{.*?\}', 'gi');
				const checkAllowedPatternsRegExp = new RegExp(regString, 'gi');
				let allPatternsMatch = value.match(checkAllPatternsRegExp);
				let allowedPatternsMatch = value.match(checkAllowedPatternsRegExp);
				incorrectPatternError.error$tr$ = 'basics.config.genericWizardPatternError.incorrectPattern';
				if (allPatternsMatch && allowedPatternsMatch) {
					result = allPatternsMatch.length === allowedPatternsMatch.length ? true : incorrectPatternError;
				} else {
					result = !(Boolean(allPatternsMatch) ^ Boolean(allowedPatternsMatch)) ? true : incorrectPatternError;
				}
			} else {
				incorrectPatternError.error$tr$ = 'basics.config.genericWizardPatternError.emptyError';
				result = incorrectPatternError;
			}
			return platformValidationService.finishValidation(result, item, value, model, this, 'basicsConfigGenWizardNamingParameterDataService');
		};
	}
})(angular);