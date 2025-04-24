/* global angular */
(function () {
	'use strict';

	var serviceName = 'basicsWorkflowModuleWizardAction';

	function BasicsWorkflowModuleWizardAction() {
		var self = this;

		self.Id = '0000b9570f044808a45e7f7eab93c102';
		self.Input = ['ModuleId', 'ModuleWizardInstanceId', 'WizardGuid', 'ModuleInternalName', 'Entity', 'IsPopUp', 'EvaluateProxy', 'AllowReassign', 'DisableRefresh', 'Context'];
		self.Output = ['Context'];
		self.Description = 'Module Wizard';
		self.ActionType = 6;
		self.Namespace = 'Basics.Workflow';
		self.templateUrl = '';
		self.IsModuleWizard = true;
	}

	angular.module('basics.workflow')
		.service(serviceName,
			[BasicsWorkflowModuleWizardAction])
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.clientActions.push(serviceName);
		}]);
})();
