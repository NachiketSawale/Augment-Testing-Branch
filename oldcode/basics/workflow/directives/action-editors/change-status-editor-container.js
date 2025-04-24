/**
 * Created by uestuenel on 10.06.2016.
 */

(function (angular) {
	/* global globals */
	'use strict';

	function basicsWorkflowChangeStatusEditorContainer(basicsWorkflowActionEditorService, platformModuleStateService, basicsWorkflowEditModes, $translate, basicsWorkflowChangeStatusService, _) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/change-status-editor.html',
			compile: function () {
				return {
					pre: function (scope, iElement, attr, ngModelCtrl) {
						var state = platformModuleStateService.state('basics.workflow');
						var action = {};
						scope.output = {};
						scope.model = {};
						scope.input = {};
						scope.config = {};
						scope.inputOpen = true;
						scope.outputOpen = true;
						scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);

						//radio-button
						scope.input.editorMode = basicsWorkflowEditModes.default;
						scope.input.editorModeOld = basicsWorkflowEditModes.default;
						scope.input.editorModeNew = basicsWorkflowEditModes.default;
						scope.input.editorModeProject = basicsWorkflowEditModes.default;
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

						scope.checkValidate = {
							ctrlId: 'checkValidate',
							labelText: $translate.instant('basics.workflow.action.customEditor.checkValidate')
						};

						scope.runDependentWorkflow = {
							ctrlId: 'runDependentWorkflow',
							labelText: $translate.instant('basics.workflow.action.customEditor.runDependentWorkflow')
						};

						scope.onRadioGroupOptChanged = function changeRadioGroupOpt(radioValue, model) {
							scope.input[model] = parseInt(radioValue);
						};
						scope.statusList = state.entityStatus;
						scope.selectOptions = {
							displayMember: 'description',
							valueMember: 'statusName',
							items: scope.statusList
						};

						scope.selectOptionsStatusId = {
							displayMember: 'DescriptionInfo.Translated',
							valueMember: 'Id',
							items: [],
							service: basicsWorkflowChangeStatusService,
							serviceMethod: 'getParameters',
							serviceReload: true
						};

						scope.config.changeStatus = function () {
							if (scope.model.name) {
								scope.model.statusId = 0;
							}
						};

						function getDataFromAction(key) {
							var param = basicsWorkflowActionEditorService.getEditorInput(key, action);
							return param ? param.value : '';
						}

						ngModelCtrl.$formatters.push(function (value) {
							action = value;
							var isCheckValidate = true;
							var checkValidate = basicsWorkflowActionEditorService.getEditorInput('CheckValidate', action);
							if (checkValidate !== undefined && checkValidate !== null && checkValidate.value !== '') {
								isCheckValidate = checkValidate.value;
							}

							var isRunDependentWorkflow = false;
							var runDependentWorkflow = basicsWorkflowActionEditorService.getEditorInput('RunDependentWorkflow', action);
							if (runDependentWorkflow !== undefined && runDependentWorkflow !== null && runDependentWorkflow.value !== '') {
								isRunDependentWorkflow = runDependentWorkflow.value;
							}
							if (action) {
								var outputProperty = basicsWorkflowActionEditorService.getEditorOutput('NewStatusId', action);

								return {
									statusName: getDataFromAction('StatusName'),
									objectId: getDataFromAction('ObjectId'),
									newStatusId: getDataFromAction('NewStatusId'),
									oldStatusId: getDataFromAction('OldStatusId'),
									projectId: getDataFromAction('ProjectId'),
									remark: getDataFromAction('Remark'),
									checkValidate: isCheckValidate,
									runDependentWorkflow: isRunDependentWorkflow,
									outputValue: outputProperty ? outputProperty.value : ''
								};
							}
							return '';
						});

						ngModelCtrl.$render = function () {
							//project scopes
							scope.model.projectselect = parseInt(ngModelCtrl.$viewValue.projectId) ? parseInt(ngModelCtrl.$viewValue.projectId) : 0;
							scope.model.projectId = ngModelCtrl.$viewValue.projectId;
							//set project-radiobutton
							if (scope.model.projectselect === 0 && ngModelCtrl.$viewValue.projectId !== '') {
								scope.input.editorModeProject = basicsWorkflowEditModes.expert;
							}

							//OldStatus scopes
							scope.model.oldStatusId = parseInt(ngModelCtrl.$viewValue.oldStatusId) ? parseInt(ngModelCtrl.$viewValue.oldStatusId) : 0;
							scope.model.oldStatusIdCode = ngModelCtrl.$viewValue.oldStatusId;
							//set old status-radiobutton
							if (scope.model.oldStatusId === 0 && ngModelCtrl.$viewValue.oldStatusId !== '') {
								scope.input.editorModeOld = basicsWorkflowEditModes.expert;
							}

							//NewStatusId scopes
							scope.model.statusId = parseInt(ngModelCtrl.$viewValue.newStatusId) ? parseInt(ngModelCtrl.$viewValue.newStatusId) : 0;
							scope.model.statusIdCode = ngModelCtrl.$viewValue.newStatusId;
							//set new status-radiobutton
							if (scope.model.statusId === 0 && ngModelCtrl.$viewValue.newStatusId !== '') {
								scope.input.editorModeNew = basicsWorkflowEditModes.expert;
							}
							scope.input.showCheckValidate = basicsWorkflowActionEditorService.getEditorInput('CheckValidate', action) !== undefined;
							scope.input.showRunDependentWorkflow = basicsWorkflowActionEditorService.getEditorInput('RunDependentWorkflow', action) !== undefined;
							scope.model.name = ngModelCtrl.$viewValue.statusName;
							scope.model.objectId = ngModelCtrl.$viewValue.objectId;
							scope.model.remark = ngModelCtrl.$viewValue.remark;
							scope.model.checkValidate = ngModelCtrl.$viewValue.checkValidate;
							scope.model.runDependentWorkflow = ngModelCtrl.$viewValue.runDependentWorkflow;
							//output
							scope.output.status = ngModelCtrl.$viewValue.outputValue;
						};

						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.name, 'StatusName', action);
							basicsWorkflowActionEditorService.setEditorInput(value.objectId, 'ObjectId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.statusId, 'NewStatusId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.oldStatusId, 'OldStatusId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.projectId, 'ProjectId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.remark, 'Remark', action);
							basicsWorkflowActionEditorService.setEditorInput(value.checkValidate, 'CheckValidate', action);
							basicsWorkflowActionEditorService.setEditorInput(value.runDependentWorkflow, 'RunDependentWorkflow', action);

							basicsWorkflowActionEditorService.setEditorOutput(value.scriptOutput, 'NewStatusId', action);

							return action;
						});

						function saveNgModel() {
							//save content from codemirror or selecteditem
							var projectContent = scope.input.editorModeProject === 2 ? scope.model.projectId : scope.model.projectselect;
							var newStatusId = scope.input.editorModeNew === 2 ? scope.model.statusIdCode : scope.model.statusId;
							var oldStatusId = scope.input.editorModeOld === 2 ? scope.model.oldStatusIdCode : scope.model.oldStatusId;

							ngModelCtrl.$setViewValue({
								name: scope.model.name,
								objectId: scope.model.objectId,
								statusId: newStatusId,
								oldStatusId: oldStatusId,
								projectId: projectContent,
								remark: scope.model.remark,
								checkValidate: scope.model.checkValidate,
								runDependentWorkflow: scope.model.runDependentWorkflow,
								scriptOutput: scope.output.status
							});
						}

						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {
								saveNgModel();
							}
						}

						scope.changeCheckbox = function () {
							saveNgModel();
						};

						scope.$watch('model.name', watchfn);
						scope.$watch('model.objectId', watchfn);
						scope.$watch('model.oldStatusId', watchfn);
						scope.$watch('model.oldStatusIdCode', watchfn);
						scope.$watch('model.statusId', watchfn);
						scope.$watch('model.statusIdCode', watchfn);
						scope.$watch('model.projectId', watchfn);
						scope.$watch('model.remark', watchfn);
						scope.$watch('output.status', watchfn);
						scope.$watch('model.projectselect', watchfn);
						scope.$watch('model.checkValidate', watchfn);
						scope.$watch('model.runDependentWorkflow', watchfn);
					}
				};
			}
		};
	}

	basicsWorkflowChangeStatusEditorContainer.$inject = ['basicsWorkflowActionEditorService', 'platformModuleStateService',
		'basicsWorkflowEditModes', '$translate', 'basicsWorkflowChangeStatusService', '_'];

	angular.module('basics.workflow')
		.directive('basicsWorkflowChangeStatusEditorContainer', basicsWorkflowChangeStatusEditorContainer)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: '5F6E595C0BF6412694D9C40AD66621DF',
					directive: 'basicsWorkflowChangeStatusEditorContainer',
					prio: null,
					tools: []
				}
			);
		}]);

})(angular);
