/* globals angular*/

(function (angular) {
	'use strict';

	var state = {};

	function basicsWorkflowScriptEditorDirective(_, basicsWorkflowGlobalContextUtil, basicsWorkflowActionEditorService,
	                                             platformModuleStateService) {
		state = platformModuleStateService.state('basics.workflow');
		return {
			restrict: 'A',
			require: 'ngModel',
			template: '<div ng-if="codeMirrorReady" data-change="changeScript" data-script-editor-directive data-ng-model="script" data-options="codeMirrorOptions" class="filler"></div>',
			compile: function compile() {
				return getPostLink(_, basicsWorkflowGlobalContextUtil, basicsWorkflowActionEditorService);
			}
		};
	}

	basicsWorkflowScriptEditorDirective.$inject = ['_', 'basicsWorkflowGlobalContextUtil',
		'basicsWorkflowActionEditorService', 'platformModuleStateService'];

	function getPostLink(_, basicsWorkflowGlobalContextUtil, basicsWorkflowActionEditorService) {
		return function postLink(scope, iElement, attr, ngModelCtrl) {
			scope.script = ngModelCtrl.$modelValue;

			var action = {};
			var scriptKey = 'Script';
			scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(false);
			scope.codeMirrorOptions.hintOptions = {
				get globalScope() {
					return basicsWorkflowGlobalContextUtil.getAutoCompleteContext();
				}
			};

			scope.codeMirrorReady = false;

			ngModelCtrl.$render = function () {

				scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(false);
				scope.codeMirrorOptions.readOnly = state.selectedTemplateVersion.IsReadOnly ? true : false;
				scope.script = ngModelCtrl.$viewValue;
				scope.codeMirrorReady = true;

			};

			ngModelCtrl.$parsers.push(function (value) {
				var param = _.find(action.input, {key: scriptKey});
				if (!param) {
					if (!action.input) {
						action.input = [];
					}
					action.input.push({key: scriptKey, value: value});
				} else {
					param.value = value;
				}

				return action;
			});

			ngModelCtrl.$formatters.push(function (value) {
				action = value;
				if (action) {
					var param = _.find(value.input, {key: scriptKey});
					return param ? param.value : '';
				}
				return '';
			});

			scope.changeScript = function (newScript) {
				scope.script = newScript;
				ngModelCtrl.$setViewValue(newScript);
			};

			scope.$watch(function () {
				return state.selectedTemplateVersion ? state.selectedTemplateVersion.IsReadOnly : true;
			}, function (newVal) {

				scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(false);
				scope.codeMirrorOptions.readOnly = newVal ? true : false;

				if (state.selectedTemplateVersion) {
					scope.script = ngModelCtrl.$viewValue;
				} else {
					scope.script = '';
				}

				scope.codeMirrorReady = true;

			});
		};
	}

	angular.module('basics.workflow')
		.directive('basicsWorkflowScriptEditorDirective', basicsWorkflowScriptEditorDirective)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: '409ed310344011e5a151feff819cdc9f',
					directive: 'basicsWorkflowScriptEditorDirective',
					prio: null,
					tools: []
				}
			);
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: 'c8fff2580378485bbb941d5029e3f569',
					directive: 'basicsWorkflowScriptEditorDirective',
					prio: null,
					tools: []
				}
			);
		}]);

})(angular);
