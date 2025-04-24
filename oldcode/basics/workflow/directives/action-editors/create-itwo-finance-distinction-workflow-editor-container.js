/**
 * Created by baitule on 17.10.2018.
 */
(function (angular) {
	/* global globals */
	'use strict';

	function basicsWorkflowCreateItwoFinanceDistinctionWorkflowActionEditorContainer(_, basicsWorkflowActionEditorService) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/create-itwo-finance-distinction-workflow-editor.html',
			compile: function () {
				return {
					pre: function (scope, iElement, attr, ngModelCtrl) {
						var action = {};
						scope.input = {};
						scope.output = {};

						//accordion
						scope.inputOpen = true;
						scope.outputOpen = true;

						scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);

						ngModelCtrl.$formatters.push(function (value) {
							action = value;
							if (action) {
								var transactionHeaderId = basicsWorkflowActionEditorService.getEditorInput('TransactionHeaderId', action);
								var resultCode = basicsWorkflowActionEditorService.getEditorOutput('ResultCode', action);
								var resultMessage = basicsWorkflowActionEditorService.getEditorOutput('ResultMessage', action);

								return {
									transactionHeaderId: transactionHeaderId ? transactionHeaderId.value : '',
									resultCode: resultCode ? resultCode.value : '',
									resultMessage: resultMessage ? resultMessage.value : ''
								};
							}
							return '';
						});

						ngModelCtrl.$render = function () {
							scope.input.transactionHeaderId = ngModelCtrl.$viewValue.transactionHeaderId;
							scope.output.resultCode = ngModelCtrl.$viewValue.resultCode;
							scope.output.resultMessage = ngModelCtrl.$viewValue.resultMessage;
						};

						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.transactionHeaderId, 'TransactionHeaderId', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.resultCode, 'ResultCode', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.resultMessage, 'ResultMessage', action);

							return action;
						});

						function saveNgModel() {
							ngModelCtrl.$setViewValue({
								transactionHeaderId: scope.input.transactionHeaderId,
								resultCode: scope.output.resultCode,
								resultMessage: scope.output.resultMessage
							});
						}

						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {
								saveNgModel();
							}
						}

						scope.$watch('input.transactionHeaderId', watchfn);
						scope.$watch('output.resultCode', watchfn);
						scope.$watch('output.resultMessage', watchfn);
					}
				};
			}
		};
	}

	basicsWorkflowCreateItwoFinanceDistinctionWorkflowActionEditorContainer.$inject = ['_', 'basicsWorkflowActionEditorService'];

	angular.module('basics.workflow')
		.directive('basicsWorkflowCreateItwoFinanceDistinctionWorkflowActionEditorContainer', basicsWorkflowCreateItwoFinanceDistinctionWorkflowActionEditorContainer)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: '5F3D6005413E46A0A11B8AC6AD482C04',
					directive: 'basicsWorkflowCreateItwoFinanceDistinctionWorkflowActionEditorContainer',
					prio: null,
					tools: []
				}
			);
		}]);
})(angular);
