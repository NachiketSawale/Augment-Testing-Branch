/*globals angular */
(function (angular) {
	'use strict';

	function actionTypeValidatorFactory(util) {

		var _ = util._;

		function actionTypeValidator(item, errorFn) {
			if (item.actionId === null && !util.isStartOrEnd(item)) {
				errorFn(item,
					util.translate('basics.workflow.workflowAction.errors.actionIdMissing')
				);

			} else {
				var action = _.find(util.actionList, {Id: item.actionId});
				if (action) {
					if (item.actionTypeId !== action.ActionType) {
						item.actionTypeId = action.ActionType;
						errorFn(item, util.translate('basics.workflow.workflowAction.errors.actionTypeWrong'));
					}

				} else {
					if (!util.isStartOrEnd(item)) {
						errorFn(item, util.translate('basics.workflow.workflowAction.errors.actionNotExist'));
					}
				}
			}
		}

		util.actionValidationHelper.registerActionValidation(actionTypeValidator);

	}

	actionTypeValidatorFactory.$inject = ['basicsWorkflowActionValidationUtilService'];
	angular.module('basics.workflow')
		.run(actionTypeValidatorFactory);

})(angular);
