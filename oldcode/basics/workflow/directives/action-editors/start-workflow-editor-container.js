/**
 * Created by uestuenel on 03.05.2016.
 */

(function (angular) {
	'use strict';

	function basicsWorkflowStartWorkflowEditorDirective(basicsWorkflowStartWorkflowEditorUtilService) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/start-workflow-editor.html',
			compile: function compile() {
				return {
					pre: basicsWorkflowStartWorkflowEditorUtilService.postLinkFn
				};
			}
		};
	}

	basicsWorkflowStartWorkflowEditorDirective.$inject = ['basicsWorkflowStartWorkflowEditorUtilService'];

	angular.module('basics.workflow')
		.directive('basicsWorkflowStartWorkflowEditorDirective', basicsWorkflowStartWorkflowEditorDirective)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: 'b9a051030fa2493bb6b0427e172e7fc9',
					directive: 'basicsWorkflowStartWorkflowEditorDirective',
					prio: null,
					tools: []
				}
			);
		}]);
})(angular);
