/*globals angular */
(function (angular) {
	'use strict';

	function ActionParamValidatorFactory(util) {

		const _ = util._;

		this.actionParamValidator = function actionParamValidator(currentAction, errorFn) {
			if (!util.isStartOrEnd(currentAction)) {
				let evaluation = {paramsChanged: false, actionMissing: false, message: ''};

				var action = _.find(util.actionList, {Id: currentAction.actionId});

				if (action) {
					if (action.Input) {
						evaluation.message += validateParam(action.Input, currentAction.input);
					}
					if (action.Output) {
						evaluation.message += ' ' + validateParam(action.Output, currentAction.output);
					}
					if (evaluation.message.trim()) {
						evaluation.paramsChanged = true;
					}

				} else {
					evaluation.actionMissing = true;
					evaluation.message = util.translate('basics.workflow.workflowAction.errors.actionNotAvailable');
				}

				if (errorFn) {
					errorFn(currentAction, evaluation.message);
				}
				return evaluation;

			}
		};

		function validateParam(workflowParams, currentWorkflowParams) {
			let actionNewParamError = '';
			let actionNonexistentParamError = '';

			for (let paramPoss = 0; paramPoss < workflowParams.length; paramPoss++) {
				if (!currentWorkflowParams.find(element => element.key === workflowParams[paramPoss])) {
					if (!actionNewParamError) {
						actionNewParamError = util.translate('basics.workflow.workflowAction.errors.actionNewParam');
					}
					actionNewParamError = actionNewParamError + ' ' + workflowParams[paramPoss] + '.';
				}
			}
			for (let paramPoss = 0; paramPoss < currentWorkflowParams.length; paramPoss++) {
				if (!workflowParams.find(element => element === currentWorkflowParams[paramPoss].key)) {
					if (!actionNonexistentParamError) {
						actionNonexistentParamError = util.translate('basics.workflow.workflowAction.errors.actionNonexistentParam');
					}
					actionNonexistentParamError = actionNonexistentParamError + ' ' + currentWorkflowParams[paramPoss].key + '.';
				}
			}

			return actionNewParamError +  ' ' + actionNonexistentParamError;
		}

		util.actionValidationHelper.registerActionValidation(this.actionParamValidator);
	}

	ActionParamValidatorFactory.$inject = ['basicsWorkflowActionValidationUtilService'];
	angular.module('basics.workflow')
		.service('actionParamValidatorFactory', ActionParamValidatorFactory);
})(angular);
