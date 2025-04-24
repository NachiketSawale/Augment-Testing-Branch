/*globals angular */
(function (angular) {
	'use strict';

	function ActionTranslationValidatorFactory($injector, _) {
		let util = $injector.get('basicsWorkflowActionValidationUtilService');
		this.actionTranslationValidator = function actionTranslationValidator(currentAction, errorFn) {
			if (util.actionValidationHelper.errorList) {
				let errorMessage = util.translate('basics.workflow.workflowAction.errors.textModuleTranslation') + ': ';
				const error = util.actionValidationHelper.errorList[currentAction.id];

				if (error && error.length > 0) {
					errorMessage = errorMessage + _.uniq(error).join(', ');
					if (errorFn) {
						errorFn(currentAction, errorMessage);
					}
				}
			}
		};

		util.actionValidationHelper.registerActionValidation(this.actionTranslationValidator);
	}

	ActionTranslationValidatorFactory.$inject = ['$injector', '_'];
	angular.module('basics.workflow')
		.service('actionTranslationValidatorFactory', ActionTranslationValidatorFactory);
})(angular);
