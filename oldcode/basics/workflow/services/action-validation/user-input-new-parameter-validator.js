(function (angular) {
	'use strict';

	function userInputNewParameterValidatorFactory(util) {
		var _ = util._;

		function userInputNewParameterValidator(action) {
			if (action.actionId === '00000000000000000000000000000000' || action.actionId === '00000000000000000000000000000001') {
				var popUp = _.find(action.input, {key: 'IsPopUp'});
				if (!popUp) {
					action.input.push({
						id: Math.floor(Math.random() * 90000) + 10000,
						key: 'IsPopUp',
						value: 'true'
					});
				} else {
					if (popUp.value !== 'true' && popUp.value !== 'false') {
						popUp.value = 'true';
					}
				}
			}
		}

		util.actionValidationHelper.registerActionValidation(userInputNewParameterValidator);

	}

	userInputNewParameterValidatorFactory.$inject = ['basicsWorkflowActionValidationUtilService'];

	angular.module('basics.workflow')
		.run(userInputNewParameterValidatorFactory);

})(angular);
