/**
 * Created by uestuenel on 01.07.2016.
 */
(function (angular) {
	'use strict';

	function basicsWorkflowCreateBaselineProjectEditorContainer(basicsWorkflowActionEditorService, basicsWorkflowEditModes, $translate) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/create-baseline-project-editor.html',
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
								var template = basicsWorkflowActionEditorService.getEditorInput('TemplatePath', action);
								var costCode = basicsWorkflowActionEditorService.getEditorInput('UpdateCostCodes', action);
								var commodity = basicsWorkflowActionEditorService.getEditorInput('UpdateCommodities', action);

								return {
									project: param ? param.value : '',
									template: template ? template.value : '',
									costCode: costCode ? costCode.value : '',
									commodity: commodity ? commodity.value : ''
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

							scope.input.template = ngModelCtrl.$viewValue.template;
							scope.input.costCode = ngModelCtrl.$viewValue.costCode;
							scope.input.commodity = ngModelCtrl.$viewValue.commodity;
						};

						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.project, 'ProjectId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.template, 'TemplatePath', action);
							basicsWorkflowActionEditorService.setEditorInput(value.costCode, 'UpdateCostCodes', action);
							basicsWorkflowActionEditorService.setEditorInput(value.commodity, 'UpdateCommodities', action);

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
								project: project,
								template: scope.input.template,
								costCode: scope.input.costCode,
								commodity: scope.input.commodity
							});
						}

						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {
								saveNgModel();
							}
						}

						scope.$watch('project.script', watchfn);
						scope.$watch('input.template', watchfn);
						scope.$watch('input.costCode', watchfn);
						scope.$watch('input.commodity', watchfn);
					}
				};
			}
		};
	}

	basicsWorkflowCreateBaselineProjectEditorContainer.$inject = ['basicsWorkflowActionEditorService', 'basicsWorkflowEditModes', '$translate'];

	angular.module('basics.workflow')
		.directive('basicsWorkflowCreateBaselineProjectEditorContainer', basicsWorkflowCreateBaselineProjectEditorContainer)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: '892c3fc71aa44d1590ebc1005b475fc4',
					directive: 'basicsWorkflowCreateBaselineProjectEditorContainer',
					prio: null,
					tools: []
				}
			);
		}]);
})(angular);
