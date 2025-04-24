/*globals angular */
(function (angular) {
	'use strict';

	function basicsWorkflowDecisionDropdownDirective() {
		return {
			restrict: 'A',
			scope: {
				decision: '=',
				result: '='
			},
			replace: true,
			template: '<div class="platform-form-col"><span class="form-control" data-domain-control data-domain="select" class="form-control"' +
				' data-model="result" data-change="changed(value)" data-options="decision"></span></div>'
		};
	}

	basicsWorkflowDecisionDropdownDirective.$inject = ['basicsCommonFileDownloadService'];

	angular.module('basics.workflow').directive('basicsWorkflowDecisionDropdownDirective', basicsWorkflowDecisionDropdownDirective);
})(angular);
