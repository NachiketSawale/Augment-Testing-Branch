(function (angular) {
	'use strict';

	function basicsWorkflowStartWorkflowByListEditorDirective(basicsWorkflowStartWorkflowEditorUtilService) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/start-workflow-by-list-editor.html',
			compile: function compile() {
				return {
					pre: basicsWorkflowStartWorkflowEditorUtilService.postLinkFn
				};
			}
		};
	}

	basicsWorkflowStartWorkflowByListEditorDirective.$inject = ['basicsWorkflowStartWorkflowEditorUtilService'];

	var directiveName = 'basicsWorkflowStartWorkflowByListEditorDirective';

	angular.module('basics.workflow')
		.directive(directiveName, basicsWorkflowStartWorkflowByListEditorDirective)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: '66244F94145044F4BAD64BD81DFA07BC',
					directive: directiveName,
					prio: null,
					tools: []
				}
			);
		}]);
})(angular);
