/**
 * Created by uestuenel on 09.06.2016.
 */

(function (angular) {
	'use strict';

	function basicsWorkflowUserFormEditorDirective(basicsWorkflowActionEditorService, _, basicsWorkflowEditModes, $translate) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/user-form-editor.html',
			compile: function () {
				return {
					pre: function (scope, iElement, attr, ngModelCtrl) {
						var action = {},
							parameters = {
								formId: 'FormId',
								contextId: 'ContextId',
								desc: 'Description',
								output: 'FormDataId'
							};
						//accordion
						scope.inputOpen = true;
						scope.outputOpen = true;

						//radio-button
						scope.input = {};
						scope.input.editorMode = basicsWorkflowEditModes.default;
						scope.input.radioGroupOpt = {
							displayMember: 'description',
							valueMember: 'value',
							cssMember: 'cssClass',
							items: [
								{
									value: 1,
									description: $translate.instant('basics.workflow.modalDialogs.defaultRadio'),
									cssClass: 'pull-left spaceToUp'
								},
								{
									value: 2,
									description: $translate.instant('basics.workflow.modalDialogs.expertRadio'),
									cssClass: 'pull-left margin-left-ld'
								}
							]
						};

						scope.onRadioGroupOptChanged = function changeRadioGroupOpt(radioValue) {
							scope.input.editorMode = radioValue;
						};

						scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);

						function getDataFromAction(key) {
							var param = basicsWorkflowActionEditorService.getEditorInput(key, action);
							return param ? param.value : '';
						}

						ngModelCtrl.$formatters.push(function (value) {
							action = value;
							if (action) {
								var outputProperty = basicsWorkflowActionEditorService.getEditorOutput(parameters.output, action);

								return {
									dataForm: getDataFromAction(parameters.formId),
									dataContext: getDataFromAction(parameters.contextId),
									dataDesc: getDataFromAction(parameters.desc),
									outputValue: outputProperty ? outputProperty.value : ''
								};
							}
							return '';
						});

						ngModelCtrl.$render = function () {
							scope.input.form = parseInt(ngModelCtrl.$viewValue.dataForm) ? parseInt(ngModelCtrl.$viewValue.dataForm) : 0;
							scope.input.formscript = ngModelCtrl.$viewValue.dataForm;
							scope.input.context = ngModelCtrl.$viewValue.dataContext;
							scope.input.description = ngModelCtrl.$viewValue.dataDesc;
							scope.input.output = ngModelCtrl.$viewValue.outputValue;

							if (basicsWorkflowActionEditorService.setRadioButtonInEditor(scope.input.form, ngModelCtrl.$viewValue.dataForm)) {
								scope.input.editorMode = 2;
							}
						};

						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.dataContext, parameters.contextId, action);
							basicsWorkflowActionEditorService.setEditorInput(value.dataDesc, parameters.desc, action);
							basicsWorkflowActionEditorService.setEditorInput(value.dataForm, parameters.formId, action);
							basicsWorkflowActionEditorService.setEditorOutput(value.scriptOutput, parameters.output, action);

							return action;
						});

						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {

								var form = scope.input.editorMode === 2 ? scope.input.formscript : scope.input.form;

								ngModelCtrl.$setViewValue({
									dataContext: scope.input.context,
									dataDesc: scope.input.description,
									dataForm: form,
									scriptOutput: scope.input.output
								});
							}
						}

						scope.$watch('input.context', watchfn);
						scope.$watch('input.description', watchfn);
						scope.$watch('input.form', watchfn);
						scope.$watch('input.formscript', watchfn);
						scope.$watch('input.output', watchfn);
					}
				};
			}
		};
	}

	basicsWorkflowUserFormEditorDirective.$inject = ['basicsWorkflowActionEditorService', '_',
		'basicsWorkflowEditModes', '$translate'];

	angular.module('basics.workflow')
		.directive('basicsWorkflowUserFormEditorDirective', basicsWorkflowUserFormEditorDirective)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: '00000000000000000000000000000002',
					directive: 'basicsWorkflowUserFormEditorDirective',
					prio: null,
					tools: []
				}
			);
		}]);
})(angular);
