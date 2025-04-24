/**
 * Created by uestuenel on 13.07.2016.
 */

(function (angular) {
	'use strict';

	function basicsWorkflowGetBaselineProjectEditorContainer() {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/get-baseline-project-editor.html'
		};
	}

	angular.module('basics.workflow')
		.directive('basicsWorkflowGetBaselineProjectEditorContainer', basicsWorkflowGetBaselineProjectEditorContainer)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: 'b1797801a59d4ba4ae08f603ea277fd7',
					directive: 'basicsWorkflowGetBaselineProjectEditorContainer',
					prio: null,
					tools: []
				}
			);
		}]);
})(angular);
