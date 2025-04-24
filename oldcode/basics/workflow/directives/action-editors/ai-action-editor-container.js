/**
 * @author: chd
 * @date: 6/29/2021 9:36 AM
 * @description:
 */
(function (angular) {
	/* global globals */
	'use strict';

	function aiActionEditorDirective(basicsWorkflowActionEditorService, basicsWorkflowActionLookupService) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/ai-action-editor.html',
			compile: function () {
				return {
					pre: function (scope, iElement, attr, ngModelCtrl) {
						let action = {};
						scope.output = {};
						scope.input = {};
						scope.inputOpen = true;
						scope.outputOpen = true;
						scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);

						scope.selectModelCase = {
							displayMember: 'Code',
							valueMember: 'Id',
							items: [],
							service: basicsWorkflowActionLookupService,
							serviceMethod: 'getModelCaseList',
							serviceReload: true
						};

						function getDataFromAction(key) {
							let param = basicsWorkflowActionEditorService.getEditorInput(key, action);
							return param ? param.value : '';
						}

						ngModelCtrl.$formatters.push(function (value) {
							action = value;
							if (action) {
								let outputProperty = basicsWorkflowActionEditorService.getEditorOutput('Result', action);
								let modelCaseVal = getDataFromAction('ModelCaseId');

								return {
									aiInputData: getDataFromAction('AIInputData'),
									modelCaseSelectId: modelCaseVal ? modelCaseVal : 1,
									outputValue: outputProperty ? outputProperty.value : ''
								};
							}
							return '';
						});

						ngModelCtrl.$render = function () {
							//input
							scope.input.modelCaseSelectId = ngModelCtrl.$viewValue.modelCaseSelectId;
							scope.input.aiInputData = ngModelCtrl.$viewValue.aiInputData;
							//output
							scope.output.Result = ngModelCtrl.$viewValue.outputValue;
						};

						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.modelCaseSelectId, 'ModelCaseId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.aiInputData, 'AIInputData', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.Result, 'Result', action);
						});

						function saveNgModel() {

							ngModelCtrl.$setViewValue({
								modelCaseSelectId: scope.input.modelCaseSelectId,
								aiInputData: scope.input.aiInputData,
								Result: scope.output.Result
							});
						}

						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {
								saveNgModel();
							}
						}

						scope.$watch('input.modelCaseSelectId', watchfn);
						scope.$watch('input.aiInputData', watchfn);
						scope.$watch('output.Result', watchfn);
					}
				};
			}
		};
	}

	aiActionEditorDirective.$inject = ['basicsWorkflowActionEditorService', 'basicsWorkflowActionLookupService'];

	let moduleName = 'basics.workflow';
	angular.module(moduleName).directive('aiActionEditorDirective', aiActionEditorDirective)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: '87309a1b6aed493da3fe9721085f2c23',
					directive: 'aiActionEditorDirective',
					prio: null,
					tools: []
				}
			);
		}]);

})(angular);

