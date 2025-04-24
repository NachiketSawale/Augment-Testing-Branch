/**
 * Created by uestuenel on 08.11.2016.
 */

(function (angular) {
	'use strict';

	function basicsWorkflowGetClerkByProcurementstructureContainer(basicsWorkflowEditModes, basicsWorkflowActionEditorService, basicsWorkflowClerkRoleService) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/get-clerk-by-procurementstructure-editor.html',
			compile: function () {
				return {
					pre: function (scope, iElement, attr, ngModelCtrl) {
						var action = {},
							parameters = {
								structure: 'StructureId',
								clerk: 'ClerkRoleId',
								output: 'Clerk'
							};

						scope.input = {};
						scope.output = {};
						scope.inputOpen = true;
						scope.outputOpen = true;
						scope.input.editorModeStructure = basicsWorkflowEditModes.default;
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

						ngModelCtrl.$formatters.push(function (value) {
							action = value;
							if (action) {
								var outputProperty = basicsWorkflowActionEditorService.getEditorOutput(parameters.output, action);

								return {
									structureId: getDataFromAction(parameters.structure),
									clerkRoleId: getDataFromAction(parameters.clerk),
									outputValue: outputProperty ? outputProperty.value : ''
								};
							}
							return '';
						});

						ngModelCtrl.$render = function () {

							//structure scopes
							scope.input.structureSelect = parseInt(ngModelCtrl.$viewValue.structureId) ? parseInt(ngModelCtrl.$viewValue.structureId) : 0;
							scope.input.structureId = ngModelCtrl.$viewValue.structureId;
							//set project-radiobutton
							if (basicsWorkflowActionEditorService.setRadioButtonInEditor(scope.input.structureSelect, ngModelCtrl.$viewValue.structureId)) {
								scope.input.editorModeStructure = basicsWorkflowEditModes.expert;
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
							basicsWorkflowActionEditorService.setEditorInput(value.structureId, parameters.structure, action);
							basicsWorkflowActionEditorService.setEditorInput(value.clerkId, parameters.clerk, action);
							basicsWorkflowActionEditorService.setEditorOutput(value.output, parameters.output, action);

							return action;
						});

						function saveNgModel() {
							//save content from codemirror or selecteditem
							var structureContent = scope.input.editorModeStructure === 2 ? scope.input.structureId : scope.input.structureSelect;
							var clerkContent = scope.input.editorModeClerkRole === 2 ? scope.input.clerkRoleId : scope.input.clerkRoleSelect;

							ngModelCtrl.$setViewValue({
								structureId: structureContent,
								clerkId: clerkContent,
								output: scope.output.property
							});
						}

						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {
								saveNgModel();
							}
						}

						scope.$watch('input.structureSelect', watchfn);
						scope.$watch('input.structureId', watchfn);
						scope.$watch('input.clerkRoleSelect', watchfn);
						scope.$watch('input.clerkRoleId', watchfn);
						scope.$watch('output.property', watchfn);

					}
				};
			}
		};
	}

	basicsWorkflowGetClerkByProcurementstructureContainer.$inject = ['basicsWorkflowEditModes', 'basicsWorkflowActionEditorService', 'basicsWorkflowClerkRoleService'];

	angular.module('basics.workflow')
		.directive('basicsWorkflowGetClerkByProcurementstructureContainer', basicsWorkflowGetClerkByProcurementstructureContainer)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: '8c9811780086406d98085cf191a2637b',
					directive: 'basicsWorkflowGetClerkByProcurementstructureContainer',
					prio: null,
					tools: []
				}
			);
		}]);

})(angular);
