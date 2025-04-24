/**
 * Created by uestuenel on 10.06.2016.
 *
 * Update iTWO Baseline Project
 */

(function (angular) {
	'use strict';

	function basicsWorkflowBaselineProjectEditorContainer(basicsWorkflowActionEditorService, basicsWorkflowEditModes, $translate) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/baseline-project-editor.html',
			compile: function () {
				return {
					pre: function (scope, iElement, attr, ngModelCtrl) {
						var action = {};
						scope.project = {};
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

						ngModelCtrl.$formatters.push(function (value) {
							action = value;
							if (action) {
								var param = basicsWorkflowActionEditorService.getEditorInput('ProjectId', action);
								var outputProperty = basicsWorkflowActionEditorService.getEditorOutputByIndex(0, action);

								return {
									project: param ? param.value : '',
									outputKey: outputProperty ? outputProperty.key : '',
									outputValue: outputProperty ? outputProperty.value : ''
								};
							}
							return '';
						});

						ngModelCtrl.$render = function () {
							scope.project.select = parseInt(ngModelCtrl.$viewValue.project) ? parseInt(ngModelCtrl.$viewValue.project) : 0;
							scope.project.script = ngModelCtrl.$viewValue.project;

							//init radiobutton
							if ((ngModelCtrl.$viewValue.project !== '') && (!parseInt(ngModelCtrl.$viewValue.project))) {
								scope.input.editorMode = 2;
							}
						};

						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.project, 'ProjectId', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.scriptOutput, scope.outputKey, action);

							return action;
						});

						//lookup for Businesspartner
						scope.project.selectConfig = {
							rt$change: function () {
								saveNgModel();
							}
						};

						function saveNgModel() {
							var project = scope.input.editorMode === 2 ? scope.project.script : scope.project.select;

							ngModelCtrl.$setViewValue({
								project: project
							});
						}

						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {
								saveNgModel();
							}
						}

						scope.$watch('project.script', watchfn);
					}
				};
			}
		};
	}

	basicsWorkflowBaselineProjectEditorContainer.$inject = ['basicsWorkflowActionEditorService', 'basicsWorkflowEditModes', '$translate'];

	angular.module('basics.workflow')
		.directive('basicsWorkflowBaselineProjectEditorContainer', basicsWorkflowBaselineProjectEditorContainer)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: 'f63e717eba624f4c94ec8501d1bb0baa',
					directive: 'basicsWorkflowBaselineProjectEditorContainer',
					prio: null,
					tools: []
				}
			);
		}]);
})(angular);
