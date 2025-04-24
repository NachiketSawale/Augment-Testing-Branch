/**
 * Created by uestuenel on 03.11.2016.
 * Object Aktion: Give the clerk with the given role in the given project.
 */

(function (angular) {
	'use strict';

	function basicsWorkflowGiveClerkEditorContainer(basicsWorkflowEditModes, basicsWorkflowActionEditorService, basicsWorkflowClerkRoleService) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/get-project-clerk-editor.html',
			compile: function () {
				return {
					pre: function (scope, iElement, attr, ngModelCtrl) {
						var action = {},
							parameters = {
								project: 'ProjectId',
								clerk: 'ClerkRoleId',
								output: 'ProjectClerk'
							};
						scope.input = {};
						scope.output = {};
						scope.inputOpen = true;
						scope.outputOpen = true;
						scope.input.editorModeProject = basicsWorkflowEditModes.default;
						scope.input.editorModeClerkRole = basicsWorkflowEditModes.default;
						scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);

						scope.input.clerkRoleUrl = 'ClerkRole/list';

						scope.selectOptionsStatusId = {
							displayMember: 'DescriptionInfo.Translated',
							valueMember: 'Id',
							items: [],
							service: basicsWorkflowClerkRoleService,
							serviceMethod: 'getItems',
							serviceReload: true
						};

						function getDataFromAction(key) {
							var param = basicsWorkflowActionEditorService.getEditorInput(key, action);
							return param ? param.value : '';
						}

						scope.onRadioGroupOptChanged = function changeRadioGroupOpt(radioValue, model) {
							scope.input[model] = parseInt(radioValue);
						};

						ngModelCtrl.$formatters.push(function (value) {
							action = value;
							if (action) {
								var outputProperty = basicsWorkflowActionEditorService.getEditorOutput(parameters.output, action);

								return {
									projectId: getDataFromAction(parameters.project),
									clerkRoleId: getDataFromAction(parameters.clerk),
									outputValue: outputProperty ? outputProperty.value : ''
								};
							}
							return '';
						});

						ngModelCtrl.$render = function () {
							//project scopes
							scope.input.projectselect = parseInt(ngModelCtrl.$viewValue.projectId) ? parseInt(ngModelCtrl.$viewValue.projectId) : 0;
							scope.input.projectId = ngModelCtrl.$viewValue.projectId;
							//set project-radiobutton
							if (basicsWorkflowActionEditorService.setRadioButtonInEditor(scope.input.projectselect, ngModelCtrl.$viewValue.projectId)) {
								scope.input.editorModeProject = basicsWorkflowEditModes.expert;
							}

							//clerk role
							scope.input.clerkRoleSelect = parseInt(ngModelCtrl.$viewValue.clerkRoleId) ? parseInt(ngModelCtrl.$viewValue.clerkRoleId) : 0;
							scope.input.clerkRoleId = ngModelCtrl.$viewValue.clerkRoleId;
							//set clerk-radiobutton
							if (basicsWorkflowActionEditorService.setRadioButtonInEditor(scope.input.clerkRoleSelect, ngModelCtrl.$viewValue.clerkRoleId)) {
								scope.input.editorModeClerkRole = basicsWorkflowEditModes.expert;
							}

							//output param
							scope.output.property = ngModelCtrl.$viewValue.outputValue;

						};

						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.projectId, parameters.project, action);
							basicsWorkflowActionEditorService.setEditorInput(value.clerkId, parameters.clerk, action);
							basicsWorkflowActionEditorService.setEditorOutput(value.output, parameters.output, action);

							return action;
						});

						function saveNgModel() {
							//save content from codemirror or selecteditem
							var projectContent = scope.input.editorModeProject === 2 ? scope.input.projectId : scope.input.projectselect;
							var clerkContent = scope.input.editorModeClerkRole === 2 ? scope.input.clerkRoleId : scope.input.clerkRoleSelect;

							ngModelCtrl.$setViewValue({
								projectId: projectContent,
								clerkId: clerkContent,
								output: scope.output.property
							});
						}

						scope.setOutputAction = function () {
							saveNgModel();
						};

						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {
								saveNgModel();
							}
						}

						scope.$watch('input.projectselect', watchfn);
						scope.$watch('input.projectId', watchfn);
						scope.$watch('input.clerkRoleSelect', watchfn);
						scope.$watch('input.clerkRoleId', watchfn);

					}
				};
			}
		};

	}

	basicsWorkflowGiveClerkEditorContainer.$inject = ['basicsWorkflowEditModes', 'basicsWorkflowActionEditorService', 'basicsWorkflowClerkRoleService'];

	angular.module('basics.workflow')
		.directive('basicsWorkflowGiveClerkEditorContainer', basicsWorkflowGiveClerkEditorContainer)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: '31fe96461fcb4067b188074320727245',
					directive: 'basicsWorkflowGiveClerkEditorContainer',
					prio: null,
					tools: []
				}
			);
		}]);

})(angular);
