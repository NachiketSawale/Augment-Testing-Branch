(function (angular) {
	'use strict';
	/* global globals */

	const serviceName = 'downloadLogAction';
	function downloadLogAction() {
		let self = this;
		self.Id = '0000fd0ab4d84d48a20c63f710994e59';
		self.Input = ['Context', 'IsPopUp'];
		self.Output = ['Result'];
		self.Description = 'Download AutoUpdate From Baseline Log';
		self.ActionType = 6;
		self.HideFooter = true;
		self.directive = 'basicsWorkflowDownloadLogActionDirective';
	}

	angular.module('basics.workflow').service(serviceName, ['platformModalService', downloadLogAction])
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.clientActions.push(serviceName);
		}]);

})(angular);