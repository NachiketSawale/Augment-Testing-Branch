
(function (angular) {
	'use strict';

	const serviceName = 'portalEmailReviewDialogClientAction';

	function ClientAction() {  // jshint ignore:line
		const self = this;
		self.Id = '0000da385c9344f2be9d19913ef2af63';
		self.Input = ['recipient', 'subject', 'body', 'IsPopUp'];
		self.Output = ['ResultCode', 'Context'];
		self.Description = 'Portal Review Bidder Invitation Email';
		self.Comment = 'Portal ClientAction for reviewing Bidder Invitation Email';
		self.ActionType = 6;
		// self.templateUrl = 'basics.workflow/userInputAction.html';  rei@ not used here
		self.directive = 'usermanagementReviewEmailClientActionDirective';
	}

	angular.module('businesspartner.main').service(serviceName, ClientAction)

		// rei@10.17 register client workflow action for usage in workflows
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.clientActions.push(serviceName);
		}]);
})(angular);
