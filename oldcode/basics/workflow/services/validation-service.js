/*globals angular */

(function (angular) {
	'use strict';
	var module = 'basics.workflow';

	function basicsWorkflowValidationService(basicsWorkflowActionValidationHelper, basicsWorkflowUtilityService, $http, $q, basicsWorkflowGlobalContextUtil, util, actionTranslationValidatorFactory) {
		var service = {};

		var templateRequest = {
			method: 'GET',
			url: globals.appBaseUrl + module + '/content/json/workflow-template.json'
		};

		service.validateVersion = function (workflowVersion, actions) {
			return this.validateTextModulesTranslation(workflowVersion).then(function (textModuleTranslation) {
				if (!workflowVersion.WorkflowAction) {
					$http(templateRequest).then(function (response) {
						workflowVersion.WorkflowAction = response.data;
					});
					return {invalidItems: []};
				}

				let helper = basicsWorkflowActionValidationHelper.get(actions);
				util.actionValidationHelper.errorList = textModuleTranslation;
				basicsWorkflowUtilityService.forEachAction(workflowVersion.WorkflowAction, helper.validateAction);

				return helper;
			});
		};

		service.validateWorkflowTemplate = function (workflowTemplate) {
			if (!workflowTemplate.Description) {
				return $q.when({
					isValid: false,
					errorText: 'basics.workflow.template.errorDialog.templateDescription.descriptionEmpty'
				});
			} else {
				return service.validateWorkflowTemplateDescription(workflowTemplate).then(function (response) {
					return {
						isValid: response,
						errorText: 'basics.workflow.template.errorDialog.templateDescription.descriptionExists'
					};
				});
			}
		};

		service.validateWorkflowTemplateDescription = function (workflowTemplate) {
			const isTemplateDescriptionRequest = {
				method: 'GET',
				url: globals.webApiBaseUrl + 'basics/workflow/template/validate/description',
				params: {
					description: workflowTemplate.Description,
					id: workflowTemplate.Id,
				}
			};

			return $http(isTemplateDescriptionRequest).then(function (response) {
				return response.data;
			});
		};

		service.evaluateDisableRefresh = (workflowInstances) => {
			if (_.isArray(workflowInstances)) {
				return workflowInstances.some((instance) => {
					if (_.isArray(instance.ActionInstances)) {
						return instance.ActionInstances.some((actionInstance) => {
							let disableRefresh = JSON.parse(actionInstance.Input).find(e => e.key === 'DisableRefresh');
							return disableRefresh ? !!disableRefresh.value : false;
						});
					}
				});
			}
			return false;
		};

		service.validateTextModulesTranslation = (selectedTemplateVersion) => {
			let templateVersion = _.cloneDeep(selectedTemplateVersion);
			templateVersion.WorkflowAction = JSON.stringify(templateVersion.WorkflowAction);
			return $http({
				method: 'POST',
				url: globals.webApiBaseUrl + 'basics/workflow/instance/validateWorkflow',
				data: templateVersion
			}).then(function (response) {

				return response.data;
			});
		};

		return service;
	}

	basicsWorkflowValidationService.$inject = ['basicsWorkflowActionValidationHelper', 'basicsWorkflowUtilityService', '$http', '$q', 'basicsWorkflowGlobalContextUtil', 'basicsWorkflowActionValidationUtilService', 'actionTranslationValidatorFactory'];

	angular.module(module)
		.factory('basicsWorkflowValidationService', basicsWorkflowValidationService);

})(angular);