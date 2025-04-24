/**
 * Created by lcn on 11/5/2019.
 */
(function (angular) {
	'use strict';

	function basicsWorkflowChangeContractOfInvoiceEditorContainer(basicsWorkflowActionEditorService) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/change-contract-of-invoice-editor.html',
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
									ContractId: getDataFromAction('ContractId'),
									outputValue: outputProperty ? outputProperty.value : ''
								};
							}
							return '';
						});

						ngModelCtrl.$render = function () {
							//input
							scope.model.InvoiceId = ngModelCtrl.$viewValue.InvoiceId;
							scope.model.ContractId = ngModelCtrl.$viewValue.ContractId;
							//output
							scope.output.Result = ngModelCtrl.$viewValue.outputValue;
						};

						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.InvoiceId, 'InvoiceId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.ContractId, 'ContractId', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.Result, 'Result', action);

							return action;
						});

						function saveNgModel() {

							ngModelCtrl.$setViewValue({
								InvoiceId: scope.model.InvoiceId,
								ContractId: scope.model.ContractId,
								Result: scope.output.Result
							});
						}

						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {
								saveNgModel();
							}
						}

						scope.$watch('model.InvoiceId', watchfn);
						scope.$watch('model.ContractId', watchfn);
						scope.$watch('output.Result', watchfn);
					}
				};
			}
		};
	}

	basicsWorkflowChangeContractOfInvoiceEditorContainer.$inject = ['basicsWorkflowActionEditorService'];

	var moduleName = 'basics.workflow';
	angular.module(moduleName).directive('basicsWorkflowChangeContractOfInvoiceEditorContainer', basicsWorkflowChangeContractOfInvoiceEditorContainer)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: 'C4CD18FDF24D4D9E91041B3D1D28101E',
					directive: 'basicsWorkflowChangeContractOfInvoiceEditorContainer',
					prio: null,
					tools: []
				}
			);
		}]);
})(angular);
