/*globals angular */

(function (angular) {
	'use strict';

	function parameterValidatorFactory(util, platformModuleStateService) {
		var _ = util._;
		const state = platformModuleStateService.state('basics.workflow');

		this.parameterValidator = function parameterValidator(action) {
			let actionTemplate;
			if (!state.selectedTemplateVersion.IsReadOnly) {
				actionTemplate = util.actionList.find(a => a.Id === action.actionId);
			}
			if (actionTemplate) {
				action.input = getParameter( action['input'], actionTemplate.Input);
				action.output = getParameter( action['output'], actionTemplate.Output);
			}
		};

		function getParameter( actionParam, actionTemplate) {
			let actionNewParam = [];
			actionTemplate.forEach(function (actionTemplateParam) {
				const param = _.find(actionParam, {key: actionTemplateParam});
				if (param) {
					actionNewParam.push(param);
				} else {
					actionNewParam.push({
						id: Math.floor(Math.random() * 90000) + 10000,
						key: actionTemplateParam,
						value: ''
					});
				}
			});
			return actionNewParam;
		}

		util.actionValidationHelper.registerActionValidation(this.parameterValidator);

	}

	parameterValidatorFactory.$inject = ['basicsWorkflowActionValidationUtilService', 'platformModuleStateService'];

	angular.module('basics.workflow')
		.service('parameterValidatorFactory', parameterValidatorFactory);

})(angular);
