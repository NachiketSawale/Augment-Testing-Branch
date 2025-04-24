(function (angular) {
	'use strict';

	var serviceName = 'basicsWorkflowExtendedUserTaskAction';

	function ExtendedUserAction() {
		var self = this;
		self.Id = '000019b479164ad1adeb7631d3fd6161';
		self.Input = ['HTML', 'Script', 'Context', 'IsPopUp','EvaluateProxy','DisableRefresh', 'AllowReassign','Title', 'Subtitle', 'DialogConfig'];
		self.Output = ['Context'];
		self.Description = 'Extended User Action';
		self.ActionType = 6;
		self.HideFooter = true;
		self.templateUrl = '';
		self.directive = 'basicsWorkflowExtendedUserTaskActionDirective';
		self.Namespace = 'Basics.Workflow';
	}

	angular.module('basics.workflow').service(serviceName,
		['_', 'basicsWorkflowUtilityService', ExtendedUserAction])
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.clientActions.push(serviceName);
		}]);

})(angular);
