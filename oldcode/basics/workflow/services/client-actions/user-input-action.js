/* globals angular */
(function (angular) {
	'use strict';

	var serviceName = 'basicsWorkflowUserInputAction';

	function UserInputAction() {
		var self = this;
		self.Id = '00000000000000000000000000000000';
		self.Input = ['Config', 'IsPopUp', 'IsNotification','EvaluateProxy','DisableRefresh','AllowReassign','EscalationDisabled', 'StopVisible', 'CancelVisible', 'Context'];
		self.Output = ['Context'];
		self.Description = 'User Input';
		self.ActionType = 6;
		self.templateUrl = 'basics.workflow/userInputAction.html';
		self.directive = 'basicsWorkflowUserInputActionDirective';
		self.Namespace = 'Basics.Workflow';
	}

	angular.module('basics.workflow').service(serviceName,
		['_', 'basicsWorkflowUtilityService', UserInputAction])
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.clientActions.push(serviceName);
		}]);

})(angular);