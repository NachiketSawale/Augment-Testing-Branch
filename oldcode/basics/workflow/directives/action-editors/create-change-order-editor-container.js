/**
 * Created by pel on 1/15/2020.
 */
(function (angular) {
	/* global globals */
	'use strict';

	function basicsWorkflowCreateChangeOrderEditorDirective(basicsWorkflowActionEditorService) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/create-change-order-editor.html',
			compile: function () {
				return {
					pre: function (scope, iElement, attr, ngModelCtrl) {
						var action = {};
						scope.output = {};
						scope.model = {};
						scope.input = {};
						scope.inputOpen = true;
						scope.outputOpen = true;
						scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);

						function getDataFromAction(key) {
							var param = basicsWorkflowActionEditorService.getEditorInput(key, action);
							return param ? param.value : '';
						}

						ngModelCtrl.$formatters.push(function (value) {
							action = value;
							if (action) {
								var outputProperty = basicsWorkflowActionEditorService.getEditorOutput('Result', action);

								return {
									BasisContractId: getDataFromAction('BasisContractId'),
									Code: getDataFromAction('Code'),
									Description: getDataFromAction('Description'),
									ProjectChangeId: getDataFromAction('ProjectChangeId'),
									outputValue: outputProperty ? outputProperty.value : ''
								};
							}
							return '';
						});

						ngModelCtrl.$render = function () {
							//input
							scope.model.BasisContractId = ngModelCtrl.$viewValue.BasisContractId;
							scope.model.Code = ngModelCtrl.$viewValue.Code;
							scope.model.Description = ngModelCtrl.$viewValue.Description;
							scope.model.ProjectChangeId = ngModelCtrl.$viewValue.ProjectChangeId;
							//output
							scope.output.Result = ngModelCtrl.$viewValue.outputValue;
						};

						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.BasisContractId, 'BasisContractId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.Code, 'Code', action);
							basicsWorkflowActionEditorService.setEditorInput(value.Description, 'Description', action);
							basicsWorkflowActionEditorService.setEditorInput(value.ProjectChangeId, 'ProjectChangeId', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.Result, 'Result', action);

							return action;
						});

						function saveNgModel() {

							ngModelCtrl.$setViewValue({
								BasisContractId: scope.model.BasisContractId,
								Code: scope.model.Code,
								Description: scope.model.Description,
								ProjectChangeId: scope.model.ProjectChangeId,
								Result: scope.output.Result
							});
						}

						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {
								saveNgModel();
							}
						}

						scope.$watch('model.BasisContractId', watchfn);
						scope.$watch('model.Code', watchfn);
						scope.$watch('model.Description', watchfn);
						scope.$watch('model.ProjectChangeId', watchfn);
						scope.$watch('output.Result', watchfn);
					}
				};
			}
		};
	}

	basicsWorkflowCreateChangeOrderEditorDirective.$inject = ['basicsWorkflowActionEditorService'];

	var moduleName = 'basics.workflow';
	angular.module(moduleName).directive('basicsWorkflowCreateChangeOrderEditorDirective', basicsWorkflowCreateChangeOrderEditorDirective)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: '37109a1b6aff493da3549721085f2c97',
					directive: 'basicsWorkflowCreateChangeOrderEditorDirective',
					prio: null,
					tools: []
				}
			);
		}]);
})(angular);

