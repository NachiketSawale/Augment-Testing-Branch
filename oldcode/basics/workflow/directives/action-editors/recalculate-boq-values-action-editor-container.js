
(function (angular) {
	/* global globals */
	'use strict';

	function basicsWorkflowRecalculateBoqValuesActionEditorContainer(_, basicsWorkflowActionEditorService) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/recalculate-boq-values-action-editor.html',
			compile: function () {
				return {
					pre: function (scope, iElement, attr, ngModelCtrl) {
						let action = {};
						scope.output = {};
						scope.model = {};
						scope.input = {};
						scope.inputOpen = true;
						scope.outputOpen = true;
						scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);

						function getDataFromAction(key) {
							let param = basicsWorkflowActionEditorService.getEditorInput(key, action);
							return param ? param.value : '';
						}

						ngModelCtrl.$formatters.push(function (value) {
							action = value;
							if (action) {
								let outputProperty = basicsWorkflowActionEditorService.getEditorOutput('Result', action);
								return {
									boqHeaderId: getDataFromAction('boqHeaderId'),
									TargetHeaderId: getDataFromAction('Target Header Id'),
									ModuleName: getDataFromAction('Module Name'),
									outputValue: outputProperty ? outputProperty.value : ''
								};
							}
							return '';
						});

						ngModelCtrl.$render = function () {
							// input
							scope.model.boqHeaderId = ngModelCtrl.$viewValue.boqHeaderId;
							scope.model.TargetHeaderId = ngModelCtrl.$viewValue.TargetHeaderId;
							scope.model.ModuleName = ngModelCtrl.$viewValue.ModuleName;
							// output
							scope.output.Result = ngModelCtrl.$viewValue.outputValue;
						};

						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.boqHeaderId, 'boqHeaderId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.TargetHeaderId, 'Target Header Id', action);
							basicsWorkflowActionEditorService.setEditorInput(value.ModuleName, 'Module Name', action);

							basicsWorkflowActionEditorService.setEditorOutput(value.Result, 'Result', action);

							return action;
						});

						function saveNgModel() {

							ngModelCtrl.$setViewValue({
								boqHeaderId: scope.model.boqHeaderId,
								TargetHeaderId: scope.model.TargetHeaderId,
								ModuleName: scope.model.ModuleName,
								Result: scope.output.Result
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

						scope.$watch('model.boqHeaderId', watchfn);
						scope.$watch('model.TargetHeaderId', watchfn);
						scope.$watch('model.ModuleName', watchfn);
						scope.$watch('output.Result', watchfn);
					}
				};
			}
		};
	}

	basicsWorkflowRecalculateBoqValuesActionEditorContainer.$inject = ['_', 'basicsWorkflowActionEditorService'];

	let moduleName = 'basics.workflow';
	angular.module(moduleName).directive('basicsWorkflowRecalculateBoqValuesActionEditorContainer', basicsWorkflowRecalculateBoqValuesActionEditorContainer)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: 'FC41170F3C194DC3A7C3849EE42895E2',
					directive: 'basicsWorkflowRecalculateBoqValuesActionEditorContainer',
					prio: null,
					tools: []
				}
			);
		}]);
})(angular);
