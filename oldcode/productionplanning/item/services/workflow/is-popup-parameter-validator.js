(function (angular) {
	'use strict';

	function IsPopUpParameterValidator(util) {
		const copyProjectLocationActionId = '00000b2f8df04099be731c8f54950507';
		let _ = util._;

		function IsPopUpParameterValidator(action) {
			if (action.actionId === copyProjectLocationActionId) {
				let popUp = _.find(action.input, {key: 'IsPopUp'});
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

		util.actionValidationHelper.registerActionValidation(IsPopUpParameterValidator);
	}

	IsPopUpParameterValidator.$inject = ['basicsWorkflowActionValidationUtilService'];

	angular.module('productionplanning.item')
		.run(IsPopUpParameterValidator);

})(angular);
