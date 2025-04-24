/* globals angular */

(function (angular) {
	'use strict';

	function basicsWorkflowCustomEditorParamsController($scope, _, basicsWorkflowActionEditorService,
	                                                    platformModuleStateService, basicsWorkflowTemplateService) {
		var state = platformModuleStateService.state('basics.workflow');

		$scope.setTools({
			showImages: true,
			showTitles: true,
			cssClass: 'tools',
			items: []
		});

		function updateAction(newVal, oldVal) {
			$scope.action = newVal;
			if (state.selectedTemplateVersion) {
				$scope.readOnly = state.selectedTemplateVersion.IsReadOnly;
			}
			if (oldVal && newVal && oldVal.id === newVal.id) {
				state.mainItemIsDirty = basicsWorkflowTemplateService.hasActionChanged();
			}
		}

		$scope.readOnly = true;

		function updateEditor(newVal) {
			var editor = basicsWorkflowActionEditorService.getEditor(newVal);
			if (editor) {
				$scope.directive = _.kebabCase(editor.directive);
				$scope.$parent.tools.items = editor.tools;
			} else {
				$scope.directive = '';
				$scope.$parent.tools.items = [];
			}
			$scope.$parent.tools.update();
		}

		$scope.$watch(
			function () {
				return state.currentWorkflowAction;
			}, updateAction);

		$scope.$watch(
			function () {
				if (state.currentWorkflowAction) {
					return state.currentWorkflowAction.actionId;
				} else {
					return null;
				}
			}, updateEditor);

	}

	basicsWorkflowCustomEditorParamsController.$inject = ['$scope', '_', 'basicsWorkflowActionEditorService',
		'platformModuleStateService', 'basicsWorkflowTemplateService'];

	angular.module('basics.workflow').controller('basicsWorkflowCustomEditorParamsController',
		basicsWorkflowCustomEditorParamsController);
})(angular);
