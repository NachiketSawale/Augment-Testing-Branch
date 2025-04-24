// eslint-disable-next-line no-redeclare
/* globals angular */
(function (angular) {
	'use strict';

	var serviceName = 'businessPartnerSelectBpdContactClientAction';

	// eslint-disable-next-line no-unused-vars
	function ClientAction(_) {  // jshint ignore:line
		var self = this;
		self.Id = '00009f045b629af442a5dba29c4503d9';
		self.Input = ['User.Ext.Provider.Entity', 'PortalAccessGroupList'];
		self.Output = ['ContactId', 'PortalAccessGroupId', 'Context'];
		self.Description = 'Portal-ClientAction Select Contact from Business Partner';
		self.Comment = 'Portal-ClientAction Select Business Partner or Contact';
		self.ActionType = 6;
		// self.templateUrl = 'basics.workflow/userInputAction.html';  rei@ not used here
		self.directive = 'businessPartnerSelectBpdContactClientActionDirective';
	}

	angular.module('businesspartner.main').service(serviceName,
		['_', ClientAction])

		// rei@10.17 register client workflow action for usage in workflows
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.clientActions.push(serviceName);
		}]);
})(angular);