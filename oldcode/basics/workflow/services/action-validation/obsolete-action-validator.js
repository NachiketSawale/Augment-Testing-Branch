/*globals angular */
(function (angular) {
	'use strict';
	var obsoleteList = ['00000000000000000000000000000001'];

	function obsoleteActionValidatorFactory(util) {
		var _ = util._;

		function obsoleteActionValidator(action, errorFn) {
			if (_.includes(obsoleteList, action.actionId)) {
				errorFn(action, util.translate('basics.workflow.workflowAction.errors.obsoleteWarning'));
			}
		}

		util.actionValidationHelper.registerActionValidation(obsoleteActionValidator);

	}

	obsoleteActionValidatorFactory.$inject = ['basicsWorkflowActionValidationUtilService'];

	angular.module('basics.workflow')
		.run(obsoleteActionValidatorFactory);

})(angular);