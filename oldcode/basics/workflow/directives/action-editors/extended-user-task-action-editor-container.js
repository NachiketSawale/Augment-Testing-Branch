/**
 * Created by baitule on 29.10.2018.
 */
(function (angular) {
	'use strict';

	function basicsWorkflowExtendedUserTaskActionEditorDirective(basicsWorkflowActionEditorService, _, basicsWorkflowEditModes, basicsWorkflowGlobalContextUtil, $translate) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/extended-user-task-action-editor-container.html',
			compile: function () {
				return {
					pre: function (scope, iElement, attr, ngModelCtrl) {

						// accordion
						scope.inputOpen = true;
						scope.outputOpen = true;
						scope.htmlOpen = true;
						scope.scriptOpen = true;

						scope.input = {};
						scope.output = {};

						// radio-button
						scope.input = {};
						scope.input.editorMode = basicsWorkflowEditModes.default;
						scope.input.radioGroupOpt = {
							displayMember: 'description', valueMember: 'value', cssMember: 'cssClass', items: [{
								value: 1,
								description: $translate.instant('basics.workflow.modalDialogs.defaultRadio'),
								cssClass: 'pull-left spaceToUp'
							}, {
								value: 2,
								description: $translate.instant('basics.workflow.modalDialogs.expertRadio'),
								cssClass: 'pull-left margin-left-ld'
							}]
						};

						scope.onRadioGroupOptChanged = function changeRadioGroupOpt(radioValue) {
							scope.input.editorMode = radioValue;
						};

						scope.isPopUpOptions = {
							ctrlId: 'isPopUpCheckbox',
							labelText: $translate.instant('basics.workflow.action.customEditor.isPopUp'),
							toolTipTitle: $translate.instant('basics.workflow.action.customEditor.isPopUp'),
							toolTipCaption: $translate.instant('basics.workflow.action.customEditor.isPopUpTooltipCaption'),
						};

						scope.EvaluateProxyOptions = {
							ctrlId: 'EvaluateProxyCheckbox',
							labelText: $translate.instant('basics.workflow.action.customEditor.EvaluateProxy'),
							toolTipTitle: $translate.instant('basics.workflow.action.customEditor.EvaluateProxy'),
							toolTipCaption: $translate.instant('basics.workflow.action.customEditor.EvaluateProxyTooltipCaption')
						};

						scope.DisableRefreshOptions = {
							ctrlId: 'DisableRefreshCheckbox',
							labelText: $translate.instant('basics.workflow.action.customEditor.DisableRefresh'),
							toolTipTitle: $translate.instant('basics.workflow.action.customEditor.DisableRefresh'),
							toolTipCaption: $translate.instant('basics.workflow.action.customEditor.DisableRefreshTooltipCaption')
						};

						scope.AllowReassignOptions = {
							ctrlId: 'AllowReassignCheckbox',
							labelText: $translate.instant('basics.workflow.action.customEditor.AllowReassign'),
							toolTipTitle: $translate.instant('basics.workflow.action.customEditor.AllowReassign'),
							toolTipCaption: $translate.instant('basics.workflow.action.customEditor.AllowReassignRefreshTooltipCaption')
						};

						scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);
						scope.codeMirrorOptionsDialogConfig = basicsWorkflowActionEditorService.setCodeMirrorOptions(false);
						scope.codeMirrorOptionsDialogConfig.placeholder = $translate.instant('basics.workflow.action.customEditor.extendedUser.extendedDialogConfigExample') + ': {\"width\": \"285px\", \"width\": \"500px\", \"headerText\": \"text\"}';


						scope.codeMirrorOptionsMulti = basicsWorkflowActionEditorService.setCodeMirrorOptions(false);
						scope.codeMirrorOptionsMulti.mode = 'htmlmixed';
						//scope.codeMirrorOptionsMulti.mode = {name: 'xml',htmlMode: true	};
						scope.codeMirrorOptionsMulti.hintOptions = {
										get globalScope() {
											return basicsWorkflowGlobalContextUtil.getAutoCompleteContext();
										}
									};

						scope.codeMirrorOptionsMultiJavascript = basicsWorkflowActionEditorService.setCodeMirrorOptions(false);
						scope.codeMirrorOptionsMultiJavascript.mode = 'javascript';
							scope.codeMirrorOptionsMultiJavascript.hintOptions = {
							get globalScope() {
								return basicsWorkflowGlobalContextUtil.getAutoCompleteContext();
							}
						};

						ngModelCtrl.$render = function () {
							if (ngModelCtrl.$viewValue) {
								scope.action = ngModelCtrl.$viewValue;
								scope.isPopUp = _.find(scope.action.input, {key: 'IsPopUp'});
								scope.EvaluateProxy = _.find(scope.action.input, {key: 'EvaluateProxy'});
								scope.DisableRefresh = _.find(scope.action.input, {key: 'DisableRefresh'});
								scope.AllowReassign = _.find(scope.action.input, {key: 'AllowReassign'});
								scope.html = _.find(scope.action.input, {key: 'HTML'});
								scope.script = _.find(scope.action.input, {key: 'Script'});
								scope.title = _.find(scope.action.input, {key: 'Title'});
								scope.subtitle = _.find(scope.action.input, {key: 'Subtitle'});
								scope.dialogConfig = _.find(scope.action.input, {key: 'DialogConfig'});
								scope.input.context = _.find(scope.action.input, {key: 'Context'});
								scope.context = _.find(scope.action.output, {key: 'Context'});
							}
						};

						scope.changeCheckbox = function (val) {
							if (val === 'isPopUp') {
								scope.isPopUp.value = _.toString(!scope.isPopUpCheckbox);
							}
							if (val === 'evaluateProxy') {
								scope.EvaluateProxy.value = _.toString(!scope.EvaluateProxyCheckbox);
							}
							if (val === 'disableRefresh') {
								scope.DisableRefresh.value = _.toString(!scope.DisableRefreshCheckbox);
							}
							if (val === 'allowReassign') {
								scope.AllowReassign.value = _.toString(!scope.AllowReassignCheckbox);
							}

						};

						scope.$watch(function () {
							return scope.isPopUp ? scope.isPopUp.value : undefined;
						}, function (newVal) {
							scope.isPopUpCheckbox = newVal === true || _.isString(newVal) ? _.toLower(newVal) === 'true' : false;
						});

						scope.$watch(function () {
							return scope.EvaluateProxy ? scope.EvaluateProxy.value : undefined;
						}, function (newVal) {
							scope.EvaluateProxyCheckbox = newVal === true || _.isString(newVal) ? _.toLower(newVal) === 'true' : false;
						});

						scope.$watch(function () {
							return scope.DisableRefresh ? scope.DisableRefresh.value : undefined;
						}, function (newVal) {
							scope.DisableRefreshCheckbox = newVal === true || _.isString(newVal) ? _.toLower(newVal) === 'true' : false;
						});

						scope.$watch(function () {
							return scope.AllowReassign ? scope.AllowReassign.value : undefined;
						}, function (newVal) {
							scope.AllowReassignCheckbox = newVal === true || _.isString(newVal) ? _.toLower(newVal) === 'true' : false;
						});
					}
				};
			}
		};
	}

	basicsWorkflowExtendedUserTaskActionEditorDirective.$inject = ['basicsWorkflowActionEditorService', '_', 'basicsWorkflowEditModes', 'basicsWorkflowGlobalContextUtil', '$translate'];

	angular.module('basics.workflow')
		.directive('basicsWorkflowExtendedUserTaskActionEditorDirective', basicsWorkflowExtendedUserTaskActionEditorDirective)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push({
				actionId: '000019b479164ad1adeb7631d3fd6161',
				directive: 'basicsWorkflowExtendedUserTaskActionEditorDirective',
				prio: null,
				tools: []
			});
		}]);
})(angular);
