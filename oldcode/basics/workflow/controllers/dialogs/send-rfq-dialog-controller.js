(function (angular) {
	'use strict';

	angular.module('basics.workflow').controller('basicsWorkflowSendRfqDialog', basicsWorkflowSendRfqDialog);

	basicsWorkflowSendRfqDialog.$inject = ['$scope'];

	function basicsWorkflowSendRfqDialog($scope) {
		$scope.tabs = [
			{
				title: 'Bidder Selection',
				content: globals.appBaseUrl + 'basics.workflow/templates/dialogs/workflow-send-rfq-tab-bidder-section.html',
				active: true
			},
			{
				title: 'Cover Letter / Email Body',
				content: globals.appBaseUrl + 'basics.workflow/templates/dialogs/workflow-send-rfq-tab-email-body.html',
				reloadTab: true
			},
			{
				title: 'Data Format',
				content: globals.appBaseUrl + 'basics.workflow/templates/dialogs/workflow-send-rfq-tab-dataformat.html',
				reloadTab: true
			},
			{
				title: 'Reports',
				content: globals.appBaseUrl + 'basics.workflow/templates/dialogs/workflow-send-rfq-tab-reports.html',
				reloadTab: true
			},
			{
				title: 'Documents',
				content: globals.appBaseUrl + 'basics.workflow/templates/dialogs/workflow-send-rfq-tab-documents.html',
				reloadTab: true
			},
			{
				title: 'Transmission Protocol',
				content: globals.appBaseUrl + 'basics.workflow/templates/dialogs/workflow-send-rfq-tab-transmission.html',
				reloadTab: true
			}
		];

		$scope.selectTab = function (index) {
			_.forEach($scope.tabs, function (item) {
				item.active = false;
			});
			$scope.tabs[index].active = true;
		};

		$scope.options = {
			labelText: 'BCC to me'
		};

		_.set($scope, 'select_options', {
			labelText: 'Select'
		});

		_.set($scope, 'select_cc', {
			labelText: 'CC'
		});
	}
})(angular);
