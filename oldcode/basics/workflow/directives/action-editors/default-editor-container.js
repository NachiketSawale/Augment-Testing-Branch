/* globals angular */

(function (angular) {
	'use strict';

	function defaultActionEditorDirective(platformModuleStateService, globals, basicsWorkflowActionEditorService) {
		var state = platformModuleStateService.state('basics.workflow');
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/default-action-editor.html',
			compile: function compile() {
				return function (scope, elem, attr, ctrl) {
					// scope.options = {};
					scope.editorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);
					scope.outputOpen = true;
					scope.inputOpen = true;

					ctrl.$render = function () {
						var action = ctrl.$viewValue;
						scope.editorOptions.readOnly = state.selectedTemplateVersion.IsReadOnly ? 'nocursor' : false;

						scope.inputParams = [];
						scope.outputParams = [];

						if (action) {
							if (action.input) {
								scope.inputParams = action.input;
							}
							if (action.output) {
								scope.outputParams = action.output;
							}
						}
					};

				};
			}
		};
	}

	defaultActionEditorDirective.$inject = ['platformModuleStateService', 'globals', 'basicsWorkflowActionEditorService'];

	angular.module('basics.workflow')
		.directive('basicsWorkflowDefaultActionEditorDirective', defaultActionEditorDirective)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: null,
					directive: 'basicsWorkflowDefaultActionEditorDirective',
					prio: null,
					tools: []
				}
			);
		}]);

})(angular);
