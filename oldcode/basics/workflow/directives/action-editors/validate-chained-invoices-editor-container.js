/**
 * Created by lcn on 18/5/2020.
 */
(function (angular) {
	'use strict';

	function basicsWorkflowValidateChainedInvoicesEditorContainer(basicsWorkflowActionEditorService) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/validate-chained-invoices-editor.html',
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
									InvoiceId: getDataFromAction('InvoiceId'),
									AutoCorrect: getDataFromAction('AutoCorrect'),
									outputValue: outputProperty ? outputProperty.value : ''
								};
							}
							return '';
						});

						ngModelCtrl.$render = function () {
							//input
							scope.model.InvoiceId = ngModelCtrl.$viewValue.InvoiceId;
							scope.model.AutoCorrect = ngModelCtrl.$viewValue.AutoCorrect;
							//output
							scope.output.Result = ngModelCtrl.$viewValue.outputValue;
						};

						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.InvoiceId, 'InvoiceId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.AutoCorrect, 'AutoCorrect', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.Result, 'Result', action);

							return action;
						});

						function saveNgModel() {

							ngModelCtrl.$setViewValue({
								InvoiceId: scope.model.InvoiceId,
								AutoCorrect: scope.model.AutoCorrect,
								Result: scope.output.Result
							});
						}

						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {
								saveNgModel();
							}
						}

						scope.$watch('model.InvoiceId', watchfn);
						scope.$watch('model.AutoCorrect', watchfn);
						scope.$watch('output.Result', watchfn);
					}
				};
			}
		};
	}

	basicsWorkflowValidateChainedInvoicesEditorContainer.$inject = ['basicsWorkflowActionEditorService'];

	var moduleName = 'basics.workflow';
	angular.module(moduleName).directive('basicsWorkflowValidateChainedInvoicesEditorContainer', basicsWorkflowValidateChainedInvoicesEditorContainer)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: '06A27878255F422B94E68D873FB8EDB1',
					directive: 'basicsWorkflowValidateChainedInvoicesEditorContainer',
					prio: null,
					tools: []
				}
			);
		}]);
})(angular);
