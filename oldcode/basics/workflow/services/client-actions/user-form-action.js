/* global angular */
(function () {
	'use strict';

	var serviceName = 'basicsWorkflowUserFormAction';

	function BasicsWorkflowUserFormAction() {
		var self = this;

		self.Id = '00000000000000000000000000000002';
		self.Input = ['FormId', 'ContextId', 'FormDataId', 'Description', 'IsPopUp', 'Title', 'Subtitle', 'DialogConfig'];
		self.Output = ['FormDataId'];
		self.Description = 'User Form';
		self.ActionType = 9;
		self.directive = 'basicsWorkflowUserFormActionDirective';
		self.Namespace = 'Basics.Workflow';
	}

	angular.module('basics.workflow')
		.service(serviceName,
			[BasicsWorkflowUserFormAction])
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.clientActions.push(serviceName);
		}]);
})();
