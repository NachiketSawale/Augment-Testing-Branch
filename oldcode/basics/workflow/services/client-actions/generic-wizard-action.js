/* global angular */
(function () {
	'use strict';

	var serviceName = 'basicsWorkflowGenericWizardAction';

	function BasicsWorkflowGenericWizardAction() {
		var self = this;

		self.Id = '0000e5b3c39e4221a626bdb76d9ce1ee';
		self.Input = ['GenericWizardInstanceId', 'EntityId', 'IsPopUp','EvaluateProxy','DisableRefresh','AllowReassign','Context','WorkflowTemplateId'];
		self.Output = ['Context'];
		self.Description = 'Generic Wizard';
		self.ActionType = 6;
		self.Namespace = 'Basics.Workflow';
		self.templateUrl = '';
		self.IsGenericWizard = true;
	}

	angular.module('basics.workflow')
		.service(serviceName,
			[BasicsWorkflowGenericWizardAction])
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.clientActions.push(serviceName);
		}]);
})();
