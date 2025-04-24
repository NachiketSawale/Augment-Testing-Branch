/**
 * Created by uestuenel on 10.06.2016.
 */

(function (angular) {
	'use strict';

	function basicsWorkflowGotoActionEditorContainer(basicsWorkflowActionEditorService, basicsWorkflowTemplateService) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/goto-action-editor.html',
			compile: function () {
				return {
					pre: function ($scope) {
						//accordion
						$scope.inputOpen = true;
						$scope.outputOpen = true;
						$scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions();
						$scope.getEditorInput = basicsWorkflowActionEditorService.getEditorInput;
						var list = basicsWorkflowTemplateService.getAllCodesFromCurrentVersion();
						var codelist = [];

						angular.forEach(list, function (item) {
							var object = {};
							object.description = item;
							codelist.push(object);
						});

						$scope.selectOptions = {
							displayMember: 'description',
							valueMember: 'description',
							items: codelist
						};
					}
				};
			}
		};
	}

	basicsWorkflowGotoActionEditorContainer.$inject = ['basicsWorkflowActionEditorService', 'basicsWorkflowTemplateService'];

	angular.module('basics.workflow')
		.directive('basicsWorkflowGotoActionEditorContainer', basicsWorkflowGotoActionEditorContainer)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: 'E0000000000000000000000000000000',
					directive: 'basicsWorkflowGotoActionEditorContainer',
					prio: null,
					tools: []
				}
			);
		}]);
})(angular);
