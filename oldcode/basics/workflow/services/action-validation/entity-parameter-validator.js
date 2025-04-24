/*globals angular */

(function (angular) {
	'use strict';

	function entiyParameterValidatorFactory(util) {
		var _ = util._;

		function entiyParameterValidator(action, errFn) {
			if (action.actionId === '80a2d342d3d346d585c0fce47379d556') {
				var param = _.find(action.input, {key: 'EntityProperty'});

				if (param) {
					if (!param.value.includes('{{')) {
						errFn(action, util.translate('basics.workflow.workflowAction.errors.saveEntityAction.entityPropertyError'));
					}
				}

			}
		}

		util.actionValidationHelper.registerActionValidation(entiyParameterValidator);
	}

	entiyParameterValidatorFactory.$inject = ['basicsWorkflowActionValidationUtilService'];

	angular.module('basics.workflow')
		.run(entiyParameterValidatorFactory);
})(angular);